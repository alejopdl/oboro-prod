// Purpose: Direct access to Notion data with minimal processing

import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';
import { getProductWithDefaults } from '../../lib/utils';

/**
 * API endpoint that directly queries Notion with minimal processing
 * to debug the drop system data issue
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get Notion credentials from environment variables
    const notionApiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    // Check if we have the required credentials
    if (!notionApiKey || !databaseId) {
      return res.status(500).json({ 
        error: 'Missing Notion credentials'
      });
    }

    // Initialize the Notion client directly in this endpoint
    const notion = new Client({ auth: notionApiKey });

    // Query the database with sorting to ensure we get variety
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
      sorts: [
        {
          property: 'DropID',
          direction: 'ascending',
        },
        {
          property: 'Level',
          direction: 'ascending',
        }
      ],
    });

    // Map Notion pages to our product format with better error handling
    const products = response.results.map((page: any) => {
      try {
        // Get raw data from Notion
        const rawProduct = {
          id: page.id,
          name: page.properties.Name?.title[0]?.plain_text,
          price: page.properties.Price?.number,
          description: page.properties.Description?.rich_text?.[0]?.plain_text,
          // Fix images to always be an array even if Notion returns a single value
          images: page.properties.Images?.files?.map((file: any) => 
            file.file?.url || file.external?.url
          ),
          category: page.properties.Category?.multi_select?.[0]?.name,
          inStock: page.properties.InStock?.checkbox,
          size: page.properties.Size?.select?.name,
          // Drop system fields
          level: page.properties.Level?.number,
          blocked: page.properties.Block?.checkbox,
          dropId: page.properties.DropID?.select?.name,
          // Metadata
          createdTime: page.created_time,
          lastEditedTime: page.last_edited_time,
        };
        
        // Apply our utility function to ensure all fields have proper values
        return getProductWithDefaults(rawProduct);
        
      } catch (error) {
        console.error('Error mapping product:', page.id, error);
        // Return a minimal valid product even if mapping fails
        return getProductWithDefaults({
          id: page.id,
          name: `Error parsing product ${page.id}`
        });
      }
    });

    // Return products and statistics
    return res.status(200).json({
      success: true,
      count: products.length,
      products: products,
      stats: {
        levels: [...new Set(products.map(p => p.level))].sort(),
        drops: [...new Set(products.map(p => p.dropId))],
        blockedCount: products.filter(p => p.blocked).length
      }
    });
  } catch (error) {
    console.error('Error in notion-direct API:', error);
    return res.status(500).json({ error: 'Failed to fetch Notion data directly' });
  }
}

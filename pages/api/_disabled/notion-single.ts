// Purpose: Debug endpoint to examine a single product from Notion

import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';
import { Product } from '@/lib/notion';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get our Notion credentials from environment variables
    const notionApiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    // Check if we have the required credentials
    if (!notionApiKey || !databaseId) {
      return res.status(500).json({ 
        error: 'Missing Notion credentials'
      });
    }

    // Initialize the Notion client
    const notion = new Client({ auth: notionApiKey });

    // Query the database with a limit of 1
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 1 // Just get one record
    });

    if (response.results.length === 0) {
      return res.status(404).json({
        message: 'No products found'
      });
    }

    // Get the first product
    const page = response.results[0];
    
    // Log all available properties
    const availableProps = Object.keys(page.properties);
    console.log('Available properties:', availableProps);
    
    // Extract the product in the format we expect
    const product: Product = {
      id: page.id,
      name: page.properties.Name.title[0]?.plain_text || '',
      price: page.properties.Price.number || 0,
      description: page.properties.Description.rich_text[0]?.plain_text || '',
      images: page.properties.Images.files?.map((file: any) => file.file?.url || file.external?.url || '') || [],
      category: page.properties.Category.select?.name || '',
      inStock: page.properties.InStock.checkbox || false,
      size: page.properties.Size.select?.name || undefined,
      // Get drop system data
      level: page.properties.Level?.number || 1,
      blocked: page.properties.Block?.checkbox || false,
      dropId: page.properties.DropID?.select?.name || 'DROP1',
      // Add metadata
      createdTime: page.created_time || '',
      lastEditedTime: page.last_edited_time || '',
    };

    // Return detailed debug info
    return res.status(200).json({
      success: true,
      availableProperties: availableProps,
      rawProperties: page.properties,
      extractedProduct: product,
      // Additional debug info
      levelProperty: page.properties.Level,
      blockProperty: page.properties.Block,
      dropIDProperty: page.properties.DropID,
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      success: false,
      error: errorMessage,
      details: error
    });
  }
}

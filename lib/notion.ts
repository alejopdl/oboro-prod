// Purpose: Notion API client and utility functions for fetching product data

import { Client } from '@notionhq/client';
import { getProductWithDefaults } from './utils';

// Define types for our product data
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  inStock: boolean;
  size?: string;
  // New fields for drop system
  level: number;
  blocked: boolean;
  dropId: string;
  // Optional metadata
  createdTime?: string;
  lastEditedTime?: string;
}

// Initialize the Notion client with our API key
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Database ID from our environment variables
const databaseId = process.env.NOTION_DATABASE_ID;

/**
 * Fetch all products from Notion database
 * @returns Promise<Product[]> Array of products
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    // Make sure we have our database ID
    if (!databaseId) throw new Error('Notion database ID not found');

    console.log('Fetching from database:', databaseId);

    // First, verify database access
    try {
      await notion.databases.retrieve({ database_id: databaseId });
    } catch (e: any) {
      console.error('Database access error:', e);
      throw new Error(`Cannot access database. Make sure the integration has access: ${e?.message || 'Unknown error'}`);
    }

    // Query the database - get up to 100 products to make sure we see the variety
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100, // Get more products to ensure variety
      // Sort by DropID to group products by drop
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

    console.log('Found', response.results.length, 'products');

    // Transform Notion data into our Product type
    const products = response.results.map((page: any) => {
      // Log the raw page data for debugging
      console.log('Raw page data:', JSON.stringify(page.properties, null, 2));
      
      try {
        // Extract data from Notion properties
        const rawProduct = {
          id: page.id,
          name: page.properties.Name.title[0]?.plain_text,
          price: page.properties.Price.number,
          description: page.properties.Description.rich_text[0]?.plain_text,
          images: page.properties.Images.files?.map((file: any) => file.file?.url || file.external?.url || ''),
          // Fix Category - it's multi_select in the database
          category: page.properties.Category.multi_select?.[0]?.name,
          inStock: page.properties.InStock.checkbox,
          size: page.properties.Size.select?.name,
          
          // Drop system fields - carefully mapped with exact property names
          level: page.properties.Level?.number,
          blocked: page.properties.Block?.checkbox,
          dropId: page.properties.DropID?.select?.name,
          
          // Add metadata
          createdTime: page.created_time,
          lastEditedTime: page.last_edited_time,
        };
        
        // Use our utility function to ensure all fields have proper defaults
        const product = getProductWithDefaults(rawProduct);
        
        // Extra debug to verify drop system fields
        console.log(`Mapped product ${product.name}:`, {
          level: product.level,
          blocked: product.blocked,
          dropId: product.dropId
        });
        
        return product;
      } catch (error) {
        console.error(`Error mapping product ${page.id}:`, error);
        // Return a default product with error info
        return getProductWithDefaults({
          id: page.id,
          name: `Error mapping product ${page.id}`
        });
      }
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch a single product by its ID
 * @param id Product ID from Notion
 * @returns Promise<Product | null> Product data or null if not found
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: id });
    
    // Now using real data from Notion instead of mock data
    // Transform the page data into our Product type
    return {
      id: response.id,
      name: (response as any).properties.Name.title[0]?.plain_text || '',
      price: (response as any).properties.Price.number || 0,
      description: (response as any).properties.Description.rich_text[0]?.plain_text || '',
      images: (response as any).properties.Images.files.map((file: any) => file.file?.url || file.external?.url || ''),
      category: (response as any).properties.Category.select?.name || '',
      inStock: (response as any).properties.InStock.checkbox || false,
      size: (response as any).properties.Size.select?.name || undefined,
      // Get real drop system data from Notion - matching exact property names from database
      // Force non-undefined values with explicit default values
      level: (response as any).properties.Level?.number ?? 1,
      blocked: (response as any).properties.Block?.checkbox ?? false,
      dropId: (response as any).properties.DropID?.select?.name ?? 'DROP1',
      // Add metadata
      createdTime: (response as any).created_time || '',
      lastEditedTime: (response as any).last_edited_time || '',
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

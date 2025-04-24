// Purpose: Notion API client and utility functions for fetching product data

import { Client } from '@notionhq/client';
import { getProductWithDefaults } from './utils';
import { createLogger } from './logger';

// Create a context-specific logger for the Notion module
const log = createLogger('Notion');

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
    if (!databaseId) {
      log.error('Notion database ID not found');
      throw new Error('Notion database ID not found');
    }

    log.info(`Fetching products from Notion database: ${databaseId.substring(0, 5)}...`);

    // First, verify database access
    try {
      log.debug('Verifying database access...');
      await notion.databases.retrieve({ database_id: databaseId });
      log.debug('Database access verified');
    } catch (e: any) {
      log.error('Database access error:', e);
      throw new Error(`Cannot access database. Make sure the integration has access: ${e?.message || 'Unknown error'}`);
    }

    // Query the database - get up to 100 products to make sure we see the variety
    log.debug('Querying Notion database with sorts by DropID and Level...');
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

    log.info(`Found ${response.results.length} products in Notion database`);

    // Transform Notion data into our Product type
    log.debug('Transforming Notion data into Product objects...');
    const products = response.results.map((page: any) => {
      // Log only the first product's raw data to avoid overwhelming logs
      if (page.id === response.results[0]?.id) {
        log.debug('Sample page properties:', {
          id: page.id,
          name: page.properties.Name?.title[0]?.plain_text || '(unnamed)',
          properties: Object.keys(page.properties)
        });
      }
      
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
        
        // Log drop system fields to help debug the drop system
        if (page.id === response.results[0]?.id) {
          log.debug('Sample product drop fields:', {
            name: product.name,
            level: product.level,
            blocked: product.blocked,
            dropId: product.dropId,
            inStock: product.inStock
          });
        }
        
        return product;
      } catch (error) {
        log.error(`Error mapping product ${page.id}:`, error);
        // Return a default product with error info
        return getProductWithDefaults({
          id: page.id,
          name: `Error mapping product ${page.id}`
        });
      }
    });

    log.info(`Successfully processed ${products.length} products from Notion`);
    return products;
  } catch (error) {
    log.error('Error fetching products:', error);
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
    log.info(`Fetching product with ID: ${id.substring(0, 8)}...`);
    
    log.debug('Retrieving page from Notion...');
    const response = await notion.pages.retrieve({ page_id: id });
    log.debug('Page retrieved successfully');
    
    // Now using real data from Notion instead of mock data
    // Transform the page data into our Product type
    log.debug('Processing product properties');
    
    const product = {
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
    
    // Log the drop system fields to help debug the drop system
    log.debug('Product drop fields:', {
      name: product.name,
      level: product.level,
      blocked: product.blocked,
      dropId: product.dropId,
      inStock: product.inStock
    });
    
    log.info(`Successfully processed product: ${product.name}`);
    return product;
    
  } catch (error) {
    log.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

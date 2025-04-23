// Purpose: Notion API client and utility functions for fetching product data

import { Client } from '@notionhq/client';

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

    // Query the database
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    console.log('Found', response.results.length, 'products');

    // Transform Notion data into our Product type
    const products = response.results.map((page: any) => {
      // Log the raw page data for debugging
      console.log('Raw page data:', JSON.stringify(page.properties, null, 2));
      
      // Extract the product name to help generate mock data
      const productName = page.properties.Name.title[0]?.plain_text || '';
      
      // Generate mock drop data based on product name
      // This is a temporary solution until the fields are added to Notion
      let mockLevel = 1;
      let mockBlocked = false;
      let mockDropId = 'DROP1';
      
      // Assign different mock values based on product name patterns
      if (productName.includes('44') || productName.includes('55') || productName.includes('33')) {
        mockDropId = 'MiniDROP2';
        mockLevel = productName.includes('44') ? 3 : (productName.includes('55') ? 4 : 2);
      } else if (productName.includes('AA') || productName.includes('EEE')) {
        mockDropId = 'XDROP3';
        mockLevel = productName.includes('AA') ? 1 : 2;
      } else {
        // Basic pattern matching for DROP1
        if (productName.includes('1')) mockLevel = 1;
        else if (productName.includes('2')) mockLevel = 2;
        else if (productName.includes('Remera')) mockLevel = 3;
        else if (productName.includes('Pant')) mockLevel = 4;
      }
      
      // Block higher level products
      mockBlocked = mockLevel > 1;

      return {
        id: page.id,
        name: productName,
        price: page.properties.Price.number || 0,
        description: page.properties.Description.rich_text[0]?.plain_text || '',
        images: page.properties.Images.files?.map((file: any) => file.file?.url || file.external?.url || '') || [],
        category: page.properties.Category.select?.name || '',
        inStock: page.properties.InStock.checkbox || false,
        size: page.properties.Size.select?.name || undefined,
        // Add mock data for drop system (until added to Notion)
        level: mockLevel,
        blocked: mockBlocked,
        dropId: mockDropId,
        // Add metadata
        createdTime: page.created_time || '',
        lastEditedTime: page.last_edited_time || '',
      };
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
    
    // Get the product name to help generate mock data
    const productName = (response as any).properties.Name.title[0]?.plain_text || '';
      
    // Generate mock drop data based on product name patterns
    // This is a temporary solution until the fields are added to Notion
    let mockLevel = 1;
    let mockBlocked = false;
    let mockDropId = 'DROP1';
    
    // Assign different mock values based on product name patterns
    if (productName.includes('44') || productName.includes('55') || productName.includes('33')) {
      mockDropId = 'MiniDROP2';
      mockLevel = productName.includes('44') ? 3 : (productName.includes('55') ? 4 : 2);
    } else if (productName.includes('AA') || productName.includes('EEE')) {
      mockDropId = 'XDROP3';
      mockLevel = productName.includes('AA') ? 1 : 2;
    } else {
      // Basic pattern matching for DROP1
      if (productName.includes('1')) mockLevel = 1;
      else if (productName.includes('2')) mockLevel = 2;
      else if (productName.includes('Remera')) mockLevel = 3;
      else if (productName.includes('Pant')) mockLevel = 4;
    }
    
    // Block higher level products
    mockBlocked = mockLevel > 1;
      
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
      // Add mock data for drop system (until added to Notion)
      level: mockLevel,
      blocked: mockBlocked,
      dropId: mockDropId,
      // Add metadata
      createdTime: (response as any).created_time || '',
      lastEditedTime: (response as any).last_edited_time || '',
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

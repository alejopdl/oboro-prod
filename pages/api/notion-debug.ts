// Purpose: Debug endpoint to see raw Notion data

import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

// Initialize the Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Database ID
const databaseId = process.env.NOTION_DATABASE_ID;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!databaseId) {
    return res.status(500).json({ message: 'Database ID not set' });
  }

  try {
    // First get database info to see properties
    const dbInfo = await notion.databases.retrieve({
      database_id: databaseId
    });

    // Get available database properties and their schemas
    const propertySchemas = dbInfo.properties;
    const dbProps = Object.keys(propertySchemas);
    console.log('Available properties:', dbProps);

    // Query the database
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 10, // Just get a few pages for debugging
    });

    // Maps to hold property information
    const propertyTypes: Record<string, string> = {};
    const propertyValues: Record<string, any[]> = {};

    // Extract property types and sample values from all pages
    response.results.forEach((page: any) => {
      const properties = page.properties;
      
      // Collect property types and sample values
      Object.entries(properties).forEach(([name, property]: [string, any]) => {
        propertyTypes[name] = property.type;
        
        // Get sample values based on type
        if (!propertyValues[name]) propertyValues[name] = [];
        
        let value;
        switch (property.type) {
          case 'title':
            value = property.title?.[0]?.plain_text;
            break;
          case 'rich_text':
            value = property.rich_text?.[0]?.plain_text;
            break;
          case 'number':
            value = property.number;
            break;
          case 'select':
            value = property.select?.name;
            break;
          case 'multi_select':
            value = property.multi_select?.map((item: any) => item.name);
            break;
          case 'checkbox':
            value = property.checkbox;
            break;
          case 'files':
            value = property.files?.map((file: any) => file.name || file.external?.url || file.file?.url);
            break;
          default:
            value = `[Type: ${property.type}]`;
        }
        
        // Only add unique values
        if (value !== undefined && !propertyValues[name].includes(value)) {
          propertyValues[name].push(value);
        }
      });
    });

    // Compare database ID with filename of CSV
    // This helps identify if we're connected to the right database
    const csvFilename = 'Product Catalog 1dd08d6ce068809ba7e6fd62568ab546.csv';
    const csvDatabaseId = csvFilename.split(' ').pop()?.split('.')[0] || '';
    
    res.status(200).json({
      success: true,
      databaseInfo: {
        currentDatabaseId: databaseId,
        csvFileDatabaseId: csvDatabaseId,
        databaseMatch: databaseId.includes(csvDatabaseId),
        databaseName: dbInfo.title?.[0]?.plain_text || 'Unnamed',
        numResults: response.results.length,
        availableProperties: dbProps,
        propertyTypes,
        samplePropertyValues: propertyValues,
      },
      results: response.results.slice(0, 3), // Only return 3 results to keep response size manageable
    });
  } catch (error) {
    console.error('Error fetching from Notion:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data', 
      details: error,
      databaseId: databaseId
    });
  }
}

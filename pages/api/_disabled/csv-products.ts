import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { Product } from '@/types/product';

/**
 * API endpoint that reads products directly from the CSV file
 * This is a temporary solution until we fix the Notion integration
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Read the CSV file
    const csvPath = path.join(process.cwd(), 'Product Catalog 1dd08d6ce068809ba7e6fd62568ab546.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    
    // Parse the CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    // Convert CSV records to our Product type
    const products: Product[] = records.map((record: any, index: number) => {
      // Generate a unique ID if not present
      const id = record.id || `csv-product-${index}`;
      
      return {
        id,
        name: record.Name || '',
        price: parseInt(record.Price) || 0,
        description: record.Description || '',
        images: record.Images ? [record.Images] : [],
        category: record.Category || '',
        inStock: record.InStock === 'Yes',
        size: record.Size || '',
        // Drop system fields - directly from CSV with proper conversion
        level: parseInt(record.Level) || 1,
        blocked: record.Block === 'Yes',
        dropId: record.DropID || 'DROP1',
        createdTime: new Date().toISOString(),
        lastEditedTime: new Date().toISOString()
      };
    });
    
    // Log what we've loaded
    console.log(`Loaded ${products.length} products from CSV`);
    console.log('Sample of drop system fields:', products.slice(0, 3).map(p => ({
      name: p.name,
      level: p.level,
      dropId: p.dropId,
      blocked: p.blocked
    })));
    
    // Return all products
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
      // Include sample data for debugging
      debug: {
        levels: [...new Set(products.map(p => p.level))].sort(),
        drops: [...new Set(products.map(p => p.dropId))],
        blockedCount: products.filter(p => p.blocked).length
      }
    });
  } catch (error) {
    console.error('Error loading CSV products:', error);
    res.status(500).json({ error: 'Failed to load products from CSV' });
  }
}

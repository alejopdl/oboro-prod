// Purpose: Test endpoint to verify Notion API integration

import { NextApiRequest, NextApiResponse } from 'next';
import { getAllProducts } from '../../lib/notion';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch products from Notion
    let products = await getAllProducts();
    
    // Log original data to see what values actually exist
    console.log('Original data from Notion:', products.slice(0, 3).map(p => ({
      name: p.name,
      level: p.level,
      blocked: p.blocked,
      dropId: p.dropId
    })));
    
    // Explicitly ensure all products have drop system fields with EXACT property names
    products = products.map(product => {
      // Check original values to help with debugging
      console.log(`Product ${product.name} raw drop values:`, {
        level: product.level,
        blocked: product.blocked,
        dropId: product.dropId
      });
      
      return {
        ...product,
        // Make sure level is properly mapped from number
        level: product.level ?? 1,
        // Make sure blocked is properly mapped from checkbox
        blocked: product.blocked === true, 
        // Make sure dropId is properly mapped from select
        dropId: product.dropId ?? 'DROP1'
      };
    });
    
    // Enhanced debugging - count drop system fields after our fix
    const dropSystemStats = {
      productsWithLevel: products.filter(p => p.level !== undefined).length,
      productsWithBlocked: products.filter(p => p.blocked !== undefined).length,
      productsWithDropId: products.filter(p => p.dropId !== undefined).length,
      // Sample of first few products with drop system fields
      sampleProducts: products.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        level: p.level,
        blocked: p.blocked,
        dropId: p.dropId
      }))
    };
    
    // Log the first few products for debugging
    console.log('First 3 products after forcing drop fields:', JSON.stringify(products.slice(0, 3), null, 2));
    
    // Return all products and count with enhanced debugging
    return res.status(200).json({
      success: true,
      count: products.length,
      dropSystemFieldStats: dropSystemStats,
      products: products,
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
    return res.status(500).json({
      success: false,
      error: errorMessage,
      details: error
    });
  }
}

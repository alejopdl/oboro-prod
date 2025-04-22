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
    const products = await getAllProducts();
    
    // Return all products and count
    return res.status(200).json({
      success: true,
      count: products.length,
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

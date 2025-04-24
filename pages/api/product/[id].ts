// Purpose: Fetch a single product by ID from Notion with security checks

import { NextApiRequest, NextApiResponse } from 'next';
import { getProductById } from '@/lib/notion';
import { createLogger } from '@/lib/logger';

// Initialize logger for this endpoint
const log = createLogger('API:Product');

/**
 * API handler for fetching a single product by ID
 * Includes security checks to prevent access to blocked products
 * 
 * @param req - Next.js API request
 * @param res - Next.js API response
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Get product ID from URL parameter
    const { id } = req.query;
    
    // Check if ID is provided and valid
    if (!id || Array.isArray(id)) {
      log.warn('Invalid product ID provided:', id);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid product ID' 
      });
    }

    log.info(`Fetching product with ID: ${id}`);
    
    // Get the product from Notion using existing utility
    const product = await getProductById(id);
    
    // If product is not found, return 404
    if (!product) {
      log.warn(`Product not found: ${id}`);
      return res.status(404).json({ 
        success: false, 
        error: 'Producto no encontrado' 
      });
    }

    // SECURITY CHECK: Verify product isn't blocked
    if (product.blocked) {
      log.warn(`Attempt to access blocked product: ${id}`);
      return res.status(403).json({ 
        success: false, 
        error: 'Este producto no está disponible todavía',
        // Limited data for blocked products
        product: {
          id: product.id,
          name: product.name,
          level: product.level,
          dropId: product.dropId,
          blocked: true
        }
      });
    }

    // Return the product with success status
    log.info(`Successfully fetched product: ${product.name}`);
    return res.status(200).json({ 
      success: true, 
      product 
    });
    
  } catch (error) {
    // Log the error
    log.error('Error fetching product:', error);
    
    // Return a 500 error
    return res.status(500).json({ 
      success: false, 
      error: 'Error al obtener el producto' 
    });
  }
}

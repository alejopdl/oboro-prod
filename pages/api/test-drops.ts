import { NextApiRequest, NextApiResponse } from 'next';
import { getAllProducts } from '@/lib/notion';
import { Product } from '@/types/product';

/**
 * API endpoint that fetches products from Notion and modifies them to test drop system
 * 
 * @param req - The request object
 * @param res - The response object
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get real products from Notion
    const products = await getAllProducts();
    
    // Create a deep copy to avoid modifying the original data
    const modifiedProducts = JSON.parse(JSON.stringify(products)) as Product[];
    
    // Modify about 1/3 of the products to have different levels and dropIds
    modifiedProducts.forEach((product, index) => {
      // First third: leave as level 1, DROP1
      if (index % 3 === 0) {
        product.level = 1;
        product.dropId = "DROP1";
        product.blocked = false;
      } 
      // Second third: set to level 2, DROP2
      else if (index % 3 === 1) {
        product.level = 2;
        product.dropId = "DROP2";
        product.blocked = product.inStock ? false : true; // Block some products
      } 
      // Last third: set to level 3, DROP3
      else {
        product.level = 3;
        product.dropId = "DROP3";
        product.blocked = true; // Block all level 3 products initially
      }
    });
    
    // Log a sample of what we're returning
    console.log('Modified drop system data sample:', 
      modifiedProducts.slice(0, 3).map(p => ({
        name: p.name,
        level: p.level,
        dropId: p.dropId,
        blocked: p.blocked
      }))
    );
    
    // Return the modified products
    res.status(200).json({
      products: modifiedProducts,
      debug: {
        count: modifiedProducts.length,
        drops: [...new Set(modifiedProducts.map(p => p.dropId))],
        levels: [...new Set(modifiedProducts.map(p => p.level))].sort(),
      }
    });
  } catch (error) {
    console.error('Error in test-drops API:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

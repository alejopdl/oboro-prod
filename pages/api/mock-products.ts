// Purpose: Mock API endpoint with sample product data for the drop system

import { NextApiRequest, NextApiResponse } from 'next';
import type { Product } from '../../types/product';

// Sample database similar to your CSV
const mockProducts: Product[] = [
  // DROP1 Products - Level 1
  {
    id: 'drop1-level1-1',
    name: 'Reme1',
    price: 11111,
    description: 'Guantes Invierno de alta calidad. Ideal para uso diario y combinar con tu estilo.',
    images: ['https://source.unsplash.com/collection/1133273/400x400?sig=1'],
    category: 'Item',
    inStock: false,  // Sold out
    soldOut: true,
    size: 'L',
    level: 1,
    blocked: false,  // Level 1 is never blocked
    dropId: 'DROP1',
    createdTime: '2025-04-22T22:21:00.000Z',
    lastEditedTime: '2025-04-23T18:18:00.000Z'
  },
  
  // DROP1 Products - Level 2
  {
    id: 'drop1-level2-1',
    name: 'Reme2',
    price: 84221,
    description: 'Campera Puffer Verde de alta calidad. Ideal para uso diario y combinar con tu estilo.',
    images: ['https://source.unsplash.com/collection/1133273/400x400?sig=2'],
    category: 'Item',
    inStock: true,
    soldOut: false,
    size: 'L',
    level: 2,
    blocked: false,  // Unblocked because level 1 is sold out
    dropId: 'DROP1',
    createdTime: '2025-04-22T22:21:00.000Z',
    lastEditedTime: '2025-04-23T18:18:00.000Z'
  },
  
  // DROP1 Products - Level 3
  {
    id: 'drop1-level3-1',
    name: 'Remera Blanca',
    price: 37601,
    description: 'Remera Blanca de alta calidad. Ideal para uso diario y combinar con tu estilo.',
    images: ['https://source.unsplash.com/collection/1133273/400x400?sig=3'],
    category: 'Item',
    inStock: true,
    soldOut: false,
    size: 'L',
    level: 3,
    blocked: true,  // Blocked because level 2 is still in stock
    dropId: 'DROP1',
    createdTime: '2025-04-22T22:21:00.000Z',
    lastEditedTime: '2025-04-23T18:18:00.000Z'
  },
  {
    id: 'drop1-level3-2',
    name: 'Bufanda Lana',
    price: 26246,
    description: 'Bufanda Lana de alta calidad. Ideal para uso diario y combinar con tu estilo.',
    images: ['https://source.unsplash.com/collection/1133273/400x400?sig=4'],
    category: 'Item',
    inStock: true,
    soldOut: false,
    size: 'XXL',
    level: 3,
    blocked: true,  // Blocked because level 2 is still in stock
    dropId: 'DROP1',
    createdTime: '2025-04-22T22:21:00.000Z',
    lastEditedTime: '2025-04-23T18:18:00.000Z'
  },
  
  // DROP1 Products - Level 4
  {
    id: 'drop1-level4-1',
    name: 'Pantalón Jean Slim',
    price: 111250,
    description: 'Pantalón Jean Slim de alta calidad. Ideal para uso diario y combinar con tu estilo.',
    images: ['https://source.unsplash.com/collection/1133273/400x400?sig=5'],
    category: 'Item',
    inStock: true,
    soldOut: false,
    size: 'XXL',
    level: 4,
    blocked: true,  // Blocked because lower levels still have stock
    dropId: 'DROP1',
    createdTime: '2025-04-22T22:21:00.000Z',
    lastEditedTime: '2025-04-23T18:18:00.000Z'
  },
  
  // MiniDROP2 Products - All are sold out except Level 3
  {
    id: 'minidrop2-level1-1',
    name: 'Reme11',
    price: 11111,
    description: 'Guantes Invierno de alta calidad. Ideal para uso diario y combinar con tu estilo.',
    images: ['https://source.unsplash.com/collection/1133273/400x400?sig=6'],
    category: 'Item',
    inStock: false,
    soldOut: true,
    size: 'L',
    level: 1,
    blocked: false,
    dropId: 'MiniDROP2',
    createdTime: '2025-04-23T18:19:00.000Z',
    lastEditedTime: '2025-04-23T19:17:00.000Z'
  },
  {
    id: 'minidrop2-level2-1',
    name: 'Reme22',
    price: 84221,
    description: 'Campera Puffer Verde de alta calidad. Ideal para uso diario y combinar con tu estilo.',
    images: ['https://source.unsplash.com/collection/1133273/400x400?sig=7'],
    category: 'Item',
    inStock: false,
    soldOut: true,
    size: 'L',
    level: 2,
    blocked: false,  // Unblocked because level 1 is sold out
    dropId: 'MiniDROP2',
    createdTime: '2025-04-23T18:19:00.000Z',
    lastEditedTime: '2025-04-23T19:17:00.000Z'
  },
  {
    id: 'minidrop2-level3-1',
    name: 'Remera Blanca33',
    price: 37601,
    description: 'Remera Blanca de alta calidad. Ideal para uso diario y combinar con tu estilo.',
    images: ['https://source.unsplash.com/collection/1133273/400x400?sig=8'],
    category: 'Item',
    inStock: false,
    soldOut: true,
    size: 'L',
    level: 3,
    blocked: false,  // Unblocked because levels 1-2 are sold out
    dropId: 'MiniDROP2',
    createdTime: '2025-04-23T18:19:00.000Z',
    lastEditedTime: '2025-04-23T19:17:00.000Z'
  },
  {
    id: 'minidrop2-level3-2',
    name: 'Bufanda Lana44',
    price: 26246,
    description: 'Bufanda Lana de alta calidad. Ideal para uso diario y combinar con tu estilo.',
    images: ['https://source.unsplash.com/collection/1133273/400x400?sig=9'],
    category: 'Item',
    inStock: false,
    soldOut: true,
    size: 'XXL',
    level: 3,
    blocked: false,  // Unblocked because levels 1-2 are sold out
    dropId: 'MiniDROP2',
    createdTime: '2025-04-23T18:19:00.000Z',
    lastEditedTime: '2025-04-23T19:17:00.000Z'
  },
  {
    id: 'minidrop2-level4-1',
    name: 'Pantalón Jean Slim55',
    price: 111250,
    description: 'Pantalón Jean Slim de alta calidad. Ideal para uso diario y combinar con tu estilo.',
    images: ['https://source.unsplash.com/collection/1133273/400x400?sig=10'],
    category: 'Item',
    inStock: false,
    soldOut: true,
    size: 'XXL',
    level: 4,
    blocked: false,  // Unblocked because all previous levels are sold out
    dropId: 'MiniDROP2',
    createdTime: '2025-04-23T18:19:00.000Z',
    lastEditedTime: '2025-04-23T19:17:00.000Z'
  },
  
  // XDROP3 Products - Mixed states
  {
    id: 'xdrop3-level1-1',
    name: 'Remera BlancaAA',
    price: 37601,
    description: 'Remera Blanca de alta calidad. Ideal para uso diario y combinar con tu estilo.',
    images: ['https://source.unsplash.com/collection/1133273/400x400?sig=11'],
    category: 'Item',
    inStock: true,
    soldOut: false,
    size: 'L',
    level: 1,
    blocked: false,
    dropId: 'XDROP3',
    createdTime: '2025-04-23T19:05:00.000Z',
    lastEditedTime: '2025-04-23T19:16:00.000Z'
  },
  {
    id: 'xdrop3-level2-1',
    name: 'RemeEEE',
    price: 84221,
    description: 'Campera Puffer Verde de alta calidad. Ideal para uso diario y combinar con tu estilo.',
    images: ['https://source.unsplash.com/collection/1133273/400x400?sig=12'],
    category: 'Item',
    inStock: true,
    soldOut: false,
    size: 'L',
    level: 2,
    blocked: true,  // Blocked because level 1 still has stock
    dropId: 'XDROP3',
    createdTime: '2025-04-23T19:05:00.000Z',
    lastEditedTime: '2025-04-23T19:16:00.000Z'
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Return mock products
    return res.status(200).json({
      success: true,
      count: mockProducts.length,
      products: mockProducts,
    });
  } catch (error) {
    console.error('Mock products API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch mock products';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}

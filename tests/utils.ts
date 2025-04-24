/**
 * Test utilities and mock data for oBoRo project
 */
import { Product } from '../types/product'

// Standard image path for all test products
const TEST_IMAGE_PATH = '/tests/assets/images/image.png';

/**
 * Mock products that match our Notion database structure
 * - Updated to include all required fields (level, blocked, dropId)
 * - Uses inStock instead of soldOut to match database
 * - Contains a mix of items in different drops and levels
 */
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Producto Test 1',
    price: 99.99,
    size: 'M',
    images: [TEST_IMAGE_PATH],
    description: 'Descripción del producto test 1',
    category: 'Camisetas',
    inStock: true,       // From Notion database (InStock column)
    soldOut: false,      // The opposite of inStock, used in UI 
    level: 1,            // Level 1 product (always available)
    blocked: false,      // Not blocked
    dropId: 'DROP1',     // Part of DROP1 collection
    createdTime: '2025-04-01T10:00:00Z',
    lastEditedTime: '2025-04-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Producto Test 2',
    price: 149.99,
    size: 'G',
    images: [TEST_IMAGE_PATH],
    description: 'Descripción del producto test 2',
    category: 'Pantalones',
    inStock: false,      // Out of stock (from Notion)
    soldOut: true,       // The opposite of inStock
    level: 1,            // Level 1 product (always available)
    blocked: false,      // Not blocked 
    dropId: 'DROP1',     // Part of DROP1 collection
    createdTime: '2025-04-01T10:30:00Z',
    lastEditedTime: '2025-04-02T11:00:00Z',
  },
  {
    id: '3',
    name: 'Producto Test 3',
    price: 79.99,
    size: 'P',
    images: [TEST_IMAGE_PATH],
    description: 'Descripción del producto test 3',
    category: 'Accesorios',
    inStock: true,       // In stock (from Notion)
    soldOut: false,      // Not sold out
    level: 2,            // Level 2 product (unlocks after level 1)
    blocked: true,       // Blocked until level 1 is sold out
    dropId: 'DROP1',     // Part of DROP1 collection
    createdTime: '2025-04-02T09:15:00Z',
    lastEditedTime: '2025-04-02T15:30:00Z',
  },
  {
    id: '4',
    name: 'Producto Test 4',
    price: 129.99,
    size: 'M',
    images: [TEST_IMAGE_PATH],
    description: 'Descripción del producto test 4',
    category: 'Camisetas',
    inStock: true,       // In stock (from Notion)
    soldOut: false,      // Not sold out
    level: 1,            // Level 1 product (always available)
    blocked: false,      // Not blocked
    dropId: 'MiniDROP2', // Part of MiniDROP2 collection
    createdTime: '2025-04-03T14:20:00Z',
    lastEditedTime: '2025-04-03T16:45:00Z',
  }
]

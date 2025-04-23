/**
 * Interface representing a product from Notion database
 */
export interface Product {
  id: string
  name: string
  price: number
  size?: string // Make size optional since it might not be available for all products
  images: string[]
  soldOut: boolean
  locked?: boolean // Add locked property used in the ProductShowcase
  description: string
  category: string
  inStock?: boolean // Add inStock to match Notion data
}

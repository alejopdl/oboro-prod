// Purpose: Display a responsive grid of product cards
import { Product } from '../types/product'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
}

/**
 * Displays a responsive grid of product cards
 * 
 * @param props - Component props containing array of products
 * @returns JSX Element of the product grid
 */
import { FC } from 'react'

export const ProductGrid: FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

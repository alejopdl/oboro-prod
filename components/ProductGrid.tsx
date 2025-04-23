import React from 'react'
import { Product } from '../types/product'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
}

/**
 * ProductGrid component renders a grid of product cards
 *
 * @param props - Component props containing products array
 * @returns JSX Element
 */
const ProductGrid = ({ products }: ProductGridProps): React.ReactElement => {
  // For empty product lists, render an empty grid with the data-testid
  if (products.length === 0) {
    return (
      <div data-testid="product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
        {/* Empty state */}
      </div>
    )
  }

  // Normal grid with products
  return (
    <div data-testid="product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
      {products.map((product) => (
        <div key={product.id} role="listitem">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

export default ProductGrid

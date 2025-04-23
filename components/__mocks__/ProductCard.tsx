// Purpose: Mock ProductCard component for testing
import React from 'react'
import { Product } from '../../types/product'

interface ProductCardProps {
  product: Product
}

/**
 * Simple mock of ProductCard for testing
 * 
 * @param props - Component props
 * @returns JSX Element
 */
const ProductCard = ({ product }: ProductCardProps): React.ReactElement => {
  const { id, name, price, size, images, soldOut, category } = product

  return (
    <div className="product-card" data-testid="product-card">
      <a href={`/produto/${id}`}>
        <img src={images[0]} alt={name} />
        <h3>{name}</h3>
        <p>{size}</p>
        <p>{price}</p>
        <p>{category}</p>
      </a>
      {soldOut && (
        <div className="sold-out-overlay">
          <span>Esgotado</span>
        </div>
      )}
    </div>
  )
}

export default ProductCard

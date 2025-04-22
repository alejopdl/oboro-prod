// Purpose: Display individual product information in a card format
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '../types/product'

interface ProductCardProps {
  product: Product
}

/**
 * Displays a product in a card format with image, name, price, and size
 * 
 * @param props - Component props containing product data
 * @returns JSX Element of the product card
 */
import { FC } from 'react'

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { name, price, size, images, soldOut } = product
  
  // Format price with Brazilian Real currency
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)

  return (
    <div className="group relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image container with aspect ratio */}
      <div className="relative aspect-square">
        <Image
          src={images[0]}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {soldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Esgotado</span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">{formattedPrice}</span>
          <span className="text-sm text-gray-600">{size}</span>
        </div>
      </div>

      {/* Clickable overlay */}
      <Link
        href={`/produto/${product.id}`}
        className="absolute inset-0"
        aria-label={`Ver detalhes de ${name}`}
      >
        <span className="sr-only">Ver detalhes</span>
      </Link>
    </div>
  )
}

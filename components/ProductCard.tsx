"use client"

import React, { useState, useEffect } from 'react'
import { default as Image } from 'next/image'
import { default as Link } from 'next/link'
import { motion } from 'framer-motion'
import { config } from '@/data/config'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { Product } from '../types/product'

interface ProductCardProps {
  product: Product
  isActive?: boolean
  panelPosition?: string
  index?: number
  previousProductSold?: boolean
}

const ProductCard = ({ product, isActive, panelPosition, index, previousProductSold }: ProductCardProps): React.ReactElement => {
  const { id, name, price, images, category, soldOut, size } = product
  const prefersReducedMotion = useReducedMotion()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Set mounted state after component mounts in browser
  useEffect(() => {
    setMounted(true)
  }, [])

  // Format price according to locale and currency
  const formattedPrice = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
  }).format(price)

  // Determine the right component to use based on mounting state
  const MotionComponent = mounted ? motion.div : 'div';

  return (
    <MotionComponent
      {...(mounted 
        ? {
            initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: prefersReducedMotion ? 0.1 : 0.5 }
          } 
        : {}
      )}
      className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      <Link href={`/produto/${id}`} className="block">
        <div className="relative h-64 w-full overflow-hidden">
          <div
            className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          />
          <Image
            src={images[0] || '/images/placeholder.jpg'}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover object-center group-hover:scale-105 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          {soldOut && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Agotado</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{name}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{category}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Talle: {size}</p>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formattedPrice}</p>
          </div>
          <div className="mt-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${!soldOut ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}
            >
              {!soldOut ? 'Disponible' : 'Agotado'}
            </span>
          </div>
        </div>
      </Link>
    </MotionComponent>
  )
}

export default ProductCard

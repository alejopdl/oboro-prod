"use client"

import React, { useState, useEffect } from 'react'
import { default as Image } from 'next/image'
import { default as Link } from 'next/link'
import { motion } from 'framer-motion'
import { config } from '@/data/config'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { Product } from '../types/product'
import { Lock, Unlock, ArrowUpCircle } from 'lucide-react' // Import icons

interface ProductCardProps {
  product: Product
  isActive?: boolean
  panelPosition?: string
  index?: number
  previousProductSold?: boolean
  soldOut?: boolean // Add explicit soldOut prop
  locked?: boolean // Add locked prop
  onProductSold?: () => void // Add callback for when product is sold
}

const ProductCard = ({ product, isActive, panelPosition, index, previousProductSold, soldOut: soldOutProp, locked: lockedProp, onProductSold }: ProductCardProps): React.ReactElement => {
  // Use props if provided, otherwise use product properties
  const { id, name, price, images, category, size } = product
  const soldOut = soldOutProp !== undefined ? soldOutProp : product.soldOut
  const locked = lockedProp !== undefined ? lockedProp : product.locked
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
      className={`group relative ${!soldOut && !locked ? 'bg-gray-800 dark:bg-white ring-4 ring-white dark:ring-black shadow-lg shadow-white/30 dark:shadow-black/30' : 'bg-gray-800/90 dark:bg-white/90'} rounded-lg overflow-hidden transition-all duration-300 ${!soldOut && !locked ? 'shadow-xl' : 'hover:shadow-xl'}`}
    >
      <Link 
        href={locked ? "#" : `/produto/${id}`} 
        className={`block ${locked ? 'pointer-events-none' : ''}`}
        onClick={(e) => {
          if (locked) {
            e.preventDefault()
            return
          }
        }}>
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
          {/* Level indicator badge removed for minimalist style */}
          
          {/* Locked indicator with minimalist style */}
          {locked && !soldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <div className="bg-red-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
            </div>
          )}
          
          {/* Unlocked indicator with more prominent effect */}
          {!locked && !soldOut && (
            <>
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full z-10" aria-label="Producto desbloqueado" title="Producto desbloqueado">
                <Unlock className="h-4 w-4" />
              </div>
              {/* Move the glow and effects to be siblings of the image container, not overlapping it */}
            </>
          )}
        </div>
        
        {/* Glow effects for available products - positioned outside the image container */}
        {!locked && !soldOut && (
          <>
            <div className="absolute inset-x-0 bottom-0 top-[260px] bg-white/10 dark:bg-black/10 backdrop-blur-[1px] pointer-events-none rounded-b-lg opacity-70"></div>
            <div className="absolute inset-x-0 -top-1 h-2 bg-gradient-to-r from-white/60 via-white/80 to-white/60 dark:from-black/40 dark:via-black/60 dark:to-black/40 pointer-events-none rounded-t-lg blur-sm"></div>
            <div className="absolute inset-y-0 -left-1 w-2 bg-gradient-to-b from-white/60 via-white/80 to-white/60 dark:from-black/40 dark:via-black/60 dark:to-black/40 pointer-events-none rounded-l-lg blur-sm"></div>
            <div className="absolute inset-y-0 -right-1 w-2 bg-gradient-to-b from-white/60 via-white/80 to-white/60 dark:from-black/40 dark:via-black/60 dark:to-black/40 pointer-events-none rounded-r-lg blur-sm"></div>
            {/* Add animated pulse effect to the card border */}
            <div className="absolute inset-0 border-2 border-white/40 dark:border-black/30 animate-pulse rounded-lg pointer-events-none z-[-1]"></div>
            </>
          )}
        
        <div className="p-4 relative z-10 bg-gray-800 dark:bg-white border-t border-white/30 dark:border-black/30">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-white dark:text-gray-900">{name}</h3>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{category}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Talle: {size}</p>
            </div>
            <p className="text-lg font-semibold text-white dark:text-gray-900">{formattedPrice}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {/* Availability status */}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${!soldOut ? 'bg-green-800 text-green-100 dark:bg-green-100 dark:text-green-800' : 'bg-red-800 text-red-100 dark:bg-red-100 dark:text-red-800'}`}
              aria-label={!soldOut ? 'Producto disponible' : 'Producto agotado'}
            >
              {!soldOut ? 'Disponible' : 'Agotado'}
            </span>
            
            {/* Removed duplicate lock status for minimalist style */}
          </div>
        </div>
      </Link>
    </MotionComponent>
  )
}

export default ProductCard

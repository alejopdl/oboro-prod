"use client"

import React, { useState, useEffect } from 'react'
import { default as Image } from 'next/image'
import { default as Link } from 'next/link'
import { motion } from 'framer-motion'
import { config } from '../data/config'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { Product } from '../types/product'
import { Lock } from 'lucide-react' // Only import the icons we actually use

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

  // Format price with only $ sign and dots as thousands separators
  const formattedPrice = `$${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`

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
      className={`group relative ${!soldOut && !locked ? 'bg-gray-800 dark:bg-white ring-4 ring-black dark:ring-white shadow-lg shadow-black/30 dark:shadow-white/30' : 'bg-gray-800/90 dark:bg-white/90'} rounded-lg overflow-hidden transition-all duration-300 ${!soldOut && !locked ? 'shadow-xl' : 'hover:shadow-xl'} w-[320px] sm:w-[380px] md:w-[420px] lg:w-[450px] mt-2`}
    >
      <Link 
        href={locked ? "#" : `/produto/${id}`} 
        className={`block ${locked ? 'pointer-events-none' : ''} h-full flex flex-col`}
        onClick={(e) => {
          if (locked) {
            e.preventDefault()
            return
          }
        }}>
        <div className="relative h-72 sm:h-80 md:h-96 lg:h-[28rem] w-full overflow-hidden flex-shrink-0">
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
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          )}
          {/* Locked indicator with minimalist style */}
          {locked && !soldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <div className="w-20 h-20 bg-red-800 rounded-full flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            </div>
          )}
          

        </div>
        
        {/* Glow effects for available products */}
        {!locked && !soldOut && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-6 bg-white/10 dark:bg-black/10 backdrop-blur-[1px] pointer-events-none rounded-b-lg opacity-70"></div>
            <div className="absolute inset-x-0 -top-1 h-2 bg-gradient-to-r from-white/60 via-white/80 to-white/60 dark:from-black/40 dark:via-black/60 dark:to-black/40 pointer-events-none rounded-t-lg blur-sm"></div>
            <div className="absolute inset-y-0 -left-1 w-2 bg-gradient-to-b from-white/60 via-white/80 to-white/60 dark:from-black/40 dark:via-black/60 dark:to-black/40 pointer-events-none rounded-l-lg blur-sm"></div>
            <div className="absolute inset-y-0 -right-1 w-2 bg-gradient-to-b from-white/60 via-white/80 to-white/60 dark:from-black/40 dark:via-black/60 dark:to-black/40 pointer-events-none rounded-r-lg blur-sm"></div>
            {/* Animated pulse effect for the card border */}
            <div className="absolute inset-0 border-2 border-black/70 dark:border-white/70 animate-pulse rounded-lg pointer-events-none z-[-1]"></div>
            </>
          )}
        
        <div className="p-3 sm:p-3 md:p-4 lg:p-4 relative z-10 bg-gray-800 dark:bg-white border-t border-black/70 dark:border-white/70 flex flex-col justify-between flex-grow">
          <div className="flex flex-col">
            <h3 className="text-base sm:text-lg md:text-lg lg:text-xl font-medium text-white dark:text-gray-900 truncate w-full">{name}</h3>
            <p className="text-base sm:text-base md:text-lg lg:text-lg font-semibold text-white dark:text-gray-900 mt-1">{formattedPrice}</p>
            <p className="mt-2 text-sm text-gray-400 dark:text-gray-500 truncate">{category}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Talle: {size}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {/* Availability status */}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${!soldOut ? 'bg-green-800 text-green-100 dark:bg-green-100 dark:text-green-800' : 'bg-red-800 text-red-100 dark:bg-red-100 dark:text-red-800'}`}
              aria-label={!soldOut ? 'Producto disponible' : 'Producto agotado'}
            >
              {!soldOut ? (
                <span className="flex items-center">
                  <svg className="mr-1" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M8 15C9.5 17 14.5 17 16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="8" cy="9" r="1.5" fill="currentColor"/>
                    <circle cx="16" cy="9" r="1.5" fill="currentColor"/>
                  </svg>
                  Disponible
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="mr-1" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M8 17C9.5 15 14.5 15 16 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="8" cy="9" r="1.5" fill="currentColor"/>
                    <circle cx="16" cy="9" r="1.5" fill="currentColor"/>
                  </svg>
                  Agotado
                </span>
              )}
            </span>
            

          </div>
        </div>
      </Link>
    </MotionComponent>
  )
}

export default ProductCard

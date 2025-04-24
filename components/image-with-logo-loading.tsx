"use client"

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import LogoLoading from './logo-loading'

/**
 * Enhanced image component with logo-based loading animation
 * 
 * This component extends Next.js Image with a nice loading state using our logo.
 * When an image is loading, it shows the logo animation instead of empty space.
 * 
 * @param {object} props - Component props (extends Next.js Image props)
 * @param {string} [props.loaderSize='md'] - Size of the logo loader
 * @returns {JSX.Element} - Enhanced image component with loading state
 */
export default function ImageWithLogoLoading({
  alt,
  src,
  className = '',
  loaderSize = 'md',
  onLoadingComplete,
  ...props
}: ImageProps & { loaderSize?: 'sm' | 'md' | 'lg' }) {
  // Track if the image is loaded
  const [isLoaded, setIsLoaded] = useState(false)

  // Handle image load complete
  const handleLoadComplete = (result: any) => {
    setIsLoaded(true)
    // Call the original onLoadingComplete if provided
    if (onLoadingComplete) {
      onLoadingComplete(result)
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* Show the logo loading animation while the image loads */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/20">
          <LogoLoading size={loaderSize} />
        </div>
      )}
      
      {/* The actual image with fade-in effect when loaded */}
      <Image
        alt={alt}
        src={src}
        className={`
          w-full h-full 
          transition-opacity duration-500
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
        onLoadingComplete={handleLoadComplete}
        {...props}
      />
    </div>
  )
}

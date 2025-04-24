"use client"

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'

/**
 * Logo loading spinner with theme awareness and accessibility features
 * 
 * @param {object} props - Component props
 * @param {string} [props.size='md'] - Size of the loader ('sm', 'md', 'lg')
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} - Animated logo loading component
 */
export default function LogoLoading({ 
  size = 'md', 
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}) {
  // Track if component is mounted to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)
  // Get current theme from next-themes
  const { resolvedTheme } = useTheme()
  
  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate size classes based on the size prop
  const sizeClasses = {
    sm: 'w-10 h-10',     // Small: 40px
    md: 'w-16 h-16',   // Medium: 64px
    lg: 'w-24 h-24',   // Large: 96px
  }[size]

  // Only render the proper theme version after mounting to prevent hydration mismatch
  if (!mounted) {
    return (
      <div 
        className={`flex items-center justify-center ${sizeClasses} ${className}`}
        aria-label="Loading content..."
        role="status"
      />
    )
  }

  return (
    <div 
      className={`relative flex items-center justify-center ${sizeClasses} ${className}`}
      aria-label="Loading content..."
      role="status"
    >
      {/* Logo with inverted background based on theme */}
      <div 
        className={`
          w-full h-full rounded-full animate-spin-slow
          ${resolvedTheme === 'dark' ? 'bg-white' : 'bg-black'}
          flex items-center justify-center
        `}
      >
        {/* For dark mode: black logo on white background */}
        {/* For light mode: white logo on black background */}
        <div className="w-[80%] h-[80%] relative">
          <Image 
            src="/assets/blackIcon.svg"
            alt=""
            fill
            aria-hidden="true"
            className={resolvedTheme === 'dark' 
              ? '' /* Original black logo for dark mode */ 
              : 'invert(100%) brightness(200%)' /* Inverted to white for light mode */
            }
            style={{
              filter: resolvedTheme === 'dark' ? 'none' : 'invert(100%) brightness(200%)',
              transform: 'scale(1.4)', // Make the logo 140% of its container size
              transformOrigin: 'center center'
            }}
          />
        </div>
      </div>
      
      {/* Pulsing ring creates a nice visual effect */}
      <div 
        className={`
          absolute inset-0 rounded-full animate-pulse-scale
          ${resolvedTheme === 'dark' ? 'border-white' : 'border-black'}
          border-2
        `}
        aria-hidden="true"
      />
      
      {/* Visually hidden text for screen readers */}
      <span className="sr-only">Cargando...</span>
    </div>
  )
}

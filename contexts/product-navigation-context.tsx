"use client"

// Purpose: Manages product navigation state (selected drop, level) across the application

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createLogger } from '@/lib/logger'

const log = createLogger('ProductNavigation')

// Define the context type
type ProductNavigationContextType = {
  // Current selected drop ID
  selectedDrop: string
  // Current selected level (if any)
  selectedLevel: number | undefined
  // Method to change the selected drop
  setDrop: (dropId: string) => void
  // Method to change the selected level
  setLevel: (level: number | undefined) => void
  // Method to reset filters like hiding out-of-stock items
  resetFilters: () => void
  // Whether out-of-stock items are hidden
  hideOutOfStock: boolean
  // Method to toggle hiding out-of-stock items
  setHideOutOfStock: (hide: boolean) => void
}

// Create the context with default values
const ProductNavigationContext = createContext<ProductNavigationContextType>({
  selectedDrop: '',
  selectedLevel: undefined,
  setDrop: () => {},
  setLevel: () => {},
  resetFilters: () => {},
  hideOutOfStock: false,
  setHideOutOfStock: () => {},
})

// Hook to use the product navigation context
export const useProductNavigation = () => useContext(ProductNavigationContext)

// Provider component that wraps the app
export function ProductNavigationProvider({ 
  children,
  availableDrops = [],
}: { 
  children: React.ReactNode,
  availableDrops: string[]
}) {
  // Get Next.js navigation hooks
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Get initial values from URL with null checks
  const initialDropId = searchParams?.get('dropId') || ''
  const initialLevel = searchParams?.has('level') 
    ? Number(searchParams.get('level')) 
    : undefined
  
  // Local state
  const [selectedDrop, setSelectedDrop] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>(undefined)
  const [hideOutOfStock, setHideOutOfStock] = useState<boolean>(false)
  
  // Initialize from URL or default values
  useEffect(() => {
    // First priority: URL parameters
    if (initialDropId && availableDrops.includes(initialDropId)) {
      log.info(`Initializing drop from URL: ${initialDropId}`)
      setSelectedDrop(initialDropId)
    } 
    // Second priority: First available drop
    else if (availableDrops.length > 0 && selectedDrop === '') {
      log.info(`Initializing to first available drop: ${availableDrops[0]}`)
      setSelectedDrop(availableDrops[0])
    }
    
    // Set level from URL if available
    if (initialLevel !== undefined) {
      log.info(`Initializing level from URL: ${initialLevel}`)
      setSelectedLevel(initialLevel)
    }
  }, [initialDropId, initialLevel, availableDrops, selectedDrop])
  
  // Method to change the drop
  const setDrop = (dropId: string) => {
    if (!availableDrops.includes(dropId)) return
    
    log.info(`Changing drop to: ${dropId}`)
    setSelectedDrop(dropId)
    
    // Always reset level to 1 when changing drops
    log.info('Resetting level to 1 when changing drops')
    setSelectedLevel(1)
    
    // Only update URL if we're on the main page and searchParams is available
    if (pathname === '/' && searchParams) {
      // Create new URL parameters
      const params = new URLSearchParams(searchParams.toString())
      params.set('dropId', dropId)
      params.set('level', '1') // Always set level to 1 in URL as well
      
      // Replace current URL without refreshing the page
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }
  
  // Method to change the level
  const setLevel = (level: number | undefined) => {
    log.info(`Changing level to: ${level}`)
    setSelectedLevel(level)
    
    // Only update URL if we're on the main page, level is defined, and searchParams is available
    if (pathname === '/' && level !== undefined && searchParams) {
      // Create new URL parameters
      const params = new URLSearchParams(searchParams.toString())
      params.set('level', level.toString())
      
      // Replace current URL without refreshing the page
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }
  
  // Method to reset filters
  const resetFilters = () => {
    setHideOutOfStock(false)
  }
  
  // Create the context value object
  const contextValue: ProductNavigationContextType = {
    selectedDrop,
    selectedLevel,
    setDrop,
    setLevel,
    resetFilters,
    hideOutOfStock,
    setHideOutOfStock,
  }
  
  // Provide the context to children
  return (
    <ProductNavigationContext.Provider value={contextValue}>
      {children}
    </ProductNavigationContext.Provider>
  )
}

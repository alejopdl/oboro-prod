"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

/**
 * DropSelector component that displays buttons for selecting different product drops.
 * 
 * @param props - Component props
 * @param props.availableDrops - Array of available drop IDs to display
 * @param props.currentDrop - Currently selected drop ID
 * @returns JSX Element - The drop selector component
 */
export default function DropSelector({ 
  availableDrops, 
  currentDrop 
}: { 
  availableDrops: string[]
  currentDrop: string
}) {
  // Use Next.js router and searchParams hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Track if component is mounted (client-side only)
  const [mounted, setMounted] = useState(false)
  
  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Function to handle drop selection change
  const handleDropChange = (dropId: string) => {
    // Create a new URLSearchParams object from the current search params
    const params = new URLSearchParams(searchParams?.toString() || '')
    
    // Update the 'drop' parameter
    params.set('drop', dropId)
    
    // Push the new URL with updated parameters
    router.push(`/?${params.toString()}`)
  }
  
  // Only render the actual buttons after mounting to prevent hydration issues
  if (!mounted) {
    // Return a placeholder with similar dimensions during SSR
    return (
      <div className="flex flex-wrap gap-2 my-4 h-12">
        <p className="font-medium mr-2">Seleccionar Drop:</p>
        <div className="h-10 bg-gray-200 dark:bg-gray-800 w-20 rounded-md"></div>
      </div>
    )
  }
  
  return (
    <div className="flex flex-wrap gap-2 my-4">
      <p className="font-medium mr-2">Seleccionar Drop:</p>
      {availableDrops.map(drop => (
        <button 
          key={drop}
          onClick={() => handleDropChange(drop)}
          aria-pressed={currentDrop === drop}
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            currentDrop === drop 
              ? 'bg-black text-white dark:bg-white dark:text-black' 
              : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {drop}
        </button>
      ))}
    </div>
  )
}

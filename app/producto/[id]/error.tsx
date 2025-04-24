"use client"

// Purpose: Error boundary component for product detail page

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

/**
 * Displays a friendly error page when product loading fails
 * 
 * @param props - Component props from Next.js error boundary
 * @param props.error - The error that occurred
 * @param props.reset - Function to retry rendering the page
 * @returns JSX Element
 */
export default function ProductErrorPage({ 
  error, 
  reset 
}: { 
  error: Error; 
  reset: () => void;
}) {
  // Log the error when component mounts
  useEffect(() => {
    console.error('Product page error:', error)
    // In a production app, you would log to a service like Sentry here
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-amber-500 rounded-full p-6 mb-6">
        <AlertTriangle className="w-16 h-16 text-white" />
      </div>
      
      <h1 className="text-3xl font-bold mb-4">Ha ocurrido un error</h1>
      
      <p className="text-lg max-w-md mb-8">
        Lo sentimos, ha ocurrido un error al cargar el producto. Por favor intenta nuevamente.
      </p>
      
      <div className="flex space-x-4">
        <Button 
          onClick={reset}
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
        >
          Intentar nuevamente
        </Button>
        
        <Link href="/">
          <Button variant="outline">
            Volver a la colección
          </Button>
        </Link>
      </div>
    </div>
  )
}

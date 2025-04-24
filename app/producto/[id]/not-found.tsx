"use client"

// Purpose: Custom not-found page for product detail

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import Header from '@/components/header'
import ChladniBackground from '@/components/background-pattern'
import BackToTop from '@/components/back-to-top'

/**
 * Displays a friendly message when a product is not found
 * 
 * @returns JSX Element
 */
export default function ProductNotFound() {
  return (
    <div className="min-h-screen">
      <ChladniBackground />
      <Header />
      
      <main className="container mx-auto pt-24 pb-16">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          {/* Search icon */}
          <div className="bg-blue-500 rounded-full p-6 mb-6">
            <Search className="w-16 h-16 text-white" />
          </div>
          
          {/* Message title */}
          <h1 className="text-3xl font-bold mb-4">Producto no encontrado</h1>
          
          {/* Friendly explanation */}
          <p className="text-lg max-w-md mb-8">
            Lo sentimos, el producto que estás buscando no existe o ha sido removido de nuestra colección.
          </p>
          
          {/* Back button */}
          <Link href="/">
            <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
              Volver a la colección
            </Button>
          </Link>
        </div>
      </main>
      
      <BackToTop />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import { config } from "../data/config"
import { motion } from "framer-motion"
import { useReducedMotion } from "../hooks/use-reduced-motion"
import { Product } from "../types/product" // Import Product type

// Create an interface for the component props
// This tells TypeScript exactly what props this component accepts
interface ProductGridProps {
  products: Product[]; // An array of Product objects
  initialCategory?: string; // Optional (?) prop with default value
}

/**
 * Grid layout of product cards with category filtering
 * 
 * @param props - Component props
 * @param props.products - Array of products to display
 * @param props.initialCategory - Initial category filter to apply (defaults to "All")
 * @returns JSX Element with filtered product grid
 */
export default function ProductGrid({ 
  products, 
  initialCategory = "All" 
}: ProductGridProps): React.ReactElement {
  // State with proper TypeScript types
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const prefersReducedMotion = useReducedMotion()

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((product) => product.category === selectedCategory))
    }
  }, [selectedCategory, products])

  // Animation variants with TypeScript types
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* Category filter buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Use predefined categories or extract them from products */}
        {Array.from(new Set(['All', ...products.map(p => p.category)])).map((category: string) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">No hay productos</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            No se encontraron productos en la categoría seleccionada.
          </p>
        </div>
      ) : (
        /* Product grid with animation */
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  )
}

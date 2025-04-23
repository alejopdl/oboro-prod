"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import ProductCard from "./ProductCard"
import LazySection from "./lazy-section"
import Connector from "./connector"
import type { Product } from "@/types/product"
import { ArrowUpCircle } from "lucide-react" // Import for level heading
import { useScroll } from "@/contexts/scroll-context"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { Lock } from "lucide-react"
import { preloadImages } from "@/services/image-service"

/**
 * Product showcase component that displays products in a visually appealing layout
 * with animations, connectors between products, and lazy loading.
 * 
 * @param props - Component props
 * @param props.products - Array of all product objects
 * @param props.availableDrops - Array of available drop IDs
 * @returns JSX Element - The product showcase component
 */
export default function ProductShowcase({ products, availableDrops }: { products: Product[], availableDrops: string[] }) {
  // Track which product is currently active based on scroll position
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Keep track of which products are marked as sold
  const [soldProducts, setSoldProducts] = useState<Record<string, boolean>>({})
  
  // Store references to each product section for positioning connectors
  const productRefs = useRef<Record<string, HTMLDivElement | null>>({})
  
  // Get current scroll position from context
  const { scrollY } = useScroll()
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = useReducedMotion()
  
  // Track if component is mounted (client-side only)
  const [mounted, setMounted] = useState(false)
  
  // Add state for selected drop
  const [selectedDrop, setSelectedDrop] = useState<string>('')
  
  // Set mounted state after component mounts and initialize selected drop
  useEffect(() => {
    setMounted(true)
    
    // Initialize selected drop to the first available drop
    if (availableDrops.length > 0 && selectedDrop === '') {
      setSelectedDrop(availableDrops[0])
    }
  }, [availableDrops, selectedDrop])

  // Preload first product images
  useEffect(() => {
    if (products.length > 0) {
      // Preload first two products' images
      const imagesToPreload = [
        ...products[0].images, 
        ...(products.length > 1 ? products[1].images : [])
      ]
      preloadImages(imagesToPreload)
    }
  }, [products])

  // Initialize sold products state based on the product data
  useEffect(() => {
    const initialSoldState: Record<string, boolean> = {}
    products.forEach((product) => {
      if (product.soldOut || !product.inStock) {
        initialSoldState[product.id] = true
      }
    })
    setSoldProducts(initialSoldState)
  }, [products])
  
  // Note: productsByLevel and levels are now created using filteredProducts above

  // Function to mark a product as sold
  const markProductAsSold = (productId: string) => {
    setSoldProducts((prev) => ({
      ...prev,
      [productId]: true,
    }))
  }

  // We'll move this useEffect after filteredProducts is defined

  // Helper function to determine if a product is unlocked
  function isProductUnlocked(product: Product): boolean {
    // If product is in level 1, it's always unlocked
    if (product.level === 1) return true;
    
    // Get all products in the previous level in the same drop
    const prevLevelProducts = products.filter(
      p => p.dropId === product.dropId && p.level === product.level - 1
    );
    
    // If no products in previous level, this product is unlocked
    if (prevLevelProducts.length === 0) return true;
    
    // Check if all products in previous level are sold out
    return prevLevelProducts.every(p => !p.inStock || soldProducts[p.id]);
  }
  
  // Additional helper to check if a product is locked (opposite of unlocked)
  function isProductLocked(product: Product): boolean {
    return !isProductUnlocked(product);
  }

  // Introduction card with animation (only applied after mounting)
  const IntroductionCard = useMemo(() => {
    return (
      <div className="mb-16 md:mb-24 relative z-10">
        {/* Static version shown during SSR and before client-side hydration */}
        {!mounted ? (
          <div className="p-8 md:p-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="flex flex-col items-start justify-start" style={{ gap: "2px" }}>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-left tracking-tight uppercase"
                  style={{ textShadow: "0.5px 0.5px 0px currentColor", letterSpacing: "-0.02em" }}>
                <span className="bg-black dark:bg-white text-white dark:text-black px-1">TODO</span> TIENE UN CICLO
              </h2>
            </div>
          </div>
        ) : (
          /* Animated version only shown after hydration */
          <motion.div
            className="mb-16 md:mb-24 relative z-10"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.3 : 1.5, delay: prefersReducedMotion ? 0 : 0.5 }}
          >
            <motion.div
              className="p-8 md:p-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.3 : 1.5, delay: prefersReducedMotion ? 0 : 0.5 }}
            >
              <div className="flex flex-col items-start justify-start" style={{ gap: "2px" }}>
                <motion.h2
                  className="text-3xl md:text-5xl lg:text-6xl font-black text-left tracking-tight uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: prefersReducedMotion ? 0.3 : 1, delay: prefersReducedMotion ? 0 : 0.5 }}
                  style={{ textShadow: "0.5px 0.5px 0px currentColor", letterSpacing: "-0.02em" }}
                >
                  <span className="bg-black dark:bg-white text-white dark:text-black px-1">TODO</span> TIENE UN CICLO
                </motion.h2>

                <motion.h2
                  className="text-3xl md:text-5xl lg:text-6xl font-black text-left tracking-tight uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: prefersReducedMotion ? 0.3 : 1, delay: prefersReducedMotion ? 0.1 : 1.0 }}
                  style={{ textShadow: "0.5px 0.5px 0px currentColor", letterSpacing: "-0.02em" }}
                >
                  <span className="bg-black dark:bg-white text-white dark:text-black px-1">TODO</span> SE RENOVARÁ
                </motion.h2>

                <motion.h2
                  className="text-3xl md:text-5xl lg:text-6xl font-black text-left tracking-tight uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: prefersReducedMotion ? 0.3 : 1, delay: prefersReducedMotion ? 0.2 : 1.5 }}
                  style={{ textShadow: "0.5px 0.5px 0px currentColor", letterSpacing: "-0.02em" }}
                >
                  <span className="bg-black dark:bg-white text-white dark:text-black px-1">TODO</span> ES ÚNICO
                </motion.h2>
              </div>
            </motion.div>

            <motion.div
              className="mt-6 p-6 md:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.3 : 1, delay: prefersReducedMotion ? 0.1 : 1.2 }}
            >
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-black dark:text-white">
                Cómo Funciona Nuestro Proceso de Venta Único
              </h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  Cada artículo en nuestra colección es{" "}
                  <span className="font-semibold text-black dark:text-white">completamente único</span> con un stock de
                  exactamente uno. Nuestro proceso de venta sigue un orden secuencial:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Los productos se lanzan y venden{" "}
                    <span className="font-semibold text-black dark:text-white">uno por uno</span>, asegurando que cada pieza
                    reciba la atención que merece.
                  </li>
                  <li>Un nuevo producto está disponible solo después de que el anterior haya sido vendido.</li>
                  <li>
                    Los artículos bloqueados (indicados con un{" "}
                    <span className="inline-flex items-center text-red-500 dark:text-red-400">
                      <Lock className="h-4 w-4 mr-1" /> símbolo
                    </span>
                    ) estarán disponibles una vez que el artículo que los precede encuentre un hogar.
                  </li>
                </ol>
                <p className="italic mt-4">
                  Este enfoque nos permite mantener la exclusividad de nuestra colección mientras aseguramos que cada
                  cliente reciba una pieza verdaderamente única.
                </p>
              </div>
            </motion.div>

            {/* Collection identifier removed as requested */}
          </motion.div>
        )}
      </div>
    )
  }, [mounted, prefersReducedMotion])

  // Filter products by the selected drop
  const filteredProducts = selectedDrop ? 
    products.filter(product => product.dropId === selectedDrop) : 
    [];

  // Group filtered products by level
  const productsByLevel = filteredProducts.reduce((acc, product) => {
    const level = product.level
    if (!acc[level]) acc[level] = []
    acc[level].push(product)
    return acc
  }, {} as Record<number, Product[]>)
  
  // Get levels sorted in ascending order
  const levels = Object.keys(productsByLevel)
    .map(Number)
    .sort((a, b) => a - b)
    
  // Update active product based on scroll position - moved after filteredProducts is defined
  // Use a ref to store the current filtered products to avoid dependency issues
  const filteredProductsRef = useRef(filteredProducts);
  
  // Update the ref when filteredProducts changes
  useEffect(() => {
    filteredProductsRef.current = filteredProducts;
  }, [filteredProducts]);
  
  // Handle scroll without dependency on filteredProducts directly
  useEffect(() => {
    const handleScroll = () => {
      // Only run if we have product refs
      if (Object.keys(productRefs.current).length === 0) return;
      
      // Throttle scroll events for better performance
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => {
          // Find any product that's in view
          Object.entries(productRefs.current).forEach(([id, ref]) => {
            if (!ref) return;
            
            const rect = ref.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Check if product is in view
            if (rect.top < viewportHeight && rect.bottom > 0) {
              // Extract product id from the ref key (format: "level-productId")
              const parts = id.split('-');
              if (parts.length >= 2) {
                const productId = parts.slice(1).join('-'); // In case product ID contains hyphens
                // Use the ref version of filteredProducts
                const currentProducts = filteredProductsRef.current;
                const productIndex = currentProducts.findIndex(p => p.id === productId);
                if (productIndex !== -1) {
                  setActiveIndex(productIndex);
                }
              }
            }
          });
        });
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array to avoid re-registering on every render

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-16 md:py-24">
      {/* Introduction Card */}
      {IntroductionCard}
      
      {/* Products by Level */}
      <div className="space-y-24 mt-16 relative">
        {/* Drop Selector - Positioned above the first level */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {availableDrops.map(drop => (
              <button 
                key={drop}
                onClick={() => setSelectedDrop(drop)}
                aria-pressed={selectedDrop === drop}
                className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                  selectedDrop === drop 
                    ? 'bg-black text-white dark:bg-white dark:text-black' 
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {drop}
              </button>
            ))}
          </div>
        </div>
        {levels.map(level => (
          <div key={level} className="mb-16 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 bg-black/80 dark:bg-white/80 text-white dark:text-black px-3 py-2 rounded-md inline-flex items-center gap-1">
              <ArrowUpCircle className="h-4 w-4" />
              <span>Nivel {level}</span>
            </h3>
            
            {/* Centered container that will hold the products */}
            <div className="w-full flex justify-center relative">
              {/* Level indicator - visual line through the center */}
              <div className="absolute left-1/2 h-full -translate-x-1/2 w-1 bg-gradient-to-b from-black/0 via-black/10 to-black/0 dark:from-white/0 dark:via-white/10 dark:to-white/0 -z-10"></div>
              
              {/* Flexible-width grid with auto-fit to center items */}
              <div className={`grid gap-6 w-full max-w-6xl mx-auto
                grid-cols-1 
                ${productsByLevel[level]?.length === 1 ? 'md:grid-cols-1 lg:grid-cols-1 md:max-w-md' : ''}
                ${productsByLevel[level]?.length === 2 ? 'md:grid-cols-2 lg:grid-cols-2 md:max-w-3xl' : ''}
                ${productsByLevel[level]?.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : ''}
              `}>
                {/* Check if productsByLevel[level] exists before mapping over it */}
                {productsByLevel[level] && productsByLevel[level].map(product => {
                  const isUnlocked = isProductUnlocked(product)
                  const isSoldOut = !product.inStock || soldProducts[product.id];
                  
                  return (
                    <LazySection
                      key={`product-section-${product.id}`}
                      ref={(el) => {
                        // Store reference with a unique ID combining level and product ID
                        if (el) productRefs.current[`${level}-${product.id}`] = el;
                      }}
                      id={`product-${product.id}`}
                      className="relative z-10 flex justify-center"
                      rootMargin="500px"
                    >
                      <ProductCard 
                        key={`product-card-${product.id}`}
                        product={product} 
                        soldOut={isSoldOut}
                        locked={!isUnlocked}
                        onProductSold={() => markProductAsSold(product.id)}
                        isActive={activeIndex === productsByLevel[level].indexOf(product)}
                        panelPosition={productsByLevel[level].indexOf(product) % 2 === 0 ? "right" : "left"}
                      />
                    </LazySection>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
        {/* Connectors removed as requested */}
      </div>
    </div>
  )
}

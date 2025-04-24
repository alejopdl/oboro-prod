"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import ProductCard from "./ProductCard"
import LazySection from "./lazy-section"
import Connector from "./connector"
import type { Product } from "../types/product"
import { ArrowUpCircle, Lock } from "lucide-react"
import { useScroll } from "../contexts/scroll-context"
import { useReducedMotion } from "../hooks/use-reduced-motion"
import { preloadImages } from "../services/image-service"
import { Checkbox } from "./ui/checkbox"
import { useTheme } from "next-themes"
import { createLogger } from "../lib/logger"
import { useProductNavigation } from "../contexts/product-navigation-context"

// Create a context-specific logger for this component
const log = createLogger('ProductShowcase')

// Simplified props interface - no longer need to manage navigation state in component
interface ProductShowcaseProps {
  products: Product[];
}

/**
 * Product showcase component that displays products in a visually appealing layout
 * with animations, connectors between products, and lazy loading.
 * Uses ProductNavigationContext for drop/level selection and filters.
 * 
 * @param props - Component props
 * @param props.products - Array of all product objects
 * @returns JSX Element - The product showcase component
 */
export default function ProductShowcase({ 
  products
}: ProductShowcaseProps) {
  // Use the product navigation context instead of local state
  const { 
    selectedDrop, 
    selectedLevel,
    setDrop,
    setLevel,
    hideOutOfStock,
    setHideOutOfStock 
  } = useProductNavigation()
  
  // Get current theme to listen for changes
  const { theme } = useTheme()
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
  
  // Reference to track if initial scroll has happened
  const initialScrollDone = useRef(false)
  
  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Reset 'hideOutOfStock' when theme changes
  useEffect(() => {
    // Reset to default (unchecked) when theme changes
    setHideOutOfStock(false);
  }, [theme, setHideOutOfStock])

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

  // Function to mark a product as sold
  const markProductAsSold = (productId: string) => {
    log.info(`Marking product as sold: ${productId}`);
    setSoldProducts((prev) => {
      const newState = {
        ...prev,
        [productId]: true,
      };
      log.debug(`Updated sold products state`, newState);
      return newState;
    })
  }

  // Helper function to determine if a product is unlocked
  function isProductUnlocked(product: Product): boolean {
    // If product is in level 1, it's always unlocked
    if (product.level === 1) {
      log.debug(`Product ${product.id} (${product.name}) is level 1 - automatically unlocked`);
      return true;
    }
    
    // Get all products in the previous level in the same drop
    const prevLevelProducts = products.filter(
      p => p.dropId === product.dropId && p.level === product.level - 1
    );
    
    log.debug(`Product ${product.name} (level ${product.level}) has ${prevLevelProducts.length} products in previous level`, {
      productId: product.id,
      level: product.level,
      dropId: product.dropId,
      prevLevelCount: prevLevelProducts.length,
      prevLevelProducts: prevLevelProducts.map(p => ({ id: p.id, name: p.name, inStock: p.inStock }))
    });
    
    // If no products in previous level, this product is unlocked
    if (prevLevelProducts.length === 0) {
      log.debug(`No products in previous level - ${product.name} unlocked`);
      return true;
    }
    
    // Check if all products in previous level are sold out
    const allPrevLevelSoldOut = prevLevelProducts.every(p => !p.inStock || soldProducts[p.id]);
    
    log.debug(`Product ${product.name} ${allPrevLevelSoldOut ? 'is unlocked' : 'is still locked'} - all previous level products sold: ${allPrevLevelSoldOut}`);
    
    return allPrevLevelSoldOut;
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
          </motion.div>
        )}
      </div>
    )
  }, [mounted, prefersReducedMotion])

  // Effect to preload images when selected drop changes
  useEffect(() => {
    if (!selectedDrop) return;
    
    log.info(`Selected drop changed to: ${selectedDrop}`);
    
    // Filter products for this drop
    const dropProducts = products.filter(p => p.dropId === selectedDrop);
    log.debug(`Found ${dropProducts.length} products in drop ${selectedDrop}`);
    
    // Get image URLs to preload
    const imageUrls = dropProducts.flatMap(p => p.images);
    log.debug(`Preloading ${imageUrls.length} images for drop ${selectedDrop}`);
    
    // Preload the images
    preloadImages(imageUrls);
    
    // Reset scroll position when drop changes
    initialScrollDone.current = false;
  }, [selectedDrop, products]);

  // Filter products by the selected drop with debug logging
  const filteredProducts = useMemo(() => {
    if (!selectedDrop) return [];
    
    const filtered = products.filter(product => product.dropId === selectedDrop);
    log.info(`Filtered products for ${selectedDrop}: ${filtered.length} products found`);
    return filtered;
  }, [products, selectedDrop]);

  // Apply hide out-of-stock filter if enabled
  const displayProducts = hideOutOfStock
    ? filteredProducts.filter(product => !(product.soldOut || soldProducts[product.id]))
    : filteredProducts;

  // Group filtered products by level
  const productsByLevel = displayProducts.reduce((acc, product) => {
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

  // Effect to scroll to selected level if specified
  useEffect(() => {
    // Only scroll once and only if mounted, selectedLevel exists, and a drop is selected
    if (
      mounted && 
      selectedLevel && 
      selectedDrop && 
      !initialScrollDone.current
    ) {
      // Find the element for this level
      const levelElement = document.getElementById(`level-${selectedLevel}`);
      if (levelElement) {
        // Set a small timeout to ensure everything is rendered properly
        setTimeout(() => {
          // Don't use scrollIntoView directly as it doesn't account for fixed headers
          // Instead, calculate the offset manually and use window.scrollTo
          const rect = levelElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          // Add an offset (100px) to account for the header height
          const targetPosition = scrollTop + rect.top - 100;
          
          // Scroll to the position with a smooth behavior
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          log.info(`Scrolled to level ${selectedLevel}`);
          initialScrollDone.current = true;
        }, 500);
      }
    }
  }, [mounted, selectedLevel, selectedDrop]);

  // Update selectedLevel in context when active elements change
  useEffect(() => {
    if (mounted && selectedDrop) {
      // Determine current level from active elements
      const activeElements = document.querySelectorAll('[data-active="true"]');
      let currentLevel: number | undefined;
      
      activeElements.forEach(el => {
        const levelId = el.closest('[id^="level-"]')?.id;
        if (levelId) {
          const levelNum = parseInt(levelId.replace('level-', ''));
          if (!isNaN(levelNum)) {
            currentLevel = levelNum;
          }
        }
      });

      // Update level in context instead of directly manipulating URL
      if (currentLevel && currentLevel !== selectedLevel) {
        setLevel(currentLevel);
        log.info(`Updated level in context to: ${currentLevel}`);
      }
    }
  }, [mounted, selectedDrop, activeIndex, selectedLevel, setLevel]);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-16 md:py-24">
      {/* Introduction Card */}
      {IntroductionCard}
      
      {/* Products by Level */}
      <div className="space-y-24 mt-16 relative">
        {/* Drop Selector - Positioned above the first level */}
        <div className="flex flex-col items-center mb-12 w-full py-6 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Get available drops from products since we're not receiving them as props anymore */}
            {[...new Set(products.map(p => p.dropId))].map(drop => (
              <button
                key={drop}
                onClick={() => {
                  // Use the setDrop function from context
                  log.info(`Changing drop from ${selectedDrop} to ${drop}`);
                  
                  // Update drop in context
                  setDrop(drop);
                  
                  // Also reset filters
                  setHideOutOfStock(false);
                }}
                className={`px-6 py-3 text-lg rounded-full shadow-md transition-all duration-300 ${
                  selectedDrop === drop
                    ? "bg-black text-white dark:bg-white dark:text-black font-bold ring-2 ring-offset-2 ring-black dark:ring-white"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {drop}
              </button>
            ))}
          </div>
          
          <div className="mt-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={hideOutOfStock}
                onCheckedChange={(checked) => setHideOutOfStock(checked === true)}
                className={`${hideOutOfStock ? 'bg-black dark:bg-white border-black dark:border-white' : 'bg-white dark:bg-gray-800'}`}
              />
              <span className="text-sm font-medium">Ocultar productos agotados</span>
            </label>
          </div>
        </div>
        
        {/* Render each level */}
        {levels.length > 0 ? (
          levels.map((level, levelIndex) => {
            const productsInLevel = productsByLevel[level] || [];
            
            // Skip rendering empty levels if hiding out-of-stock
            if (productsInLevel.length === 0) return null;
            
            // Check if all products in this level are locked
            const allLocked = productsInLevel.every(product => isProductLocked(product));
            
            return (
              <div key={`level-${level}`} id={`level-${level}`} className="relative">
                <motion.h2
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.2 : 0.8 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 inline-block relative z-20 bg-white/70 dark:bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm"
                >
                  Nivel {level}
                </motion.h2>
        
                {/* Show lock icon next to title for levels that are all locked */}
                {allLocked && (
                  <div className="inline-flex items-center justify-center ml-4">
                    <div className="bg-red-800 rounded-full p-1 inline-flex">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
        
                {/* Products in this level */}
                <div className="relative">
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
        
                  {/* Map products in this level */}
                  {productsInLevel.map((product, productIndex) => {
                    // Product is locked if not unlocked
                    const locked = isProductLocked(product);
                    // Is this product sold out?
                    const soldOut = product.soldOut || soldProducts[product.id];
                    // Is this the first product in the level?
                    const isFirst = productIndex === 0;
                    // Is the previous product sold?
                    const previousProductSold =
                      productIndex > 0 ? productsByLevel[level][productIndex - 1].soldOut || soldProducts[productsByLevel[level][productIndex - 1].id] : false;
                    // Position relative to timeline (alternating)
                    const position = productIndex % 2 === 0 ? "right" : "left";
        
                    return (
                      <div
                        key={product.id}
                        ref={(el) => {
                          // Store ref without returning a value (fixing TypeScript error)
                          productRefs.current[`level-${product.id}`] = el
                        }}
                        className="relative"
                      >
                        {/* Only render connectors for products after the first one */}
                        {!isFirst && (
                          <LazySection>
                            <Connector 
                              startRef={productRefs.current[`level-${productsByLevel[level][productIndex - 1].id}`]} 
                              endRef={productRefs.current[`level-${product.id}`]} 
                              isActive={true}
                              id={`connector-${level}-${productIndex}`}
                            />
                          </LazySection>
                        )}
        
                        <div
                          className={`relative mb-16 flex items-center justify-center ${
                            position === "left" ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <div
                            className={`absolute left-1/2 w-6 h-6 bg-white dark:bg-black border-2 ${
                              soldOut
                                ? "border-red-500 dark:border-red-400"
                                : locked
                                ? "border-gray-400 dark:border-gray-600"
                                : "border-green-500 dark:border-green-400 animate-pulse"
                            } rounded-full transform -translate-x-1/2`}
                          ></div>
        
                          <div className={`w-10/12 md:w-5/12 ${position === "left" ? "mr-8" : "ml-8"}`}>
                            <LazySection threshold={0.1}>
                              <ProductCard
                                product={product}
                                isActive={product.id === filteredProducts[activeIndex]?.id}
                                panelPosition={position}
                                index={productIndex}
                                previousProductSold={previousProductSold}
                                soldOut={soldOut}
                                locked={locked}
                                onProductSold={() => markProductAsSold(product.id)}
                              />
                            </LazySection>
                          </div>
        
                          <div className="w-2/12 md:w-5/12"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          // Show message when no products are found
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {selectedDrop && hideOutOfStock 
                ? 'No hay productos disponibles en este momento.' 
                : 'Selecciona una colección para ver los productos.'}
            </p>
          </div>
        )}
      </div>
      
      {/* Floating back-to-top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-50 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Volver al inicio"
      >
        <ArrowUpCircle className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  )
}

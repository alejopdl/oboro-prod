"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import ProductCard from "./ProductCard"
import LazySection from "./lazy-section"
import Connector from "./connector"
import type { Product } from "@/types/product"
import { useScroll } from "@/contexts/scroll-context"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { Lock } from "lucide-react"
import { preloadImages } from "@/services/image-service"

export default function ProductShowcase({ products }: { products: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [soldProducts, setSoldProducts] = useState<Record<string, boolean>>({})
  const productRefs = useRef<(HTMLDivElement | null)[]>([])
  const { scrollY } = useScroll()
  const prefersReducedMotion = useReducedMotion()

  // Preload first product images
  useEffect(() => {
    if (products.length > 0) {
      // Preload first two products' images
      const imagesToPreload = [...products[0].images, ...(products.length > 1 ? products[1].images : [])]
      preloadImages(imagesToPreload)
    }
  }, [products])

  // Initialize sold products state based on the product data
  useEffect(() => {
    const initialSoldState: Record<string, boolean> = {}
    products.forEach((product) => {
      if (product.soldOut) {
        initialSoldState[product.id] = true
      }
    })
    setSoldProducts(initialSoldState)
  }, [products])

  // Function to mark a product as sold
  const markProductAsSold = (productId: string) => {
    setSoldProducts((prev) => ({
      ...prev,
      [productId]: true,
    }))
  }

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return

      const scrollPosition = window.scrollY + window.innerHeight / 2

      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      productRefs.current.forEach((ref, index) => {
        if (ref) {
          const { top } = ref.getBoundingClientRect()
          const distance = Math.abs(top + window.scrollY - scrollPosition)

          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = index
          }
        }
      })

      setActiveIndex(closestIndex)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Function to check if the previous product is sold
  const isPreviousProductSold = (index: number) => {
    if (index === 0) return true // First product is always unlocked
    const previousProduct = products[index - 1]
    return soldProducts[previousProduct.id] || false
  }

  // Memoize the introduction card to prevent unnecessary re-renders
  const IntroductionCard = useMemo(() => {
    return (
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

        {/* Drop Code Label - Below process description */}
        <motion.div
          className="mt-8 mx-auto text-center relative max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black to-black/80 dark:from-white/80 dark:via-white dark:to-white/80 blur-sm -z-10 rounded-md transform rotate-1"></div>
          <div className="bg-black dark:bg-white p-5 rounded-md shadow-xl border border-gray-400/30 dark:border-gray-600/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400/50 dark:via-gray-500/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400/50 dark:via-gray-500/50 to-transparent"></div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                Identificador de Colección
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-[0.2em] text-white dark:text-black">0BQ1</span>
                <span className="text-sm text-gray-400 dark:text-gray-500 font-light">Código de lanzamiento</span>
              </div>
              <div className="mt-1 flex items-center">
                <div className="h-[1px] w-4 bg-gray-500/50 dark:bg-gray-400/50"></div>
                <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-500 mx-1"></div>
                <div className="h-[1px] w-4 bg-gray-500/50 dark:bg-gray-400/50"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }, [prefersReducedMotion])

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-16 md:py-24">
      {/* Introduction Card */}
      {IntroductionCard}

      {/* Product Cards */}
      {products.map((product, index) => {
        const previousProductSold = isPreviousProductSold(index)
        const prevRef = index > 0 ? productRefs.current[index - 1] : null
        const currentRef = productRefs.current[index]

        return (
          <div key={`product-container-${product.id}`} className="relative">
            {index > 0 && prevRef && currentRef && (
              <Connector
                key={`connector-${product.id}`}
                id={`connector-${product.id}`}
                startRef={prevRef}
                endRef={currentRef}
                isActive={activeIndex === index || activeIndex === index - 1}
              />
            )}
            <LazySection
              key={`product-section-${product.id}`}
              ref={(el) => {
                // Store reference and return void (not the element itself)
                if (el) productRefs.current[index] = el;
                // TypeScript expects ref callbacks to return void
              }}
              id={`product-${product.id}`}
              className="mb-16 md:mb-24 relative z-10"
              rootMargin="500px"
            >
              <ProductCard
                key={`product-card-${product.id}`}
                product={product}
                isActive={activeIndex === index}
                panelPosition={index % 2 === 0 ? "right" : "left"}
                index={index}
                previousProductSold={previousProductSold}
              />
            </LazySection>
          </div>
        )
      })}
    </div>
  )
}

"use client"

import { memo, useMemo } from "react"
import { motion } from "framer-motion"
import type { Product } from "@/types/product"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useAnimationVariants } from "@/hooks/use-animation-variants"

interface ProductPanelProps {
  product: Product
  isActive: boolean
  isLocked?: boolean
  isSoldOut?: boolean
}

function ProductPanelComponent({ product, isActive, isLocked = false, isSoldOut = false }: ProductPanelProps) {
  const prefersReducedMotion = useReducedMotion()
  const { currentTheme, borderVariants, highlightVariants } = useAnimationVariants()
  const isAvailable = !isLocked && !isSoldOut

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`¡Hola! Me interesa el ${product.name} (${product.size}) por ${product.price}.`)
    window.open(`https://wa.me/+1234567890?text=${message}`, "_blank", "noopener,noreferrer")
  }

  // Memoize the button text to avoid unnecessary calculations
  const buttonText = useMemo(() => {
    if (isLocked) return "Bloqueado"
    if (isSoldOut) return "Agotado"
    return "Es para mí"
  }, [isLocked, isSoldOut])

  // Memoize the button class to avoid unnecessary string concatenations
  const buttonClass = useMemo(() => {
    if (isLocked) {
      return "w-full py-3 px-4 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed"
    }
    if (isSoldOut) {
      return "w-full py-3 px-4 bg-yellow-300 dark:bg-yellow-600 text-yellow-800 dark:text-yellow-100 rounded-lg font-medium cursor-not-allowed"
    }
    return "w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
  }, [isLocked, isSoldOut])

  return (
    <motion.div
      className={`relative bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-md ${
        isLocked
          ? "border-2 border-red-300 dark:border-red-800"
          : isSoldOut
            ? "border-2 border-yellow-300 dark:border-yellow-600"
            : "border-none"
      }`}
      initial={{ opacity: 0, x: 0 }}
      animate={{
        opacity: isActive ? 1 : 0.7,
        x: 0,
        scale: isActive ? 1 : 0.95,
      }}
      transition={{ duration: 0.4 }}
      style={{ willChange: "opacity, transform" }}
    >
      {/* Enhanced animated glow effect for available products */}
      {isAvailable && isActive && !prefersReducedMotion && (
        <>
          <motion.div
            className="absolute -inset-2 rounded-xl pointer-events-none"
            initial="initial"
            animate={currentTheme}
            variants={highlightVariants}
            aria-hidden="true"
            style={{ willChange: "box-shadow" }}
          />
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial="initial"
            animate={currentTheme}
            variants={borderVariants}
            aria-hidden="true"
            style={{ willChange: "box-shadow" }}
          />
        </>
      )}

      {isLocked ? (
        <>
          <div className="mb-4">
            <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-500">Artículo Bloqueado</h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Este artículo se desbloqueará cuando el anterior sea vendido.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Stock: Único</p>
          <motion.button className={buttonClass} disabled aria-disabled="true">
            {buttonText}
          </motion.button>
        </>
      ) : isSoldOut ? (
        <>
          <div className="mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">AGOTADO</h2>
          </div>
          <h3 className="text-xl font-bold mb-4 dark:text-white line-through">{product.name}</h3>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Precio</span>
              <span className="text-xl font-bold dark:text-white line-through">${product.price}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Talle</span>
              <span className="font-medium dark:text-white line-through">{product.size}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Stock</span>
              <span className="font-medium dark:text-white line-through">Único</span>
            </div>
          </div>
          <motion.button className={buttonClass} disabled aria-disabled="true">
            {buttonText}
          </motion.button>
        </>
      ) : (
        <>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white relative">
            {product.name}
            {isActive && !prefersReducedMotion && (
              <motion.span
                className="absolute -left-3 top-1/2 w-2 h-2 bg-black dark:bg-white rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: [-4, 0, -4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
                aria-hidden="true"
                style={{ willChange: "opacity, transform" }}
              />
            )}
          </h2>

          <div className="space-y-4 mb-6 relative">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Precio</span>
              <span className="text-xl font-bold dark:text-white">${product.price}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Talle</span>
              <span className="font-medium dark:text-white">{product.size}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Stock</span>
              <span className="font-medium dark:text-white">Único</span>
            </div>
          </div>

          <motion.button
            className={buttonClass}
            onClick={handleWhatsAppClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`Contactar por WhatsApp sobre ${product.name}`}
          >
            {/* Enhanced shine effect on button */}
            {isActive && !prefersReducedMotion && (
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                animate={{
                  translateX: ["100%", "-100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 1,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
                style={{ willChange: "transform" }}
              />
            )}
            {buttonText}
          </motion.button>
        </>
      )}
    </motion.div>
  )
}

// Memoize the component to prevent unnecessary re-renders
const ProductPanel = memo(ProductPanelComponent)
export default ProductPanel

"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { config } from "../data/config"
import { useReducedMotion } from "../hooks/use-reduced-motion"
import { Product } from "../types/product" // Import the Product type

// Define props interface for our component
interface ProductDetailProps {
  product: Product | null;
}

/**
 * Displays detailed information about a single product
 * Features image gallery, zoom function, and WhatsApp purchase button
 * 
 * @param props - Component props
 * @param props.product - Product data to display
 * @returns JSX Element with product details
 */
export default function ProductDetail({ product }: ProductDetailProps): React.ReactElement {
  // State with proper type definitions
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false)
  const [imageLoaded, setImageLoaded] = useState<boolean>(false)
  const prefersReducedMotion = useReducedMotion()

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Producto no encontrado</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">El producto que buscas no existe o ha sido eliminado.</p>
      </div>
    )
  }

  const { name, price, description, images, category, inStock, size } = product

  // Format price according to locale and currency
  const formattedPrice = new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
  }).format(price)

  // Function to go to next image
  const nextImage = (): void => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  // Function to go to previous image
  const prevImage = (): void => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  // Function to handle WhatsApp click
  const handleWhatsAppClick = (): void => {
    const message = encodeURIComponent(
      `¡Hola! Me interesa el producto "${name}" (${size || "N/A"}) por ${formattedPrice}.`,
    )
    window.open(`https://wa.me/${config.social?.whatsapp}?text=${message}`, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="md:flex">
        {/* Product Images */}
        <div className="md:w-1/2 relative">
          <div className="relative h-80 md:h-96 lg:h-[500px] w-full group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
                className={`h-full w-full relative overflow-hidden ${isImageZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                onClick={() => setIsImageZoomed(!isImageZoomed)}
              >
                <Image
                  src={images[currentImageIndex] || "/placeholder-product.jpg"}
                  alt={`${name} - imagen ${currentImageIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={currentImageIndex === 0}
                  className={`object-contain transition-transform duration-300 ${
                    isImageZoomed ? "scale-150" : "scale-100"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              </motion.div>
            </AnimatePresence>

            {/* Loading state */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="animate-pulse w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
              </div>
            )}

            {/* Image navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full p-2 shadow-md hover:bg-white dark:hover:bg-black/80 transition-colors"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full p-2 shadow-md hover:bg-white dark:hover:bg-black/80 transition-colors"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Zoom button */}
            <button
              onClick={() => setIsImageZoomed(!isImageZoomed)}
              className="absolute bottom-2 right-2 bg-white/80 dark:bg-black/50 rounded-full p-2 shadow-md hover:bg-white dark:hover:bg-black/80 transition-colors"
              aria-label={isImageZoomed ? "Alejar" : "Acercar"}
            >
              {isImageZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
            </button>

            {/* Thumbnail navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImageIndex === index
                        ? "bg-black dark:bg-white"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                    aria-label={`Ver imagen ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 md:w-1/2">
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formattedPrice}</p>

            {/* Category and size */}
            <div className="flex flex-wrap gap-2">
              {category && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                  {category}
                </span>
              )}
              {size && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                  Talle: {size}
                </span>
              )}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  inStock
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {inStock ? "En stock" : "Agotado"}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{description}</p>

            {/* WhatsApp button */}
            <button
              onClick={handleWhatsAppClick}
              disabled={!inStock}
              className={`mt-6 w-full py-3 px-4 rounded-md font-medium transition-colors ${
                inStock
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              {inStock ? "Comprar por WhatsApp" : "No disponible"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

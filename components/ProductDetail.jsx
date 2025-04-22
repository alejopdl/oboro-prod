"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { config } from "@/data/config"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export default function ProductDetail({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
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

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `¡Hola! Me interesa el producto "${name}" (${size || "N/A"}) por ${formattedPrice}.`,
    )
    window.open(`https://wa.me/${config.contactWhatsApp}?text=${message}`, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2 relative">
          <div className="relative h-96 md:h-full w-full">
            <div
              className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 ${imageLoaded ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
                className={`relative h-full w-full ${isImageZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                onClick={() => setIsImageZoomed(!isImageZoomed)}
              >
                <Image
                  src={images[currentImageIndex] || "/images/placeholder.jpg"}
                  alt={`${name} - Imagen ${currentImageIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-contain transition-transform duration-300 ${
                    isImageZoomed ? "scale-150" : "scale-100"
                  } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => setImageLoaded(true)}
                />
              </motion.div>
            </AnimatePresence>

            {!inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-bold text-xl">Agotado</span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md z-10 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md z-10 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImageIndex === index ? "bg-black dark:bg-white w-4" : "bg-black/40 dark:bg-white/40"
                }`}
                aria-label={`Ir a imagen ${index + 1} de ${images.length} de ${name}`}
                aria-current={currentImageIndex === index ? "true" : undefined}
              />
            ))}
          </div>

          <button
            onClick={() => setIsImageZoomed(!isImageZoomed)}
            className="absolute top-4 right-4 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md z-10 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            aria-label={isImageZoomed ? "Alejar imagen" : "Ampliar imagen"}
          >
            {isImageZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
          </button>
        </div>

        <div className="md:w-1/2 p-6 md:p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{category}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formattedPrice}</p>
          </div>

          {size && (
            <div className="mt-4">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white">Talle</h2>
              <p className="mt-1 text-gray-600 dark:text-gray-300">{size}</p>
            </div>
          )}

          <div className="mt-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                inStock
                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
              }`}
            >
              {inStock ? "Disponible" : "Agotado"}
            </span>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Descripción</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 whitespace-pre-line">{description}</p>
          </div>

          <div className="mt-8">
            <button
              disabled={!inStock}
              onClick={handleWhatsAppClick}
              className={`w-full py-3 px-4 rounded-md font-medium text-white ${
                inStock
                  ? "bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
                  : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              }`}
            >
              {inStock ? "Es para mí" : "Agotado"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

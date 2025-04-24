"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import ImageWithLogoLoading from "./image-with-logo-loading"
import LogoLoading from "./logo-loading"
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
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  
  // Set mounted state after component mounts to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Determine the right component to use based on mounting state
  const MotionComponent = mounted ? motion.div : 'div';
  
  return (
    <MotionComponent
      {...(mounted 
        ? {
            initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: prefersReducedMotion ? 0.1 : 0.5 }
          } 
        : {}
      )}
      className={`bg-gray-800 dark:bg-white ring-4 ring-black dark:ring-white shadow-lg shadow-black/30 dark:shadow-white/30 rounded-lg overflow-hidden transition-all duration-300`}
    >
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
                <ImageWithLogoLoading
                  src={images[currentImageIndex] || "/placeholder-product.jpg"}
                  alt={`${name} - imagen ${currentImageIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={currentImageIndex === 0}
                  loaderSize="lg"
                  className={`object-contain transition-transform duration-300 ${
                    isImageZoomed ? "scale-150" : "scale-100"
                  }`}
                  onLoadingComplete={() => setImageLoaded(true)}
                />
              </motion.div>
            </AnimatePresence>

            {/* We no longer need this basic loading state since ImageWithLogoLoading handles it */}

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

            {/* Enhanced thumbnail strip */}
            {images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/20 dark:bg-white/20 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 px-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent max-w-full">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all duration-300 ${
                        currentImageIndex === index
                          ? "ring-2 ring-black dark:ring-white scale-110"
                          : "ring-1 ring-gray-300 dark:ring-gray-600 opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`Ver imagen ${index + 1}`}
                    >
                      <ImageWithLogoLoading 
                        src={image} 
                        alt={`${name} - miniatura ${index + 1}`}
                        fill
                        sizes="64px"
                        loaderSize="sm"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 md:w-1/2 relative z-10 bg-gray-800 dark:bg-white border-t border-black/70 dark:border-white/70">
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white dark:text-gray-900">{name}</h1>
            <p className="text-3xl font-bold text-white dark:text-gray-900">{formattedPrice}</p>

            {/* Category and size */}
            <div className="flex flex-wrap gap-2">
              {category && (
                <span className="px-3 py-1 bg-gray-700 dark:bg-gray-200 rounded-full text-sm font-medium text-gray-200 dark:text-gray-700">
                  {category}
                </span>
              )}
              {size && (
                <span className="px-3 py-1 bg-gray-700 dark:bg-gray-200 rounded-full text-sm font-medium text-gray-200 dark:text-gray-700">
                  Talle: {size}
                </span>
              )}
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                  inStock
                    ? "bg-green-800 text-green-100 dark:bg-green-100 dark:text-green-800"
                    : "bg-red-800 text-red-100 dark:bg-red-100 dark:text-red-800"
                }`}
                aria-label={inStock ? 'Producto disponible' : 'Producto agotado'}
              >
                {inStock ? (
                  <span className="flex items-center">
                    <svg className="mr-1" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M8 15C9.5 17 14.5 17 16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="8" cy="9" r="1.5" fill="currentColor"/>
                      <circle cx="16" cy="9" r="1.5" fill="currentColor"/>
                    </svg>
                    Disponible
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="mr-1" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M8 17C9.5 15 14.5 15 16 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="8" cy="9" r="1.5" fill="currentColor"/>
                      <circle cx="16" cy="9" r="1.5" fill="currentColor"/>
                    </svg>
                    Agotado
                  </span>
                )}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-300 dark:text-gray-700 whitespace-pre-wrap">{description}</p>

            {/* WhatsApp button */}
            <button
              onClick={handleWhatsAppClick}
              disabled={!inStock}
              className={`mt-6 w-full py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                inStock
                  ? "bg-green-600 hover:bg-green-700 text-white ring-2 ring-green-600 hover:ring-green-500 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-gray-700 text-gray-400 dark:bg-gray-300 dark:text-gray-500 cursor-not-allowed opacity-70"
              }`}
            >
              <span className="flex items-center justify-center">
                {inStock ? (
                  <>
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.4722 14.7336C17.1926 14.5936 15.7162 13.8703 15.4614 13.7799C15.2066 13.6895 15.0218 13.6443 14.8371 13.9239C14.6523 14.2035 14.0794 14.8816 13.9147 15.0663C13.75 15.251 13.5854 15.2737 13.3058 15.1335C13.0262 14.9933 12.0882 14.6639 10.9737 13.6744C10.1021 12.9023 9.51608 11.9594 9.35145 11.6798C9.18673 11.4002 9.33426 11.2486 9.47524 11.1098C9.60237 10.9848 9.75845 10.7824 9.90017 10.6177C10.0419 10.453 10.087 10.3401 10.1775 10.1553C10.2679 9.97058 10.2228 9.80584 10.1549 9.66583C10.087 9.52583 9.50426 8.04948 9.27449 7.49004C9.05045 6.94755 8.82358 7.01533 8.6514 7.00749C8.48667 7.00049 8.30188 7.00008 8.11709 7.00008C7.9323 7.00008 7.63269 7.06796 7.37788 7.34757C7.12307 7.62717 6.33472 8.35042 6.33472 9.82677C6.33472 11.3031 7.39788 12.7343 7.5396 12.9191C7.68133 13.1039 9.5016 15.8835 12.2614 17.1897C12.9262 17.4766 13.4499 17.6564 13.8553 17.7928C14.5345 18.0224 15.1514 17.9903 15.6359 17.9205C16.1774 17.842 17.3918 17.2031 17.6217 16.5536C17.8516 15.9041 17.8516 15.3447 17.7837 15.2315C17.7157 15.1183 17.5309 15.0506 17.2513 14.9105C16.9718 14.7704 17.4722 14.7336 17.4722 14.7336ZM12.0405 21.5957H12.0354C10.2613 21.596 8.52053 21.1388 6.99949 20.2781L6.6352 20.0573L2.88662 21.0168L3.86466 17.35L3.62182 16.9731C2.67357 15.4029 2.17352 13.5896 2.17576 11.7378C2.17797 6.31766 6.6204 1.87523 12.0456 1.87523C14.6701 1.87523 17.117 2.90587 18.9487 4.73848C19.8543 5.64073 20.5709 6.71739 21.0536 7.90546C21.5362 9.09352 21.7752 10.3682 21.7545 11.6517C21.7522 17.0719 17.3098 21.5957 12.0405 21.5957ZM20.4732 3.21417C19.3541 2.0889 18.0173 1.19948 16.5447 0.599679C15.0721 -0.000119088 13.4939 -0.1527 11.9469 0.0904C10.3998 0.3335 8.92205 0.965 7.6218 1.93799C6.32156 2.91098 5.2326 4.20229 4.44471 5.70452C2.82431 8.79039 2.82388 12.5133 4.44362 15.5995L2.95342 22.1435L9.65741 20.6941C11.0437 21.4842 12.6029 21.8991 14.1907 21.9011H14.1959C16.5658 21.9011 18.8246 20.9785 20.5458 19.2561C22.266 17.5337 23.1911 15.2751 23.1941 12.9049C23.1971 10.5357 22.2769 8.27477 20.4732 3.21417Z"/>
                    </svg>
                    Comprar por WhatsApp
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M8 17C9.5 15 14.5 15 16 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="8" cy="9" r="1.5" fill="currentColor"/>
                      <circle cx="16" cy="9" r="1.5" fill="currentColor"/>
                    </svg>
                    No disponible
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Glow effects similar to ProductCard */}
      {mounted && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-6 bg-white/10 dark:bg-black/10 backdrop-blur-[1px] pointer-events-none rounded-b-lg opacity-70"></div>
          <div className="absolute inset-x-0 -top-1 h-2 bg-gradient-to-r from-white/60 via-white/80 to-white/60 dark:from-black/40 dark:via-black/60 dark:to-black/40 pointer-events-none rounded-t-lg blur-sm"></div>
          <div className="absolute inset-y-0 -left-1 w-2 bg-gradient-to-b from-white/60 via-white/80 to-white/60 dark:from-black/40 dark:via-black/60 dark:to-black/40 pointer-events-none rounded-l-lg blur-sm"></div>
          <div className="absolute inset-y-0 -right-1 w-2 bg-gradient-to-b from-white/60 via-white/80 to-white/60 dark:from-black/40 dark:via-black/60 dark:to-black/40 pointer-events-none rounded-r-lg blur-sm"></div>
          {/* Animated pulse effect for the card border */}
          <div className="absolute inset-0 border-2 border-black/70 dark:border-white/70 animate-pulse rounded-lg pointer-events-none z-[-1]"></div>
        </>
      )}
    </MotionComponent>
  )
}

"use client"

import { useRef, useEffect, useState, useCallback, useMemo } from "react"
import { motion, useTransform, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Lock, ZoomIn } from "lucide-react"
import ProductPanel from "./product-panel"
import Image from "next/image"
import ProgressiveImage from "./progressive-image"
import ErrorBoundary from "./error-boundary"
import type { Product } from "@/types/product"
import { useScroll } from "@/contexts/scroll-context"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useProductInteraction } from "@/hooks/use-product-interaction"
import { useAnimationVariants } from "@/hooks/use-animation-variants"
import { useLazyLoad } from "@/hooks/use-lazy-load"

interface ProductCardProps {
  product: Product
  isActive: boolean
  panelPosition: "left" | "right"
  index: number
  previousProductSold?: boolean
}

export default function ProductCard({
  product,
  isActive,
  panelPosition,
  index,
  previousProductSold = index === 0, // First product is always unlocked
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardTop, setCardTop] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const { scrollY } = useScroll()
  const prefersReducedMotion = useReducedMotion()
  const { currentTheme, highlightVariants } = useAnimationVariants()
  const { ref: lazyLoadRef, isVisible: isInViewport } = useLazyLoad({ rootMargin: "500px" })

  // Determine if the product is locked or sold out
  const isLocked = product.locked && !previousProductSold
  const isSoldOut = product.soldOut === true
  const isAvailable = !isLocked && !isSoldOut

  // Use our custom hook for product interaction
  const {
    currentImageIndex,
    isZoomed,
    ariaLiveText,
    nextImage,
    prevImage,
    toggleZoom,
    handleImageLoad,
    setupKeyboardNavigation,
    setCurrentImageIndex,
    announceImageChange,
  } = useProductInteraction({
    product,
    isLocked,
    isSoldOut,
  })

  // Set up keyboard navigation
  useEffect(() => {
    return setupKeyboardNavigation(cardRef)
  }, [setupKeyboardNavigation])

  // Update card position for parallax calculations
  useEffect(() => {
    if (!cardRef.current || typeof window === "undefined") return

    const updatePosition = () => {
      const element = cardRef.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      setCardTop(rect.top + window.scrollY)
      setWindowHeight(window.innerHeight)
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)

    return () => {
      window.removeEventListener("resize", updatePosition)
    }
  }, [])

  // Calculate parallax values based on scroll position
  const calculateParallax = useCallback(
    (strength = 0.1) => {
      if (!cardTop || !windowHeight) return 0

      const distanceFromCenter = cardTop - scrollY.get() - windowHeight / 2
      return distanceFromCenter * strength
    },
    [cardTop, windowHeight, scrollY],
  )

  // Create motion values for parallax effects
  const defaultParallaxValue = 0

  const yValue = calculateParallax(0.1) || defaultParallaxValue
  const scaleValueCalc = calculateParallax(0.0005) || defaultParallaxValue
  const rotationValueCalc = calculateParallax(0.005) || defaultParallaxValue

  const y = useTransform(scrollY, (value) => (prefersReducedMotion ? 0 : yValue))

  const scale = useTransform(scrollY, () => {
    if (prefersReducedMotion) return 1
    return isActive ? 1 : Math.max(0.95, 1 - Math.abs(scaleValueCalc))
  })

  const opacity = useTransform(scrollY, () => 1) // Always fully opaque

  const rotation = useTransform(scrollY, () => {
    if (prefersReducedMotion) return 0
    return rotationValueCalc * (index % 2 === 0 ? 1 : -1) * 0.5
  })

  const panelY = useTransform(y, (value) => (prefersReducedMotion ? 0 : value * -0.5))

  // Define border class based on product state
  const { borderClass, backgroundClass } = useMemo(() => {
    let borderClass = "border-none"
    let backgroundClass = ""

    if (isLocked) {
      borderClass = "border-2 border-red-200 dark:border-red-900"
      backgroundClass = "bg-red-50/50 dark:bg-red-950/30 opacity-90"
    } else if (isSoldOut) {
      borderClass = "border-2 border-yellow-300 dark:border-yellow-600"
      backgroundClass = "bg-yellow-50/50 dark:bg-yellow-950/30 opacity-90"
    }

    return { borderClass, backgroundClass }
  }, [isLocked, isSoldOut])

  // Combine refs for both card and lazy loading
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      cardRef.current = node
      // @ts-ignore - We know this is a valid ref setter
      if (typeof lazyLoadRef === "function") {
        lazyLoadRef(node)
      } else if (lazyLoadRef && "current" in lazyLoadRef) {
        lazyLoadRef.current = node
      }
    },
    [lazyLoadRef],
  )

  return (
    <ErrorBoundary>
      <section
        className={`flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.07)] transition-all duration-300 ${backgroundClass} relative`}
        aria-labelledby={`product-title-${product.id}`}
      >
        {/* Accessibility announcement */}
        <div aria-live="polite" className="sr-only">
          {ariaLiveText}
        </div>

        {/* Enhanced outer glow for the entire product section when available */}
        {isAvailable && isActive && !prefersReducedMotion && (
          <motion.div
            key={`glow-${product.id}`}
            className="absolute -inset-2 rounded-xl pointer-events-none z-0"
            initial="initial"
            animate={currentTheme}
            variants={highlightVariants}
            aria-hidden="true"
          />
        )}

        {panelPosition === "left" && (
          <motion.div
            key={`panel-left-${product.id}`}
            className="w-full md:w-1/3 order-2 md:order-1 relative z-10"
            style={{
              y: panelY,
              opacity,
            }}
          >
            <ProductPanel product={product} isActive={isActive} isLocked={isLocked} isSoldOut={isSoldOut} />
          </motion.div>
        )}

        <motion.div
          ref={setRefs}
          id={`product-${product.id}`}
          data-product-card
          className={`w-full md:w-2/3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden order-1 md:order-2 ${borderClass} relative z-10`}
          style={{
            y,
            scale,
            rotate: rotation,
            opacity,
          }}
          transition={{ type: "spring", stiffness: 300 }}
          tabIndex={isLocked || isSoldOut ? -1 : 0}
          role="region"
          aria-roledescription={
            isLocked ? "producto bloqueado" : isSoldOut ? "producto agotado" : "galería de producto"
          }
        >
          {/* Animated highlight effect for available products */}
          {isAvailable && isActive && !prefersReducedMotion && isInViewport && (
            <motion.div
              key={`highlight-${product.id}`}
              className="absolute -inset-[1px] rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                boxShadow: ["0 0 0 0 rgba(0, 0, 0, 0)", "0 0 0 2px rgba(0, 0, 0, 0.2)", "0 0 0 0 rgba(0, 0, 0, 0)"],
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
              }}
              aria-hidden="true"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              }}
            />
          )}

          <div className="relative aspect-square md:aspect-[4/3] w-full">
            <div className="relative w-full h-full bg-white dark:bg-gray-800 overflow-hidden">
              {isAvailable && isActive && !prefersReducedMotion && isInViewport && (
                <motion.div
                  key={`animation-container-${product.id}`}
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  aria-hidden="true"
                >
                  <motion.div
                    key={`animation-dot-1-${product.id}`}
                    className="absolute top-0 left-0 w-[2px] h-[2px] bg-white shadow-[0_0_5px_2px_rgba(255,255,255,0.7)]"
                    initial={{ x: 0, y: 0 }}
                    animate={{
                      x: ["0%", "100%", "100%", "0%", "0%"],
                      y: ["0%", "0%", "100%", "100%", "0%"],
                    }}
                    transition={{
                      duration: 4,
                      ease: "linear",
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                    style={{
                      filter: "blur(1px)",
                      willChange: "transform",
                    }}
                  />
                  <motion.div
                    key={`animation-dot-2-${product.id}`}
                    className="absolute top-0 left-0 w-[2px] h-[2px] bg-white shadow-[0_0_5px_2px_rgba(255,255,255,0.7)]"
                    initial={{ x: "50%", y: "50%" }}
                    animate={{
                      x: ["50%", "100%", "100%", "0%", "0%", "50%"],
                      y: ["50%", "0%", "100%", "100%", "0%", "50%"],
                    }}
                    transition={{
                      duration: 4,
                      ease: "linear",
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: 2,
                    }}
                    style={{
                      filter: "blur(1px)",
                      willChange: "transform",
                    }}
                  />
                </motion.div>
              )}

              {isLocked ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-red-50 dark:bg-red-950/40">
                  <motion.div
                    key={`lock-animation-${product.id}`}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: [1, 1.1, 1],
                      filter: [
                        "drop-shadow(0 0 0 rgba(239, 68, 68, 0))",
                        "drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))",
                        "drop-shadow(0 0 0 rgba(239, 68, 68, 0))",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  >
                    <Lock className="w-20 h-20 text-red-300 dark:text-red-700" />
                  </motion.div>
                </div>
              ) : isSoldOut ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  {/* Show the product image with overlay */}
                  {product.images.length > 0 && (
                    <div className="absolute inset-0">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={`${product.name} - Agotado`}
                        className="object-contain p-4 opacity-50"
                        fill
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-yellow-100 dark:bg-yellow-900 flex flex-col items-center justify-center">
                    <motion.div
                      key={`soldout-animation-${product.id}`}
                      initial={{ scale: 1 }}
                      animate={{
                        scale: [1, 1.1, 1],
                        filter: [
                          "drop-shadow(0 0 0 rgba(251, 191, 36, 0))",
                          "drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))",
                          "drop-shadow(0 0 0 rgba(251, 191, 36, 0))",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                      }}
                    >
                      <Lock className="w-20 h-20 text-amber-500 dark:text-amber-300" />
                    </motion.div>
                  </div>
                </div>
              ) : (
                <>
                  {product.images.map((image, imageIndex) => (
                    <motion.div
                      key={`${product.id}-image-${imageIndex}`}
                      className="absolute inset-0 flex items-center justify-center p-6"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: currentImageIndex === imageIndex ? 1 : 0,
                        scale: currentImageIndex === imageIndex ? 1 : 0.9,
                      }}
                      transition={{
                        duration: prefersReducedMotion ? 0.1 : 0.5,
                      }}
                      style={{
                        pointerEvents: "none",
                        willChange: "opacity, transform",
                      }}
                    >
                      <div className={`relative w-full h-full ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}>
                        <ProgressiveImage
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} - Imagen ${imageIndex + 1}`}
                          className={`object-contain p-4 transition-transform duration-300 ${
                            isZoomed && currentImageIndex === imageIndex ? "scale-150" : "scale-100"
                          }`}
                          priority={imageIndex === 0 && isActive}
                          onLoad={() => handleImageLoad(imageIndex)}
                        />
                      </div>
                    </motion.div>
                  ))}

                  {/* Zoom button */}
                  <button
                    onClick={toggleZoom}
                    className="absolute top-4 right-4 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md z-20 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    aria-label={isZoomed ? "Alejar imagen" : "Ampliar imagen"}
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {!isLocked && !isSoldOut && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 p-2 md:p-3 rounded-full shadow-md z-10 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  aria-label={`Imagen anterior de ${product.name}`}
                  style={{ touchAction: "manipulation" }}
                >
                  <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 p-2 md:p-3 rounded-full shadow-md z-10 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  aria-label={`Siguiente imagen de ${product.name}`}
                  style={{ touchAction: "manipulation" }}
                >
                  <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.images.map((_, dotIndex) => (
                    <button
                      key={`${product.id}-dot-${dotIndex}`}
                      onClick={() => {
                        setCurrentImageIndex(dotIndex)
                        announceImageChange(dotIndex)
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImageIndex === dotIndex ? "bg-black dark:bg-white w-4" : "bg-black/40 dark:bg-white/40"
                      }`}
                      aria-label={`Ir a imagen ${dotIndex + 1} de ${product.images.length} de ${product.name}`}
                      aria-current={currentImageIndex === dotIndex ? "true" : undefined}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Animated corner accents for available products */}
          {isAvailable && isActive && !prefersReducedMotion && isInViewport && (
            <AnimatePresence>
              {/* Top left corner */}
              <motion.div
                key={`corner-tl-${product.id}`}
                className="absolute top-0 left-0 w-12 h-12 pointer-events-none"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ willChange: "opacity" }}
              >
                <motion.div
                  key={`corner-tl-v-${product.id}`}
                  className="absolute top-0 left-0 w-[3px] h-0 bg-black dark:bg-white"
                  animate={{ height: ["0%", "100%", "100%", "0%"] }}
                  transition={{
                    duration: 2,
                    times: [0, 0.4, 0.6, 1],
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                  }}
                  style={{ willChange: "height" }}
                />
                <motion.div
                  key={`corner-tl-h-${product.id}`}
                  className="absolute top-0 left-0 h-[3px] w-0 bg-black dark:bg-white"
                  animate={{ width: ["0%", "100%", "100%", "0%"] }}
                  transition={{
                    duration: 2,
                    times: [0, 0.4, 0.6, 1],
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                  }}
                  style={{ willChange: "width" }}
                />
              </motion.div>

              {/* Bottom right corner */}
              <motion.div
                key={`corner-br-${product.id}`}
                className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ willChange: "opacity" }}
              >
                <motion.div
                  key={`corner-br-v-${product.id}`}
                  className="absolute bottom-0 right-0 w-[3px] h-0 bg-black dark:bg-white"
                  animate={{ height: ["0%", "100%", "100%", "0%"] }}
                  transition={{
                    duration: 2,
                    times: [0, 0.4, 0.6, 1],
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                    delay: 1,
                  }}
                  style={{ willChange: "height" }}
                />
                <motion.div
                  key={`corner-br-h-${product.id}`}
                  className="absolute bottom-0 right-0 h-[3px] w-0 bg-black dark:bg-white"
                  animate={{ width: ["0%", "100%", "100%", "0%"] }}
                  transition={{
                    duration: 2,
                    times: [0, 0.4, 0.6, 1],
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                    delay: 1,
                  }}
                  style={{ willChange: "width" }}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {panelPosition === "right" && (
          <motion.div
            key={`panel-right-${product.id}`}
            className="w-full md:w-1/3 order-2 relative z-10"
            style={{
              y: panelY,
              opacity,
            }}
          >
            <ProductPanel product={product} isActive={isActive} isLocked={isLocked} isSoldOut={isSoldOut} />
          </motion.div>
        )}
      </section>
    </ErrorBoundary>
  )
}

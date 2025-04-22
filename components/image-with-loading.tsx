"use client"

import { useState, memo, useCallback } from "react"
import Image from "next/image"

interface ImageWithLoadingProps {
  src: string
  alt: string
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
  onLoad?: () => void
  onError?: () => void
}

function ImageWithLoadingComponent({
  src,
  alt,
  fill = true,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className = "",
  onLoad,
  onError,
}: ImageWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
    if (onLoad) onLoad()
  }, [onLoad])

  const handleImageError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    if (onError) onError()
  }, [onError])

  const fallbackSrc = "/colorful-abstract-flow.png"

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 animate-pulse">
          <span className="sr-only">Cargando imagen</span>
          <svg
            className="w-10 h-10 text-gray-300 dark:text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      <Image
        src={hasError ? fallbackSrc : src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={priority ? "eager" : "lazy"}
        quality={80}
      />
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
const ImageWithLoading = memo(ImageWithLoadingComponent)
export default ImageWithLoading

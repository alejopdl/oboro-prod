"use client"

import { useState, memo } from "react"
import Image from "next/image"

interface ProgressiveImageProps {
  src: string
  alt: string
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
  onLoad?: () => void
  onError?: () => void
  lowQualitySrc?: string
  blurDataURL?: string
}

function ProgressiveImageComponent({
  src,
  alt,
  fill = true,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className = "",
  onLoad,
  onError,
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Fallback image in case of error
  const fallbackSrc = "/colorful-abstract-flow.png"

  const handleImageLoad = () => {
    setIsLoading(false)
    if (onLoad) onLoad()
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
    if (onError) onError()
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 animate-pulse"
          aria-hidden="true"
        >
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      )}
      <Image
        src={hasError ? fallbackSrc : src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300 object-contain`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
const ProgressiveImage = memo(ProgressiveImageComponent)
export default ProgressiveImage

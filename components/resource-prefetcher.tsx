"use client"

import { useEffect } from "react"
import { preloadImages } from "@/services/image-service"
import type { Product } from "@/types/product"

interface ResourcePrefetcherProps {
  products: Product[]
}

export default function ResourcePrefetcher({ products }: ResourcePrefetcherProps) {
  // Preload critical resources on component mount
  useEffect(() => {
    if (typeof window === "undefined") return

    // Preload first product images immediately
    if (products.length > 0) {
      const firstProductImages = products[0].images
      preloadImages(firstProductImages)
    }

    // Use requestIdleCallback to preload other resources when browser is idle
    const preloadRemainingImages = () => {
      // Skip the first product as we've already preloaded it
      const remainingImages = products
        .slice(1, 3) // Only preload the next 2 products to avoid excessive network usage
        .flatMap((product) => product.images)

      if (remainingImages.length > 0) {
        preloadImages(remainingImages)
      }
    }

    // Use requestIdleCallback if available, otherwise use setTimeout
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(preloadRemainingImages, { timeout: 2000 })
    } else {
      setTimeout(preloadRemainingImages, 1000)
    }
  }, [products])

  // This component doesn't render anything
  return null
}

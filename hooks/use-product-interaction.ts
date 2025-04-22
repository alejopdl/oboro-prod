"use client"

import type React from "react"

import { useState, useCallback } from "react"
import type { Product } from "@/types/product"

interface UseProductInteractionProps {
  product: Product
  isLocked: boolean
  isSoldOut: boolean
}

interface UseProductInteractionReturn {
  currentImageIndex: number
  isZoomed: boolean
  imageLoaded: boolean
  ariaLiveText: string
  nextImage: () => void
  prevImage: () => void
  toggleZoom: () => void
  handleImageLoad: (index: number) => void
  setupKeyboardNavigation: (ref: React.RefObject<HTMLElement>) => () => void
  setCurrentImageIndex: (index: number) => void
  announceImageChange: (index: number) => void
}

export function useProductInteraction({
  product,
  isLocked,
  isSoldOut,
}: UseProductInteractionProps): UseProductInteractionReturn {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [ariaLiveText, setAriaLiveText] = useState("")

  // Función para anunciar cambios de imagen para lectores de pantalla
  const announceImageChange = useCallback(
    (index: number) => {
      const totalImages = product.images.length
      const announcement = `Imagen ${index + 1} de ${totalImages} para ${product.name}. Use las flechas izquierda y derecha para navegar.`
      setAriaLiveText(announcement)
    },
    [product.images.length, product.name],
  )

  const nextImage = useCallback(() => {
    if (isLocked || isSoldOut) return // Prevent navigation when locked or sold out

    const newIndex = currentImageIndex === product.images.length - 1 ? 0 : currentImageIndex + 1
    setCurrentImageIndex(newIndex)
    announceImageChange(newIndex)
  }, [currentImageIndex, product.images.length, isLocked, isSoldOut, announceImageChange])

  const prevImage = useCallback(() => {
    if (isLocked || isSoldOut) return // Prevent navigation when locked or sold out

    const newIndex = currentImageIndex === 0 ? product.images.length - 1 : currentImageIndex - 1
    setCurrentImageIndex(newIndex)
    announceImageChange(newIndex)
  }, [currentImageIndex, product.images.length, isLocked, isSoldOut, announceImageChange])

  const toggleZoom = useCallback(() => {
    if (isLocked || isSoldOut) return
    setIsZoomed((prev) => !prev)
  }, [isLocked, isSoldOut])

  const handleImageLoad = useCallback(
    (index: number) => {
      if (index === currentImageIndex) {
        setImageLoaded(true)
      }
    },
    [currentImageIndex],
  )

  const setupKeyboardNavigation = useCallback(
    (ref: React.RefObject<HTMLElement>) => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (isLocked || isSoldOut) return // Prevent keyboard navigation when locked or sold out

        if (document.activeElement === ref.current || ref.current?.contains(document.activeElement)) {
          if (e.key === "ArrowRight") {
            nextImage()
          } else if (e.key === "ArrowLeft") {
            prevImage()
          } else if (e.key === "Escape" && isZoomed) {
            setIsZoomed(false)
          }
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
    },
    [isLocked, isSoldOut, nextImage, prevImage, isZoomed],
  )

  return {
    currentImageIndex,
    isZoomed,
    imageLoaded,
    ariaLiveText,
    nextImage,
    prevImage,
    toggleZoom,
    handleImageLoad,
    setupKeyboardNavigation,
    setCurrentImageIndex,
    announceImageChange,
  }
}

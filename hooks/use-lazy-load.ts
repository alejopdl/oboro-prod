"use client"

import { useState, useEffect, useRef } from "react"

interface UseLazyLoadOptions {
  rootMargin?: string
  threshold?: number
  triggerOnce?: boolean
}

export function useLazyLoad({
  rootMargin = "200px 0px",
  threshold = 0.1,
  triggerOnce = true,
}: UseLazyLoadOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      // Si no hay soporte para IntersectionObserver, mostrar siempre
      setIsVisible(true)
      return
    }

    if (triggerOnce && hasTriggered) return

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries && entries[0]) {
          if (entries[0].isIntersecting) {
            setIsVisible(true)
            if (triggerOnce) {
              setHasTriggered(true)
              observer.disconnect()
            }
          } else if (!triggerOnce) {
            setIsVisible(false)
          }
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [rootMargin, threshold, triggerOnce, hasTriggered])

  return { ref, isVisible }
}

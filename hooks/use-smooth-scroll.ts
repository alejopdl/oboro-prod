"use client"

import { useEffect, useState, useRef } from "react"

interface SmoothScrollOptions {
  ease?: number
  enableSnapping?: boolean
  snapThreshold?: number
}

// Quadratic easing for mouse
const easeOutQuad = (t: number): number => t * (2 - t)

// Cubic easing for touch
const easeOutCubic = (t: number): number => 1 + --t * t * t

export function useSmoothScroll({ ease = 0.1, enableSnapping = true, snapThreshold = 0.1 }: SmoothScrollOptions = {}) {
  const [scrollY, setScrollY] = useState(0)
  const [targetScrollY, setTargetScrollY] = useState(0)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [snapPoints, setSnapPoints] = useState<number[]>([])
  const [isSnapping, setIsSnapping] = useState(false)

  // Use refs for values that don't need to trigger re-renders
  const lastScrollY = useRef(0)
  const rafId = useRef<number | null>(null)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const isTouchDevice = useRef(false)

  // Store the easing function in a ref to avoid issues with stale closures
  const easingFunctionRef = useRef(easeOutQuad)

  // Initialize touch detection and easing function
  useEffect(() => {
    isTouchDevice.current = "ontouchstart" in window || navigator.maxTouchPoints > 0
    easingFunctionRef.current = isTouchDevice.current ? easeOutCubic : easeOutQuad
  }, [])

  // Initialize scroll position
  useEffect(() => {
    setTargetScrollY(window.scrollY)
    setScrollY(window.scrollY)
    lastScrollY.current = window.scrollY

    const handleResize = () => {
      // Recalculate snap points when window is resized
      calculateSnapPoints()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Calculate snap points based on product elements
  const calculateSnapPoints = () => {
    const productElements = document.querySelectorAll("[data-product-card]")
    const points = Array.from(productElements).map((el) => {
      const rect = el.getBoundingClientRect()
      return rect.top + window.scrollY - window.innerHeight / 2 + rect.height / 2
    })
    setSnapPoints(points)
  }

  // Set up scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setTargetScrollY(window.scrollY)

      // Calculate velocity
      const velocity = window.scrollY - lastScrollY.current
      setScrollVelocity(velocity)
      lastScrollY.current = window.scrollY

      // Calculate progress (0 to 1) based on document height
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0
      setScrollProgress(progress)

      // Reset snapping state when user scrolls
      setIsSnapping(false)

      // Clear previous timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      // Set timeout to detect when scrolling stops
      if (enableSnapping) {
        scrollTimeout.current = setTimeout(() => {
          // Find closest snap point
          if (snapPoints.length > 0 && Math.abs(velocity) < snapThreshold) {
            const closest = snapPoints.reduce((prev, curr) => {
              return Math.abs(curr - window.scrollY) < Math.abs(prev - window.scrollY) ? curr : prev
            })

            // Only snap if we're not too far from the snap point
            if (Math.abs(closest - window.scrollY) < window.innerHeight * 0.3) {
              setIsSnapping(true)
              window.scrollTo({
                top: closest,
                behavior: "smooth",
              })
            }
          }
        }, 150)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [enableSnapping, snapPoints, snapThreshold])

  // Smooth scroll animation
  useEffect(() => {
    // Skip animation if snapping is in progress
    if (isSnapping) return

    const animate = () => {
      const diff = targetScrollY - scrollY

      // Apply appropriate easing based on input type
      let delta
      if (Math.abs(diff) < 0.1) {
        delta = diff
      } else {
        // Use the easing function from the ref
        const t = ease
        const easedT = easingFunctionRef.current(t)
        delta = diff * easedT
      }

      if (Math.abs(diff) < 0.1) {
        setScrollY(targetScrollY)
      } else {
        setScrollY(scrollY + delta)
      }

      rafId.current = requestAnimationFrame(animate)
    }

    rafId.current = requestAnimationFrame(animate)

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [targetScrollY, scrollY, ease, isSnapping])

  // Initialize snap points when component mounts
  useEffect(() => {
    // Wait for DOM to be ready
    setTimeout(() => {
      calculateSnapPoints()
    }, 500)
  }, [])

  return {
    scrollY,
    scrollVelocity,
    scrollProgress,
    snapPoints,
    calculateSnapPoints,
  }
}

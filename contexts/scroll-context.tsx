"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useMotionValue, useSpring, type MotionValue } from "framer-motion"

interface ScrollContextType {
  scrollY: MotionValue<number>
  smoothScrollY: MotionValue<number>
  scrollProgress: number
  isScrolled: boolean
}

const ScrollContext = createContext<ScrollContextType | null>(null)

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollY = useMotionValue(0)
  const smoothScrollY = useSpring(scrollY, { damping: 20, stiffness: 100 })
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const updateScroll = () => {
      scrollY.set(window.scrollY)

      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? window.scrollY / docHeight : 0)
      setIsScrolled(window.scrollY > 100)
    }

    // Set initial values
    updateScroll()

    window.addEventListener("scroll", updateScroll, { passive: true })
    return () => window.removeEventListener("scroll", updateScroll)
  }, [scrollY])

  return (
    <ScrollContext.Provider value={{ scrollY, smoothScrollY, scrollProgress, isScrolled }}>
      {children}
    </ScrollContext.Provider>
  )
}

export const useScroll = () => {
  const context = useContext(ScrollContext)
  if (!context) throw new Error("useScroll must be used within a ScrollProvider")
  return context
}

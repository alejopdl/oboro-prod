"use client"

import { useLazyLoad } from "@/hooks/use-lazy-load"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { motion } from "framer-motion"
import { forwardRef, type ReactNode } from "react"

interface LazySectionProps {
  children: ReactNode
  className?: string
  rootMargin?: string
  threshold?: number
  initialAnimation?: boolean
  id?: string
}

const LazySection = forwardRef<HTMLDivElement, LazySectionProps>(
  ({ children, className = "", rootMargin = "200px", threshold = 0.1, initialAnimation = true, id }, ref) => {
    const { ref: lazyRef, isVisible } = useLazyLoad({ rootMargin, threshold })
    const prefersReducedMotion = useReducedMotion()

    // Combine refs
    const setRefs = (node: HTMLDivElement | null) => {
      // Forward the ref
      if (ref) {
        if (typeof ref === "function") {
          ref(node)
        } else {
          ref.current = node
        }
      }

      // Set the lazy load ref
      if (lazyRef) {
        if (typeof lazyRef === "function") {
          lazyRef(node)
        } else {
          lazyRef.current = node
        }
      }
    }

    return (
      <motion.div
        ref={setRefs}
        id={id}
        className={className}
        initial={initialAnimation && !prefersReducedMotion ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={
          isVisible || prefersReducedMotion
            ? { opacity: 1, y: 0 }
            : initialAnimation
              ? { opacity: 0, y: 20 }
              : { opacity: 1, y: 0 }
        }
        transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    )
  },
)

LazySection.displayName = "LazySection"
export default LazySection

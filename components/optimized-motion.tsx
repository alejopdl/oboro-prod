"use client"

import { motion, type MotionProps, type Variant, type Variants } from "framer-motion"
import { useOptimizedAnimation } from "@/hooks/use-optimized-animation"
import { forwardRef, type ElementType, type ReactNode } from "react"

interface OptimizedMotionProps extends Omit<MotionProps, "transition"> {
  as?: ElementType
  children: ReactNode
  shouldAnimate?: boolean
  transitionOverrides?: Record<string, any>
  className?: string
}

export const OptimizedMotion = forwardRef<HTMLElement, OptimizedMotionProps>(
  ({ as = "div", children, shouldAnimate = true, transitionOverrides, ...props }, ref) => {
    const Component = motion[as as keyof typeof motion] || motion.div

    const { isAnimationEnabled, getTransition } = useOptimizedAnimation({
      shouldAnimate,
      defaultConfig: {
        duration: 0.5,
        ease: "easeInOut",
      },
      reducedMotionConfig: {
        duration: 0.1,
      },
    })

    // If animations are disabled, simplify variants
    const simplifyVariants = (variants: Variants | undefined): Variants | undefined => {
      if (!variants || isAnimationEnabled) return variants

      const simplified: Variants = {}
      for (const key in variants) {
        const variant = variants[key] as Variant
        // Keep only opacity and display properties for accessibility
        simplified[key] = {
          opacity: variant.opacity,
          display: variant.display,
          visibility: variant.visibility,
        }
      }
      return simplified
    }

    return (
      <Component
        ref={ref}
        {...props}
        variants={simplifyVariants(props.variants)}
        transition={getTransition(transitionOverrides)}
        style={{
          ...props.style,
          // Force hardware acceleration for animations
          willChange: isAnimationEnabled ? props.style?.willChange || "transform, opacity" : "auto",
        }}
      >
        {children}
      </Component>
    )
  },
)

OptimizedMotion.displayName = "OptimizedMotion"

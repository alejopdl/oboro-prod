"use client"

import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCallback, useMemo } from "react"

interface AnimationConfig {
  duration: number
  delay?: number
  ease?: string
  repeat?: number
  repeatType?: "loop" | "reverse" | "mirror"
}

interface UseOptimizedAnimationOptions {
  shouldAnimate?: boolean
  reducedMotionConfig?: Partial<AnimationConfig>
  defaultConfig: AnimationConfig
}

export function useOptimizedAnimation({
  shouldAnimate = true,
  reducedMotionConfig,
  defaultConfig,
}: UseOptimizedAnimationOptions) {
  const prefersReducedMotion = useReducedMotion()

  // Determine if animations should be enabled
  const isAnimationEnabled = useMemo(() => {
    return shouldAnimate && !prefersReducedMotion
  }, [shouldAnimate, prefersReducedMotion])

  // Get the appropriate animation configuration
  const animationConfig = useMemo(() => {
    if (!isAnimationEnabled) {
      // If animations are disabled, use minimal configuration
      return {
        duration: 0.1,
        delay: 0,
        ease: "linear",
      }
    }

    if (prefersReducedMotion && reducedMotionConfig) {
      // If user prefers reduced motion and we have a specific config for it
      return {
        ...defaultConfig,
        ...reducedMotionConfig,
      }
    }

    // Otherwise use the default config
    return defaultConfig
  }, [isAnimationEnabled, prefersReducedMotion, defaultConfig, reducedMotionConfig])

  // Helper function to get transition properties
  const getTransition = useCallback(
    (overrides?: Partial<AnimationConfig>) => {
      return {
        ...animationConfig,
        ...overrides,
      }
    },
    [animationConfig],
  )

  return {
    isAnimationEnabled,
    animationConfig,
    getTransition,
  }
}

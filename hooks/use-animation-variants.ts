"use client"

import { useMemo } from "react"
import { useTheme } from "next-themes"

type AnimationVariantType = "initial" | "animate" | "dark"

interface GlowVariants {
  initial: {
    boxShadow: string
  }
  animate: {
    boxShadow: string[]
    transition: {
      duration: number
      repeat: number
      repeatType: "reverse" | "loop" | "mirror"
      ease: string
    }
  }
  dark: {
    boxShadow: string[]
    transition: {
      duration: number
      repeat: number
      repeatType: "reverse" | "loop" | "mirror"
      ease: string
    }
  }
}

interface BorderVariants {
  initial: {
    boxShadow: string
  }
  animate: {
    boxShadow: string[]
    transition: {
      duration: number
      repeat: number
      repeatType: "reverse" | "loop" | "mirror"
      ease: string
    }
  }
  dark: {
    boxShadow: string[]
    transition: {
      duration: number
      repeat: number
      repeatType: "reverse" | "loop" | "mirror"
      ease: string
    }
  }
}

export function useAnimationVariants() {
  const { theme, resolvedTheme } = useTheme()

  // Determine which animation variant to use based on theme
  const currentTheme = useMemo(() => {
    if (typeof window === "undefined") return "animate"
    return theme === "dark" || resolvedTheme === "dark" ? "dark" : "animate"
  }, [theme, resolvedTheme])

  // Highlight glow effect variants
  const highlightVariants = useMemo<GlowVariants>(
    () => ({
      initial: {
        boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
      },
      animate: {
        boxShadow: [
          "0 0 0 rgba(0, 0, 0, 0)",
          "0 0 20px 5px rgba(0, 0, 0, 0.2)",
          "0 0 30px 5px rgba(0, 0, 0, 0.1)",
          "0 0 0 rgba(0, 0, 0, 0)",
        ],
        transition: {
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      },
      dark: {
        boxShadow: [
          "0 0 0 rgba(255, 255, 255, 0)",
          "0 0 20px 5px rgba(255, 255, 255, 0.2)",
          "0 0 30px 5px rgba(255, 255, 255, 0.1)",
          "0 0 0 rgba(255, 255, 255, 0)",
        ],
        transition: {
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      },
    }),
    [],
  )

  // Border animation variants
  const borderVariants = useMemo<BorderVariants>(
    () => ({
      initial: {
        boxShadow: "inset 0 0 0 0 rgba(0, 0, 0, 0)",
      },
      animate: {
        boxShadow: [
          "inset 0 0 0 0 rgba(0, 0, 0, 0)",
          "inset 0 0 0 2px rgba(0, 0, 0, 0.2)",
          "inset 0 0 0 0 rgba(0, 0, 0, 0)",
        ],
        transition: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      },
      dark: {
        boxShadow: [
          "inset 0 0 0 0 rgba(255, 255, 255, 0)",
          "inset 0 0 0 2px rgba(255, 255, 255, 0.2)",
          "inset 0 0 0 0 rgba(255, 255, 255, 0)",
        ],
        transition: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      },
    }),
    [],
  )

  return {
    currentTheme: currentTheme as AnimationVariantType,
    highlightVariants,
    borderVariants,
  }
}

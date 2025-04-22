"use client"

import { useEffect, useState } from "react"
import { HelpCircle, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, useScroll } from "framer-motion"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const { theme, setTheme } = useTheme()
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(true)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Hide buttons when scrolling down
  useEffect(() => {
    const updateVisibility = () => {
      // Hide buttons after scrolling down 100px
      setVisible(scrollY.get() < 100)
    }

    const unsubscribe = scrollY.onChange(updateVisibility)
    return () => unsubscribe()
  }, [scrollY])

  if (!mounted) {
    return null
  }

  const toggleHelp = () => {
    const newState = !showHelp
    setShowHelp(newState)

    // Use a custom event to communicate with other components
    if (typeof window !== "undefined") {
      const event = new CustomEvent("toggleHelp", { detail: { visible: newState } })
      window.dispatchEvent(event)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{
          opacity: visible ? 1 : 0,
          x: visible ? 0 : -20,
          pointerEvents: visible ? "auto" : "none",
        }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="absolute left-4 top-1/2 -translate-y-1/2"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
          className="rounded-full w-10 h-10 border-2"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{
          opacity: visible ? 1 : 0,
          x: visible ? 0 : 20,
          pointerEvents: visible ? "auto" : "none",
        }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="absolute right-4 top-1/2 -translate-y-1/2"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={toggleHelp}
          aria-label="Mostrar información de la marca"
          className="rounded-full w-10 h-10 border-2"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </motion.div>
    </>
  )
}

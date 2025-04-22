"use client"

import { motion, AnimatePresence, useTransform } from "framer-motion"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { HelpCircle, Moon, Sun } from "lucide-react"
import { useScroll } from "@/contexts/scroll-context"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export default function Header() {
  const [showHelp, setShowHelp] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const { scrollY, isScrolled } = useScroll()
  const { theme, setTheme } = useTheme()
  const prefersReducedMotion = useReducedMotion()

  // Listen for help toggle events
  useEffect(() => {
    const handleHelpToggle = (event: CustomEvent) => {
      setShowHelp(event.detail.visible)
    }

    window.addEventListener("toggleHelp", handleHelpToggle as EventListener)

    // Set window width after component mounts
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth)

      // Update window width on resize
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }

      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("toggleHelp", handleHelpToggle as EventListener)
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  const toggleHelp = () => {
    const newState = !showHelp
    setShowHelp(newState)

    // Use a custom event to communicate with other components
    if (typeof window !== "undefined") {
      const event = new CustomEvent("toggleHelp", { detail: { visible: newState } })
      window.dispatchEvent(event)
    }
  }

  // Calculate the target positions based on window width
  const leftTargetX = windowWidth ? windowWidth / 2 - 180 : 0
  const rightTargetX = windowWidth ? -(windowWidth / 2 - 180) : 0

  return (
    <>
      <motion.header
        className="w-full flex items-center justify-between border-b border-gray-100/30 dark:border-gray-800/30 fixed top-0 left-0 z-50 blur-container"
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
        animate={{
          opacity: 1,
          y: 0,
          paddingTop: isScrolled ? "0.25rem" : "0.75rem",
          paddingBottom: isScrolled ? "0.25rem" : "0.75rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
      >
        <motion.div
          key="header-left-button"
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.3, duration: prefersReducedMotion ? 0 : 0.5 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            className="rounded-full w-8 h-8 border-2"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </motion.div>

        <motion.h1
          key="header-title"
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mx-4"
          style={{
            scale: useTransform(scrollY, [0, 300], [1, 1.1]),
          }}
        >
          oBoRo
        </motion.h1>

        <motion.div
          key="header-right-button"
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.3, duration: prefersReducedMotion ? 0 : 0.5 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={toggleHelp}
            aria-label="Mostrar información de la marca"
            className="rounded-full w-8 h-8 border-2"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.header>

      {/* Spacer to prevent content from being hidden behind fixed header */}
      <div className="h-[80px]"></div>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            key="help-panel"
            initial={{ height: 0, overflow: "hidden" }}
            animate={{ height: "auto", overflow: "hidden" }}
            exit={{ height: 0, overflow: "hidden" }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.5, ease: "easeInOut" }}
            className="w-full blur-container border-b border-border dark:border-gray-700 py-6 mt-12"
          >
            <div className="max-w-4xl mx-auto px-4">
              <h3 className="text-xl font-semibold mb-3">Acerca de oBoRo</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                oBoRo es una colección curada de productos artesanales. Nuestra marca se enfoca en materiales
                sustentables, producción ética y diseño atemporal. Cada pieza es cuidadosamente seleccionada para traer
                belleza y funcionalidad a tu vida cotidiana. Trabajamos directamente con artesanos calificados para
                asegurar la más alta calidad y preservar técnicas tradicionales de artesanía.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

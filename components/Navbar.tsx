"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { config } from "@/data/config"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, Search, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

/**
 * Navigation bar component for the site header.
 * 
 * @remarks
 * Features responsive design, search functionality, and theme toggling.
 * Includes animation for mobile menu using Framer Motion.
 * 
 * @returns JSX Element - The navigation bar component
 */
export const Navbar = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  // Handle theme change - wait for component to mount to access browser APIs
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /**
   * Handles the search form submission.
   * 
   * @param e - Form submit event
   */
  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/productos?query=${encodeURIComponent(searchQuery)}`)
      setIsMenuOpen(false)
    }
  }

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
  }`

  return (
    <nav className={navbarClasses} aria-label="Navegación principal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{config.siteName}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {config.navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors ${
                  router.pathname === link.path
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <form onSubmit={handleSearch} className="relative">
              <label htmlFor="desktop-search" className="sr-only">Buscar productos</label>
              <input
                id="desktop-search"
                type="text"
                placeholder="Buscar productos..."
                className="w-64 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={theme === "dark" ? "Cambiar al modo claro" : "Cambiar al modo oscuro"}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={theme === "dark" ? "Cambiar al modo claro" : "Cambiar al modo oscuro"}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {config.navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    router.pathname === link.path
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSearch} className="px-4 flex">
                <label htmlFor="mobile-search" className="sr-only">Buscar productos</label>
                <input
                  id="mobile-search"
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="ml-2 p-2 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-200"
                  aria-label="Buscar"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar

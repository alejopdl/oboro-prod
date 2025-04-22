"use client"

import { useState, useEffect } from "react"

export default function SkipLink() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white dark:focus:bg-gray-800 focus:text-black dark:focus:text-white focus:shadow-md focus:rounded-md focus:outline-none"
    >
      Saltar al contenido principal
    </a>
  )
}

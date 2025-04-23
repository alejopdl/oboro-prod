/**
 * Purpose: Component wrapper that only renders its children on the client-side after hydration
 */
"use client"

import { useState, useEffect, ReactNode } from 'react'

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * A component that only renders its children on the client side after hydration
 * to prevent hydration mismatches with components that rely on browser APIs.
 *
 * @param props - Component props
 * @param props.children - Content to render after client-side hydration
 * @param props.fallback - Optional content to show during server rendering
 * @returns JSX Element - Either the children or a fallback during server rendering
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return fallback
  }

  return <>{children}</>
}

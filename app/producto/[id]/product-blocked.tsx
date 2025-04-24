"use client"

// Purpose: Component to display when a product is blocked (not yet available)

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

/**
 * Displays a message when user tries to access a blocked product
 * 
 * @param props - Component props
 * @param props.level - The level needed to unlock this product
 * @param props.dropId - The drop ID this product belongs to
 * @returns JSX Element
 */
export default function ProductBlockedPage({ 
  level, 
  dropId = 'drop_1' 
}: { 
  level: number;
  dropId?: string;
}) {
  // Add mounted state for animation (prevents hydration issues)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Red lock icon animation */}
      {mounted ? (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-red-800 rounded-full p-6 mb-6"
        >
          <Lock className="w-16 h-16 text-white" />
        </motion.div>
      ) : (
        <div className="bg-red-800 rounded-full p-6 mb-6">
          <Lock className="w-16 h-16 text-white" />
        </div>
      )}
      
      {/* Message title */}
      <h1 className="text-3xl font-bold mb-4">Producto Bloqueado</h1>
      
      {/* Explanation for the user */}
      <p className="text-lg max-w-md mb-8">
        Este producto aún no está disponible. Necesitas desbloquear el nivel {level} para acceder.
      </p>
      
      {/* Back button preserves the dropId for context */}
      <Link href={`/?dropId=${dropId}`}>
        <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
          Volver a la colección
        </Button>
      </Link>
    </div>
  )
}

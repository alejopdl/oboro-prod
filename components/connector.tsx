"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ConnectorProps {
  startRef: HTMLDivElement | null
  endRef: HTMLDivElement | null
  isActive: boolean
  id: string // Añadimos un ID único para cada conector
}

export default function Connector({ startRef, endRef, isActive, id }: ConnectorProps) {
  const [path, setPath] = useState("")

  useEffect(() => {
    const updatePath = () => {
      if (!startRef || !endRef) return

      const startRect = startRef.getBoundingClientRect()
      const endRect = endRef.getBoundingClientRect()

      const startX = startRect.left + startRect.width / 2
      const startY = startRect.bottom
      const endX = endRect.left + endRect.width / 2
      const endY = endRect.top

      const midY = startY + (endY - startY) / 2

      setPath(`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`)
    }

    updatePath()
    window.addEventListener("resize", updatePath)
    window.addEventListener("scroll", updatePath)

    return () => {
      window.removeEventListener("resize", updatePath)
      window.removeEventListener("scroll", updatePath)
    }
  }, [startRef, endRef])

  if (!path) return null

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" key={`connector-svg-${id}`}>
      <motion.path
        key={`connector-path-${id}`}
        d={path}
        fill="none"
        stroke="black"
        strokeWidth={2}
        strokeDasharray="6 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: isActive ? 1 : 0.3,
          strokeWidth: isActive ? 2 : 1,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </svg>
  )
}

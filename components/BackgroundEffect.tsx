"use client"

import { useRef, useEffect, useState } from "react"

// Define TypeScript interface for Particle class
interface ParticleProps {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  update: () => void
  draw: (ctx: CanvasRenderingContext2D) => void
}

/**
 * Background effect with animated particles and connecting lines
 * Creates a canvas with moving particles that connect when close to each other
 * 
 * @returns JSX Element with the background effect
 */
export default function BackgroundEffect(): React.ReactElement {
  // TypeScript: specify correct ref type
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState<boolean>(false)

  // Wait until client-side hydration is complete
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current || typeof window === "undefined") return

    // Create canvas element
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return // Early return if context not available
    
    containerRef.current.appendChild(canvas)

    // Set canvas size
    const resizeCanvas = (): void => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle class
    class Particle implements ParticleProps {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
        this.color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)`
      }

      update(): void {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particlesArray: Particle[] = []
    const numberOfParticles = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000))

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle())
    }

    // Animation loop
    const animate = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw(ctx)
      }

      // Connect particles with lines if they're close enough
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x
          const dy = particlesArray[a].y - particlesArray[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(150, 150, 150, ${0.2 - distance / 500})`
            ctx.lineWidth = 1
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (containerRef.current && containerRef.current.contains(canvas)) {
        containerRef.current.removeChild(canvas)
      }
    }
  }, [mounted])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-1] pointer-events-none opacity-70 dark:opacity-50"
      aria-hidden="true"
    />
  )
}

"use client"

import { useRef, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import Script from "next/script"

export default function ChladniBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sketchInstanceRef = useRef<any>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [p5Loaded, setP5Loaded] = useState(false)
  const INITIAL_SCROLL_ROTATION = 0
  const MAX_SCROLL_ROTATION = 0.1 // Adjust to the maximum rotation allowed (radians)
  const MIN_SCROLL_ROTATION = -0.1 // Adjust to the minimum (negative) rotation allowed

  const INITIAL_SCROLL_SCALE = 1
  const MAX_SCROLL_SCALE = 1.5 // Maximum scaling value (further spread)
  const MIN_SCROLL_SCALE = 0.8 // Minimum scaling value (closer to the center)

  // Wait until client-side hydration is complete
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current || !p5Loaded || typeof window === "undefined") return

    // Cleanup function to remove the sketch and listeners
    const cleanupSketch = () => {
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector("canvas")
        if (canvas) canvas.remove()
      }
      if (sketchInstanceRef.current && sketchInstanceRef.current.noLoop) {
        try {
          sketchInstanceRef.current.noLoop()
        } catch (e) {
          console.log("Could not stop animation loop")
        }
      }
      // If the sketch defined a cleanup function for the scroll, invoke it
      if (sketchInstanceRef.current && sketchInstanceRef.current.myCleanup) {
        sketchInstanceRef.current.myCleanup()
      }
      sketchInstanceRef.current = null
    }

    cleanupSketch()

    // Start the p5 sketch with the modified effect
    const startSketch = () => {
      if (typeof window.p5 !== "function") {
        console.error("p5 is not loaded yet")
        return
      }

      const sketch = (p: any) => {
        // Parameters for particles and animation (adapted to screen and device)
        let N = window.innerWidth < 768 ? 600 : 1000
        if (window.navigator.hardwareConcurrency && window.navigator.hardwareConcurrency < 4) {
          N = Math.floor(N * 0.6)
        }
        const V = 0.5
        const PV = -2
        const d = 1

        const PX: number[] = []
        const PY: number[] = []
        let T = 0
        let TT = 1
        let osc = 0

        // Global effect parameters
        const parDef = {
          play: true,
          frq: 0.1,
          nPoints: 4,
          bckgR: 0,
          bckgG: 0,
          bckgB: 0,
          opt: 15,
          red: 255,
          green: 255,
          blue: 255,
          baseDiff: 0.3, // Base distance from center (as fraction of width)
          oscAmplitude: 0.2,
          oscSpeed: 0.002,
          rotationSpeed: 0.001,
          particleSize: window.innerWidth < 768 ? 3 : 7,
          particleOpacity: 0.9,
        }

        // Adjust colors based on theme
        if (theme === "dark") {
          parDef.bckgR = 10
          parDef.bckgG = 10
          parDef.bckgB = 20
          parDef.red = 255
          parDef.green = 255
          parDef.blue = 255
        } else {
          parDef.bckgR = 255
          parDef.bckgG = 255
          parDef.bckgB = 255
          parDef.red = 0
          parDef.green = 0
          parDef.blue = 0
        }

        // VARIABLES FOR SCROLL EFFECT:
        // scrollRotation accumulates additional rotation (in radians)
        // scrollScale acts on the radius, allowing to bring closer (minimum 0.8, i.e., 20% less) or leave at 1
        let scrollRotation = 0
        let scrollScale = 5

        // Listener for wheel event
        function handleWheel(e: WheelEvent) {
          if (e.deltaY > 0) {
            // Scrolling down: increase rotation and scale up (tending toward maximum)
            scrollRotation += 0.001
            scrollScale = Math.min(MAX_SCROLL_SCALE, scrollScale + 0.01)
          } else {
            // Scrolling up: decrease rotation and scale down (tending toward minimum)
            scrollRotation -= 0.001
            scrollScale = Math.max(MIN_SCROLL_SCALE, scrollScale - 0.01)
          }

          // Reset scrollRotation if it exceeds maximum or minimum threshold
          if (scrollRotation >= MAX_SCROLL_ROTATION || scrollRotation <= MIN_SCROLL_ROTATION) {
            scrollRotation = INITIAL_SCROLL_ROTATION
          }

          // Reset scrollScale if it reaches the maximum or minimum allowed value
          if (scrollScale >= MAX_SCROLL_SCALE || scrollScale <= MIN_SCROLL_SCALE) {
            scrollScale = INITIAL_SCROLL_SCALE
          }
        }

        // Arrays for control points
        const ptsD: any[] = [] // Rotating control points (automatically updated)
        const cornerPts: any[] = [] // Static anchor points (transformed according to scroll)

        // Class for rotating control points
        class Draggable {
          baseAngle: number
          radius: number
          pos: any
          r: number

          constructor() {
            this.baseAngle = 0
            this.radius = 0
            this.pos = p.createVector(0, 0)
            this.r = 20
          }

          update() {
            this.baseAngle += parDef.rotationSpeed
            const baseRadius = p.width * parDef.baseDiff
            this.radius = baseRadius * (1 + parDef.oscAmplitude * p.sin(osc))
            // Apply scrollScale and scrollRotation when calculating the final position
            const effectiveRadius = this.radius * scrollScale
            this.pos.x = p.width / 2 + effectiveRadius * p.cos(this.baseAngle + scrollRotation)
            this.pos.y = p.height / 2 + effectiveRadius * p.sin(this.baseAngle + scrollRotation)
          }

          show() {
            p.noFill()
            p.stroke(255, 0, 0)
            p.ellipse(this.pos.x, this.pos.y, this.r * 2)
          }
        }

        // Class for anchor points (static), which are transformed according to scroll
        class StaticDraggable extends Draggable {
          origPos: any
          constructor(x: number, y: number) {
            super()
            this.origPos = p.createVector(x, y)
            this.pos = this.origPos.copy()
          }
          update() {
            // Calculate the new position from the original vector relative to the center,
            // multiply by scrollScale and rotate by scrollRotation.
            const center = p.createVector(p.width / 2, p.height / 2)
            const diff = (window as any).p5.Vector.sub(this.origPos, center)
            diff.mult(scrollScale)
            diff.rotate(scrollRotation)
            this.pos = (window as any).p5.Vector.add(center, diff)
          }
        }

        // Function to create a new rotating point
        function pushRandomCircle() {
          ptsD.push(new Draggable())
        }

        // Rearranges the rotating control points in a circle
        function resetPoints() {
          const baseRadius = p.width * parDef.baseDiff
          for (let i = 0; i < ptsD.length; i++) {
            const angle = (p.TWO_PI * i) / ptsD.length
            ptsD[i].baseAngle = angle
            ptsD[i].radius = baseRadius
            ptsD[i].pos.x = p.width / 2 + baseRadius * p.cos(angle)
            ptsD[i].pos.y = p.height / 2 + baseRadius * p.sin(angle)
          }
        }

        // Initializes the anchor points; "original" positions are defined using a margin
        function initCornerPts() {
          cornerPts.length = 0
          const margin = p.width * 0.05
          cornerPts.push(new StaticDraggable(margin, margin)) // Top left
          cornerPts.push(new StaticDraggable(p.width - margin, margin)) // Top right
          cornerPts.push(new StaticDraggable(margin, p.height - margin)) // Bottom left
          cornerPts.push(new StaticDraggable(p.width - margin, p.height - margin)) // Bottom right
          cornerPts.push(new StaticDraggable(p.width / 2, margin)) // Top center
          cornerPts.push(new StaticDraggable(p.width / 2, p.height - margin)) // Bottom center
          cornerPts.push(new StaticDraggable(margin, p.height / 2)) // Left center
          cornerPts.push(new StaticDraggable(p.width - margin, p.height / 2)) // Right center
        }

        p.setup = () => {
          const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
          canvas.style("display", "block")
          canvas.parent(containerRef.current)
          p.frameRate(60)
          T = 0
          TT = 1

          // Create and arrange the rotating control points
          for (let i = 0; i < parDef.nPoints; i++) {
            pushRandomCircle()
          }
          resetPoints()
          // Initialize anchor points
          initCornerPts()

          // Initialize particle positions randomly
          for (let i = 0; i < N; i++) {
            PX[i] = p.random(p.width)
            PY[i] = p.random(p.height)
          }
        }

        p.draw = () => {
          osc += parDef.oscSpeed
          p.background(parDef.bckgR, parDef.bckgG, parDef.bckgB, parDef.opt)
          p.noStroke()

          // Update each particle considering the influence of all points
          for (let i = 0; i < N; i++) {
            let R_val = 0
            let D_val = 0
            let C_val = 0

            for (let j = 0; j < ptsD.length; j++) {
              const sx = ptsD[j].pos.x
              const sy = ptsD[j].pos.y
              let L = p.dist(PX[i], PY[i], sx, sy)
              C_val += p.sin((p.TWO_PI * parDef.frq * (T - L / V)) / 60)
              L = p.dist(PX[i] + d, PY[i], sx, sy)
              R_val += p.sin((p.TWO_PI * parDef.frq * (T - L / V)) / 60)
              L = p.dist(PX[i], PY[i] + d, sx, sy)
              D_val += p.sin((p.TWO_PI * parDef.frq * (T - L / V)) / 60)
            }

            for (let j = 0; j < cornerPts.length; j++) {
              const sx = cornerPts[j].pos.x
              const sy = cornerPts[j].pos.y
              let L = p.dist(PX[i], PY[i], sx, sy)
              C_val += p.sin((p.TWO_PI * parDef.frq * (T - L / V)) / 60)
              L = p.dist(PX[i] + d, PY[i], sx, sy)
              R_val += p.sin((p.TWO_PI * parDef.frq * (T - L / V)) / 60)
              L = p.dist(PX[i], PY[i] + d, sx, sy)
              D_val += p.sin((p.TWO_PI * parDef.frq * (T - L / V)) / 60)
            }

            R_val = p.abs(R_val)
            D_val = p.abs(D_val)
            C_val = p.abs(C_val)

            // Configure color (applying opacity) according to theme
            if (theme === "dark") {
              p.fill(
                parDef.red * (1 - C_val),
                parDef.green * (1 - C_val),
                parDef.blue * (1 - C_val),
                255 * parDef.particleOpacity,
              )
            } else {
              p.fill(
                parDef.red * (1 - C_val * 0.7),
                parDef.green * (1 - C_val * 0.7),
                parDef.blue * (1 - C_val * 0.7),
                255 * parDef.particleOpacity,
              )
            }
            p.ellipse(PX[i], PY[i], parDef.particleSize, parDef.particleSize)

            const L_val = p.sqrt(p.sq(R_val - C_val) + p.sq(D_val - C_val))
            const VX = (PV * (R_val - C_val)) / L_val
            const VY = (PV * (D_val - C_val)) / L_val
            // Apply additional rotation from scroll to particle movement
            const rotatedVX = VX * p.cos(scrollRotation) - VY * p.sin(scrollRotation)
            const rotatedVY = VX * p.sin(scrollRotation) + VY * p.cos(scrollRotation)
            PX[i] += rotatedVX
            PY[i] += rotatedVY

            if (PX[i] < 0 || PX[i] > p.width || PY[i] < 0 || PY[i] > p.height || C_val < 0.0025) {
              PX[i] = p.random(p.width)
              PY[i] = p.random(p.height)
            }
          }

          // Update and (optionally) display the rotating points
          for (let i = 0; i < ptsD.length; i++) {
            ptsD[i].update()
            // Uncomment the following line to show control points
            // ptsD[i].show()
          }

          // Update and (optionally) display the anchor points
          for (let i = 0; i < cornerPts.length; i++) {
            cornerPts[i].update()
            // Uncomment the following line to show anchor points
            // cornerPts[i].show()
          }

          if (parDef.play) {
            T += TT
          }
        }

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight)
          resetPoints()
          initCornerPts()
          parDef.particleSize = window.innerWidth < 768 ? 3 : 4
        }
      }

      try {
        sketchInstanceRef.current = new window.p5(sketch)
      } catch (error) {
        console.error("Error initializing p5:", error)
      }
    }

    startSketch()

    return cleanupSketch
  }, [theme, mounted, p5Loaded])

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"
        onLoad={() => setP5Loaded(true)}
        strategy="afterInteractive"
      />
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-[-1] w-full h-full"
        aria-hidden="true"
        style={{ opacity: mounted ? 1 : 0 }}
      />
    </>
  )
}

declare global {
  interface Window {
    p5: any
  }
}

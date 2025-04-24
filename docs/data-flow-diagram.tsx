"use client"

import { useEffect, useRef } from "react"

export default function DataFlowDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 800
    canvas.height = 500

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw data flow diagram

    // Draw components
    drawComponent(ctx, 400, 60, "Notion Database", "#f0f9ff")
    drawComponent(ctx, 400, 140, "Next.js API Routes (test-notion)", "#f0fdf4")
    drawComponent(ctx, 400, 220, "Server Components", "#fff7ed")
    
    // Draw drop system components
    drawComponent(ctx, 250, 300, "DropSelector", "#ede9fe")
    drawComponent(ctx, 550, 300, "ProductShowcase", "#fae8ff")
    drawComponent(ctx, 250, 380, "Level Grouping", "#fef3c7")
    drawComponent(ctx, 550, 380, "Drop Filtering", "#fef3c7")
    drawComponent(ctx, 400, 460, "User Interface", "#f8fafc")

    // Draw arrows with drop system fields
    // Database to API routes
    drawArrow(ctx, 400, 90, 400, 120, "Real Notion Data")
    
    // API to Server Components
    drawArrow(ctx, 400, 170, 400, 200, "Products with Drop Fields")
    
    // Server Components to Client Components
    drawArrow(ctx, 350, 250, 250, 280, "DropID values (DROP1, MiniDROP2, etc.)")
    drawArrow(ctx, 450, 250, 550, 280, "Products with transformed fields:\nNotion DB → Code\nLevel → level\nBlock → blocked\nDropID → dropId")
    
    // Client interactions
    drawArrow(ctx, 250, 330, 250, 360, "Selected Drop")
    drawArrow(ctx, 550, 330, 550, 360, "Product Filtering")
    
    // Processing to UI
    drawArrow(ctx, 300, 400, 370, 440, "Products by Level")
    drawArrow(ctx, 500, 400, 430, 440, "Filtered by Drop")
  }, [])

  return (
    <div className="flex justify-center my-8">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-md shadow-md"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  )
}

function drawComponent(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, fillColor: string) {
  const width = 200
  const height = 60

  // Draw box
  ctx.fillStyle = fillColor
  ctx.strokeStyle = "#666666"
  ctx.lineWidth = 2

  ctx.beginPath()
  // Use a safer approach for roundRect which might not be in all browsers
  // TypeScript doesn't recognize roundRect in its canvas definitions
  const ctxAny = ctx as any;
  if (typeof ctxAny.roundRect === 'function') {
    // Use the modern Canvas API roundRect method
    ctxAny.roundRect(x - width / 2, y - height / 2, width, height, 10);
  } else {
    // Fallback to regular rectangle for browsers that don't support roundRect
    ctx.rect(x - width / 2, y - height / 2, width, height);
  }
  ctx.fill()
  ctx.stroke()

  // Draw text
  ctx.fillStyle = "#000000"
  ctx.font = "bold 14px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, x, y)
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  text: string,
) {
  const headLength = 10
  const angle = Math.atan2(toY - fromY, toX - fromX)

  // Draw line
  ctx.strokeStyle = "#666666"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(fromX, fromY)
  ctx.lineTo(toX, toY)
  ctx.stroke()

  // Draw arrowhead
  ctx.beginPath()
  ctx.moveTo(toX, toY)
  ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6))
  ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6))
  ctx.closePath()
  ctx.fillStyle = "#666666"
  ctx.fill()

  // Draw text
  ctx.fillStyle = "#000000"
  ctx.font = "12px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  // Calculate midpoint and offset text slightly
  const midX = (fromX + toX) / 2
  const midY = (fromY + toY) / 2
  const offsetX = -10 * Math.sin(angle)
  const offsetY = 10 * Math.cos(angle)

  ctx.fillText(text, midX + offsetX, midY + offsetY)
}

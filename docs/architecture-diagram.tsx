"use client"

import { useEffect, useRef } from "react"

export default function ArchitectureDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 800
    canvas.height = 600

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw architecture diagram
    // This is a simplified version - you would typically use a proper diagramming library

    // Draw main architectural boxes
    drawBox(ctx, 100, 50, 600, 80, "#f0f9ff", "#3b82f6", "Next.js Frontend")
    
    // Draw drop system components
    drawBox(ctx, 120, 150, 170, 70, "#fce7f3", "#ec4899", "DropSelector")
    drawBox(ctx, 320, 150, 170, 70, "#ede9fe", "#8b5cf6", "ProductShowcase")
    drawBox(ctx, 520, 150, 170, 70, "#fef3c7", "#f59e0b", "Level-Based Grouping")
    
    // Draw API and data layer
    drawBox(ctx, 100, 250, 280, 120, "#f0fdf4", "#22c55e", "API Routes / Mock API")
    drawBox(ctx, 420, 250, 280, 120, "#fef2f2", "#ef4444", "Notion Database")
    
    // Draw deployment
    drawBox(ctx, 100, 400, 600, 80, "#f5f3ff", "#8b5cf6", "Vercel Deployment")

    // Draw arrows between components
    // Frontend to drop system components
    drawArrow(ctx, 200, 130, 200, 150)
    drawArrow(ctx, 400, 130, 400, 150)
    drawArrow(ctx, 600, 130, 600, 150)
    
    // Component interactions
    drawArrow(ctx, 205, 185, 320, 185) // DropSelector to ProductShowcase
    drawArrow(ctx, 405, 185, 520, 185) // ProductShowcase to Level Grouping
    
    // Drop system to API layer
    drawArrow(ctx, 200, 220, 200, 250)
    drawArrow(ctx, 400, 220, 400, 250)
    drawArrow(ctx, 600, 220, 600, 250)
    
    // Between API and Notion
    drawArrow(ctx, 380, 310, 420, 310)
    
    // To deployment
    drawArrow(ctx, 240, 370, 240, 400)
    drawArrow(ctx, 560, 370, 560, 400)

    // Add labels
    ctx.font = "12px Arial"
    ctx.fillStyle = "#000000"
    ctx.textAlign = "center"

    ctx.fillText("Drop Selection", 260, 165)
    ctx.fillText("Product Display", 460, 165)
    ctx.fillText("Unlocking Logic", 660, 165)
    ctx.fillText("API Calls", 400, 290)
    ctx.fillText("Deployment", 240, 385)
    ctx.fillText("Deployment", 560, 385)
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

function drawBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fillColor: string,
  borderColor: string,
  text: string,
) {
  // Draw box
  ctx.fillStyle = fillColor
  ctx.strokeStyle = borderColor
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.roundRect(x, y, width, height, 10)
  ctx.fill()
  ctx.stroke()

  // Draw text
  ctx.fillStyle = "#000000"
  ctx.font = "bold 16px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, x + width / 2, y + height / 2)
}

function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) {
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
}

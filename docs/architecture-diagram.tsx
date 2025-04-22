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

    // Draw boxes
    drawBox(ctx, 100, 50, 600, 100, "#f0f9ff", "#3b82f6", "Next.js Frontend")
    drawBox(ctx, 100, 200, 280, 150, "#f0fdf4", "#22c55e", "API Routes")
    drawBox(ctx, 420, 200, 280, 150, "#fef2f2", "#ef4444", "Notion API")
    drawBox(ctx, 100, 400, 600, 100, "#f5f3ff", "#8b5cf6", "Vercel Deployment")

    // Draw arrows
    drawArrow(ctx, 240, 150, 240, 200)
    drawArrow(ctx, 560, 150, 560, 200)
    drawArrow(ctx, 380, 275, 420, 275)
    drawArrow(ctx, 240, 350, 240, 400)
    drawArrow(ctx, 560, 350, 560, 400)

    // Add labels
    ctx.font = "12px Arial"
    ctx.fillStyle = "#000000"
    ctx.textAlign = "center"

    ctx.fillText("User Requests", 240, 180)
    ctx.fillText("Static Generation", 560, 180)
    ctx.fillText("API Calls", 400, 260)
    ctx.fillText("Deployment", 240, 380)
    ctx.fillText("Deployment", 560, 380)
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

/**
 * Servicio para manejar la optimización y carga de imágenes
 */

// Función para generar un placeholder de baja calidad
export function generateBlurPlaceholder(url: string): string {
  // Para imágenes externas, podemos usar una versión de baja calidad
  if (url && url.startsWith("http")) {
    try {
      // Añadir parámetros para reducir la calidad y tamaño
      const urlObj = new URL(url)

      // Si es una URL de Unsplash, podemos usar sus parámetros
      if (url.includes("unsplash.com")) {
        return `${urlObj.origin}${urlObj.pathname}?q=10&w=50&auto=format&fit=crop`
      }
    } catch (error) {
      console.error("Error generating blur placeholder:", error)
    }
  }

  // Para otras URLs o en caso de error, devolvemos la original
  return url || ""
}

// Función para precargar imágenes
export function preloadImages(urls: string[]): void {
  if (typeof window === "undefined" || !urls || !Array.isArray(urls)) return

  urls.forEach((url) => {
    if (url) {
      const img = new Image()
      img.src = url
    }
  })
}

// Función para determinar el formato óptimo de imagen
export function getOptimalImageFormat(): string {
  if (typeof window === "undefined") return "jpg"

  try {
    const canvas = document.createElement("canvas")
    if (canvas.getContext && canvas.getContext("2d")) {
      // Verificar soporte para WebP
      if (canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0) {
        return "webp"
      }
      // Verificar soporte para AVIF
      if (canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0) {
        return "avif"
      }
    }
  } catch (error) {
    console.error("Error checking image format support:", error)
  }

  return "jpg"
}

// Función para optimizar URLs de imágenes
export function optimizeImageUrl(url: string, width = 600): string {
  if (!url) return ""

  try {
    if (url.startsWith("http")) {
      // Si es una URL de Unsplash, podemos optimizarla
      if (url.includes("unsplash.com")) {
        const urlObj = new URL(url)
        const format = getOptimalImageFormat()
        return `${urlObj.origin}${urlObj.pathname}?q=80&w=${width}&auto=format&fit=crop&fm=${format}`
      }
    }
  } catch (error) {
    console.error("Error optimizing image URL:", error)
  }

  return url
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollProvider } from "@/contexts/scroll-context"

const inter = Inter({ subsets: ["latin"] })

// Actualizar los metadatos de la página
export const metadata: Metadata = {
  title: "oBoRo - Exhibición de Productos",
  description: "Una forma moderna y visualmente cautivadora de explorar artículos únicos",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ScrollProvider>{children}</ScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

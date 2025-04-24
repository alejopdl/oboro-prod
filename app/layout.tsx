import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollProvider } from "@/contexts/scroll-context"
import { ProductNavigationProvider } from "@/contexts/product-navigation-context"

const inter = Inter({ subsets: ["latin"] })

// Actualizar los metadatos de la página
export const metadata: Metadata = {
  title: "oBoRo - Exhibición de Productos",
  description: "Una forma moderna y visualmente cautivadora de explorar artículos únicos",
  icons: {
    icon: '/assets/blackIcon.svg',
    apple: '/assets/blackIcon.svg',
  },
  generator: 'v0.dev',
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Add suppressHydrationWarning to the body tag to prevent hydration errors from browser extensions */}
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ScrollProvider>
            {/* At layout level, we don't have access to products yet, so we provide an empty array */}
            <ProductNavigationProvider availableDrops={[]}>
              {children}
            </ProductNavigationProvider>
          </ScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

// Purpose: Display detailed information for a single product using direct Notion integration

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/header'
import ChladniBackground from '@/components/background-pattern'
import BackToTop from '@/components/back-to-top'
import SkipLink from '@/components/skip-link'
import ErrorBoundary from '@/components/error-boundary'
import ProductDetail from '@/components/ProductDetail'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { getProductById } from '@/lib/notion'
import { createLogger } from '@/lib/logger'
import ProductBlockedPage from './product-blocked'
import { ProductNavigationProvider } from '@/contexts/product-navigation-context'

// Initialize logger
const log = createLogger('ProductDetail')

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

/**
 * Generate metadata for the product page (SEO)
 */
export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  // Await params before accessing properties (Next.js 15 requirement)
  const safeParams = await params
  
  // Get ID safely
  const id = String(safeParams.id)

  // Fetch product data for metadata
  const { product, status } = await getProductData(id)
  
  // Default metadata for error cases
  if (status !== 'success' || !product) {
    return {
      title: 'Producto no encontrado | oBoRo',
      description: 'Lo sentimos, el producto que buscas no existe o ha sido removido.',
    }
  }
  
  // Return product-specific metadata with complete SEO information
  return {
    title: `${product.name} | oBoRo`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} | oBoRo`,
      description: product.description.substring(0, 160),
      images: product.images.length > 0 ? [product.images[0]] : [],
      type: 'website',
    },
    // JSON-LD structured data for better SEO
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images[0],
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'ARS',
          availability: product.inStock 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock'
        }
      })
    }
  }
}

/**
 * Fetch product data directly from Notion
 * Uses server component to securely access Notion API
 */
async function getProductData(id: string): Promise<{ 
  product: Product | null; 
  status: 'success' | 'blocked' | 'not-found' | 'error';
}> {
  try {
    log.info(`Fetching product with ID: ${id}`)
    
    // Call Notion API directly (since we're in a server component)
    const product = await getProductById(id)
    
    if (!product) {
      log.warn(`Product not found: ${id}`)
      return { product: null, status: 'not-found' }
    }
    
    // Security check: Block access to locked products
    if (product.blocked) {
      log.warn(`Attempt to access blocked product: ${id}`)
      return { product, status: 'blocked' }
    }
    
    log.info(`Successfully fetched product: ${product.name}`)
    return { product, status: 'success' }
  } catch (error) {
    log.error('Error fetching product:', error)
    return { product: null, status: 'error' }
  }
}

/**
 * Product Detail Page Component
 * Shows detailed product information or appropriate error state
 * Uses direct Notion integration for performance and security
 */
export default async function ProductPage({ params, searchParams }: Props) {
  // Await params and searchParams before accessing (Next.js 15 requirement)
  const safeParams = await params
  const safeSearchParams = await searchParams
  
  // Get product ID safely
  const id = String(safeParams.id)

  // Safely get search params for navigation context
  const dropIdParam = safeSearchParams?.dropId || ''
  const levelParam = safeSearchParams?.level || ''
  
  // Convert parameters to proper types
  const dropId = typeof dropIdParam === 'string' && dropIdParam ? dropIdParam : undefined
  const level = typeof levelParam === 'string' && levelParam ? parseInt(levelParam, 10) : undefined
  
  // Get available drops for the ProductNavigationProvider
  // For product detail page, we only need the current drop
  const availableDrops = dropId ? [dropId] : []
  
  // Fetch product data directly from Notion
  const { product, status } = await getProductData(id)
  
  // Handle product not available (blocked)
  if (status === 'blocked') {
    return (
      <ProductNavigationProvider availableDrops={availableDrops}>
        <div className="min-h-screen">
          <ChladniBackground />
          <Header />
          <main className="container mx-auto pt-24 pb-16">
            <ProductBlockedPage 
              level={product?.level || 1} 
              dropId={product?.dropId}
            />
          </main>
          <BackToTop />
        </div>
      </ProductNavigationProvider>
    )
  }
  
  // Handle product not found or error
  if (status === 'not-found' || status === 'error') {
    notFound() // Use Next.js not found page
  }
  
  // Back link with state preservation
  const backLink = dropId ? 
    `/?dropId=${dropId}${level ? `&level=${level}` : ''}` : 
    '/'
  
  return (
    <>
      <SkipLink />
      <ErrorBoundary>
        {/* Wrap everything in ProductNavigationProvider to preserve drop/level state */}
        <ProductNavigationProvider availableDrops={availableDrops}>
          <main id="main-content" className="min-h-screen">
            <ChladniBackground />
            <Header />
            
            {/* Main content with proper padding for header */}
            <div className="container mx-auto max-w-6xl px-4 pt-24 pb-16">
              {/* Back button that preserves state */}
              <Link href={backLink} aria-label="Volver a la colección">
                <Button 
                  variant="ghost" 
                  className="mb-6 flex items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Volver a la colección
                </Button>
              </Link>
              
              {/* Product detail component */}
              <ProductDetail product={product} />
            </div>
            
            <BackToTop />
          </main>
        </ProductNavigationProvider>
      </ErrorBoundary>
    </>
  )
}

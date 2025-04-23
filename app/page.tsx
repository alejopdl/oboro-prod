import Header from "@/components/header"
import ProductShowcase from "@/components/product-showcase"
import ChladniBackground from "@/components/background-pattern"
import BackToTop from "@/components/back-to-top"
import SkipLink from "@/components/skip-link"
import ErrorBoundary from "@/components/error-boundary"
import ResourcePrefetcher from "@/components/resource-prefetcher"
// Remove static products import
import { getAllProducts } from "@/lib/notion"

// Add a loading component to show while data is being fetched
function LoadingProducts() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      <p className="ml-4 text-lg font-medium">Cargando productos...</p>
    </div>
  )
}

// Add an error component to show when data fetching fails
function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div className="p-8 my-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Error al cargar productos</h2>
      <p className="text-red-600 dark:text-red-300">{error.message}</p>
      <p className="mt-4 text-gray-700 dark:text-gray-300">
        Por favor, intente recargar la página. Si el problema persiste, contáctenos.
      </p>
    </div>
  )
}

// Use async/await for server component data fetching
export default async function Home() {
  try {
    // Fetch products from Notion
    const notionProducts = await getAllProducts();
    
    // Map to match expected format if needed (your Product type might be different)
    const products = notionProducts.map(product => ({
      ...product,
      // Add any missing properties needed by your components
      soldOut: !product.inStock,
      locked: false, // You might need to adjust this logic based on your requirements
    }));

    return (
      <>
        <SkipLink />
        <ErrorBoundary>
          <main id="main-content" className="min-h-screen">
            <ResourcePrefetcher products={products} />
            <ChladniBackground />
            <Header />
            <ProductShowcase products={products} />
            <BackToTop />
          </main>
        </ErrorBoundary>
      </>
  )
  } catch (error) {
    // Handle any errors during data fetching
    console.error('Error fetching products from Notion:', error);
    
    return (
      <>
        <SkipLink />
        <ErrorBoundary>
          <main id="main-content" className="min-h-screen">
            <ChladniBackground />
            <Header />
            <ErrorDisplay error={error instanceof Error ? error : new Error('Error desconocido al cargar los productos')} />
            <BackToTop />
          </main>
        </ErrorBoundary>
      </>
    )
  }
}

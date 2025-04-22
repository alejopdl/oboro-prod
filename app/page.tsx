import Header from "@/components/header"
import ProductShowcase from "@/components/product-showcase"
import ChladniBackground from "@/components/background-pattern"
import BackToTop from "@/components/back-to-top"
import SkipLink from "@/components/skip-link"
import ErrorBoundary from "@/components/error-boundary"
import ResourcePrefetcher from "@/components/resource-prefetcher"
import { products } from "@/data/products"

export default function Home() {
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
}

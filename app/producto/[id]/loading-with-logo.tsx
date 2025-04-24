import LogoLoading from '@/components/logo-loading'

/**
 * Product page loading component with logo animation
 * Shows a nice loading state while product data is being fetched
 * 
 * @returns {JSX.Element} Loading UI for product pages
 */
export default function ProductLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Large centered logo animation */}
      <div className="mb-8">
        <LogoLoading size="lg" className="opacity-80" />
      </div>
      
      {/* Loading text */}
      <h2 className="text-xl font-medium animate-pulse">
        Cargando producto...
      </h2>
    </div>
  )
}

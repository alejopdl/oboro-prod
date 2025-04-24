// Purpose: Loading state for product detail page

import Header from '@/components/header'
import ChladniBackground from '@/components/background-pattern'
import BackToTop from '@/components/back-to-top'
import LogoLoading from '@/components/logo-loading'

/**
 * Displays a loading skeleton while the product page loads
 * 
 * @returns JSX Element
 */
export default function ProductLoading() {
  return (
    <div className="min-h-screen">
      <ChladniBackground />
      <Header />
      
      <main className="container mx-auto max-w-6xl px-4 pt-24 pb-16">
        {/* Back button skeleton */}
        <div className="mb-6 w-40 h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* Image skeleton with logo loading animation */}
            <div className="md:w-1/2 relative">
              <div className="h-80 md:h-96 lg:h-[500px] w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <LogoLoading size="lg" />
              </div>
            </div>
            
            {/* Product info skeleton */}
            <div className="p-6 md:w-1/2">
              <div className="flex flex-col space-y-4">
                {/* Title skeleton */}
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                
                {/* Price skeleton */}
                <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                
                {/* Tags skeleton */}
                <div className="flex space-x-2">
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                </div>
                
                {/* Description skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                
                {/* Button skeleton */}
                <div className="mt-6 h-12 flex items-center justify-center gap-3 bg-gray-200 dark:bg-gray-700 rounded-md">
                  <LogoLoading size="sm" />
                  <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <BackToTop />
    </div>
  )
}

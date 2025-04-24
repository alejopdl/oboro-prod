// Purpose: Loading state for the main page using the logo animation

import Header from '@/components/header'
import ChladniBackground from '@/components/background-pattern'
import BackToTop from '@/components/back-to-top'
import LogoLoading from '@/components/logo-loading'

/**
 * Displays the main page loading state with logo animation
 * 
 * @returns JSX Element with loading animation
 */
export default function MainPageLoading() {
  return (
    <div className="min-h-screen">
      <ChladniBackground />
      <Header />
      
      <main className="container mx-auto max-w-6xl px-4 pt-24 pb-16">
        {/* Loading message with logo animation */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-6">
            <LogoLoading size="lg" />
          </div>
          <p className="text-lg font-medium animate-pulse text-center">
            Cargando productos...
          </p>
        </div>
        
        {/* Product grid skeleton */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div 
              key={i} 
              className="bg-black dark:bg-white rounded-lg overflow-hidden shadow-md h-80"
            >
              {/* Image placeholder */}
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              
              {/* Content placeholder */}
              <div className="p-4">
                {/* Title placeholder */}
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                
                {/* Price placeholder */}
                <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                
                {/* Tags placeholder */}
                <div className="flex space-x-2">
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <BackToTop />
    </div>
  )
}

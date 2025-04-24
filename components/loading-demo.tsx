"use client"

import { useState } from 'react'
import LogoLoading from './logo-loading'

/**
 * Demo page for the logo loading animation
 * This helps visualize how the loading animation looks in different sizes
 * 
 * @returns JSX Element with loading demo
 */
export default function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(true)
  
  // Toggle loading state to test
  const toggleLoading = () => {
    setIsLoading(!isLoading)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Logo Loading Animation Demo</h1>
      
      <button 
        onClick={toggleLoading}
        className="mb-8 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md"
      >
        {isLoading ? 'Hide' : 'Show'} Loading Animation
      </button>
      
      {isLoading && (
        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-semibold mb-4">Small Size</h2>
            <div className="flex items-center justify-center p-8 border border-gray-300 dark:border-gray-700 rounded-lg">
              <LogoLoading size="sm" />
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Medium Size (Default)</h2>
            <div className="flex items-center justify-center p-8 border border-gray-300 dark:border-gray-700 rounded-lg">
              <LogoLoading size="md" />
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Large Size</h2>
            <div className="flex items-center justify-center p-8 border border-gray-300 dark:border-gray-700 rounded-lg">
              <LogoLoading size="lg" />
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Examples in Different Backgrounds</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-900 rounded-lg">
                <LogoLoading size="md" />
                <p className="ml-4">Light/Dark Background</p>
              </div>
              <div className="flex items-center justify-center p-8 bg-black rounded-lg">
                <LogoLoading size="md" />
                <p className="ml-4 text-white">Black Background</p>
              </div>
              <div className="flex items-center justify-center p-8 bg-white rounded-lg">
                <LogoLoading size="md" />
                <p className="ml-4 text-black">White Background</p>
              </div>
              <div className="flex items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <LogoLoading size="md" />
                <p className="ml-4 text-white">Gradient Background</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

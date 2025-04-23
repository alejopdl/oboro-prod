// Purpose: Provide common test utilities and mock data
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

// Mock product data for testing
export const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    price: 99.99,
    size: 'M',
    images: ['/test-image-1.jpg'],
    soldOut: false
  },
  {
    id: '2',
    name: 'Test Product 2',
    price: 149.99,
    size: 'L',
    images: ['/test-image-2.jpg'],
    soldOut: true
  }
]

// Custom render function for testing
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options })

export * from '@testing-library/react'
export { customRender as render }

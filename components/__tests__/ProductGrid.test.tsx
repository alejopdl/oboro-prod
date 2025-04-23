// Purpose: Test ProductGrid component functionality
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProductGrid from '../ProductGrid'
import { mockProducts } from '../../tests/utils'

// Mock ProductCard component to simplify testing
jest.mock('../ProductCard', () => {
  return {
    __esModule: true,
    default: ({ product }) => (
      <div data-testid="product-card">
        <h3>{product.name}</h3>
        <p>{product.price}</p>
        <p>{product.size}</p>
      </div>
    ),
  }
})

describe('ProductGrid', () => {
  beforeEach(() => {
    // Clear any previous rendering
    jest.clearAllMocks()
  })

  it('renders all products correctly', () => {
    render(<ProductGrid products={mockProducts} />)

    // Check if the grid exists
    const grid = screen.getByTestId('product-grid')
    expect(grid).toBeInTheDocument()
    
    // Check if all product names are displayed
    mockProducts.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    })
  })

  it('handles empty product list', () => {
    render(<ProductGrid products={[]} />)
    
    // The grid should still be rendered but empty
    const grid = screen.getByTestId('product-grid')
    expect(grid).toBeInTheDocument()
    expect(grid.children).toHaveLength(0)
  })

  it('maintains correct grid layout classes', () => {
    render(<ProductGrid products={mockProducts} />)
    
    const grid = screen.getByTestId('product-grid')
    expect(grid).toHaveClass(
      'grid',
      'grid-cols-1',
      'sm:grid-cols-2',
      'lg:grid-cols-3'
    )
  })
})

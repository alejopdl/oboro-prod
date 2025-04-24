// Purpose: Test ProductGridWithFilters component functionality
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductGrid from '../ProductGridWithFilters';
import { mockProducts } from '../../tests/utils';
import type { Product } from '../../types/product';

// Mock the ProductCard component to simplify testing
jest.mock('../ProductCard', () => ({
  __esModule: true,
  default: ({ product }: { product: Product }) => (
    <div 
      data-testid={`product-card-${product.id}`}
      className="product-card"
    >
      <h3>{product.name}</h3>
      <p>Category: {product.category}</p>
    </div>
  ),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  __esModule: true,
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
      <button {...props}>{children}</button>
    ),
  },
}));

// Mock config with categories
jest.mock('../../data/config', () => ({
  config: {
    // Categories will be extracted from products if not provided
    categories: undefined
  },
}));

// Mock the reduced motion hook
jest.mock('../../hooks/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}));

describe('ProductGridWithFilters', () => {
  it('renders all products when no filter is applied', () => {
    render(<ProductGrid products={mockProducts} />);
    
    // Should show all products initially
    mockProducts.forEach(product => {
      expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
    });
  });
  
  it('shows category filter buttons', () => {
    render(<ProductGrid products={mockProducts} />);
    
    // Should show "All" button
    const allButton = screen.getByText('All');
    expect(allButton).toBeInTheDocument();
    
    // Should show buttons for each unique category in the mockProducts
    const uniqueCategories = [...new Set(mockProducts.map(p => p.category))];
    uniqueCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });
  
  it('filters products by category when a category button is clicked', () => {
    render(<ProductGrid products={mockProducts} />);
    
    // Get a category with multiple products
    // In our mock data, "Camisetas" has at least 2 products
    const targetCategory = "Camisetas";
    const targetProducts = mockProducts.filter(p => p.category === targetCategory);
    const otherProducts = mockProducts.filter(p => p.category !== targetCategory);
    
    // Click on the category button to filter
    const categoryButton = screen.getByText(targetCategory);
    fireEvent.click(categoryButton);
    
    // Now only products from the selected category should be visible
    targetProducts.forEach(product => {
      expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
    });
    
    // Products from other categories should not be visible
    // This could fail if there's a stacking animation, so we'll check for specific display properties
    otherProducts.forEach(product => {
      const card = screen.queryByTestId(`product-card-${product.id}`);
      if (card) {
        // If the card is in the DOM, it should be hidden in some way
        // We'll check for common hiding techniques
        expect(card).not.toBeVisible();
      } else {
        // Or the card might be completely removed from the DOM
        expect(card).toBeNull();
      }
    });
  });
  
  it('accepts an initial category filter', () => {
    // Set an initial category from our mock data
    const initialCategory = "Pantalones";
    render(<ProductGrid products={mockProducts} initialCategory={initialCategory} />);
    
    // The initial category button should be active - checking for dark styling 
    // instead of a specific 'active' class since the component uses tailwind classes
    const categoryButton = screen.getByText(initialCategory);
    
    // The button is using Tailwind classes to show it's active with dark background
    expect(categoryButton).toHaveClass('bg-black', {exact: false});
    expect(categoryButton).toHaveClass('text-white', {exact: false});
    
    // Only products from this category should be visible
    const matchingProducts = mockProducts.filter(p => p.category === initialCategory);
    const otherProducts = mockProducts.filter(p => p.category !== initialCategory);
    
    matchingProducts.forEach(product => {
      expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
    });
    
    // Products from other categories should be filtered out
    otherProducts.forEach(product => {
      const card = screen.queryByTestId(`product-card-${product.id}`);
      if (card) {
        expect(card).not.toBeVisible();
      } else {
        expect(card).toBeNull();
      }
    });
  });
  
  it('shows a message when no products match the category filter', () => {
    // Create a product list where no product has the category "EmptyCategory"
    render(<ProductGrid products={mockProducts} initialCategory="EmptyCategory" />);
    
    // Should show an empty message
    const emptyMessage = screen.getByText(/no hay productos/i);
    expect(emptyMessage).toBeInTheDocument();
  });
});

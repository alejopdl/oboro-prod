// Purpose: Test the homepage component with Notion data and the mock products API

import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../page';

// Mock the global fetch API for testing
global.fetch = jest.fn() as jest.Mock;

// Prepare mock response data for our fetch mocks
const mockProducts = [
  {
    id: 'test-id-1',
    name: 'Mock Product 1',
    price: 99.99,
    description: 'This is a mock product',
    images: ['https://example.com/image.jpg'],
    category: 'Test',
    inStock: true,
    size: 'M',
    soldOut: false,
    level: 1,
    blocked: false,
    dropId: 'DROP1'
  },
  {
    id: 'test-id-2',
    name: 'Mock Product 2',
    price: 149.99,
    description: 'This is another mock product',
    images: ['https://example.com/image2.jpg'],
    category: 'Test',
    inStock: false,
    size: 'L',
    soldOut: true,
    level: 2,
    blocked: true,
    dropId: 'DROP1'
  }
];

// Mock the components used in the homepage - use relative paths
jest.mock('../../components/header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('../../components/product-showcase', () => ({ 
  products, 
  availableDrops 
}: { 
  products: any[],
  availableDrops: string[] 
}) => (
  <div data-testid="mock-product-showcase">
    {/* Show how many products were passed to this component */}
    <span data-testid="product-count">{products.length}</span>
    {/* Show the first product name for testing */}
    {products.length > 0 && <span data-testid="first-product-name">{products[0].name}</span>}
    {/* Show the drops */}
    <div data-testid="available-drops">{availableDrops.join(',')}</div>
  </div>
));
jest.mock('../../components/background-pattern', () => () => <div data-testid="mock-background">Background</div>);
jest.mock('../../components/back-to-top', () => () => <div>Back to Top</div>);
jest.mock('../../components/skip-link', () => () => <div>Skip Link</div>);
jest.mock('../../components/error-boundary', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock('../../components/resource-prefetcher', () => () => null);

// Helper function to make the async component testable
async function renderHomePage() {
  // Since Next.js App Router uses React Server Components, we need to 
  // wait for the component to resolve before rendering
  const HomePageResolved = await HomePage();
  return render(<>{HomePageResolved}</>);
}

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('HomePage', () => {
  // Test 1: Happy path - Products load and display correctly
  it('renders products from mock API correctly', async () => {
    // Mock the fetch function to return our test data
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        count: mockProducts.length,
        products: mockProducts
      })
    });
    
    // Render the homepage
    await renderHomePage();
    
    // Check if key elements are present
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-background')).toBeInTheDocument();
    expect(screen.getByTestId('mock-product-showcase')).toBeInTheDocument();
    
    // Check if products were passed to the ProductShowcase component
    expect(screen.getByTestId('product-count').textContent).toBe('2');
    expect(screen.getByTestId('first-product-name').textContent).toBe('Mock Product 1');
    
    // Verify that fetch was called with the correct URL (we now use notion-direct instead of mock-products)
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/notion-direct', { cache: 'no-store' });
  });

  // Test 2: Error state - Show error message when data fetching fails
  it('displays error message when API fails', async () => {
    // Mock the fetch function to return an error
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch products'));
    
    // Render the homepage - it should handle the error
    await renderHomePage();
    
    // Check if the error message is displayed
    expect(screen.getByText(/Error al cargar productos/i)).toBeInTheDocument();
    // Check for the presence of the help text
    expect(screen.getByText(/Por favor, intente recargar la página/i)).toBeInTheDocument();
  });

  // Test 3: Empty state - What happens when there are no products
  it('handles empty product list', async () => {
    // Mock the fetch function to return an empty array
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        count: 0,
        products: []
      })
    });
    
    // Render the homepage with empty products
    await renderHomePage();
    
    // Check if the product showcase still renders but with 0 products
    expect(screen.getByTestId('mock-product-showcase')).toBeInTheDocument();
    expect(screen.getByTestId('product-count').textContent).toBe('0');
    
    // The first product name shouldn't be in the document since there are no products
    expect(screen.queryByTestId('first-product-name')).not.toBeInTheDocument();
  });
  
  // Skip the test for now
  it.skip('should show product filters', () => {
    // This test would verify that product filters work correctly
    // We'll implement this in a future update
  });
});

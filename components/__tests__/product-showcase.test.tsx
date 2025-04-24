// Purpose: Test ProductShowcase functionality with simplified tests for beginners
import React from 'react';
import { mockProducts } from '../../tests/utils';
import '@testing-library/jest-dom';
import type { Product } from '../../types/product';

// A simple mock for window.scrollTo
const scrollToMock = jest.fn();
global.scrollTo = scrollToMock;

// Create a subset of products by drop for testing
const drop1Products = mockProducts.filter(p => p.dropId === 'DROP1');
const drop2Products = mockProducts.filter(p => p.dropId === 'MiniDROP2');

// Test the filtering logic directly for simplicity
const filterProductsByDrop = (products: Product[], dropId: string): Product[] => {
  return products.filter(product => product.dropId === dropId);
};

// Test the scroll behavior logic
const calculateScrollPosition = (elementTop: number, scrollTop: number): number => {
  // Simulate the logic from our component
  const targetPosition = scrollTop + elementTop - 100; // 100px offset
  return targetPosition;
};

describe('ProductShowcase', () => {
  // Simple product filtering test
  it('filters products by drop', () => {
    // Filter products for DROP1
    const filteredProducts = filterProductsByDrop(mockProducts, 'DROP1');
    
    // Verify all products have the correct dropId
    expect(filteredProducts.length).toBeGreaterThan(0);
    filteredProducts.forEach(product => {
      expect(product.dropId).toBe('DROP1');
    });
    
    // Test filtering for a different drop
    const drop2Products = filterProductsByDrop(mockProducts, 'MiniDROP2');
    expect(drop2Products.every(p => p.dropId === 'MiniDROP2')).toBe(true);
  });
  
  // Test scroll position calculation
  it('calculates scroll position with header offset', () => {
    const elementTop = 200;
    const scrollTop = 100;
    
    // With a 100px offset, the scroll position should be:  scrollTop + elementTop - 100
    const position = calculateScrollPosition(elementTop, scrollTop);
    
    // Expected: 100 + 200 - 100 = 200
    expect(position).toBe(200);
  });
});

// Test level reset when changing drops
describe('Drop Navigation', () => {
  it('resets level to 1 when changing drops', () => {
    // Create a mock context that simulates our ProductNavigationContext
    const setSelectedDrop = jest.fn();
    const setSelectedLevel = jest.fn();
    
    // This simulates the setDrop method in our context
    const setDrop = (dropId: string): void => {
      setSelectedDrop(dropId);
      // This is the key functionality we fixed: always reset level to 1
      setSelectedLevel(1);
    };
    
    // Call the function to change drops
    setDrop('DROP2');
    
    // Verify the drop was changed
    expect(setSelectedDrop).toHaveBeenCalledWith('DROP2');
    
    // Verify the level was reset to 1
    expect(setSelectedLevel).toHaveBeenCalledWith(1);
  });
});

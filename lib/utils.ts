// Purpose: Utility functions for the application

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from "./notion"

/**
 * Combines class names with Tailwind classes
 * @param inputs - Class names to combine
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Ensures a product has all required fields with sensible defaults
 * This helps prevent errors when data is missing or incomplete
 *
 * @param product - Partial product data from API
 * @returns Complete product with fallback values for missing fields
 */
export function getProductWithDefaults(product: Partial<Product>): Product {
  return {
    // Basic product information with fallbacks
    id: product.id || 'unknown-id',
    name: product.name || 'Unnamed Product',
    price: product.price ?? 0, // Use 0 if price is missing
    description: product.description || 'No description available',
    
    // Ensure images is always an array, even if API returns a single string
    images: Array.isArray(product.images) ? product.images : 
           (product.images ? [product.images] : []),
           
    // Other standard fields
    category: product.category || 'Uncategorized',
    inStock: product.inStock ?? true, // Default to in stock
    size: product.size || 'One Size',
    
    // Drop system fields with sensible defaults
    level: product.level ?? 1, // Default to level 1
    blocked: product.blocked ?? false, // Default to unblocked
    dropId: product.dropId || 'DEFAULT', // Default drop
    
    // Metadata fields
    createdTime: product.createdTime || new Date().toISOString(),
    lastEditedTime: product.lastEditedTime || new Date().toISOString(),
  };
}

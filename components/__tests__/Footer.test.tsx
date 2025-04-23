// Purpose: Test Footer component functionality
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Footer from '../Footer'

// Mock global config for testing
jest.mock('../../data/config', () => ({
  config: {
    siteName: 'oBoRo',
    siteDescription: 'Tienda de ropa y accesorios de calidad',
    navLinks: [
      { name: 'Inicio', path: '/' },
      { name: 'Productos', path: '/productos' },
    ],
    social: {
      instagram: 'https://instagram.com/oboro',
      whatsapp: 'https://wa.me/5491155555555',
    },
  },
}))

describe('Footer', () => {
  // Test 1: Happy Path - Component renders correctly
  it('renders footer with site information and navigation links', () => {
    render(<Footer />)
    
    // Check if site name is displayed
    expect(screen.getByText('oBoRo')).toBeInTheDocument()
    
    // Check if site description is displayed
    expect(screen.getByText('Tienda de ropa y accesorios de calidad')).toBeInTheDocument()
    
    // Check if navigation links are displayed
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Productos')).toBeInTheDocument()
    
    // Check if social section exists
    expect(screen.getByText('Síguenos')).toBeInTheDocument()
  })

  // Test 2: Edge Case - Current year in copyright
  it('displays the current year in the copyright notice', () => {
    render(<Footer />)
    
    const currentYear = new Date().getFullYear()
    const copyrightText = `© ${currentYear} oBoRo. Todos los derechos reservados.`
    
    expect(screen.getByText(copyrightText)).toBeInTheDocument()
  })

  // Test 3: Accessibility - Has proper aria attributes
  it('has proper accessibility attributes', () => {
    render(<Footer />)
    
    // Check for ARIA landmark (footer tag has implicit contentinfo role)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
    
    // Check that social media links have proper aria-labels
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument()
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument()
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument()
    
    // Check for proper heading
    expect(screen.getByText('Síguenos')).toBeInTheDocument()
  })
})

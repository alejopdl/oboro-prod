// Purpose: Mock Next.js components for testing
import React from 'react'

// Mock Next.js Image component
jest.mock('next/image', () => {
  const MockImage = (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />
  }
  return MockImage
})

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
  return MockLink
})

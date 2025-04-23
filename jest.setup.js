// Purpose: Add Jest DOM matchers and setup test environment
import React from 'react'
import '@testing-library/jest-dom'

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image(props) {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    const { fill, ...rest } = props
    return React.createElement('img', rest)
  }
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: function Link({ children, href, ...props }) {
    return React.createElement('a', { href: href.replace('/producto/', '/produto/'), ...props }, children)
  }
}))

// Mock Framer Motion
jest.mock('framer-motion', () => {
  return {
    __esModule: true,
    motion: {
      div: ({ children, ...props }) => React.createElement('div', props, children),
      span: ({ children, ...props }) => React.createElement('span', props, children)
    },
    AnimatePresence: ({ children }) => children
  }
})

// No text replacement needed - we're using Spanish text

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

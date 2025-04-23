# Hydration in Next.js: A Beginner's Guide

## What is Hydration?

Hydration is the process that makes a server-rendered HTML page interactive in the browser. 

1. **Step 1**: Next.js generates HTML on the server
2. **Step 2**: This HTML is sent to the browser (fast initial load)
3. **Step 3**: JavaScript loads and "hydrates" the page, adding interactivity

## Common Hydration Issues

Hydration mismatches occur when the HTML that Next.js renders on the server is different from what React tries to render on the client. Common causes:

### 1. Browser-only APIs in Render Logic
```jsx
// ❌ BAD: Using window during rendering
function Component() {
  // This causes errors because window doesn't exist on the server
  const width = window.innerWidth;
  return <div>Screen width: {width}</div>;
}
```

### 2. Dynamic Content Without Proper Handling
```jsx
// ❌ BAD: Different values on server vs client
function Component() {
  // Date.now() will be different on server vs client
  return <div>Current time: {new Date().toLocaleTimeString()}</div>;
}
```

### 3. CSS-in-JS with Different Classes
```jsx
// ❌ BAD: Some CSS-in-JS libraries generate different class names
// on server vs client if not configured properly
```

### 4. Animation Libraries 
```jsx
// ❌ BAD: Animation props applied during server rendering
<motion.div animate={{ opacity: 1 }}>Content</motion.div>
```

## How We Fixed Hydration Issues

### 1. ClientOnly Component Pattern

We created a ClientOnly component that only renders its content after hydration is complete:

```tsx
// components/ClientOnly.tsx
"use client"

import { useState, useEffect, ReactNode } from 'react'

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return fallback
  }

  return <>{children}</>
}
```

### 2. Using the ClientOnly Pattern

```jsx
// How to use it:
<ClientOnly fallback={<StaticPlaceholder />}>
  <AnimatedComponent />
</ClientOnly>
```

### 3. Applying to Theme Toggle

The theme toggle is a classic example of a component that needs client-side rendering:

```tsx
// ✅ GOOD: Only show theme toggle after mount
const [mounted, setMounted] = useState(false)

// Set mounted state after hydration
useEffect(() => {
  setMounted(true)
}, [])

return (
  <header>
    {mounted ? (
      <ThemeToggleButton theme={theme} setTheme={setTheme} />
    ) : (
      <div className="w-8 h-8" /> {/* Empty placeholder with same size */}
    )}
  </header>
)
```

### 4. Handling Framer Motion Animations

For animations with libraries like Framer Motion:

```tsx
// ✅ GOOD: Apply animation props only after mounting
const MotionComponent = mounted ? motion.div : 'div'

return (
  <MotionComponent
    {...(mounted 
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5 }
        } 
      : {}
    )}
    className="your-classes"
  >
    Content
  </MotionComponent>
)
```

## Best Practices for Avoiding Hydration Issues

1. **Move browser-only code to useEffect hooks** that run after mounting
2. **Provide fallbacks** for server-rendering
3. **Use the ClientOnly pattern** for components that must be different on client vs server
4. **Pre-render static fallbacks** that match the dimensions of your dynamic content
5. **Avoid dynamic values** in initial renders when possible

## Resources for Further Learning

- [Next.js Documentation on Hydration](https://nextjs.org/docs/messages/react-hydration-error)
- [React Documentation on Hydration](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Josh Comeau's Guide to Hydration Issues](https://www.joshwcomeau.com/react/the-perils-of-rehydration/)

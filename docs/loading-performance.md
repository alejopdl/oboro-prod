# oBoRo Loading Performance Guide

This document explains how we've enhanced loading performance and user experience in the oBoRo application, with a focus on the logo-based loading animations.

## Understanding the Problem

When users browse the product listings or detail pages, images often take time to load. This can create a jarring experience where:

- Cards appear but images are blank while loading
- Layout shifts occur as images load in
- Users don't have clear feedback about what's happening

## Our Solution: Logo-Based Loading Animations

We've created a beautiful, brand-consistent loading experience using the oBoRo logo.

### How It Works (In Simple Terms)

1. **Logo Placeholder**: When an image is loading, we show the oBoRo logo spinning in its place
2. **Theme Awareness**: The logo changes color automatically based on the theme (black or white)
3. **Smooth Transition**: When the image finishes loading, the logo fades out and the image fades in
4. **No Layout Shifts**: The space for the image is reserved from the start, preventing jumps

## Key Components

### 1. LogoLoading Component

This component displays an animated spinning logo:

```tsx
// components/logo-loading.tsx
export default function LogoLoading({ size = 64, className = '' }) {
  // Shows the spinning logo animation
  // Automatically adjusts color based on theme
}
```

**What it does:**
- Creates a spinning animation with our oBoRo logo
- Changes color based on light/dark theme
- Can be customized in size

### 2. ImageWithLogoLoading Component

This component handles loading images with our logo animation:

```tsx
// components/image-with-logo-loading.tsx
export default function ImageWithLogoLoading({
  src,
  alt,
  // other props
}) {
  // Shows logo while image loads
  // Fades in the image when ready
}
```

**What it does:**
- Shows the spinning logo while an image loads
- Smoothly transitions to the actual image when ready
- Prevents layout shifts

## How to Use These Components

### Basic Usage

```tsx
import ImageWithLogoLoading from '@/components/image-with-logo-loading'

// In your component:
<ImageWithLogoLoading
  src="/path/to/image.jpg"
  alt="Product name"
  priority={isImportantImage}
/>
```

### For ProductCard

```tsx
<ImageWithLogoLoading
  src={product.images[0]}
  alt={product.name}
  priority={index < 3} // Prioritize first 3 visible cards
/>
```

### For ProductDetail

```tsx
<ImageWithLogoLoading
  src={images[currentImageIndex]}
  alt={`${name} - imagen ${currentImageIndex + 1}`}
  priority={currentImageIndex === 0} // Main image loads first
  objectFit="contain"
/>
```

## Performance Benefits

1. **Better User Experience**: Users see something visually engaging while waiting
2. **Improved Core Web Vitals**: Less layout shift improves CLS score
3. **Faster Perceived Loading**: The site feels faster even if actual load times are the same
4. **Brand Reinforcement**: Every loading state reinforces your brand identity

## Next Steps

- Implement the full loading performance plan outlined in TASK.md
- Add image optimizations to reduce actual load times
- Create automated tests to verify loading behavior

## Questions?

If you're unsure about anything in this guide, please reach out to the development team!

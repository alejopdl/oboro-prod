# oBoRo - Production E-commerce Site

A modern, responsive e-commerce product listing website built with Next.js 15.2.4 and Notion as a headless CMS. This is the production repository optimized for Vercel deployment.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.local.example` to `.env.local` and fill in your values:
   - NOTION_API_KEY: Your Notion integration token
   - NOTION_DATABASE_ID: Your Notion database ID
   - Other configuration values as needed

4. Run the development server:
   ```bash
   npm run dev
   ```

## Features

- Modern UI with Tailwind CSS
- Notion as headless CMS
- Server-side data fetching from Notion database
- Error handling and loading states
- Product listing and filtering
- **Enhanced Drop System:**
  - Level-based product unlocking
  - **Centralized navigation state management**
  - **Level-resetting when changing drops**
  - **Improved scrolling with header offset**
- Visual indicators for product availability:
  - Sad face icon for sold-out products
  - Large lock icon for locked products
  - Inverted color card design (dark in light mode, white in dark mode)
- **Enhanced Product Detail Page:**
  - Matching UI style with product cards (inverted colors)
  - Improved image gallery with thumbnails
  - Consistent visual feedback for availability
  - Smooth animations and transitions
- **Brand-Consistent Loading System:**
  - Logo-based loading animations with theme awareness
  - Enhanced image loading with smooth transitions
  - Page-level loading states with product skeleton UI
  - Optimized background patterns and prioritized resources
  - Favicon and site identity across browsers
- **Secure product detail pages with blocked product protection**
- **State preservation when navigating between pages**
- **Fixed hydration issues with browser extensions**
- WhatsApp integration for purchases
- Responsive design
- SEO optimized with structured data
- Comprehensive test coverage

## Tech Stack

- Next.js 15.2.4
- TypeScript
- Tailwind CSS
- Notion API
- Framer Motion
- next-themes

## Testing

The project includes comprehensive test coverage using Jest and React Testing Library. Run the tests with:

```bash
npm test
```

### Test Structure

- **Component Tests**: Each component has its own test file in the `components/__tests__/` directory
- **Edge Case Tests**: Components are tested with various data scenarios (empty data, single items, etc.)
- **Utility Tests**: API clients and utility functions have their own tests in `lib/__tests__/`

### Key Test Features

- **Mock Data**: Standardized mock products in `tests/utils.ts` matching the Notion schema
- **TypeScript Support**: All tests use TypeScript for better type safety
- **Image Mocking**: Image components are mocked to avoid network requests during tests
- **Navigation Tests**: Interactive elements like gallery navigation are tested
- **Edge Cases**: Components are tested with various data conditions:
  - Products with multiple images
  - Products with a single image
  - Products with no images
  - Products that are sold out
  - Products that are locked (part of the drop system)
  - Null/undefined product data

## Hydration Safety

The project implements several patterns to prevent Next.js hydration mismatches:

### ClientOnly Component

A `ClientOnly` wrapper component is used for content that must only render on the client:

```tsx
// For components that use browser APIs or dynamic values that differ between server and client
import ClientOnly from '../components/ClientOnly';

function MyComponent() {
  return (
    <div>
      {/* Safe for server rendering */}
      <h1>Static content</h1>
      
      {/* Only rendered after hydration */}
      <ClientOnly fallback="Loading...">
        {/* Content using browser APIs or producing different outputs between server/client */}
        <p>Current time: {new Date().toLocaleTimeString()}</p>
      </ClientOnly>
    </div>
  );
}
```

### Mounted State Pattern

Components using animations or themes use the mounted state pattern to prevent hydration mismatches:

```tsx
const [mounted, setMounted] = useState(false);

// Set mounted state after component mounts in browser
useEffect(() => {
  setMounted(true);
}, []);

// Only use client-specific features after mounting
const Component = mounted ? motion.div : 'div';
```

### When to Use Each Pattern

- Use `ClientOnly` for small sections of content that depend on browser APIs or dynamic values
- Use the mounted state pattern for components that need different rendering behavior on server vs client
- Include "use client" directive at the top of any component using client-side features

## Product Detail Pages

The application includes a comprehensive product detail page system with security features, state preservation, and enhanced UI:

### Features

- **Direct Notion Integration**: Server components fetch product data directly from Notion
- **Security Measures**: Prevents access to blocked products with appropriate error messages
- **State Preservation**: Back button returns users to the same drop and level they were viewing
- **Enhanced Image Gallery**: Thumbnails for easy navigation between product images
- **Zoom Functionality**: Click to zoom in/out on product images
- **Consistent Visual Style**: Matching the inverted card design (dark in light mode, light in dark mode)
- **Availability Indicators**: Smiley/sad faces showing product availability status
- **Enhanced WhatsApp Button**: Improved styling with icon and better visual feedback
- **SEO Optimization**: Includes metadata, structured data, and favicon for product pages
- **Error Handling**: Graceful error states with user-friendly messages
- **Branded Loading Experience**: Consistent logo-based loading animations throughout the site

### Usage Example

Product detail pages automatically inherit the navigation state from the listing page:

```tsx
// When clicking a product from the listing
<Link href={`/producto/${id}?dropId=${product.dropId}&level=${product.level}`}>
  {/* Product card content */}
</Link>

// When returning to the listing, state is preserved
<Link href={`/?dropId=${dropId}${level ? `&level=${level}` : ''}`}>
  Volver a la colección
</Link>
```

## Loading Animation System

The site features a comprehensive, brand-consistent loading animation system using the oBoRo logo:

### LogoLoading Component

A versatile, theme-aware loading component that displays the oBoRo logo with animations:

```tsx
// Base loading component that adapts to theme
import LogoLoading from './components/logo-loading';

// Use the loader with different sizes
<LogoLoading size="sm" /> // Small for inline use
<LogoLoading size="md" /> // Medium for general content
<LogoLoading size="lg" /> // Large for full-page loading
```

### ImageWithLogoLoading Component

Enhances the Next.js Image component with logo-based loading animation:

```tsx
// Drop-in replacement for Next.js Image with loading animation
import ImageWithLogoLoading from './components/image-with-logo-loading';

// Use it just like a regular Next.js Image
<ImageWithLogoLoading
  src="/path/to/image.jpg"
  alt="Product image"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  loaderSize="md" // Controls size of the logo loader
/>
```

### Page-Level Loading States

Custom loading.tsx files in the app directory provide consistent loading experiences:

```tsx
// app/loading.tsx - Main page loading with logo animation
export default function MainPageLoading() {
  return (
    <div className="min-h-screen">
      {/* Page layout with logo loader */}
      <div className="flex flex-col items-center justify-center py-16">
        <LogoLoading size="lg" />
        <p className="text-lg font-medium animate-pulse">
          Cargando productos...
        </p>
      </div>
      {/* Product skeleton UI */}
    </div>
  );
}
```

### Favicon and Site Identity

The favicon and web manifest ensure brand consistency in browser tabs and when installed as a PWA:

```tsx
// In app/layout.tsx - Metadata configuration
export const metadata = {
  title: "oBoRo - Exhibición de Productos",
  description: "Una forma moderna y visualmente cautivadora de explorar artículos únicos",
  icons: {
    icon: '/assets/blackIcon.svg',
    apple: '/assets/blackIcon.svg',
  },
  manifest: '/manifest.json'
};
```

### Security Implementation

The product detail system includes security checks to prevent unauthorized access to blocked products:

```typescript
// Security check example from app/producto/[id]/page.tsx
async function getProductData(id: string) {
  try {
    // Fetch the product
    const product = await getProductById(id)
    
    // If product is not found, return not-found status
    if (!product) {
      return { product: null, status: 'not-found' }
    }
    
    // Block access to locked products
    if (product.blocked) {
      return { product, status: 'blocked' }
    }
    
    return { product, status: 'success' }
  } catch (error) {
    return { product: null, status: 'error' }
  }
}
```

### User Flow

1. User browses products by drop and level
2. User clicks on an unlocked product
3. Product detail page loads with full information
4. User can return to the same drop/level via the back button

## Logging System

The application includes a flexible logging utility (`lib/logger.ts`) that provides:

- Different log levels (DEBUG, INFO, WARN, ERROR)
- Color-coded console output
- Contextual logging (component/module specific)
- Production-mode log suppression

### Using the Logger

```typescript
import { createLogger, LogLevel } from '../lib/logger';

// Create a logger for your component
const logger = createLogger('ComponentName', LogLevel.INFO);

// Use different log levels
logger.debug('Detailed information for debugging');
logger.info('General information about operation');
logger.warn('Warning that something might be wrong');
logger.error('Error that prevented operation');
```

### Log Level Control

Set the current log level in `lib/logger.ts`:
- `LogLevel.DEBUG`: All messages (development)
- `LogLevel.INFO`: Info and above (general usage)
- `LogLevel.WARN`: Warnings and errors only (production)
- `LogLevel.ERROR`: Only errors (minimal logging)

## Project Structure

Following a hybrid Next.js structure with both App Router and Pages Router:
```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Homepage component
│   ├── producto/[id]/      # Product detail pages
│   │   ├── page.tsx        # Product detail page component
│   │   ├── product-blocked.tsx # Blocked product component
│   │   └── error.tsx       # Error handling component
│   └── __tests__/          # Tests for app components
├── pages/                  # Next.js Pages Router (API routes)
│   └── api/                # API endpoints
│       ├── test-notion.ts  # Notion API test endpoint
│       ├── notion-direct.ts # Direct Notion API endpoint
│       └── test-drops.ts   # Drop system test endpoint
├── components/             # Reusable UI components (all TypeScript)
│   ├── Navbar.tsx          # Navigation bar
│   ├── Footer.tsx          # Footer component
│   ├── ProductCard.tsx     # Product card component
│   ├── ProductDetail.tsx   # Product detail component (converted to TS)
│   ├── BackgroundEffect.tsx # Background animation (converted to TS)
│   ├── product-showcase.tsx # Product showcase component
│   ├── ProductGridWithFilters.tsx # Product grid with filters (converted to TS)
│   ├── drop-selector.tsx   # Drop selection component
│   ├── lazy-section.tsx    # Lazy loading section component
│   └── __tests__/          # Component tests
├── tests/                  # Test utilities and mock data
│   ├── utils.ts            # Test utilities and mock products
│   ├── assets/             # Test assets (images, etc.)
│   └── mocks/              # Component mocks for testing
├── lib/                    # Utility functions
│   ├── notion.ts           # Notion API client
│   ├── logger.ts           # Logging utility
│   └── __tests__/          # Tests for utilities
│   └── notion.ts           # Notion API client (TypeScript)
├── data/                   # Data and configuration
│   └── config.ts           # Site configuration
├── styles/                 # CSS and styling
│   └── globals.css         # Global styles
├── public/                 # Static assets
│   └── images/             # Image assets
├── types/                  # TypeScript type definitions
│   └── product.ts          # Product interface definitions
├── docs/                   # Project documentation
│   ├── drop-system.md      # Drop system documentation
│   ├── notion-cms-guide.md # Notion CMS usage guide
│   └── notion-integration.md # Technical Notion integration details
├── .env.local.example      # Example environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── jest.setup.js           # Jest test configuration
└── package.json            # Project dependencies

## Notion CMS Integration

### Database Structure
The Notion database includes these fields:
- Name (Title) - Product name
- Price (Number) - Price in ARS (Argentine Pesos)
- Description (Text) - Detailed product description
- Images (Files & Media) - Product images
- Category (Select) - Product category
- InStock (Checkbox) - Whether the product is available
- Size (Select) - Product size (S, M, L, XL, etc.)
- Level (Number) - Product level in the drop system (1, 2, 3, etc.)
- Blocked (Checkbox) - Whether the product is blocked until lower levels are sold out
- DropId (Select) - The drop collection the product belongs to (e.g., "DROP1", "MiniDROP2")

### Working with Notion
- API calls are made through secure server-side functions
- Error handling is in place for failed API calls
- All data is typed using TypeScript interfaces
- See `docs/notion-cms-guide.md` for editor instructions
- See `docs/drop-system.md` for details on how the drop system works

### Testing
- Unit tests for Notion API functions
- Integration tests for pages using Notion data
- Mocks for testing without calling the actual API

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

[Add your license here]

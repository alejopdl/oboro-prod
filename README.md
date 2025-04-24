# oBoRo - Next.js Product Listing Site

A modern, responsive e-commerce product listing website built with Next.js and Notion as a headless CMS.

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
- **Drop system with level-based product unlocking**
- Visual indicators for product availability status with inverted color card design
- Unique card design: dark in light mode, white in dark mode
- Subtle glow effect on available products
- WhatsApp integration for purchases
- Responsive design
- SEO optimized
- Comprehensive test coverage

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Notion API
- Framer Motion

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
│   └── page.tsx            # Homepage component
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

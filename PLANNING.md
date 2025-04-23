# Next.js Product Listing Site with Notion CMS - Project Planning

## Project Vision

Create a modern, responsive e-commerce product listing website that leverages Notion as a headless CMS for easy content management. The site will showcase products with detailed information, allow filtering and searching, and provide a seamless user experience across all devices.

### Core Objectives

- Create a visually appealing product showcase with modern UI/UX principles
- Implement a headless CMS approach using Notion for content management
- Develop a responsive design that works flawlessly on all devices
- Optimize for performance, accessibility, and SEO
- Implement a simple purchase flow via WhatsApp integration
- Deploy on Vercel for optimal performance and reliability

## Architecture

### Frontend Architecture

The frontend will be built using Next.js with a hybrid rendering approach:

- **Static Generation (SSG)** for performance-critical pages like the homepage and product listings
- **Server-Side Rendering (SSR)** for dynamic content like search results
- **Client-side rendering** for interactive elements and animations

### Client-Side Rendering & Hydration Strategy

To prevent hydration mismatches in Next.js, we've implemented the following strategies:

- **ClientOnly Component**: A wrapper component that only renders its children after hydration completes
- **Conditional Rendering**: Components that rely on browser APIs render placeholders during SSR
- **useEffect for Mounting**: Components track mounted state to conditionally apply client-side features
- **Animation Handling**: Framer Motion animations only applied after hydration is complete

See `docs/hydration-guide.md` for detailed implementation techniques.

### Backend Architecture

- **Notion API** will serve as the backend database and CMS
- **Next.js API Routes** will handle secure data fetching from Notion
- **Serverless Functions** on Vercel for any additional backend logic

### Data Flow

1. **Content Management**:
   - Products are created and managed in a Notion database
   - Each product has properties like name, price, description, images, etc.

2. **Data Fetching**:
   - During build time: Next.js fetches data for static pages using `getStaticProps`
   - During runtime: Client-side components fetch data from API routes

3. **Rendering**:
   - Static pages are pre-rendered at build time
   - Dynamic pages are rendered server-side or client-side as needed
   - UI components receive data as props and render the interface

4. **User Interaction**:
   - Users can browse, search, and filter products
   - When a user selects a product, they view the detailed page
   - Purchase intent is directed to WhatsApp for order processing

## Technical Constraints

- **Performance**: The site must achieve a high score on Core Web Vitals
- **Accessibility**: Must be WCAG 2.1 AA compliant
- **SEO**: Must implement best practices for search engine optimization
- **Responsive Design**: Must work on all devices from mobile to desktop
- **Browser Compatibility**: Must support modern browsers (last 2 versions)
- **Content Management**: Must be manageable by non-technical users through Notion
- **Localization**: Content must use Spanish text for the Argentinian audience (e.g., "Agotado" instead of "Esgotado")
- **Next.js 15 Compatibility**: Must follow latest Next.js 15.2.4 best practices and avoid deprecated options

## Tech Stack

### Frontend

- **Next.js 15.2.4**: React framework for hybrid rendering (SSG/SSR) 
- **React 18**: UI library
- **TypeScript**: Type safety and improved developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for UI interactions
- **next-themes**: Theme management (dark/light mode)
- **Lucide React**: Icon library

### Backend

- **Notion API**: Headless CMS and database
- **Next.js API Routes**: Serverless functions for data fetching

### Infrastructure

- **Vercel**: Hosting and deployment platform
- **GitHub**: Version control and CI/CD

## Development Tools

- **TypeScript**: Type safety and developer experience
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **Husky**: Git hooks for pre-commit checks
- **VS Code**: Recommended IDE with extensions for React, Tailwind, and ESLint

## Project Structure

```
├── pages/                  # Next.js pages and API routes
│   ├── api/                # API endpoints
│   │   ├── productos.js    # Products listing API
│   │   └── producto/[id].js # Single product API
│   ├── producto/[id].js    # Product detail page
│   ├── productos.js        # Products listing page
│   ├── index.js            # Homepage
│   ├── _app.js             # Custom App component
│   └── _document.js        # Custom Document component
├── components/             # Reusable UI components
│   ├── Navbar.tsx          # Navigation bar (TypeScript)
│   ├── Footer.tsx          # Footer component (TypeScript)
│   ├── ProductCard.tsx     # Product card component (TypeScript)
│   ├── ProductGrid.tsx     # Product grid layout (TypeScript)
│   ├── product-showcase.tsx # Product showcase component (TypeScript)
│   ├── lazy-section.tsx    # Lazy loading section component
│   ├── ClientOnly.tsx      # Client-side only rendering wrapper
│   └── ProductDetail.jsx   # Product detail component
├── tests/                  # Test utilities and mock data
│   ├── utils.ts            # Test utilities and mock data
│   └── mocks/              # Component mocks for testing
├── lib/                    # Utility functions
│   └── notion.js           # Notion API client
├── data/                   # Data and configuration
│   └── config.ts           # Site configuration
├── styles/                 # CSS and styling
│   └── globals.css         # Global styles
├── public/                 # Static assets
│   └── images/             # Image assets
├── .env.local.example      # Example environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── jest.setup.js           # Jest test configuration
└── package.json            # Project dependencies
```

### File Naming Conventions

To maintain consistency across the project:

- Use **CamelCase for component files**: `ProductCard.tsx`, `ProductGrid.tsx`
- Use **kebab-case for import paths** when referencing components: `import ComponentName from "./component-name"`
- All file references should match the actual case of the file on disk to ensure cross-platform compatibility

## Notion Database Structure

The Notion database will have the following properties:

- **Name** (Title): Product name
- **Price** (Number): Product price
- **Description** (Text): Product description
- **Images** (Files & Media): Product images
- **Category** (Select): Product category
- **InStock** (Checkbox): Whether the product is in stock
- **Size** (Select): Product size (if applicable)

## Deployment Strategy

1. **Development Environment**: Local development with hot reloading
2. **Staging Environment**: Preview deployments on Vercel for each pull request
3. **Production Environment**: Automatic deployment to Vercel on merge to main branch

## Performance Optimization Strategy

- Image optimization using Next.js Image component
- Code splitting and lazy loading
- Efficient data fetching with SWR or React Query
- Caching strategies for API responses
- Minimizing JavaScript bundle size
- Implementing Core Web Vitals best practices

## SEO Strategy

- Server-side rendering for critical pages
- Proper meta tags and structured data
- Semantic HTML
- Sitemap generation
- Canonical URLs
- Optimized images with alt text

## Monitoring and Analytics

- Vercel Analytics for performance monitoring
- Google Analytics for user behavior tracking
- Error tracking with Sentry or similar service

## Future Considerations

- User authentication and accounts
- Shopping cart functionality
- Payment gateway integration
- Order management system
- Inventory management
- Multi-language support
- Advanced filtering and sorting options

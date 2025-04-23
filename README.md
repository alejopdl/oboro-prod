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

## Project Structure

Following a hybrid Next.js structure with both App Router and Pages Router:
- `/app` - App Router pages and layouts
- `/pages` - API endpoints (Pages Router)
- `/components` - Reusable UI components
- `/lib` - Utility functions and API clients
- `/styles` - Global styles and Tailwind config
- `/public` - Static assets
- `/tests` - Test utilities and mocks
- `/docs` - Project documentation

See `docs/notion-integration.md` for details on how the Notion integration works.

## Development Guidelines

1. **Code Style**
   - Use TypeScript with strict mode
   - Follow Airbnb/Next.js ESLint rules
   - Format with Prettier
   - Write JSDoc comments for functions and components

2. **Components**
   - Keep files under 500 lines
   - Use named exports
   - Style with Tailwind CSS
   - Add Framer Motion animations

3. **Testing**
   - Write unit tests for utilities and components
   - Include integration tests for user flows
   - Place tests in mirrored `/tests` directory

4. **Performance**
   - Use Next.js Image component for images
   - Implement proper lazy loading
   - Monitor Core Web Vitals
   - Follow accessibility guidelines

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

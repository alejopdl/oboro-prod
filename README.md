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
- Product listing and filtering
- WhatsApp integration for purchases
- Responsive design
- SEO optimized

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Notion API
- Framer Motion

## Project Structure

Following the standard Next.js structure with:
- `/pages` - Routes and API endpoints
- `/components` - Reusable UI components
- `/lib` - Utility functions and API clients
- `/styles` - Global styles and Tailwind config
- `/public` - Static assets

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

## Notion Database Structure

The Notion database includes these fields:
- Name (Title)
- Price (Number)
- Description (Text)
- Images (Files & Media)
- Category (Select)
- InStock (Checkbox)
- Size (Select)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

[Add your license here]

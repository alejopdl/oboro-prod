# oBoRo Drop System

This document explains the drop system implemented in oBoRo, a feature that allows products to be released in collections ("drops") with level-based unlocking.

## What is the Drop System?

The drop system is a product release strategy that:

1. **Organizes products into collections** called "drops" (e.g., "DROP1", "MiniDROP2", "XDROP3")
2. **Groups products by levels** within each drop (e.g., Level 1, Level 2, Level 3)
3. **Controls product availability** through a level-based unlocking mechanism
4. **Provides visual indicators** for product status (available, sold out, locked)

## Key Features

### Drop Collections

- Products are grouped into named collections called "drops"
- Users can switch between drops using a selector UI
- Each drop has its own set of products organized by levels

### Level-Based Unlocking

- Products in higher levels are "locked" until lower-level products are sold out
- This creates a sequential buying experience, where users must purchase lower-level items first
- Level 1 products are always available (if in stock)
- Level 2+ products become available only when all products from previous levels are sold out

### Visual Status Indicators

- **Available**: Products that are in stock and available for purchase
  - Displayed with an inverted color scheme (dark in light mode, white in dark mode)
  - Feature a subtle glow effect with accent color borders
  - Include an unlock icon in the top-right corner
- **Sold Out**: Products that are no longer available (sold out)
  - Displayed with reduced opacity and a "Sold Out" badge
- **Locked**: Products that are not yet available for purchase (higher-level products)
  - Displayed with a lock icon overlay
  - Can't be clicked or accessed until unlocked

## How It Works

### Data Model

The drop system adds three key fields to the product data model:

1. **level** (Number): The product's level within a drop (1, 2, 3, etc.)
2. **blocked** (Boolean): Whether the product is blocked until lower levels are sold out
3. **dropId** (String): The drop collection the product belongs to (e.g., "DROP1", "MiniDROP2")

### Unlocking Logic

The unlocking logic follows these rules:

1. All Level 1 products are always unlocked (though they may be sold out)
2. For a Level 2+ product to be unlocked:
   - It must be part of the current selected drop
   - All products from lower levels in the same drop must be sold out

### UI Components

The drop system implementation includes these main UI components:

1. **DropSelector**: Buttons for selecting different product drops
2. **ProductShowcase**: Displays products grouped by level with correct visual indicators
3. **ProductCard**: Includes visual indicators with inverted color design for available products and clear indicators for locked/blocked products

## Implementation Details

### Client-Side Drop Selection

The drop selection is handled on the client-side within the ProductShowcase component:

1. The component maintains a state variable for the selected drop
2. When a user clicks a drop selector button, it filters products to show only those from the selected drop
3. Products are then grouped by level and displayed with the appropriate visual indicators

### Product Status Calculation

Product status is calculated based on several factors:

1. **Sold Out**: `!product.inStock || soldProducts[product.id]`
2. **Locked**: `!isProductUnlocked(product)`
3. **Available**: Not sold out and not locked

The `isProductUnlocked()` function checks if a product should be available based on:
- The product's level
- Whether the product is blocked
- Whether all products from lower levels are sold out

## Adding New Drops

To add a new drop to the system:

1. Add a new option to the "DropId" Select property in your Notion database
2. Assign products to the new drop by selecting the new drop ID
3. Set appropriate level numbers for products within the drop
4. Mark higher-level products as blocked (if they should follow the level-unlocking rules)

## Testing

The drop system includes comprehensive tests:

1. **Unit tests** for the DropSelector component
2. **Integration tests** for the ProductShowcase component
3. **End-to-end tests** for the drop selection and level-unlocking functionality

## Current Styling Features

1. **Inverted Color Scheme**: Product cards use an inverted color scheme to create visual interest
   - Light Mode: Dark cards with white text and accents
   - Dark Mode: White cards with dark text and accents

2. **Glow Effects**: Available products feature subtle glow effects
   - Edge highlights around the border
   - Subtle pulse animation to draw attention
   - All effects avoid affecting product image clarity

3. **Status Badges**: Clear visual indicators for product status
   - Available products feature a green badge that matches the card color scheme
   - Sold-out products display a prominent red badge

## Future Enhancements

Potential future enhancements to the drop system:

1. Server-side drop filtering for improved SEO
2. Drop-specific landing pages with custom styling
3. Countdown timers for upcoming drops
4. Email notifications for new drop releases
5. Personalized recommendations based on previous drop purchases
6. Animated transitions when products become unlocked

## Related Documentation

- [Notion CMS Guide](./notion-cms-guide.md) - For information on how to set up and manage product data in Notion
- [Notion Integration](./notion-integration.md) - For technical details on how the Notion API integration works

// Purpose: Integration test for the drop system with the actual API endpoint (not unit test)

/**
 * This file tests the actual Notion API integration with drop system fields.
 * It should only be run when you need to verify the real API integration.
 * For regular development, use the mock tests instead.
 * 
 * To run this test: npm test -- -t "Drop System Integration"
 */

// NOTE: We're skipping these tests because they require a real Notion API connection
// You can remove the ".skip" when you want to test the real integration
describe.skip('Drop System Integration (Real API)', () => {
  it('fetches products with drop system fields', async () => {
    // This test requires a real Notion connection
    // Import the function that calls the actual API endpoint
    const fetch = require('node-fetch');
    const response = await fetch('http://localhost:3000/api/notion-direct');
    const data = await response.json();
    const products = data.products;
    
    // Verify we got products
    expect(products.length).toBeGreaterThan(0);
    
    // Check for drop system fields
    const firstProduct = products[0];
    expect(firstProduct).toHaveProperty('level');
    expect(firstProduct).toHaveProperty('dropId');
    expect(firstProduct).toHaveProperty('blocked');
  });
});

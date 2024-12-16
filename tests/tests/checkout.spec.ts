import { test, expect } from '@playwright/test';

test.describe('Sauce Labs Checkout Flow', () => {
  test('should complete a successful checkout with random items', async ({ page }) => {
    // Step 1: Login
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    // Step 2: Add 3 random items to the cart
    const items = await page.$$('.inventory_item');
    const selectedIndices: number[] = [];
    while (selectedIndices.length < 3) {
      const randomIndex = Math.floor(Math.random() * items.length);
      if (!selectedIndices.includes(randomIndex)) {
        selectedIndices.push(randomIndex);
        const addToCartButton = await items[randomIndex].$('.btn_inventory');
        await addToCartButton?.click();
      }
    }

    // Step 3: Go to the cart and verify selected items
    await page.click('.shopping_cart_link');
    const cartItems = await page.$$('.cart_item');
    expect(cartItems.length).toBe(3);

    // Step 4: Proceed to checkout
    await page.click('#checkout');
    await page.fill('#first-name', 'Reshma');
    await page.fill('#last-name', 'Holennavar');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');

    // Step 5: Verify total price and complete checkout
    const totalLabel = await page.textContent('.summary_total_label');
    expect(totalLabel).toContain('Total');

    await page.click('#finish');

    // Step 6: Assert checkout completion message
    const successMessage = await page.textContent('.complete-header');
    expect(successMessage).toBe('Thank you for your order!');
  });
});

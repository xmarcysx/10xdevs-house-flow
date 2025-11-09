import { Page } from '@playwright/test';

/**
 * Helper functions for authentication in E2E tests
 */

export async function loginUser(page: Page, email: string = 'test@example.com', password: string = 'password123') {
  await page.goto('/login');

  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);

  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL('/');
}

export async function registerUser(page: Page, email: string, password: string) {
  await page.goto('/register');

  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.fill('[name="confirmPassword"]', password);

  await page.click('button[type="submit"]');

  // Wait for redirect or success message
  await page.waitForURL('/');
}

export async function logoutUser(page: Page) {
  // Click logout button (adjust selector based on actual implementation)
  await page.click('[data-testid="logout-button"]');

  // Wait for redirect to login
  await page.waitForURL('/login');
}

export async function resetPassword(page: Page, email: string) {
  await page.goto('/reset-password');

  await page.fill('[name="email"]', email);

  await page.click('button[type="submit"]');

  // Wait for success message
  await expect(page.locator('text=Link do resetowania hasła został wysłany')).toBeVisible();
}

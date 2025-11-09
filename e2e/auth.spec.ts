import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can navigate to login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveTitle(/HouseFlow/);
    await expect(page.locator('text=Zaloguj się')).toBeVisible();
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.locator('[name="password"]')).toBeVisible();
  });

  test('user can navigate to register page', async ({ page }) => {
    await page.goto('/register');

    await expect(page.locator('text=Zarejestruj się')).toBeVisible();
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.locator('[name="password"]')).toBeVisible();
    await expect(page.locator('[name="confirmPassword"]')).toBeVisible();
  });

  test('login form shows validation errors for empty fields', async ({ page }) => {
    await page.goto('/login');

    // Click submit without filling fields
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator('text=Email jest wymagany')).toBeVisible();
    await expect(page.locator('text=Hasło jest wymagane')).toBeVisible();
  });

  test('register form shows validation errors for invalid data', async ({ page }) => {
    await page.goto('/register');

    // Fill with invalid data
    await page.fill('[name="email"]', 'invalid-email');
    await page.fill('[name="password"]', '123');
    await page.fill('[name="confirmPassword"]', '456');

    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator('text=Nieprawidłowy format email')).toBeVisible();
    await expect(page.locator('text=Hasło musi mieć minimum 8 znaków')).toBeVisible();
    await expect(page.locator('text=Hasła muszą być identyczne')).toBeVisible();
  });

  test('user can navigate between login and register', async ({ page }) => {
    await page.goto('/login');

    // Click register link
    await page.click('text=Zarejestruj się');

    await expect(page).toHaveURL('/register');

    // Click back to login
    await page.click('text=Zaloguj się');

    await expect(page).toHaveURL('/login');
  });

  test('guest user can access guest page', async ({ page }) => {
    await page.goto('/guest');

    await expect(page.locator('text=Witaj w HouseFlow')).toBeVisible();
    await expect(page.locator('text=Zacznij korzystać z aplikacji')).toBeVisible();
  });
});

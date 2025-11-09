import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('homepage loads and shows main sections', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/HouseFlow/);

    // Check main navigation elements
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Wydatki')).toBeVisible();
    await expect(page.locator('text=Dochody')).toBeVisible();
    await expect(page.locator('text=Cele')).toBeVisible();
    await expect(page.locator('text=Raporty')).toBeVisible();
  });

  test('navigation menu works correctly', async ({ page }) => {
    await page.goto('/');

    // Click on different navigation items
    await page.click('text=Wydatki');
    await expect(page).toHaveURL('/expenses');

    await page.goto('/');
    await page.click('text=Dochody');
    await expect(page).toHaveURL('/incomes');

    await page.goto('/');
    await page.click('text=Cele');
    await expect(page).toHaveURL('/goals');
  });

  test('dashboard shows budget summary cards', async ({ page }) => {
    await page.goto('/');

    // Check for budget summary elements
    await expect(page.locator('text=Pozostała kwota')).toBeVisible();
    await expect(page.locator('text=Suma wydatków')).toBeVisible();
    await expect(page.locator('text=Suma dochodów')).toBeVisible();
  });

  test('dashboard shows recent transactions', async ({ page }) => {
    await page.goto('/');

    // Check for recent transactions section
    await expect(page.locator('text=Ostatnie transakcje')).toBeVisible();
  });

  test('dashboard shows goals summary', async ({ page }) => {
    await page.goto('/');

    // Check for goals section
    await expect(page.locator('text=Cele oszczędnościowe')).toBeVisible();
  });

  test('quick actions are available', async ({ page }) => {
    await page.goto('/');

    // Check for quick action buttons
    await expect(page.locator('text=Dodaj wydatek')).toBeVisible();
    await expect(page.locator('text=Dodaj dochód')).toBeVisible();
    await expect(page.locator('text=Dodaj cel')).toBeVisible();
  });

  test('category pie chart is displayed', async ({ page }) => {
    await page.goto('/');

    // Check for pie chart (may need specific data-testid)
    await expect(page.locator('[data-testid="category-chart"]')).toBeVisible();
  });

  test('trends line chart is displayed', async ({ page }) => {
    await page.goto('/');

    // Check for trends chart
    await expect(page.locator('[data-testid="trends-chart"]')).toBeVisible();
  });
});

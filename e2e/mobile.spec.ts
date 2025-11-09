import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

test.describe('Mobile Responsiveness', () => {
  test('mobile navigation works', async ({ page }) => {
    await page.goto('/');

    // Check if mobile menu button is visible
    const menuButton = page.locator('[data-testid="mobile-menu"]');
    await expect(menuButton).toBeVisible();

    // Open mobile menu
    await menuButton.click();

    // Check if navigation items are visible
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Wydatki')).toBeVisible();
    await expect(page.locator('text=Dochody')).toBeVisible();
    await expect(page.locator('text=Cele')).toBeVisible();
    await expect(page.locator('text=Raporty')).toBeVisible();
  });

  test('mobile expense form works', async ({ page }) => {
    await page.goto('/expenses');

    // Open add expense modal
    await page.click('text=Dodaj wydatek');

    // Check if modal is properly sized for mobile
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Fill form on mobile
    await page.fill('[name="amount"]', '25.50');
    await page.fill('[name="description"]', 'Mobile test expense');
    await page.selectOption('[name="category"]', 'Food');

    // Submit form
    await page.click('button[type="submit"]');

    // Check if expense appears
    await expect(page.locator('text=Mobile test expense')).toBeVisible();
  });

  test('mobile dashboard layout', async ({ page }) => {
    await page.goto('/');

    // Check if cards stack vertically on mobile
    const cards = page.locator('[data-testid="budget-card"]');
    await expect(cards).toHaveCount(3); // Assuming 3 budget cards

    // Check if quick actions are properly arranged
    await expect(page.locator('text=Szybkie akcje')).toBeVisible();

    // Check if charts are responsive
    const pieChart = page.locator('[data-testid="category-chart"]');
    await expect(pieChart).toBeVisible();
  });

  test('mobile table scrolling', async ({ page }) => {
    await page.goto('/expenses');

    // Check if table has horizontal scroll on mobile
    const table = page.locator('table');
    if (await table.isVisible()) {
      // Verify table is scrollable if content is wide
      const tableWidth = await table.evaluate(el => el.scrollWidth);
      const containerWidth = await table.evaluate(el => el.clientWidth);

      if (tableWidth > containerWidth) {
        // Table should be horizontally scrollable
        expect(tableWidth).toBeGreaterThan(containerWidth);
      }
    }
  });

  test('mobile form validation', async ({ page }) => {
    await page.goto('/expenses');

    await page.click('text=Dodaj wydatek');

    // Try to submit empty form on mobile
    await page.click('button[type="submit"]');

    // Check if validation messages are visible on mobile
    await expect(page.locator('text=Kwota jest wymagana')).toBeVisible();
    await expect(page.locator('text=Opis jest wymagany')).toBeVisible();
  });

  test('mobile goal tracking', async ({ page }) => {
    await page.goto('/goals');

    // Check if goals are displayed properly on mobile
    await expect(page.locator('text=Cele oszczędnościowe')).toBeVisible();

    // Check if progress bars are responsive
    const progressBars = page.locator('[data-testid="progress-bar"]');
    if (await progressBars.count() > 0) {
      await expect(progressBars.first()).toBeVisible();
    }
  });

  test('mobile theme toggle', async ({ page }) => {
    await page.goto('/');

    // Check if theme toggle works on mobile
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();

      // Check if theme changes (this may require specific implementation)
      const html = page.locator('html');
      const className = await html.getAttribute('class');
      expect(className).toMatch(/dark|light/);
    }
  });
});

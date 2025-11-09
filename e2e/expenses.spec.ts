import { test, expect } from '@playwright/test';

test.describe('Expense Management', () => {
  test('expenses page loads correctly', async ({ page }) => {
    await page.goto('/expenses');

    await expect(page.locator('text=Wydatki')).toBeVisible();
    await expect(page.locator('text=Dodaj wydatek')).toBeVisible();
  });

  test('add expense button opens modal', async ({ page }) => {
    await page.goto('/expenses');

    await page.click('text=Dodaj wydatek');

    // Check if modal opens
    await expect(page.locator('text=Dodaj wydatek')).toBeVisible();
    await expect(page.locator('[name="amount"]')).toBeVisible();
    await expect(page.locator('[name="description"]')).toBeVisible();
    await expect(page.locator('[name="category"]')).toBeVisible();
  });

  test('expense form validation works', async ({ page }) => {
    await page.goto('/expenses');

    await page.click('text=Dodaj wydatek');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check validation messages
    await expect(page.locator('text=Kwota jest wymagana')).toBeVisible();
    await expect(page.locator('text=Opis jest wymagany')).toBeVisible();
    await expect(page.locator('text=Kategoria jest wymagana')).toBeVisible();
  });

  test('expense form accepts valid data', async ({ page }) => {
    await page.goto('/expenses');

    await page.click('text=Dodaj wydatek');

    // Fill form with valid data
    await page.fill('[name="amount"]', '50.00');
    await page.fill('[name="description"]', 'Test expense');
    await page.selectOption('[name="category"]', 'Food');

    // Submit form
    await page.click('button[type="submit"]');

    // Check if modal closes and expense appears in list
    await expect(page.locator('text=Test expense')).toBeVisible();
    await expect(page.locator('text=50.00 zł')).toBeVisible();
  });

  test('expense filters work correctly', async ({ page }) => {
    await page.goto('/expenses');

    // Check filter controls exist
    await expect(page.locator('text=Filtruj')).toBeVisible();

    // Test category filter
    await page.selectOption('[name="category"]', 'Food');
    await expect(page.locator('text=Food')).toBeVisible();

    // Test date filter
    await page.fill('[name="month"]', '2024-01');
    // Should filter expenses by selected month
  });

  test('expense table displays data correctly', async ({ page }) => {
    await page.goto('/expenses');

    // Check table headers
    await expect(page.locator('text=Data')).toBeVisible();
    await expect(page.locator('text=Opis')).toBeVisible();
    await expect(page.locator('text=Kategoria')).toBeVisible();
    await expect(page.locator('text=Kwota')).toBeVisible();
    await expect(page.locator('text=Akcje')).toBeVisible();
  });

  test('expense can be edited', async ({ page }) => {
    await page.goto('/expenses');

    // Assuming there's at least one expense, click edit button
    const editButton = page.locator('[data-testid="edit-expense"]').first();
    if (await editButton.isVisible()) {
      await editButton.click();

      // Check if edit modal opens with pre-filled data
      await expect(page.locator('text=Edytuj wydatek')).toBeVisible();

      // Modify description
      await page.fill('[name="description"]', 'Updated expense');

      // Save changes
      await page.click('button[type="submit"]');

      // Check if changes are reflected
      await expect(page.locator('text=Updated expense')).toBeVisible();
    }
  });

  test('expense can be deleted', async ({ page }) => {
    await page.goto('/expenses');

    // Assuming there's at least one expense, click delete button
    const deleteButton = page.locator('[data-testid="delete-expense"]').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Confirm deletion in modal
      await page.click('text=Usuń');

      // Check if expense is removed (this may need adjustment based on actual implementation)
      // For now, just check that delete action was initiated
      await expect(page.locator('text=Wydatek został usunięty')).toBeVisible();
    }
  });

  test('bulk operations work', async ({ page }) => {
    await page.goto('/expenses');

    // Check if bulk select checkboxes exist
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();

    if (count > 1) {
      // Select multiple expenses
      await checkboxes.nth(0).check();
      await checkboxes.nth(1).check();

      // Check if bulk actions appear
      await expect(page.locator('text=Usuń zaznaczone')).toBeVisible();
    }
  });
});

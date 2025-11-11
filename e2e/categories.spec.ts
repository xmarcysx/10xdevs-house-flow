import { test, expect } from '@playwright/test';

/**
 * Testy zarządzania kategoriami w aplikacji HouseFlow
 */
test.describe('Zarządzanie kategoriami', () => {
  test('Powinien umożliwić dodanie nowej kategorii, wyświetlenie listy i usunięcie', async ({ page }) => {
    // Sprawdź czy zmienne środowiskowe są dostępne
    const testEmail = process.env.E2E_USERNAME;
    const testPassword = process.env.E2E_PASSWORD;

    if (!testEmail || !testPassword) {
      throw new Error('Brak wymaganych zmiennych środowiskowych E2E_USERNAME lub E2E_PASSWORD');
    }

    // 1. Zaloguj się do systemu
    await page.goto('/login');

    // Wypełnij formularz danymi testowymi
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('input[type="password"]').fill(testPassword);

    // Kliknij przycisk logowania
    await page.locator('button:has-text("Zaloguj się")').click();

    // Sprawdź czy logowanie było pomyślne
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });

    // 2. Przejdź do strony kategorii
    await page.goto('/categories');

    // Sprawdź czy jesteśmy na stronie kategorii
    await expect(page).toHaveURL(/.*categories/);

    // 3. Dodaj nową kategorię "kategoria testowa"
    // Kliknij przycisk "Dodaj kategorię"
    await page.locator('[data-test-id="add-category-button"]').click();

    // Wypełnij nazwę kategorii
    await page.locator('[data-test-id="category-name-input"]').fill('kategoria testowa');

    // Kliknij przycisk "Dodaj kategorię" w modalu
    await page.locator('[data-test-id="submit-add-category-button"]').click();

    // Poczekaj na zamknięcie modala i odświeżenie listy
    await page.waitForTimeout(2000);

    // 4. Sprawdź czy kategoria została dodana i jest widoczna na liście
    await expect(page.locator('[data-test-id="category-row-kategoria-testowa"]')).toBeVisible();

    // Sprawdź czy nazwa kategorii jest wyświetlana
    await expect(page.locator('[data-test-id="category-name-kategoria-testowa"]')).toHaveText('kategoria testowa');

    // 5. Usuń dodaną kategorię
    // Znajdź przycisk usunięcia dla kategorii "kategoria testowa"
    await page.locator('[data-test-id="delete-category-kategoria-testowa"]').click();

    // Poczekaj na usunięcie (toast powinien się pojawić)
    await page.waitForTimeout(2000);

    // 6. Sprawdź czy kategoria została usunięta
    await expect(page.locator('[data-test-id="category-row-kategoria-testowa"]')).not.toBeVisible();
  });
});

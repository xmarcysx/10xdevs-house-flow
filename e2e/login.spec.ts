import { test, expect } from '@playwright/test';

/**
 * Testy logowania do aplikacji HouseFlow
 */
test.describe('Logowanie', () => {
  test('Powinien umożliwić przejście do strony logowania', async ({ page }) => {
    // Przejdź do strony głównej aplikacji
    await page.goto('/');

    // Sprawdź czy strona się załadowała (powinna być jakaś treść)
    await expect(page).toHaveTitle(/HouseFlow/);

    // Przejdź do strony logowania
    await page.goto('/login');

    // Sprawdź czy jesteśmy na stronie logowania
    await expect(page).toHaveURL(/.*login/);

    // Sprawdź czy strona zawiera tytuł logowania
    await expect(page.locator('text=Zaloguj się')).toBeVisible();
  });

  test('Powinien zawierać formularz logowania z odpowiednimi polami', async ({ page }) => {
    // Przejdź do strony logowania
    await page.goto('/login');

    // Sprawdź czy formularz zawiera pola email i hasło
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Sprawdź czy jest przycisk logowania
    await expect(page.locator('button:has-text("Zaloguj się")')).toBeVisible();
  });

  test('Powinien umożliwić pomyślne zalogowanie się', async ({ page }) => {
    // Sprawdź czy zmienne środowiskowe są dostępne
    const testEmail = process.env.E2E_USERNAME;
    const testPassword = process.env.E2E_PASSWORD;

    if (!testEmail || !testPassword) {
      throw new Error('Brak wymaganych zmiennych środowiskowych E2E_USERNAME lub E2E_PASSWORD');
    }

    // Przejdź do strony logowania
    await page.goto('/login');

    // Wypełnij formularz danymi testowymi
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('input[type="password"]').fill(testPassword);

    // Kliknij przycisk logowania
    await page.locator('button:has-text("Zaloguj się")').click();

    // Sprawdź czy logowanie było pomyślne - powinniśmy zostać przekierowani
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });

    // Sprawdź czy URL zmienił się na dashboard lub inną stronę aplikacji
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');
  })
});

import { expect, test } from "@playwright/test";

/**
 * Testy zarządzania wpływami w aplikacji HouseFlow
 */
test.describe("Zarządzanie wpływami", () => {
  test("Powinien umożliwić dodanie nowego wpływu, wyświetlenie listy i usunięcie", async ({ page }) => {
    // Sprawdź czy zmienne środowiskowe są dostępne
    const testEmail = process.env.E2E_USERNAME;
    const testPassword = process.env.E2E_PASSWORD;

    if (!testEmail || !testPassword) {
      throw new Error("Brak wymaganych zmiennych środowiskowych E2E_USERNAME lub E2E_PASSWORD");
    }

    // 1. Zaloguj się do systemu
    await page.goto("/login");

    // Wypełnij formularz danymi testowymi
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('input[type="password"]').fill(testPassword);

    // Kliknij przycisk logowania
    await page.locator('button:has-text("Zaloguj się")').click();

    // Sprawdź czy logowanie było pomyślne
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });

    // 2. Przejdź do strony wpływów
    await page.goto("/incomes");

    // Sprawdź czy jesteśmy na stronie wpływów
    await expect(page).toHaveURL(/.*incomes/);

    // 3. Dodaj nowy wpływ
    // Kliknij przycisk "Dodaj pierwszy wpływ"
    await page.locator('button:has-text("Dodaj pierwszy wpływ")').click();

    // Wypełnij formularz danymi testowymi
    await page.locator("#amount").fill("1000");
    await page.locator("#date").fill(new Date().toISOString().split("T")[0]); // Dzisiejsza data
    await page.locator("#description").fill("wpływ testowy");
    await page.locator("#source").fill("pensja testowa");

    // Kliknij przycisk "Zapisz wpływ"
    await page.locator('button:has-text("Zapisz wpływ")').click();

    // Poczekaj na zamknięcie modala i odświeżenie listy
    await page.waitForTimeout(2000);

    // 4. Sprawdź czy wpływ został dodany i jest widoczny na liście
    // Sprawdź czy tabela zawiera wpływ z opisem "wpływ testowy"
    await expect(page.locator("text=wpływ testowy")).toBeVisible();

    // Sprawdź czy tabela zawiera źródło "pensja testowa"
    await expect(page.locator("text=pensja testowa")).toBeVisible();

    // Sprawdź czy tabela zawiera kwotę "1000,00 zł"
    await expect(page.locator("text=1000,00 zł")).toBeVisible();

    // 5. Usuń dodany wpływ
    // Znajdź wiersz zawierający "wpływ testowy" i kliknij przycisk usunięcia w tym wierszu
    const rowWithTestIncome = page.locator("tr").filter({ hasText: "wpływ testowy" });
    await rowWithTestIncome.locator('button[title="Usuń"]').click();

    // W dialogu potwierdzenia kliknij "Tak"
    await page.locator('button:has-text("Tak")').click();

    // Poczekaj na usunięcie
    await page.waitForTimeout(2000);

    // 6. Sprawdź czy wpływ został usunięty
    await expect(page.locator("text=wpływ testowy")).not.toBeVisible();
    await expect(page.locator("text=pensja testowa")).not.toBeVisible();
    await expect(page.locator("text=1000,00 zł")).not.toBeVisible();
  });
});

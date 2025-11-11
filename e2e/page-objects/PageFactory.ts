import type { Page } from "@playwright/test";
import { LoginPageObject } from "./LoginPageObject";

/**
 * Fabryka Page Object Models - centralny punkt tworzenia instancji POM
 * Zapewnia spójność i łatwe zarządzanie wszystkimi POM w testach
 */
export class PageFactory {
  private readonly page: Page;

  // Instancje POM - lazy loading
  private _loginPage?: LoginPageObject;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Instancja strony logowania
   */
  get loginPage(): LoginPageObject {
    if (!this._loginPage) {
      this._loginPage = new LoginPageObject(this.page);
    }
    return this._loginPage;
  }

  /**
   * Inicjalizacja scenariusza kategorii (automatyczne logowanie + przejście do strony kategorii)
   * Przydatne dla testów które wymagają zalogowanego użytkownika
   */
  async initializeForCategoriesScenario(): Promise<void> {
    // Przejdź do strony logowania
    await this.loginPage.goto();

    // Sprawdź czy strona się załadowała
    const isVisible = await this.loginPage.isLoginPageVisible();
    if (!isVisible) {
      throw new Error("Strona logowania nie została poprawnie załadowana");
    }

    // Zaloguj się danymi testowymi
    await this.loginPage.loginWithTestUser();

    // Poczekaj na pomyślne logowanie
    await this.loginPage.waitForLoginSuccess();

    // Możesz tutaj dodać dodatkowe kroki inicjalizacji
    // np. przejście do konkretnej strony, ustawienie stanu aplikacji itp.
  }

  /**
   * Inicjalizacja scenariusza logowania (tylko przejście do strony logowania)
   */
  async initializeForLoginScenario(): Promise<void> {
    await this.loginPage.goto();

    const isVisible = await this.loginPage.isLoginPageVisible();
    if (!isVisible) {
      throw new Error("Strona logowania nie została poprawnie załadowana");
    }
  }

  /**
   * Reset fabryki - czyszczenie wszystkich instancji POM
   * Przydatne między testami jeśli potrzebujesz świeżej instancji
   */
  reset(): void {
    this._loginPage = undefined;
  }

  /**
   * Helper do oczekiwania na globalne ładowanie strony
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Helper do oczekiwaania na konkretny URL
   */
  async waitForUrl(url: string | RegExp): Promise<void> {
    await this.page.waitForURL(url);
  }
}

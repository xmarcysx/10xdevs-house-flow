import { expect, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Page Object Model dla strony logowania
 */
export class LoginPageObject extends BasePage {
  // Selektory dla elementów formularza logowania
  private readonly emailInput = () => this.getByTestId("login-email-input");
  private readonly passwordInput = () => this.getByTestId("login-password-input");
  private readonly submitButton = () => this.getByTestId("login-submit-button");

  // Selektory dla błędów walidacji
  private readonly emailError = () => this.getByTestId("login-email-error");
  private readonly passwordError = () => this.getByTestId("login-password-error");
  private readonly apiError = () => this.getByTestId("login-api-error");

  // Linki nawigacyjne
  private readonly registerLink = () => this.page.locator('a[href="/register"]');
  private readonly forgotPasswordLink = () => this.page.locator('a[href="/reset-password"]');

  /**
   * Sprawdza czy strona logowania jest widoczna
   */
  async isLoginPageVisible(): Promise<boolean> {
    try {
      // Sprawdź czy jesteśmy na stronie logowania
      const currentUrl = this.page.url();
      if (!currentUrl.includes("/login")) {
        return false;
      }

      // Sprawdź czy element formularza istnieje i jest widoczny
      const emailInput = this.getByTestId("login-email-input");
      await emailInput.waitFor({ state: "visible", timeout: 10000 });

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wypełnia pole email
   */
  async fillEmail(email: string): Promise<void> {
    const input = this.emailInput();
    await input.fill(email);
  }

  /**
   * Wypełnia pole hasło
   */
  async fillPassword(password: string): Promise<void> {
    const input = this.passwordInput();
    await input.fill(password);
  }

  /**
   * Kliknięcie przycisku logowania
   */
  async clickLoginButton(): Promise<void> {
    const button = this.submitButton();
    await button.click();
  }

  /**
   * Sprawdza czy błąd walidacji email jest widoczny
   */
  async isEmailValidationErrorVisible(): Promise<boolean> {
    return await this.isElementVisible("login-email-error");
  }

  /**
   * Sprawdza czy błąd walidacji hasła jest widoczny
   */
  async isPasswordValidationErrorVisible(): Promise<boolean> {
    return await this.isElementVisible("login-password-error");
  }

  /**
   * Sprawdza czy błąd API jest widoczny
   */
  async isApiErrorVisible(): Promise<boolean> {
    return await this.isElementVisible("login-api-error");
  }

  /**
   * Pobiera tekst błędu API
   */
  async getApiErrorText(): Promise<string | null> {
    if (await this.isApiErrorVisible()) {
      const errorElement = this.apiError();
      return await errorElement.textContent();
    }
    return null;
  }

  /**
   * Pełny proces logowania
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Logowanie z danymi testowymi z .env.test
   */
  async loginWithTestUser(): Promise<void> {
    const testEmail = process.env.E2E_USERNAME;
    const testPassword = process.env.E2E_PASSWORD;

    if (!testEmail || !testPassword) {
      throw new Error("Brak danych testowych w zmiennych środowiskowych E2E_USERNAME lub E2E_PASSWORD");
    }

    await this.login(testEmail, testPassword);
  }

  /**
   * Oczekiwanie na pomyślne logowanie (przekierowanie do dashboardu)
   */
  async waitForLoginSuccess(): Promise<void> {
    await this.waitForUrl(/\/$|\/dashboard|\/expenses|\/incomes|\/goals|\/categories|\/reports/, 15000);
  }

  /**
   * Kliknięcie linku rejestracji
   */
  async clickRegisterLink(): Promise<void> {
    await this.registerLink().click();
  }

  /**
   * Kliknięcie linku "zapomniałeś hasła"
   */
  async clickForgotPasswordLink(): Promise<void> {
    await this.forgotPasswordLink().click();
  }

  /**
   * Sprawdza czy przycisk logowania jest dostępny
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    const button = this.submitButton();
    return await button.isEnabled();
  }

  /**
   * Sprawdza czy przycisk logowania jest w trakcie ładowania
   */
  async isLoginButtonLoading(): Promise<boolean> {
    const button = this.submitButton();
    const buttonText = await button.textContent();
    return buttonText?.includes("Logowanie...") ?? false;
  }

  /**
   * Czyści pola formularza
   */
  async clearForm(): Promise<void> {
    await this.emailInput().clear();
    await this.passwordInput().clear();
  }

  /**
   * Przechodzi do strony logowania
   */
  async goto(): Promise<void> {
    await this.page.goto("/login");
    await this.waitForPageLoad();
  }
}

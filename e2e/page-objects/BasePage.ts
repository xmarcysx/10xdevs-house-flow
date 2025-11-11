import { Locator, Page } from "@playwright/test";

/**
 * Klasa bazowa dla wszystkich Page Object Models
 * Zawiera wspólne metody i funkcjonalności
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Czeka na pełne załadowanie strony
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Czeka na pojawienie się elementu z data-test-id
   */
  async waitForElement(testId: string, timeout = 10000): Promise<Locator> {
    const element = this.page.getByTestId(testId);
    await element.waitFor({ state: "visible", timeout });
    return element;
  }

  /**
   * Pobiera element po data-test-id
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Sprawdza czy element jest widoczny
   */
  async isElementVisible(testId: string): Promise<boolean> {
    try {
      const element = this.getByTestId(testId);
      return await element.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Czeka na zniknięcie elementu
   */
  async waitForElementToDisappear(testId: string, timeout = 5000): Promise<void> {
    const element = this.getByTestId(testId);
    await element.waitFor({ state: "hidden", timeout });
  }

  /**
   * Czeka na zmianę URL
   */
  async waitForUrl(url: string | RegExp, timeout = 10000): Promise<void> {
    await this.page.waitForURL(url, { timeout });
  }

  /**
   * Pobiera aktualny URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Odświeża stronę
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Czeka na określoną ilość czasu (używane tylko gdy to konieczne)
   */
  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}

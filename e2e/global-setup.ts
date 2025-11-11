import { chromium, FullConfig } from "@playwright/test";

/**
 * Global setup dla testów Playwright
 * Wykonywany przed uruchomieniem wszystkich testów
 */
async function globalSetup(config: FullConfig) {
  console.log("🚀 Uruchamianie global setup dla testów E2E...");

  console.log("✅ Global setup zakończony pomyślnie");
}

export default globalSetup;

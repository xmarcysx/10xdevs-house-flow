import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup dla testów Playwright
 * Wykonywany przed uruchomieniem wszystkich testów
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Uruchamianie global setup dla testów E2E...');

  // Możemy tutaj dodać dodatkową konfigurację, np.:
  // - Przygotowanie bazy danych testowej
  // - Utworzenie użytkowników testowych
  // - Konfiguracja środowiska testowego

  console.log('✅ Global setup zakończony pomyślnie');
}

export default globalSetup;



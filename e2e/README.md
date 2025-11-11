# E2E Testy - Playwright

## Struktura projektu

```
e2e/
├── page-objects/           # Page Object Models
│   ├── BasePage.ts        # Klasa bazowa ze wspólnymi funkcjonalnościami
│   ├── NavbarPageObject.ts # POM dla nawigacji
│   ├── CategoriesPageObject.ts # POM dla strony kategorii
│   ├── CategoryFormModalPageObject.ts # POM dla modala formularza
│   ├── CategoryItemPageObject.ts # POM dla pojedynczego elementu kategorii
│   ├── LoginPageObject.ts # POM dla strony logowania
│   ├── PageFactory.ts     # Fabryka POM - centralny punkt tworzenia instancji
│   └── index.ts           # Eksport wszystkich POM
├── categories.spec.ts     # Testy scenariuszy kategorii
├── test-setup.ts          # Konfiguracja testów i helpery
└── README.md             # Ta dokumentacja
```

## Page Object Model (POM)

### Zasady implementacji

- **Rozdzielenie odpowiedzialności**: Każdy POM odpowiada za jeden komponent UI
- **Hermetyzacja**: Metody POM ukrywają szczegóły implementacji selektorów
- **Łatwość utrzymania**: Zmiana selektorów wymaga zmian tylko w jednym miejscu
- **Czytelność testów**: Testy opisują scenariusz biznesowy, nie szczegóły techniczne

### Korzystanie z POM

```typescript
import { PageFactory } from "./page-objects";

test("Przykład testu", async ({ page }) => {
  const pageFactory = new PageFactory(page);

  // Inicjalizacja scenariusza
  await pageFactory.initializeForCategoriesScenario();

  // Korzystanie z POM
  const modal = await pageFactory.categoriesPage.clickAddCategoryButton();
  await modal.addNewCategory("Testowa kategoria");

  // Asercje
  await expect(pageFactory.categoriesPage.categoryExists("Testowa kategoria")).toBeTruthy();
});
```

## Dostępne Page Object Models

### BasePage

Klasa bazowa zawierająca wspólne metody:

- `waitForPageLoad()` - czeka na załadowanie strony
- `waitForElement(testId)` - czeka na element
- `getByTestId(testId)` - pobiera element po data-test-id
- `isElementVisible(testId)` - sprawdza widoczność elementu

### NavbarPageObject

Metody nawigacji:

- `goToDashboard()`, `goToCategories()`, `goToExpenses()`, itp.
- `logout()` - wylogowanie użytkownika
- `isUserLoggedIn()` - sprawdzenie statusu logowania

### CategoriesPageObject

Metody strony kategorii:

- `clickAddCategoryButton()` - kliknięcie przycisku dodaj kategorię
- `categoryExists(name)` - sprawdzenie czy kategoria istnieje
- `clickEditCategory(name)` - edycja kategorii
- `clickDeleteCategory(name)` - usunięcie kategorii
- `waitForCategoryToDisappear(name)` - czekanie na zniknięcie kategorii

### CategoryFormModalPageObject

Metody modala formularza:

- `fillCategoryName(name)` - wypełnienie pola nazwy
- `clickAddCategory()` - kliknięcie "Dodaj kategorię"
- `clickSaveChanges()` - kliknięcie "Zapisz zmiany"
- `clickCancel()` - kliknięcie "Anuluj"
- `isNameValidationErrorVisible()` - sprawdzenie błędów walidacji
- `addNewCategory(name)` - skrócona metoda dodania kategorii

### CategoryItemPageObject

Metody pojedynczego elementu kategorii:

- `isVisible()` - sprawdzenie widoczności
- `getCategoryName()` - pobranie nazwy
- `clickEdit()`, `clickDelete()` - akcje na kategorii
- `isDefaultCategory()`, `isCustomCategory()` - sprawdzenie typu kategorii

### LoginPageObject

Metody strony logowania:

- `isLoginPageVisible()` - sprawdzenie widoczności strony logowania
- `fillEmail(email)`, `fillPassword(password)` - wypełnienie pól formularza
- `clickLoginButton()` - kliknięcie przycisku logowania
- `isEmailValidationErrorVisible()`, `isPasswordValidationErrorVisible()` - sprawdzenie błędów walidacji
- `isApiErrorVisible()`, `getApiErrorText()` - sprawdzenie błędów API
- `login(email, password)` - pełny proces logowania
- `loginWithTestUser()` - logowanie z danymi testowymi z .env.test
- `waitForLoginSuccess()` - oczekiwanie na pomyślne logowanie
- `clickRegisterLink()`, `clickForgotPasswordLink()` - nawigacja do innych stron

### PageFactory

Centralny punkt zarządzania POM:

- `navbar` - instancja nawigacji
- `categoriesPage` - instancja strony kategorii
- `loginPage` - instancja strony logowania
- `initializeForCategoriesScenario()` - inicjalizacja scenariusza kategorii (z automatycznym logowaniem)

## Dane testowe

Testy automatycznie używają danych logowania zdefiniowanych w pliku `.env.test`:

```env
E2E_USERNAME=tester@houseflow.pl
E2E_PASSWORD=tester
E2E_USERNAME_ID=5c61eb57-3c2c-4742-b634-1aca4a0efd7d
```

Dane te są automatycznie ładowane przez `PageFactory.initializeForCategoriesScenario()` i używane przez `LoginPageObject.loginWithTestUser()`.

## Uruchamianie testów

```bash
# Wszystkie testy
npm run test:e2e

# Tylko testy Chromium
npm run test:e2e:chromium

# Testy w trybie wizualnym
npm run test:e2e:headed

# Debugowanie testów
npm run test:e2e:debug

# Raport z testów
npm run test:e2e:report
```

## Konwencje nazewnictwa

### Selektory data-test-id

- `kebab-case` dla identyfikatorów
- Opisowe nazwy: `add-category-button`, `category-name-input`
- Dynamiczne dla elementów: `category-row-{nazwa}`, `edit-category-{nazwa}`

### Metody POM

- `isSomething()` - sprawdzenie stanu (boolean)
- `getSomething()` - pobranie wartości
- `clickSomething()` - kliknięcie elementu
- `waitForSomething()` - oczekiwanie na stan
- `fillSomething(value)` - wypełnienie pola

## Zalecenia

1. **Używaj PageFactory** zamiast bezpośredniego tworzenia instancji POM
2. **Hermetyzuj złożone operacje** w metodach POM (np. `addNewCategory()`)
3. **Używaj odpowiednich asercji** Playwright zamiast ręcznych sprawdzeń
4. **Dziel duże testy** na mniejsze, skupiające się na jednej funkcjonalności
5. **Używaj beforeEach/afterEach** do konfiguracji i czyszczenia

## Przykład pełnego scenariusza testowego

```typescript
test("Zarządzanie kategoriami - pełny przepływ", async ({ page }) => {
  const pageFactory = new PageFactory(page);
  await pageFactory.initializeForCategoriesScenario();

  const testCategory = "kategoria testowa";

  // Dodanie kategorii
  const modal = await pageFactory.categoriesPage.clickAddCategoryButton();
  await modal.addNewCategory(testCategory);

  // Weryfikacja
  await expect(pageFactory.categoriesPage.categoryExists(testCategory)).toBeTruthy();

  // Usunięcie kategorii
  await pageFactory.categoriesPage.clickDeleteCategory(testCategory);
  await expect(pageFactory.categoriesPage.categoryExists(testCategory)).toBeFalsy();
});
```

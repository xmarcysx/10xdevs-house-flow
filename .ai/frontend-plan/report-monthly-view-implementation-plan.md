# Plan implementacji widoku Raport miesięczny

## 1. Przegląd

Widok raportu miesięcznego wyświetla podsumowanie wydatków użytkownika za wybrany miesiąc. Umożliwia przeglądanie listy wszystkich wydatków wraz z sumami pogrupowanymi według kategorii. Widok zawiera również funkcję eksportu danych do formatu CSV oraz responsywny interfejs dostosowany do urządzeń mobilnych.

## 2. Routing widoku

Widok będzie dostępny pod ścieżką `/reports/monthly` jako strona Astro.

## 3. Struktura komponentów

```
MonthlyReportPage (strona Astro)
├── MonthSelector (komponent React)
├── ExpensesTable (komponent React - tabela Shadcn/ui)
├── CategorySummary (komponent React)
└── ExportButton (komponent React - przycisk Shadcn/ui)
```

## 4. Szczegóły komponentów

### MonthlyReportPage

- **Opis komponentu**: Główny komponent strony Astro, który zarządza całym widokiem raportu miesięcznego. Koordynuje ładowanie danych, obsługuje stan aplikacji i renderuje wszystkie podkomponenty.
- **Główne elementy**: Container div z tytułami sekcji, komponenty MonthSelector, ExpensesTable, CategorySummary i ExportButton. Zawiera również obsługę stanów ładowania i błędów.
- **Obsługiwane interakcje**: Ładowanie danych przy inicjalizacji komponentu i zmianie miesiąca, obsługa błędów API, zarządzanie stanem ładowania.
- **Obsługiwana walidacja**: Sprawdzenie dostępności danych raportu, walidacja formatu miesiąca przed wywołaniem API, sprawdzenie autoryzacji użytkownika.
- **Typy**: MonthlyReportDTO, ExpenseReportItemDTO[], CategoryTotalDTO[].
- **Propsy**: Brak - komponent główny strony.

### MonthSelector

- **Opis komponentu**: Komponent do wyboru miesiąca raportu. Zawiera select z opcjami miesięcy oraz logikę walidacji formatu.
- **Główne elementy**: Element select z opcjami miesięcy, label opisujący funkcjonalność komponentu.
- **Obsługiwane interakcje**: Zmiana wartości select wywołuje funkcję odświeżenia danych raportu.
- **Obsługiwana walidacja**: Format miesiąca musi być zgodny z YYYY-MM, walidacja regex przed przekazaniem do API.
- **Typy**: string (wybrany miesiąc).
- **Propsy**:
  ```typescript
  interface MonthSelectorProps {
    selectedMonth: string;
    onMonthChange: (month: string) => void;
  }
  ```

### ExpensesTable

- **Opis komponentu**: Tabela wyświetlająca listę wszystkich wydatków za wybrany miesiąc. Wykorzystuje komponenty Shadcn/ui dla responsywnego wyświetlania danych.
- **Główne elementy**: Tabela z kolumnami: Data, Kwota, Kategoria. Nagłówek tabeli i wiersze danych.
- **Obsługiwane interakcje**: Brak interaktywnych elementów - tylko wyświetlanie danych.
- **Obsługiwana walidacja**: Sprawdzenie czy array expenses nie jest pusty, wyświetlenie komunikatu gdy brak danych.
- **Typy**: ExpenseReportItemDTO[].
- **Propsy**:
  ```typescript
  interface ExpensesTableProps {
    expenses: ExpenseReportItemDTO[];
  }
  ```

### CategorySummary

- **Opis komponentu**: Komponent wyświetlający sumy wydatków pogrupowane według kategorii. Pokazuje całkowite kwoty dla każdej kategorii w wybranym miesiącu.
- **Główne elementy**: Lista lub tabela z nazwami kategorii i odpowiadającymi im sumami, opcjonalnie z procentowym udziałem w całkowitych wydatkach.
- **Obsługiwane interakcje**: Brak interaktywnych elementów - tylko wyświetlanie podsumowania.
- **Obsługiwana walidacja**: Sprawdzenie dostępności danych category_totals, wyświetlenie komunikatu gdy brak danych.
- **Typy**: CategoryTotalDTO[].
- **Propsy**:
  ```typescript
  interface CategorySummaryProps {
    categoryTotals: CategoryTotalDTO[];
  }
  ```

### ExportButton

- **Opis komponentu**: Przycisk umożliwiający eksport danych raportu do formatu CSV. Generuje plik zawierający wszystkie wydatki i sumy kategorii.
- **Główne elementy**: Przycisk Shadcn/ui z ikoną eksportu i tekstem "Eksportuj CSV".
- **Obsługiwane interakcje**: Kliknięcie przycisku wywołuje funkcję generowania i pobierania pliku CSV.
- **Obsługiwana walidacja**: Sprawdzenie czy dane raportu są dostępne przed umożliwieniem eksportu, przycisk nieaktywny gdy brak danych.
- **Typy**: MonthlyReportDTO.
- **Propsy**:
  ```typescript
  interface ExportButtonProps {
    reportData: MonthlyReportDTO;
    disabled?: boolean;
  }
  ```

## 5. Typy

Widok wykorzystuje istniejące typy zdefiniowane w `src/types.ts`:

- **MonthlyReportDTO**: Główny typ odpowiedzi API zawierający dane raportu
  - `expenses: ExpenseReportItemDTO[]` - tablica wydatków
  - `category_totals: CategoryTotalDTO[]` - tablica sum per kategoria

- **ExpenseReportItemDTO**: Typ pojedynczego wydatku w raporcie
  - `date: string` - data wydatku w formacie YYYY-MM-DD
  - `amount: number` - kwota wydatku
  - `category: string` - nazwa kategorii wydatku

- **CategoryTotalDTO**: Typ sumy wydatków dla kategorii
  - `category: string` - nazwa kategorii
  - `total: number` - całkowita suma wydatków dla kategorii

Dodatkowo dla komponentów zdefiniowane są interfejsy props:

```typescript
interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

interface ExpensesTableProps {
  expenses: ExpenseReportItemDTO[];
}

interface CategorySummaryProps {
  categoryTotals: CategoryTotalDTO[];
}

interface ExportButtonProps {
  reportData: MonthlyReportDTO;
  disabled?: boolean;
}
```

## 6. Zarządzanie stanem

Stan widoku będzie zarządzany przy pomocy customowego hooka `useMonthlyReport`. Hook będzie zawierał:

- **selectedMonth**: string - aktualnie wybrany miesiąc (domyślnie bieżący miesiąc)
- **reportData**: MonthlyReportDTO | null - dane raportu pobrane z API
- **isLoading**: boolean - flaga wskazująca ładowanie danych
- **error**: string | null - komunikat błędu lub null gdy brak błędów

Hook będzie automatycznie pobierać dane przy zmianie miesiąca oraz obsługiwać błędy API. Przykład użycia:

```typescript
const { selectedMonth, setSelectedMonth, reportData, isLoading, error } = useMonthlyReport();
```

## 7. Integracja API

Widok integruje się z endpointem `GET /api/reports/monthly/{month}`.

- **Typ żądania**: GET request z parametrem month w ścieżce URL
- **Parametry**:
  - `month` (ścieżka) - miesiąc w formacie YYYY-MM (np. "2024-01")
- **Typ odpowiedzi**: MonthlyReportDTO
- **Nagłówki**: Authorization header automatycznie dodawany przez Supabase Auth
- **Obsługa błędów**:
  - 401 Unauthorized - przekierowanie do logowania
  - Inne błędy - wyświetlenie komunikatu błędu w interfejsie

Wywołanie API będzie realizowane przez funkcję fetch w custom hooku `useMonthlyReport`.

## 8. Interakcje użytkownika

1. **Wybór miesiąca**: Użytkownik wybiera miesiąc z dropdown list w komponencie MonthSelector. Po zmianie automatycznie pobierane są nowe dane raportu i odświeżany jest widok.

2. **Eksport danych**: Użytkownik klika przycisk "Eksportuj CSV" w komponencie ExportButton. Aplikacja generuje plik CSV zawierający wszystkie wydatki i sumy kategorii, który zostaje automatycznie pobrany przez przeglądarkę.

3. **Przeglądanie danych**: Użytkownik może przeglądać tabelę wydatków oraz podsumowanie kategorii. Na urządzeniach mobilnych tabela jest responsywna z poziomym przewijaniem.

## 9. Warunki i walidacja

- **Format miesiąca**: Miesiąc musi być w formacie YYYY-MM. Walidacja wykonywana w komponencie MonthSelector przed wywołaniem API. Nieprawidłowy format powoduje wyświetlenie komunikatu błędu.

- **Autoryzacja użytkownika**: Wymagana dla dostępu do danych. Sprawdzenie wykonywane automatycznie przez Supabase Auth. Brak autoryzacji powoduje przekierowanie do strony logowania.

- **Dostępność danych**: Przed renderowaniem tabeli i podsumowania sprawdzana jest dostępność danych. Gdy dane nie są dostępne, wyświetlane są odpowiednie komunikaty.

- **Stan ładowania**: Podczas pobierania danych z API interfejs jest w stanie ładowania - przyciski nieaktywne, wyświetlany jest indicator ładowania.

## 10. Obsługa błędów

- **Błąd autoryzacji (401)**: Użytkownik zostaje przekierowany do strony logowania.
- **Nieprawidłowy format miesiąca (400)**: Wyświetlony zostaje komunikat "Nieprawidłowy format miesiąca".
- **Błąd serwera (500)**: Wyświetlony zostaje komunikat "Wystąpił błąd podczas ładowania danych. Spróbuj ponownie.".
- **Błąd sieci**: Wyświetlony zostaje komunikat "Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.".
- **Brak danych**: Gdy w wybranym miesiącu nie ma wydatków, wyświetlony zostaje komunikat "Brak wydatków w wybranym miesiącu".

Wszystkie błędy są logowane do konsoli przeglądarki dla celów diagnostycznych.

## 11. Kroki implementacji

1. **Utworzenie struktury plików**:
   - Utworzyć katalog `src/components/reports/` jeśli nie istnieje
   - Utworzyć plik strony `src/pages/reports/monthly.astro`
   - Utworzyć komponenty: `MonthSelector.tsx`, `ExpensesTable.tsx`, `CategorySummary.tsx`, `ExportButton.tsx`
   - Utworzyć hook `src/lib/hooks/useMonthlyReport.ts`

2. **Implementacja hooka useMonthlyReport**:
   - Zaimplementować zarządzanie stanem (selectedMonth, reportData, isLoading, error)
   - Dodać funkcję pobierania danych z API
   - Zaimplementować obsługę błędów i stanów ładowania
   - Dodać automatyczne ładowanie danych przy zmianie miesiąca

3. **Implementacja komponentu MonthSelector**:
   - Utworzyć select z opcjami miesięcy
   - Dodać walidację formatu miesiąca
   - Zaimplementować obsługę zmiany wartości

4. **Implementacja komponentu ExpensesTable**:
   - Wykorzystać komponenty Shadcn Table
   - Zaimplementować wyświetlanie danych w kolumnach: Data, Kwota, Kategoria
   - Dodać obsługę pustego stanu

5. **Implementacja komponentu CategorySummary**:
   - Wyświetlić listę kategorii z sumami
   - Dodać formatowanie kwot
   - Obsłużyć pusty stan

6. **Implementacja komponentu ExportButton**:
   - Utworzyć przycisk z ikoną eksportu
   - Zaimplementować funkcję generowania CSV
   - Dodać automatyczne pobieranie pliku

7. **Implementacja strony MonthlyReportPage**:
   - Utworzyć layout strony z komponentami
   - Dodać tytuł i opis sekcji
   - Zaimplementować obsługę stanów ładowania i błędów

8. **Dodanie responsywności**:
   - Dostosować tabele do urządzeń mobilnych
   - Zapewnić prawidłowe wyświetlanie na małych ekranach
   - Przetestować na różnych urządzeniach

9. **Testowanie integracji**:
   - Przetestować wywołania API z różnymi miesiącami
   - Sprawdzić obsługę błędów
   - Zweryfikować funkcjonalność eksportu CSV

10. **Optymalizacja i refaktoryzacja**:
    - Przejrzeć kod pod kątem wydajności
    - Dodać ewentualne memoizacje komponentów
    - Przeprowadzić code review zgodnie ze standardami projektu

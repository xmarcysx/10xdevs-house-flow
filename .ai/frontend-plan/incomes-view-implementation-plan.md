# Plan implementacji widoku wpływów

## 1. Przegląd

Widok wpływów umożliwia użytkownikom zarządzanie swoimi wpływami finansowymi poprzez wyświetlanie listy wpływów z możliwością filtrowania, dodawania nowych wpływów oraz edycji i usuwania istniejących. Głównym celem jest zapewnienie intuicyjnego interfejsu do śledzenia wszystkich źródeł dochodów z pełną funkcjonalnością CRUD.

## 2. Routing widoku

Widok będzie dostępny pod ścieżką `/incomes` jako strona Astro z komponentami React dla interaktywności.

## 3. Struktura komponentów

```
IncomesPage (strona Astro)
├── IncomesFilters (komponent filtrów)
├── IncomesTable (tabela z wpływami)
│   ├── IncomeRow (wiersz tabeli dla pojedynczego wpływu)
│   └── Pagination (komponent paginacji)
└── IncomeModal (modal dla dodawania/edycji)
    └── IncomeForm (formularz wpływu)
```

## 4. Szczegóły komponentów

### IncomesPage

- **Opis komponentu**: Główna strona Astro zawierająca wszystkie komponenty widoku wpływów. Odpowiada za koordynację stanu między komponentami i zarządzanie cyklem życia strony.
- **Główne elementy**: Kontener główny z sekcją filtrów, tabelą i modalem. Używa layoutu Layout.astro.
- **Obsługiwane interakcje**: Ładowanie danych przy montowaniu, obsługa zmian filtrów, otwieranie/zamykanie modala, odświeżanie danych po operacjach CRUD.
- **Obsługiwana walidacja**: Brak bezpośredniej walidacji - deleguje do podkomponentów.
- **Typy**: IncomeDTO, PaginationDTO, IncomesFiltersData, IncomesTableData.
- **Propsy**: Brak - komponent strony nie przyjmuje propsów.

### IncomesFilters

- **Opis komponentu**: Komponent zawierający kontrolki filtrowania wpływów, głównie wybór miesiąca w formacie YYYY-MM.
- **Główne elementy**: Select komponent z opcjami miesięcy, przycisk "Wyczyść filtry". Używa komponentów Shadcn/ui (Select, Button).
- **Obsługiwane interakcje**: Zmiana wybranego miesiąca, czyszczenie filtrów.
- **Obsługiwana walidacja**: Walidacja formatu miesiąca (YYYY-MM), zapewnienie że miesiąc jest w przeszłości lub teraźniejszości.
- **Typy**: IncomesFiltersData.
- **Propsy**: `filters: IncomesFiltersData`, `onFiltersChange: (filters: IncomesFiltersData) => void`.

### IncomesTable

- **Opis komponentu**: Tabela wyświetlająca listę wpływów z akcjami dla każdego wiersza. Zawiera paginację i obsługuje stan ładowania.
- **Główne elementy**: Tabela HTML z nagłówkami (Data, Kwota, Opis, Źródło, Akcje), wiersze IncomeRow, komponent Pagination. Używa komponentów Shadcn/ui (Table, Button).
- **Obsługiwane interakcje**: Sortowanie po kolumnach, zmiana strony paginacji, kliknięcia w przyciski edycji/usunięcia.
- **Obsługiwana walidacja**: Brak - wyświetla dane z API.
- **Typy**: IncomesTableData, IncomeDTO.
- **Propsy**: `data: IncomesTableData`, `onPageChange: (page: number) => void`, `onEdit: (incomeId: string) => void`, `onDelete: (incomeId: string) => void`, `isLoading: boolean`.

### IncomeRow

- **Opis komponentu**: Pojedynczy wiersz tabeli reprezentujący jeden wpływ. Wyświetla dane wpływu i przyciski akcji.
- **Główne elementy**: Komórki tabeli z sformatowanymi danymi (data, kwota w PLN, opis, źródło), przyciski "Edytuj" i "Usuń".
- **Obsługiwane interakcje**: Kliknięcia w przyciski edycji i usunięcia.
- **Obsługiwana walidacja**: Brak - komponent prezentacyjny.
- **Typy**: IncomeDTO.
- **Propsy**: `income: IncomeDTO`, `onEdit: (id: string) => void`, `onDelete: (id: string) => void`.

### Pagination

- **Opis komponentu**: Komponent paginacji umożliwiający nawigację między stronami wyników.
- **Główne elementy**: Przyciski poprzednia/następna, numery stron, informacja o zakresie wyników. Używa komponentów Shadcn/ui.
- **Obsługiwane interakcje**: Zmiana strony poprzez kliknięcie w przyciski lub numery stron.
- **Obsługiwana walidacja**: Zapewnienie że wybrana strona jest w prawidłowym zakresie (1 do totalPages).
- **Typy**: PaginationDTO.
- **Propsy**: `pagination: PaginationDTO`, `onPageChange: (page: number) => void`.

### IncomeModal

- **Opis komponentu**: Modal dialog zawierający formularz dodawania lub edycji wpływu. Obsługuje dwa tryby: dodawanie i edycja.
- **Główne elementy**: Dialog z tytułem, komponentem IncomeForm, przyciskami akcji. Używa komponentów Shadcn/ui (Dialog, Button).
- **Obsługiwane interakcje**: Otwieranie/zamykanie modala, zatwierdzanie formularza, anulowanie zmian.
- **Obsługiwana walidacja**: Deleguje walidację do IncomeForm, sprawdza czy modal jest otwarty w prawidłowym trybie.
- **Typy**: IncomeFormData, IncomeDTO (dla trybu edycji).
- **Propsy**: `isOpen: boolean`, `mode: 'add' | 'edit'`, `income?: IncomeDTO`, `onSubmit: (data: IncomeFormData) => void`, `onClose: () => void`, `isSubmitting: boolean`.

### IncomeForm

- **Opis komponentu**: Formularz do wprowadzania danych wpływu z walidacją w czasie rzeczywistym.
- **Główne elementy**: Pola formularza (kwota, data, opis, źródło) z etykietami i komunikatami błędów. Używa komponentów Shadcn/ui (Form, Input, Textarea, Button).
- **Obsługiwane interakcje**: Wprowadzanie danych, walidacja w czasie rzeczywistym, zatwierdzanie formularza.
- **Obsługiwana walidacja**:
  - Kwota: wymagana, większa od 0, maksymalnie 2 miejsca po przecinku
  - Data: wymagana, nie może być w przyszłości
  - Opis: opcjonalny, maksymalnie 500 znaków
  - Źródło: opcjonalne, maksymalnie 100 znaków
- **Typy**: IncomeFormData.
- **Propsy**: `initialData?: IncomeFormData`, `onSubmit: (data: IncomeFormData) => void`, `isSubmitting: boolean`.

## 5. Typy

### Istniejące typy (z types.ts)

- `IncomeDTO`: Reprezentuje pojedynczy wpływ z API
- `CreateIncomeCommand`: Dane do utworzenia nowego wpływu
- `UpdateIncomeCommand`: Dane do aktualizacji wpływu
- `PaginationDTO`: Metadane paginacji
- `MessageDTO`: Komunikaty z API

### Nowe typy ViewModel

#### IncomeFormData

```typescript
interface IncomeFormData {
  amount: number; // Kwota wpływu (wymagana, > 0)
  date: string; // Data wpływu w formacie YYYY-MM-DD (wymagana)
  description?: string; // Opcjonalny opis wpływu (max 500 znaków)
  source?: string; // Opcjonalne źródło wpływu (max 100 znaków)
}
```

#### IncomesFiltersData

```typescript
interface IncomesFiltersData {
  month?: string; // Miesiąc w formacie YYYY-MM (opcjonalny)
}
```

#### IncomesTableData

```typescript
interface IncomesTableData {
  incomes: IncomeDTO[]; // Lista wpływów na bieżącej stronie
  pagination: PaginationDTO; // Metadane paginacji
}
```

#### IncomesQuery

```typescript
interface IncomesQuery extends GetIncomesQuery {
  // Dziedziczy po GetIncomesQuery z types.ts
  // Dodatkowe pola specyficzne dla widoku jeśli potrzebne
}
```

## 6. Zarządzanie stanem

Stan będzie zarządzany za pomocą React hooks w komponencie IncomesPage oraz customowego hooka `useIncomesApi` dla logiki API.

Główne zmienne stanu:

- `incomesData`: IncomesTableData - dane tabeli z paginacją
- `filters`: IncomesFiltersData - aktualne filtry
- `modalState`: { isOpen: boolean, mode: 'add' | 'edit', incomeId?: string } - stan modala
- `isLoading`: boolean - stan ładowania danych
- `isSubmitting`: boolean - stan wysyłania formularza

Custom hook `useIncomesApi` będzie zawierać:

- `fetchIncomes(query: IncomesQuery)` - pobieranie listy wpływów
- `createIncome(data: IncomeFormData)` - tworzenie nowego wpływu
- `updateIncome(id: string, data: IncomeFormData)` - aktualizacja wpływu
- `deleteIncome(id: string)` - usunięcie wpływu

Hook będzie obsługiwał loading states, error handling i automatyczne odświeżanie danych po mutacjach.

## 7. Integracja API

Integracja będzie realizowana poprzez custom hook `useIncomesApi` używający fetch API do komunikacji z endpointami:

### GET /api/incomes

- **Żądanie**: `GET /api/incomes?page=${page}&limit=${limit}&month=${month}&sort=${sort}`
- **Typ żądania**: `IncomesQuery`
- **Typ odpowiedzi**: `{ data: IncomeDTO[], pagination: PaginationDTO }`
- **Użycie**: Pobieranie listy wpływów z filtrowaniem i paginacją

### POST /api/incomes

- **Żądanie**: `POST /api/incomes` z body `CreateIncomeCommand`
- **Typ odpowiedzi**: `IncomeDTO`
- **Użycie**: Tworzenie nowego wpływu

### PUT /api/incomes/{id}

- **Żądanie**: `PUT /api/incomes/{id}` z body `UpdateIncomeCommand`
- **Typ odpowiedzi**: `IncomeDTO`
- **Użycie**: Aktualizacja istniejącego wpływu

### DELETE /api/incomes/{id}

- **Żądanie**: `DELETE /api/incomes/{id}`
- **Typ odpowiedzi**: `MessageDTO`
- **Użycie**: Usunięcie wpływu

Wszystkie żądania wymagają nagłówka Authorization z JWT tokenem Supabase.

## 8. Interakcje użytkownika

1. **Filtrowanie po miesiącu**: Użytkownik wybiera miesiąc z selecta -> automatyczne odświeżenie tabeli z zastosowanym filtrem
2. **Dodanie wpływu**: Kliknięcie "Dodaj wpływ" -> otwarcie modala z pustym formularzem -> wypełnienie i zapis -> zamknięcie modala, toast sukcesu, odświeżenie tabeli
3. **Edycja wpływu**: Kliknięcie "Edytuj" w wierszu -> otwarcie modala z wypełnionym formularzem -> modyfikacja i zapis -> zamknięcie modala, toast sukcesu, odświeżenie tabeli
4. **Usunięcie wpływu**: Kliknięcie "Usuń" w wierszu -> potwierdzenie w dialogu -> usunięcie, toast sukcesu, odświeżenie tabeli
5. **Paginacja**: Kliknięcie w przyciski nawigacji -> zmiana strony, odświeżenie danych
6. **Anulowanie operacji**: Kliknięcie "Anuluj" w modalu -> zamknięcie bez zapisania zmian

## 9. Warunki i walidacja

### Warunki weryfikowane przez komponenty:

#### IncomeForm:

- **Kwota**: Wymagana, musi być > 0, maksymalnie 2 miejsca po przecinku, format numeryczny
- **Data**: Wymagana, prawidłowy format daty, nie może być w przyszłości
- **Opis**: Opcjonalny, maksymalnie 500 znaków
- **Źródło**: Opcjonalne, maksymalnie 100 znaków

#### IncomesFilters:

- **Miesiąc**: Format YYYY-MM, opcjonalny, jeśli podany to prawidłowy zakres dat

#### Pagination:

- **Strona**: Liczba całkowita >= 1, <= całkowitej liczby stron

### Wpływ na stan interfejsu:

- Błędy walidacji formularza: Wyświetlanie komunikatów błędów pod polami, blokada przycisku "Zapisz"
- Błędy API: Wyświetlanie toastów z komunikatami błędów
- Nieprawidłowe filtry: Ignorowanie lub reset do wartości domyślnych
- Brak danych: Wyświetlanie pustego stanu z komunikatem

## 10. Obsługa błędów

### Błędy API:

- **401 Unauthorized**: Przekierowanie do strony logowania, wyczyszczenie lokalnego stanu
- **404 Not Found**: Toast z informacją "Wpływ nie został znaleziony"
- **422 Unprocessable Entity**: Wyświetlanie szczegółowych błędów walidacji w formularzu
- **500 Internal Server Error**: Ogólny toast z prośbą o ponowne spróbowanie

### Błędy sieci:

- Timeout: Toast z informacją o problemach z połączeniem
- Brak internetu: Toast z informacją o utracie połączenia

### Błędy walidacji:

- Wyświetlanie błędów pod odpowiednimi polami formularza
- Blokada przycisku submit przy błędach
- Czyszczenie błędów przy poprawie danych

### Edge cases:

- Pusta lista wpływów: Wyświetlanie komunikatu "Brak wpływów do wyświetlenia"
- Usunięcie wpływu podczas edycji przez innego użytkownika: Toast z informacją o błędzie, zamknięcie modala
- Konflikt edycji: Optymistyczne aktualizacje z rollback przy błędach

## 11. Kroki implementacji

1. **Utworzenie struktury plików**: Utworzyć katalogi `src/pages/incomes.astro`, `src/components/incomes/` z plikami dla wszystkich komponentów
2. **Implementacja typów ViewModel**: Dodać nowe typy do `src/types.ts` zgodnie z opisem w sekcji 5
3. **Utworzenie hooka useIncomesApi**: Zaimplementować custom hook z wszystkimi metodami API w `src/lib/hooks/useIncomesApi.ts`
4. **Implementacja IncomeForm**: Utworzyć komponent formularza z walidacją używając react-hook-form i zod
5. **Implementacja IncomeModal**: Utworzyć modal dialog z integracją IncomeForm
6. **Implementacja IncomesFilters**: Utworzyć komponent filtrów z selectem miesiąca
7. **Implementacja IncomeRow i IncomesTable**: Utworzyć tabelę z wierszami i obsługą akcji
8. **Implementacja Pagination**: Utworzyć komponent paginacji
9. **Implementacja IncomesPage**: Połączyć wszystkie komponenty w głównej stronie z zarządzaniem stanem
10. **Dodanie routingu**: Utworzyć stronę `/incomes` w systemie routingu Astro
11. **Testowanie integracji**: Przetestować wszystkie operacje CRUD i interakcje użytkownika
12. **Dodanie loading states i error handling**: Uzupełnić obsługę stanów ładowania i błędów
13. **Optymalizacja wydajności**: Dodać memoizację komponentów i optymalizację rerenderów
14. **Testowanie responsywności**: Zapewnić prawidłowe wyświetlanie na urządzeniach mobilnych
15. **Finalne testy i refaktoring**: Przeprowadzić kompleksowe testy i poprawki kodu

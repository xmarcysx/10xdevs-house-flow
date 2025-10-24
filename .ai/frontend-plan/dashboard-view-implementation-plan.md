# Plan implementacji widoku Dashboard główny

## 1. Przegląd

Dashboard główny to centrum dowodzenia aplikacji HouseFlow, zapewniające kompleksowy przegląd budżetu miesięcznego, trendów finansowych, celów oszczędnościowych, ostatnich transakcji oraz alertów. Umożliwia użytkownikowi szybką ocenę sytuacji finansowej i podjęcie decyzji. Widok skupia się na responsywności dla urządzeń mobilnych, wykorzystuje komponenty Shadcn/ui oraz aktualizację danych przy ładowaniu strony.

## 2. Routing widoku

Widok dostępny jest na ścieżce główną aplikacji: `/`.

## 3. Struktura komponentów

Główny komponent Dashboard (strona Astro) zawiera:

- DashboardLayout: Kontener z siatką dla sekcji.
  - BudgetSummaryCard: Podsumowanie miesięczne.
  - CategoryPieChart: Wykres kołowy kategorii (lazy-loaded).
  - TrendsLineChart: Wykres liniowy trendów (lazy-loaded).
  - GoalsSummary: Podsumowanie celów (z GoalItem dla każdego celu).
  - RecentTransactions: Lista transakcji (z TransactionRow dla każdej).
  - QuickActions: Przyciski akcji (z ActionButton).

## 4. Szczegóły komponentów

### DashboardLayout

- **Opis komponentu**: Główny kontener odpowiedzialny za układ siatki responsywnej, grupujący wszystkie sekcje dashboardu. Zapewnia strukturę wizualną i obsługuje ładowanie komponentów.
- **Główne elementy HTML i komponenty dzieci**: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">` zawierający wszystkie podkomponenty jako dzieci.
- **Obsługiwane zdarzenia**: Brak bezpośrednich zdarzeń; deleguje do dzieci.
- **Warunki walidacji**: Brak specyficznych warunków; zawsze renderuje jeśli dane są dostępne.
- **Typy**: Brak własnych typów; korzysta z typów dzieci.
- **Propsy**: Brak; komponent nie przyjmuje propsów od rodzica.

### BudgetSummaryCard

- **Opis komponentu**: Karta wyświetlająca podsumowanie miesięcznego budżetu, w tym wpływy, wydatki i pozostałą kwotę. Używa komponentu Card z Shadcn/ui.
- **Główne elementy HTML i komponenty dzieci**: `<Card>`, `<CardHeader>`, `<CardContent>` z tekstem i wartościami liczbowymi.
- **Obsługiwane zdarzenia**: Brak interakcji użytkownika.
- **Warunki walidacji**: Wyświetla dane tylko jeśli `data` nie jest null; w przeciwnym razie pokazuje placeholder "Brak danych".
- **Typy**: MonthlyBudgetDTO.
- **Propsy**: `{ data: MonthlyBudgetDTO | null }`.

### CategoryPieChart

- **Opis komponentu**: Lazy-loaded wykres kołowy prezentujący procentowy podział wydatków po kategoriach. Wykorzystuje bibliotekę do wykresów (np. Chart.js lub Recharts).
- **Główne elementy HTML i komponenty dzieci**: `<PieChart>` z segmentami dla każdej kategorii, tooltip na hover.
- **Obsługiwane zdarzenia**: Hover na segmentach wykresu dla wyświetlenia tooltip z nazwą kategorii, procentem i kwotą.
- **Warunki walidacji**: Jeśli brak danych w category_breakdown, wyświetla placeholder "Brak danych do wyświetlenia".
- **Typy**: CategoryBreakdownDTO[].
- **Propsy**: `{ data: CategoryBreakdownDTO[] }`.

### TrendsLineChart

- **Opis komponentu**: Lazy-loaded wykres liniowy pokazujący trendy wpływów i wydatków w porównaniu do poprzednich miesięcy. Wymaga danych z kilku miesięcy.
- **Główne elementy HTML i komponenty dzieci**: `<LineChart>` z liniami dla wpływów i wydatków, osie X/Y.
- **Obsługiwane zdarzenia**: Hover na punktach dla tooltip; opcjonalnie zoom/scroll dla większego zakresu.
- **Warunki walidacji**: Wymaga minimum 2 miesięcy danych; jeśli mniej, wyświetla komunikat "Za mało danych dla trendów".
- **Typy**: TrendsVM[] (custom: { month: string; income: number; expenses: number; }[]).
- **Propsy**: `{ data: TrendsVM[] }`.

### GoalsSummary

- **Opis komponentu**: Sekcja wyświetlająca top 3 cele oszczędnościowe z paskami progresu. Zawiera predykcję daty osiągnięcia.
- **Główne elementy HTML i komponenty dzieci**: Lista `<GoalItem>` (do 3), każdy z `<Progress>` (Shadcn/ui), nazwą, progresem procentowym i tekstem predykcji.
- **Obsługiwane zdarzenia**: Kliknięcie na GoalItem przekierowuje do szczegółów celu (/goals/[id]).
- **Warunki walidacji**: Wyświetla maksymalnie 3 cele; jeśli mniej, pokazuje dostępne; predykcja obliczana jeśli dane dostępne.
- **Typy**: GoalDTO[] (z opcjonalną predykcją w ViewModel).
- **Propsy**: `{ goals: GoalDTO[] }`.

### RecentTransactions

- **Opis komponentu**: Mini tabela ostatnich 10 transakcji (wydatki i wpływy połączone), posortowana po dacie malejąco.
- **Główne elementy HTML i komponenty dzieci**: `<Table>` z `<TransactionRow>` dla każdej transakcji, kolumny: data, typ, kwota, kategoria/źródło.
- **Obsługiwane zdarzenia**: Kliknięcie na TransactionRow przekierowuje do szczegółów (/expenses/[id] lub /incomes/[id]).
- **Warunki walidacji**: Łączy expenses i incomes w jedną listę TransactionVM; limit 10; sort po dacie.
- **Typy**: TransactionVM[] (custom: union ExpenseDTO i IncomeDTO z type).
- **Propsy**: `{ transactions: TransactionVM[] }`.

### QuickActions

- **Opis komponentu**: Przyciski do szybkiego dostępu do dodania wydatku, wpływu lub celu.
- **Główne elementy HTML i komponenty dzieci**: Trzy `<ActionButton>` (Shadcn/ui Button) z ikonami i tekstem.
- **Obsługiwane zdarzenia**: Kliknięcie przycisku przekierowuje do formularzy (/expenses/new, /incomes/new, /goals/new).
- **Warunki walidacji**: Brak; przyciski zawsze dostępne.
- **Typy**: Brak.
- **Propsy**: Brak.

## 5. Typy

Wymagane typy oparte na src/types.ts:

- **DTO**: MonthlyBudgetDTO, GoalDTO, ExpenseDTO, IncomeDTO, PaginationDTO.
- **ViewModel**:
  - **TransactionVM**: { id: string; type: 'expense' | 'income'; amount: number; date: string; description?: string; category_name?: string; source?: string; created_at: string; } - połączenie ExpenseDTO i IncomeDTO dla listy transakcji.
  - **AlertVM**: { id: string; type: 'warning' | 'info'; message: string; dismissible: boolean; } - dla alertów generowanych klient-side.
  - **TrendsVM**: { month: string; income: number; expenses: number; remaining: number; }[] - dla wykresu liniowego, wymaga dodatkowych obliczeń lub fetch kilku miesięcy.

## 6. Zarządzanie stanem

Stan zarządzany w głównym komponencie Dashboard za pomocą useState:

- `budgetData: MonthlyBudgetDTO | null`
- `goalsData: GoalDTO[]`
- `transactions: TransactionVM[]`
- `alerts: AlertVM[]`
- `loading: boolean`
- `error: string | null`
  Customowy hook `useDashboardData()` obsługuje fetch wszystkich danych przy mount, ustawia loading/error i oblicza alerts/transactions na podstawie odpowiedzi API.

## 7. Integracja API

Integracja poprzez fetch w useDashboardData():

- GET /api/budget/monthly?month=currentMonth (currentMonth: new Date().toISOString().slice(0,7)) -> MonthlyBudgetDTO
- GET /api/goals?page=1&limit=3&sort=created_at DESC -> { data: GoalDTO[], pagination: PaginationDTO }
- GET /api/expenses?page=1&limit=10&sort=date DESC -> { data: ExpenseDTO[], pagination: PaginationDTO }
- GET /api/incomes?page=1&limit=10&sort=date DESC -> { data: IncomeDTO[], pagination: PaginationDTO }
  Odpowiedzi mapowane na ViewModel (np. merge expenses/incomes do transactions). Obsługa błędów: 401 -> redirect, inne -> error state.

## 8. Interakcje użytkownika

- Ładowanie strony: Wyświetlanie loading spinner podczas fetch.
- Hover na wykresach: Tooltip z detalami.
- Kliknięcie na cel/tranzakcję: Przekierowanie do szczegółów.
- Kliknięcie przycisków akcji: Przekierowanie do formularzy.
- Dismiss alert: Usunięcie z listy alertów.

## 9. Warunki i walidacja

- Miesiąc: Zawsze bieżący (YYYY-MM), walidacja formatu przed fetch.
- Limit/sort: Domyślne wartości, bez dodatkowej walidacji klient-side.
- Dane: Sprawdzanie obecności przed renderowaniem (np. placeholder dla brak danych).
- Alerty: Generowane jeśli remaining < 0 lub zbliżający się koniec miesiąca.

## 10. Obsługa błędów

- Błędy API: Wyświetlanie toast z komunikatem błędu; dla 401 przekierowanie do logowania.
- Brak danych: Placeholder w komponentach.
- Błędy parsowania: Fallback do pustych danych.
- Network errors: Retry button w UI.

## 11. Kroki implementacji

1. Utwórz plik `src/pages/index.astro` jako główną stronę dashboardu.
2. Zaimplementuj komponenty w `src/components/` (DashboardLayout, BudgetSummaryCard itp.) używając React i Shadcn/ui.
3. Dodaj custom hook `useDashboardData` w `src/lib/hooks/useDashboardData.ts` dla zarządzania stanem i API calls.
4. Zintegruj lazy-loading dla wykresów za pomocą dynamic import.
5. Dodaj routing dla przekierowań (użyj navigate z Astro lub React Router jeśli potrzebne).
6. Przetestuj responsywność z Tailwind classes.
7. Dodaj obsługę błędów i loading states.
8. Przeprowadź testy integracyjne z prawdziwymi endpointami.
9. Optymalizuj wydajność (np. memo dla komponentów).
10. Zaktualizuj dokumentację jeśli potrzebne.

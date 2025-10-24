# Plan implementacji widoku celów oszczędnościowych

## 1. Przegląd

Widok celów oszczędnościowych to strona umożliwiająca użytkownikom przeglądanie, tworzenie, edycję i usuwanie celów oszczędnościowych. Głównym celem jest wyświetlenie listy celów z wizualnym przedstawieniem progresu, procentem ukończenia, pozostałą kwotą oraz predykcją daty osiągnięcia. Widok zawiera paginację, sortowanie oraz modalne formularze dla operacji CRUD.

## 2. Routing widoku

Widok będzie dostępny pod ścieżką `/goals` jako strona Astro. Wymaga uwierzytelnienia użytkownika.

## 3. Struktura komponentów

```
GoalsPage (strona Astro)
├── GoalsList (kontener z paginacją i przyciskiem "Dodaj")
│   ├── GoalCard (karta pojedynczego celu)
│   │   ├── ProgressBar (pasek progresu)
│   │   ├── PredictionBadge (predykcja daty)
│   │   └── ActionButtons (przyciski edytuj/usuń)
│   └── PaginationControls (kontrolki paginacji)
└── GoalForm (modalny formularz dla dodania/edycji)
    ├── FormFields (pola nazwa i kwota)
    └── FormActions (przyciski zapisz/anuluj)
```

## 4. Szczegóły komponentów

### GoalsPage

- **Opis komponentu**: Główna strona Astro zawierająca layout, tytuł oraz kontener z listą celów. Zarządza globalnym stanem widoku.
- **Główne elementy**: Layout Astro, tytuł strony, kontener GoalsList, przycisk "Dodaj nowy cel"
- **Obsługiwane zdarzenia**: onAddGoal (otwiera modal), onEditGoal (otwiera modal z danymi), onDeleteGoal (potwierdzenie usunięcia)
- **Warunki walidacji**: Brak bezpośredniej walidacji - deleguje do podkomponentów
- **Typy**: GoalsListViewModel, GoalFormData
- **Propsy**: Brak (strona główna)

### GoalsList

- **Opis komponentu**: Kontener wyświetlający listę celów z kontrolkami paginacji i sortowania. Obsługuje ładowanie danych i akcje użytkownika.
- **Główne elementy**: Lista GoalCard, PaginationControls, przycisk "Dodaj cel", kontrolki sortowania
- **Obsługiwane zdarzenia**: onPageChange, onSortChange, onAddClick, onEditClick, onDeleteClick
- **Warunki walidacji**: Brak - walidacja na poziomie API
- **Typy**: GoalsListViewModel, PaginationDTO
- **Propsy**: goals: GoalViewModel[], pagination: PaginationDTO, onAction: (action: string, goal?: GoalViewModel) => void

### GoalCard

- **Opis komponentu**: Karta wyświetlająca pojedynczy cel z paskiem progresu, informacjami i przyciskami akcji.
- **Główne elementy**: Tytuł celu, kwota docelowa, kwota aktualna, ProgressBar, PredictionBadge, ActionButtons
- **Obsługiwane zdarzenia**: onEdit, onDelete
- **Warunki walidacji**: Brak - wyświetla dane z API
- **Typy**: GoalViewModel
- **Propsy**: goal: GoalViewModel, onEdit: (goal: GoalViewModel) => void, onDelete: (goalId: string) => void

### GoalForm

- **Opis komponentu**: Modalny formularz do tworzenia i edycji celów. Zawiera walidację pól i obsługę submit.
- **Główne elementy**: Modal Shadcn/ui, pola formularza (nazwa, kwota docelowa), przyciski akcji, komunikaty błędów
- **Obsługiwane zdarzenia**: onSubmit, onCancel, onFieldChange
- **Warunki walidacji**: name - wymagane, niepuste; target_amount - wymagane, liczba > 0
- **Typy**: GoalFormData, GoalFormErrors, CreateGoalCommand, UpdateGoalCommand
- **Propsy**: goal?: GoalViewModel (dla edycji), onSubmit: (data: GoalFormData) => Promise<void>, onCancel: () => void

### ProgressBar

- **Opis komponentu**: Wizualny pasek progresu pokazujący procent ukończenia celu.
- **Główne elementy**: Kontener z paskiem postępu, etykieta procentowa
- **Obsługiwane zdarzenia**: Brak
- **Warunki walidacji**: progress_percentage między 0-100
- **Typy**: Brak własnych typów
- **Propsy**: progress: number (0-100), className?: string

### PredictionBadge

- **Opis komponentu**: Komponent wyświetlający predykcję daty osiągnięcia celu.
- **Główne elementy**: Ikona, tekst z datą, tooltip z wyjaśnieniem kalkulacji
- **Obsługiwane zdarzenia**: onHover (tooltip)
- **Warunki walidacji**: predicted_date opcjonalne, prawidłowy format daty
- **Typy**: Brak własnych typów
- **Propsy**: predictedDate?: string, className?: string

## 5. Typy

### Istniejące typy z types.ts:

- `GoalDTO`: { id: string, name: string, target_amount: number, current_amount: number, created_at: string }
- `CreateGoalCommand`: { name: string, target_amount: number }
- `UpdateGoalCommand`: { name?: string, target_amount?: number }
- `PaginationDTO`: { page: number, limit: number, total: number }

### Nowe typy ViewModel:

```typescript
interface GoalViewModel extends GoalDTO {
  progress_percentage: number; // (current_amount / target_amount) * 100
  remaining_amount: number; // target_amount - current_amount
  predicted_completion_date?: string; // Data w formacie ISO, opcjonalna
}

interface GoalsListViewModel {
  goals: GoalViewModel[];
  pagination: PaginationDTO;
}

interface GoalFormData {
  name: string;
  target_amount: number;
}

interface GoalFormErrors {
  name?: string;
  target_amount?: string;
}

interface GoalsQueryParams {
  page?: number;
  limit?: number;
  sort?: "created_at ASC" | "created_at DESC" | "name ASC" | "name DESC" | "target_amount ASC" | "target_amount DESC";
}
```

## 6. Zarządzanie stanem

Widok wykorzystuje dwa główne customowe hooki:

### useGoals Hook:

- **Cel**: Zarządzanie stanem listy celów, paginacji i akcji CRUD
- **Stan**: goals: GoalViewModel[], pagination: PaginationDTO, loading: boolean, error: string | null
- **Metody**: fetchGoals(params), createGoal(data), updateGoal(id, data), deleteGoal(id)
- **Użycie**: W GoalsList do ładowania i aktualizacji danych

### useGoalForm Hook:

- **Cel**: Zarządzanie stanem modalnego formularza
- **Stan**: data: GoalFormData, errors: GoalFormErrors, isSubmitting: boolean, isOpen: boolean
- **Metody**: openForCreate(), openForEdit(goal), handleSubmit(), handleCancel(), validate()
- **Użycie**: W GoalForm do obsługi tworzenia/edycji

Stan globalny nie jest potrzebny - wszystkie dane są lokalne dla komponentów.

## 7. Integracja API

Integracja wykorzystuje istniejące endpointy z typami z types.ts:

- **GET /api/goals**: fetchGoals(query: GoalsQueryParams) → GoalsListViewModel
- **POST /api/goals**: createGoal(command: CreateGoalCommand) → GoalDTO
- **PUT /api/goals/{id}**: updateGoal(id: string, command: UpdateGoalCommand) → GoalDTO
- **DELETE /api/goals/{id}**: deleteGoal(id: string) → MessageDTO

Wszystkie wywołania wymagają nagłówka Authorization z JWT tokenem. Odpowiedzi są mapowane na ViewModel z obliczeniami po stronie klienta.

## 8. Interakcje użytkownika

1. **Przeglądanie celów**: Lista celów z paginacją (10 elementów na stronę), sortowanie po dacie utworzenia/rosnąco/malejąco
2. **Dodanie celu**: Kliknięcie "Dodaj cel" → otwarcie modala → wypełnienie formularza → zapis → zamknięcie modala → odświeżenie listy
3. **Edycja celu**: Kliknięcie "Edytuj" w karcie → otwarcie modala z wypełnionymi danymi → modyfikacja → zapis → zamknięcie modala → odświeżenie karty
4. **Usunięcie celu**: Kliknięcie "Usuń" → potwierdzenie w dialogu → usunięcie → usunięcie z listy
5. **Nawigacja**: Przyciski poprzednia/następna strona, zmiana limitu wyników

## 9. Warunki i walidacja

### Walidacja pól formularza (GoalForm):

- **name**: wymagane, niepuste, maksymalnie 255 znaków
- **target_amount**: wymagane, liczba > 0, maksymalnie 999999.99

### Walidacja API (422 Unprocessable Entity):

- name: unikalne dla użytkownika
- target_amount: musi być większe od 0

### Warunki wyświetlania:

- ProgressBar: widoczny tylko gdy current_amount > 0
- PredictionBadge: widoczny tylko gdy predicted_completion_date istnieje
- Przyciski akcji: dostępne tylko dla właściciela celu

## 10. Obsługa błędów

- **401 Unauthorized**: Przekierowanie do strony logowania
- **404 Not Found**: Toast "Cel nie został znaleziony"
- **422 Unprocessable Entity**: Wyświetlanie błędów walidacji w formularzu
- **Błędy sieciowe**: Toast z komunikatem "Błąd połączenia - spróbuj ponownie"
- **Błędy formularza**: Walidacja po stronie klienta przed wysłaniem
- **Potwierdzenie usunięcia**: Modal potwierdzenia przed DELETE

## 11. Kroki implementacji

1. Utworzyć plik `src/pages/goals.astro` z podstawowym layoutem strony
2. Zaimplementować hook `useGoals` w `src/lib/hooks/useGoals.ts`
3. Utworzyć komponenty `GoalsList` i `GoalCard` w `src/components/goals/`
4. Zaimplementować `ProgressBar` i `PredictionBadge` jako komponenty UI
5. Utworzyć hook `useGoalForm` i komponent `GoalForm`
6. Dodać typy ViewModel do `src/types.ts`
7. Zaimplementować kalkulację progresu i predykcji w utility functions
8. Przetestować integrację z API i obsłużyć wszystkie scenariusze błędów
9. Dodać responsywność i optymalizację wydajności
10. Przeprowadzić testy manualne wszystkich interakcji użytkownika

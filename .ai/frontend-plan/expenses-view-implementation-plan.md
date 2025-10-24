# Plan implementacji widoku listy wydatków

## 1. Przegląd

Widok listy wydatków umożliwia użytkownikom przeglądanie, filtrowanie, dodawanie, edycję i usuwanie wydatków finansowych. Jest to kluczowy komponent aplikacji HouseFlow, skupiający się na prostocie i responsywności, zgodny z wymaganiami MVP. Widok integruje się z API expenses i categories, oferując paginowaną listę z opcjami filtrowania po miesiącu i kategorii.

## 2. Routing widoku

Widok powinien być dostępny pod ścieżką `/expenses`. Będzie to strona Astro z komponentem React jako głównym widokiem, wykorzystującym layout aplikacji.

## 3. Struktura komponentów

- **ExpensesPage**: Główny komponent strony, zawierający layout i zarządzający stanem globalnym widoku.
  - **FilterControls**: Komponent filtrów z selektorami miesiąca i kategorii.
  - **ExpensesList**: Tabela z listą wydatków, przyciskami akcji i paginacją.
    - **ExpenseTable**: Tabela Shadcn/ui wyświetlająca dane wydatków.
    - **ExpenseRow**: Wiersz tabeli z przyciskami edycji/usunięcia.
    - **PaginationControls**: Komponent paginacji Shadcn/ui.
  - **ExpenseForm**: Modal z formularzem dla dodania/edycji wydatku.
  - **DeleteConfirmationDialog**: Modal potwierdzający usunięcie wydatku.

## 4. Szczegóły komponentów

### ExpensesPage

- **Opis komponentu**: Główny kontener widoku, zarządza stanem aplikacji, integruje API i renderuje podkomponenty. Jego przeznaczeniem jest koordynacja między filtrami, listą a modalami.
- **Główne elementy**: Container div z FilterControls, ExpensesList, ExpenseForm (jako Portal) i DeleteConfirmationDialog.
- **Obsługiwane interakcje**: Otwarcie formularza dodania, otwarcie formularza edycji, otwarcie dialogu usunięcia, odświeżenie listy po zmianach.
- **Obsługiwana walidacja**: Brak bezpośredniej walidacji; deleguje do ExpenseForm.
- **Typy**: ExpenseDTO, CategoryDTO, GetExpensesQuery, MessageDTO.
- **Propsy**: Brak (główny komponent strony).

### FilterControls

- **Opis komponentu**: Komponent zawierający kontrolki filtrowania listy wydatków. Umożliwia wybór miesiąca i kategorii, aktualizując stan filtra.
- **Główne elementy**: Dwa selektory (Select Shadcn/ui) dla miesiąca i kategorii, przycisk "Wyczyść filtry".
- **Obsługiwane interakcje**: Zmiana wartości selektorów, kliknięcie "Wyczyść".
- **Obsługiwana walidacja**: Brak (filtry są opcjonalne).
- **Typy**: CategoryDTO (dla opcji kategorii), string (dla miesiąca).
- **Propsy**: categories: CategoryDTO[], currentMonth: string?, currentCategoryId: string?, onFilterChange: (month?: string, categoryId?: string) => void.

### ExpensesList

- **Opis komponentu**: Wyświetla tabelę wydatków z paginacją i przyciskami akcji. Zarządza ładowaniem danych i interakcjami użytkownika.
- **Główne elementy**: Przycisk "Dodaj wydatek", tabela ExpenseTable, PaginationControls.
- **Obsługiwane interakcje**: Kliknięcie "Dodaj", edycja/usunięcie wiersza, zmiana strony paginacji.
- **Obsługiwana walidacja**: Brak.
- **Typy**: ExpenseDTO[], PaginationDTO, GetExpensesQuery.
- **Propsy**: expenses: ExpenseDTO[], pagination: PaginationDTO, loading: boolean, onAdd: () => void, onEdit: (expense: ExpenseDTO) => void, onDelete: (id: string) => void, onPageChange: (page: number) => void.

### ExpenseForm

- **Opis komponentu**: Modal z formularzem do dodania lub edycji wydatku. Zawiera pola kwota, data, kategoria, opis z walidacją.
- **Główne elementy**: Form Shadcn/ui z polami Input, DatePicker, Select, Textarea, przyciski "Zapisz" i "Anuluj".
- **Obsługiwane interakcje**: Submit formularza, anulowanie, zmiana pól.
- **Obsługiwana walidacja**: Kwota > 0 (wymagana, number), data prawidłowa i nie w przyszłości, kategoria wymagana (UUID istniejący), opis opcjonalny (max 1000 znaków).
- **Typy**: CreateExpenseCommand | UpdateExpenseCommand, CategoryDTO[], ExpenseDTO (dla edycji).
- **Propsy**: isOpen: boolean, mode: 'add' | 'edit', expense?: ExpenseDTO, categories: CategoryDTO[], onSave: (data: CreateExpenseCommand | UpdateExpenseCommand) => void, onCancel: () => void, loading: boolean.

### DeleteConfirmationDialog

- **Opis komponentu**: Modal potwierdzający usunięcie wydatku. Wyświetla komunikat i przyciski potwierdzenia.
- **Główne elementy**: Dialog Shadcn/ui z tekstem potwierdzenia, przyciski "Usuń" i "Anuluj".
- **Obsługiwane interakcje**: Potwierdzenie usunięcia, anulowanie.
- **Obsługiwana walidacja**: Brak.
- **Typy**: MessageDTO (dla odpowiedzi).
- **Propsy**: isOpen: boolean, onConfirm: () => void, onCancel: () => void, loading: boolean.

## 5. Typy

- **ExpenseDTO**: Istniejący typ z polami id (string), amount (number), date (string), description (string?), category_id (string), created_at (string), category_name (string).
- **CreateExpenseCommand**: Istniejący typ z polami amount (number), date (string), description (string?), category_id (string).
- **UpdateExpenseCommand**: Istniejący typ, partial CreateExpenseCommand.
- **CategoryDTO**: Istniejący typ z polami id (string), name (string), is_default (boolean), created_at (string).
- **GetExpensesQuery**: Istniejący typ z polami page (number), limit (number), month (string?), category_id (string?), sort (string).
- **PaginationDTO**: Istniejący typ z polami page (number), limit (number), total (number).
- **MessageDTO**: Istniejący typ z polem message (string).
- **ExpenseFormViewModel**: Nowy typ dla stanu formularza, zawierający fields: { amount: number, date: string, description: string, category_id: string }, errors: { amount?: string, date?: string, description?: string, category_id?: string }.

## 6. Zarządzanie stanem

Stan widoku będzie zarządzany za pomocą customowych hooków React. Główny hook `useExpenses` będzie obsługiwał listę wydatków, filtry, paginację i wywołania API. Hook `useExpenseForm` zarządza stanem formularza, walidacją i submit. Hook `useCategories` pobiera i cache'uje listę kategorii. Stan zostanie zsynchronizowany z API przy każdej zmianie filtra lub akcji użytkownika, z obsługą loading states i błędów.

## 7. Integracja API

Integracja wykorzystuje Supabase SDK poprzez context.locals.supabase.

- GET /api/expenses: Zapytanie z parametrami GetExpensesQuery, odpowiedź z { data: ExpenseDTO[], pagination: PaginationDTO }.
- POST /api/expenses: Żądanie z CreateExpenseCommand, odpowiedź ExpenseDTO (201).
- PUT /api/expenses/{id}: Żądanie z UpdateExpenseCommand, odpowiedź ExpenseDTO (200).
- DELETE /api/expenses/{id}: Żądanie bez ciała, odpowiedź MessageDTO (200).
- GET /api/categories: Żądanie bez parametrów, odpowiedź CategoryDTO[] (200).
  Wszystkie wywołania wymagają autoryzacji JWT.

## 8. Interakcje użytkownika

- Filtrowanie: Wybór miesiąca/kategorii aktualizuje listę natychmiast.
- Paginacja: Zmiana strony przeładowuje dane.
- Dodanie: Otwiera modal, po zapisie toast sukcesu i odświeżenie listy.
- Edycja: Otwiera modal z danymi, po zapisie toast i odświeżenie.
- Usunięcie: Otwiera dialog potwierdzenia, po usunięciu toast i odświeżenie.
- Walidacja formularza: Błędy wyświetlane pod polami, przycisk zapisz disabled przy błędach.

## 9. Warunki i walidacja

- Kwota: > 0, wymagana, number - walidacja w ExpenseForm, błąd jeśli nieprawidłowa.
- Data: Wymagana, prawidłowy format date, nie w przyszłości - walidacja w ExpenseForm.
- Kategoria: Wymagana, istniejący UUID z listy - walidacja w ExpenseForm poprzez sprawdzenie z API.
- Opis: Opcjonalny, max 1000 znaków - walidacja długości w ExpenseForm.
  Warunki wpływają na enabled przycisków submit i wyświetlanie błędów.

## 10. Obsługa błędów

Błędy API (401, 404, 422) wyświetlane jako toasty z komunikatami. Błędy sieciowe obsługiwane przez retry lub komunikat ogólny. Walidacja po stronie klienta zapobiega większości błędów 422. Edge cases jak brak kategorii obsługiwane przez sprawdzenie dostępności.

## 11. Kroki implementacji

1. Utworzyć komponenty podstawowe: ExpensesPage, FilterControls, ExpensesList, ExpenseForm, DeleteConfirmationDialog.
2. Zaimplementować hooki: useExpenses, useExpenseForm, useCategories.
3. Dodać integrację API z obsługą błędów i loading states.
4. Zaimplementować walidację formularza z warunkami z sekcji 9.
5. Dodać interakcje użytkownika: modali, toasty, odświeżanie listy.
6. Przetestować responsywność i integrację z API.
7. Dodać testy jednostkowe dla komponentów i hooków.
8. Przeprowadzić code review i optymalizację wydajności.

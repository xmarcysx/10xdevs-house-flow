# Plan implementacji widoku listy kategorii

## 1. Przegląd

Widok listy kategorii pozwala użytkownikom na przeglądanie, dodawanie, edycję i usuwanie własnych kategorii wydatków. Domyślne kategorie są wyświetlane, ale nieedytowalne. Widok wykorzystuje komponenty Shadcn/ui dla listy, przycisków i modalnych formularzy, zapewniając responsywność na urządzeniach mobilnych zgodnie z wymaganiami aplikacji HouseFlow.

## 2. Routing widoku

Widok dostępny pod ścieżką `/categories`. Strona powinna być chroniona autoryzacją, wymaga logowania użytkownika.

## 3. Struktura komponentów

- **CategoriesPage**: Główny komponent strony, zarządza stanem listy kategorii i modala.
  - **CategoriesList**: Wyświetla listę kategorii z paginacją.
    - **CategoryItem**: Pojedynczy element listy kategorii.
  - **PaginationControls**: Kontrolki paginacji (jeśli potrzebne).
  - **CategoryFormModal**: Modal dla dodania lub edycji kategorii.

## 4. Szczegóły komponentów

### CategoriesPage

- **Opis komponentu**: Główna strona widoku kategorii, zawiera listę i modal. Zarządza ładowaniem danych, obsługą akcji i komunikacją z API.
- **Główne elementy**: Kontener div, tytuł strony, przycisk "Dodaj kategorię", komponenty CategoriesList, CategoryFormModal, opcjonalnie PaginationControls.
- **Obsługiwane interakcje**: Ładowanie strony (fetch danych), kliknięcie "Dodaj kategorię" (otwórz modal create), obsługa submit/edycja/usunięcie z modala (wywołaj API, odśwież listę).
- **Obsługiwana walidacja**: Brak bezpośredniej walidacji; deleguje do CategoryFormModal.
- **Typy**: CategoriesListViewModel (lista kategorii i paginacja), CategoryFormViewModel (stan modala).
- **Propsy**: Brak (komponent główny).

### CategoriesList

- **Opis komponentu**: Wyświetla paginowaną listę kategorii w formie tabeli lub listy kart. Zawiera przyciski akcji tylko dla własnych kategorii.
- **Główne elementy**: Tabela lub lista z wierszami CategoryItem, przyciski paginacji.
- **Obsługiwane interakcje**: Kliknięcie przycisków edycji/usunięcia (otwórz modal lub wywołaj usunięcie), zmiana strony (fetch nowa strona).
- **Obsługiwana walidacja**: Brak; walidacja akcji w API.
- **Typy**: CategoryDTO[] dla listy, PaginationDTO dla paginacji.
- **Propsy**: categories: CategoryDTO[], pagination: PaginationDTO, onEdit: (category: CategoryDTO) => void, onDelete: (id: string) => void, onPageChange: (page: number) => void.

### CategoryItem

- **Opis komponentu**: Pojedynczy element listy kategorii, wyświetla nazwę, status domyślny i przyciski akcji (tylko jeśli nie domyślna).
- **Główne elementy**: Span dla nazwy, badge dla statusu domyślnego, przyciski Edit/Delete.
- **Obsługiwane interakcje**: Kliknięcie Edit (wywołaj onEdit), kliknięcie Delete (potwierdzenie opcjonalne, wywołaj onDelete).
- **Obsługiwana walidacja**: Przyciski ukryte jeśli is_default === true.
- **Typy**: CategoryDTO.
- **Propsy**: category: CategoryDTO, onEdit: (category: CategoryDTO) => void, onDelete: (id: string) => void.

### CategoryFormModal

- **Opis komponentu**: Modal z formularzem dla dodania lub edycji kategorii. Zawiera pole tekstowe dla nazwy, walidację i przyciski akcji.
- **Główne elementy**: Modal Shadcn/ui, Form z Input dla nazwy, Button submit/cancel, Toast dla błędów/sukcesów.
- **Obsługiwane interakcje**: Submit formularza (walidacja, wywołaj API), kliknięcie cancel (zamknij modal), zmiana inputu (walidacja w czasie rzeczywistym).
- **Obsługiwana walidacja**: Nazwa niepusta (1-100 znaków), unikalna per użytkownik (sprawdzenie po stronie serwera). Błędy wyświetlane w toaście lub przy polu.
- **Typy**: CategoryFormViewModel (stan formularza), CreateCategoryCommand/UpdateCategoryCommand dla API.
- **Propsy**: isOpen: boolean, mode: 'create'|'edit', category?: CategoryDTO, onSubmit: (data: {name: string}) => void, onClose: () => void.

### PaginationControls

- **Opis komponentu**: Kontrolki nawigacji po stronach listy kategorii.
- **Główne elementy**: Przyciski poprzednia/następna, numery stron.
- **Obsługiwane interakcje**: Kliknięcie strony (wywołaj onPageChange).
- **Obsługiwana walidacja**: Page >=1, limit 1-100 (walidacja w hooku).
- **Typy**: PaginationDTO.
- **Propsy**: pagination: PaginationDTO, onPageChange: (page: number) => void.

## 5. Typy

- **Istniejące typy z types.ts**: CategoryDTO (id, name, is_default, created_at), CreateCategoryCommand (name), UpdateCategoryCommand (name), MessageDTO (message), PaginationDTO (page, limit, total).
- **Nowy typ UpdateCategoryDTO**: { id: string, name: string, is_default: boolean, updated_at: string } - używany dla odpowiedzi PUT.
- **ViewModel CategoriesListViewModel**: { categories: CategoryDTO[], pagination: PaginationDTO, isLoading: boolean, error?: string } - stan listy.
- **ViewModel CategoryFormViewModel**: { isOpen: boolean, mode: 'create'|'edit', category?: CategoryDTO, formData: { name: string }, errors: { name?: string }, isSubmitting: boolean } - stan modala i formularza.

## 6. Zarządzanie stanem

Stan zarządzany w CategoriesPage za pomocą useState dla listy (categories, pagination, loading, error) i modala (isOpen, mode, selectedCategory, formData, errors, submitting). Customowy hook useCategories może być użyty do obsługi fetch API z parametrami page, limit, sort. Dla modala użyj useState lokalnie lub w rodzicu. Brak potrzeby dla zewnętrznych bibliotek stanu; wszystko w React hooks.

## 7. Integracja API

Integracja przez fetch w komponentach lub custom hook. Dla GET /api/categories: użyj query params page, limit, sort; odpowiedź: { data: CategoryDTO[], pagination: PaginationDTO }. Dla POST /api/categories: body { name: string }, odpowiedź CategoryDTO (201). Dla PUT /api/categories/{id}: body { name: string }, odpowiedź UpdateCategoryDTO (200). Dla DELETE /api/categories/{id}: brak body, odpowiedź MessageDTO (200). Wszystkie żądania z autoryzacją JWT. Typy żądania: CreateCategoryCommand/UpdateCategoryCommand, odpowiedzi: CategoryDTO/UpdateCategoryDTO/PaginationDTO/MessageDTO.

## 8. Interakcje użytkownika

- **Dodanie kategorii**: Kliknij "Dodaj kategorię" -> otwórz modal create, wypełnij nazwę, submit -> walidacja, API call, toast sukces, zamknij modal, odśwież listę.
- **Edycja kategorii**: Kliknij "Edytuj" na własnej kategorii -> otwórz modal edit z wypełnionymi danymi, zmień nazwę, submit -> walidacja, API call, toast sukces, zamknij, odśwież.
- **Usunięcie kategorii**: Kliknij "Usuń" na własnej kategorii -> potwierdzenie opcjonalne, API call, toast sukces, odśwież listę.
- **Paginacja**: Kliknij stronę -> fetch nowa strona, zaktualizuj listę.
- **Zamknięcie modala**: Kliknij cancel lub outside -> zamknij bez zmian.

## 9. Warunki i walidacja

- **Nazwa kategorii**: Wymagana, 1-100 znaków, unikalna per użytkownik. Walidacja w CategoryFormModal (client-side basic), sprawdzenie w API (422 jeśli zajęta). Wpływa na stan: błędy w errors, przycisk submit disabled jeśli invalid.
- **Domyślne kategorie**: is_default === true -> ukryj przyciski Edit/Delete w CategoryItem.
- **Paginacja**: page >=1, limit 1-100. Walidacja w hooku, błąd jeśli invalid.
- **Stan interfejsu**: Loading disables przyciski, error pokazuje toast.

## 10. Obsługa błędów

- **Błędy API**: 400/422 -> toast z komunikatem błędu, nie zamykaj modala. 404 -> toast "Kategoria nie znaleziona", odśwież listę. 401 -> redirect do logowania. 500 -> toast "Błąd serwera".
- **Błędy sieci**: Timeout -> toast "Błąd połączenia", opcja retry.
- **Błędy walidacji**: Wyświetl przy polach lub w toaście. Dla usunięcia domyślnej: toast "Nie można usunąć domyślnej kategorii".
- **Edge cases**: Brak kategorii -> wyświetl "Brak kategorii", pusty formularz -> walidacja blokuje submit.

## 11. Kroki implementacji

1. Utwórz plik `src/pages/categories.astro` dla routingu.
2. Zaimplementuj komponenty w `src/components`: CategoriesPage.tsx, CategoriesList.tsx, CategoryItem.tsx, CategoryFormModal.tsx, PaginationControls.tsx.
3. Dodaj typy ViewModel w `src/types.ts` jeśli potrzebne.
4. Zaimplementuj hook useCategories w `src/lib/hooks/useCategories.ts` dla API calls.
5. Zintegruj API w komponentach: fetch dla GET, submit dla POST/PUT/DELETE.
6. Dodaj walidację w CategoryFormModal używając Zod lub manualnie.
7. Zaimplementuj obsługę błędów z toastami (Shadcn/ui Toast).
8. Przetestuj responsywność na mobile używając Tailwind.
9. Dodaj loading states i error handling.
10. Przetestuj integrację z backendem, symuluj scenariusze błędów.

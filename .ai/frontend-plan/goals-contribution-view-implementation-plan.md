# Plan implementacji widoku szczegółów celu (wpłaty)

## 1. Przegląd

Widok szczegółów celu umożliwia użytkownikowi zarządzanie wpłatami na wybrany cel oszczędnościowy. Głównym celem jest wyświetlanie listy wpłat, dodawanie nowych wpłat, edycja istniejących oraz usunięcie wpłat, a także wizualizacja progresu celu za pomocą wykresu liniowego. Widok zapewnia prosty interfejs do śledzenia oszczędności zgodnie z wymaganiami PRD, z naciskiem na responsywność i brak dodatkowych potwierdzeń dla edycji danych finansowych.

## 2. Routing widoku

Widok powinien być dostępny pod ścieżką `/goals/[id]`, gdzie `[id]` to parametr dynamiczny identyfikatora celu. Routing zostanie skonfigurowany w Astro zgodnie ze strukturą projektu.

## 3. Struktura komponentów

- **GoalContributionsView** (główny komponent widoku)
  - **GoalHeader** (nagłówek z nazwą celu i progresem procentowym)
  - **ProgressChart** (wykres liniowy progresu, lazy-loaded)
  - **ContributionForm** (formularz dodania/edycji wpłaty)
  - **ContributionsTable** (tabela wpłat z paginacją i sortowaniem)
    - **TableRow** (wiersz tabeli dla pojedynczej wpłaty)

## 4. Szczegóły komponentów

### GoalContributionsView

- Opis komponentu: Główny komponent zarządzający stanem widoku, wywołaniami API i renderowaniem podkomponentów. Odpowiada za pobieranie danych celu i wpłat, obsługę interakcji użytkownika oraz koordynację między komponentami.
- Główne elementy: Kontener główny z layoutem, warunkowe renderowanie komponentów dzieci w zależności od stanu ładowania.
- Obsługiwane interakcje: Obsługa submit formularza, edycji/usunięcia wpłaty z tabeli, zmiany paginacji/sortowania.
- Obsługiwana walidacja: Brak bezpośredniej walidacji, deleguje do ContributionForm i ContributionsTable.
- Typy: GoalDTO, GoalContributionDTO[], ContributionsListVM, ProgressDataVM.
- Propsy: Brak (komponent główny).

### GoalHeader

- Opis komponentu: Wyświetla nazwę celu, aktualny progres procentowy oraz pozostałą kwotę do osiągnięcia.
- Główne elementy: Nagłówek z tekstem, pasek progresu.
- Obsługiwane interakcje: Brak interakcji użytkownika.
- Obsługiwana walidacja: Brak.
- Typy: GoalDTO.
- Propsy: goal: GoalDTO.

### ProgressChart

- Opis komponentu: Lazy-loaded wykres liniowy pokazujący historię wpłat i prognozowaną datę osiągnięcia celu. Wykorzystuje bibliotekę do wykresów (np. Recharts) dla wizualizacji.
- Główne elementy: Komponent wykresu z linią progresu, etykietami dat i opcjonalną linią predykcji.
- Obsługiwane interakcje: Brak interakcji użytkownika.
- Obsługiwana walidacja: Brak.
- Typy: ProgressDataVM.
- Propsy: data: ProgressDataVM.

### ContributionForm

- Opis komponentu: Formularz do dodawania nowej lub edycji istniejącej wpłaty. Zawiera pola dla kwoty, daty i opisu.
- Główne elementy: Formularz z inputami (number dla amount, date dla date, text dla description), przycisk submit.
- Obsługiwane interakcje: onSubmit (wysyłanie formularza), onCancel (anulowanie edycji).
- Obsługiwana walidacja: amount > 0 (wymagane, liczba dodatnia), date w formacie YYYY-MM-DD (wymagane, prawidłowa data), description opcjonalne (string).
- Typy: CreateGoalContributionCommand, UpdateGoalContributionCommand, GoalContributionDTO.
- Propsy: onSubmit: (data: CreateGoalContributionCommand | UpdateGoalContributionCommand) => void, editingContribution?: GoalContributionDTO, onCancel?: () => void.

### ContributionsTable

- Opis komponentu: Tabela wyświetlająca listę wpłat z paginacją i sortowaniem. Zawiera kolumny dla daty, kwoty, opisu oraz akcji edycji/usunięcia.
- Główne elementy: Tabela z wierszami, przyciski paginacji, dropdown sortowania.
- Obsługiwane interakcje: onEdit (wybór wpłaty do edycji), onDelete (usunięcie wpłaty), onSort (zmiana sortowania), onPage (zmiana strony).
- Obsługiwana walidacja: Brak bezpośredniej walidacji.
- Typy: ContributionsListVM, GoalContributionDTO[].
- Propsy: data: ContributionsListVM, onEdit: (contribution: GoalContributionDTO) => void, onDelete: (id: string) => void, onSort: (sort: string) => void, onPage: (page: number) => void.

### TableRow

- Opis komponentu: Pojedynczy wiersz tabeli reprezentujący wpłatę.
- Główne elementy: Komórki tabeli dla daty, kwoty, opisu, przyciski akcji.
- Obsługiwane interakcje: onEdit, onDelete.
- Obsługiwana walidacja: Brak.
- Typy: GoalContributionDTO.
- Propsy: contribution: GoalContributionDTO, onEdit: () => void, onDelete: () => void.

## 5. Typy

Wymagane typy obejmują istniejące DTO z types.ts oraz nowe ViewModel dla widoku:

- **GoalDTO**: id (string), name (string), target_amount (number), current_amount (number), created_at (string).
- **GoalContributionDTO**: id (string), amount (number), date (string), description? (string), created_at (string).
- **CreateGoalContributionCommand**: amount (number > 0), date (string w formacie YYYY-MM-DD), description? (string).
- **UpdateGoalContributionCommand**: amount? (number > 0), date? (string), description? (string).
- **ContributionsListVM**: data (GoalContributionDTO[]), pagination (PaginationDTO), sort (string).
- **ProgressDataVM**: points ({date: string, amount: number}[]), predictedDate? (string).

Nowe typy ViewModel rozszerzają DTO o dane specyficzne dla widoku, takie jak obliczony progres czy dane wykresu.

## 6. Zarządzanie stanem

Stan zarządzany jest w GoalContributionsView za pomocą useState dla contributions, goal, loading, error oraz editingContribution. Dla złożonej logiki używany jest custom hook useContributions (obsługa pobierania wpłat z paginacją/sortowaniem) i useGoal (pobieranie danych celu). Hooki korzystają z useEffect dla wywołań API i synchronizacji stanu. Stan formularza zarządzany lokalnie w ContributionForm.

## 7. Integracja API

Integracja odbywa się przez wywołania do endpointów Supabase:

- GET /api/goals/{goal_id}/contributions (żądanie: query params page, limit, sort; odpowiedź: ContributionsListVM).
- POST /api/goals/{goal_id}/contributions (żądanie: CreateGoalContributionCommand; odpowiedź: GoalContributionDTO).
- PUT /api/goals/{goal_id}/contributions/{id} (żądanie: UpdateGoalContributionCommand; odpowiedź: GoalContributionDTO).
- DELETE /api/goals/{goal_id}/contributions/{id} (żądanie: brak; odpowiedź: MessageDTO).
- GET /api/goals (żądanie: path param id; odpowiedź: GoalDTO).

Wywołania obsługiwane przez fetch z autoryzacją JWT, błędy parsowane zgodnie z kodami API.

## 8. Interakcje użytkownika

- Dodanie wpłaty: Użytkownik wypełnia formularz i klika submit → wpłata dodawana do listy, progres aktualizowany, wykres odświeżany.
- Edycja wpłaty: Kliknięcie "Edytuj" w tabeli → formularz wypełnia się danymi wpłaty, submit aktualizuje wpis.
- Usunięcie wpłaty: Kliknięcie "Usuń" → wpłata usuwana z listy bez potwierdzenia (zgodnie z PRD), progres aktualizowany.
- Sortowanie/paginacja: Zmiana parametrów → tabela odświeżana z nowymi danymi.
- Przegląd progresu: Automatyczne wyświetlanie w nagłówku i wykresie po każdej zmianie.

## 9. Warunki i walidacja

Warunki weryfikowane na poziomie komponentów:

- ContributionForm: amount > 0 (błąd jeśli nie), date prawidłowa (wymagane), description opcjonalne. Błędy wyświetlane pod polami.
- API walidacja: goal_id istnieje i należy do użytkownika (404 jeśli nie), amount > 0 (422). Stan interfejsu: formularz blokowany podczas submit, komunikaty błędów dla 422/404.

## 10. Obsługa błędów

- 401 Unauthorized: Przekierowanie do logowania.
- 404 Not Found: Toast "Cel nie istnieje lub nie masz dostępu".
- 422 Unprocessable Entity: Wyświetlanie błędów walidacji w formularzu.
- Błędy sieciowe: Toast "Błąd połączenia, spróbuj ponownie", przycisk retry.
- Błędy obliczeń: Domyślne wartości dla progresu (0%), logowanie błędów.

## 11. Kroki implementacji

1. Utworzyć stronę Astro pod `src/pages/goals/[id].astro` z podstawowym layoutem.
2. Zaimplementować GoalContributionsView jako komponent React z podstawowym stanem i strukturą.
3. Dodać hooki useContributions i useGoal dla integracji API.
4. Zaimplementować ContributionsTable z paginacją i sortowaniem.
5. Dodać ContributionForm z walidacją Zod i obsługą dodania/edycji.
6. Zaimplementować ProgressChart z lazy-loading i obliczeniami progresu/predykcji.
7. Dodać GoalHeader dla wyświetlania podstawowej informacji o celu.
8. Przetestować integrację API i obsłużyć błędy zgodnie z planem.
9. Dodać responsywność z Tailwind dla urządzeń mobilnych.
10. Przeprowadzić testy jednostkowe i integracyjne, aktualizować dokumentację.

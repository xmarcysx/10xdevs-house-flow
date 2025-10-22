# API Endpoint Implementation Plan: GET /api/goals/{goal_id}/contributions

## 1. Przegląd punktu końcowego

Punkt końcowy GET /api/goals/{goal_id}/contributions umożliwia pobieranie listy wpłat na konkretny cel oszczędnościowy. Endpoint obsługuje paginację i sortowanie wyników, zwracając dane wpłat wraz z informacjami o paginacji. Jest to operacja tylko do odczytu, która wymaga uwierzytelnienia użytkownika i sprawdzenia własności celu.

## 2. Szczegóły żądania

- **Metoda HTTP:** GET
- **Struktura URL:** `/api/goals/{goal_id}/contributions`
- **Parametry:**
  - **Wymagane:**
    - `goal_id` (path parameter, string): UUID identyfikatora celu oszczędnościowego
  - **Opcjonalne:**
    - `page` (query parameter, integer, domyślnie 1): Numer strony dla paginacji (minimum 1)
    - `limit` (query parameter, integer, domyślnie 10): Liczba elementów na stronę (zakres 1-100)
    - `sort` (query parameter, string, domyślnie "created_at DESC"): Pole i kierunek sortowania (dozwolone: "amount", "date", "created_at" z opcjami "ASC"/"DESC")
- **Request Body:** Brak

## 3. Wykorzystywane typy

- **GoalContributionDTO:** Typ zwracanych danych wpłat zawierający pola: `id`, `amount`, `date`, `description`, `created_at`
- **PaginationDTO:** Typ zawierający metadane paginacji: `page`, `limit`, `total`

## 4. Szczegóły odpowiedzi

- **Kod sukcesu:** 200 OK
- **Struktura odpowiedzi:**

```json
{
  "data": [
    {
      "id": "uuid",
      "amount": 100.5,
      "date": "2024-01-15",
      "description": "Wpłata miesięczna",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

- **Kody błędów:**
  - `401 Unauthorized`: Brak lub nieprawidłowy token uwierzytelniania
  - `404 Not Found`: Cel o podanym ID nie istnieje lub nie należy do uwierzytelnionego użytkownika
  - `422 Unprocessable Entity`: Nieprawidłowe parametry zapytania (np. nieprawidłowy format page/limit/sort)

## 5. Przepływ danych

1. **Uwierzytelnianie:** Middleware Astro sprawdza obecność i ważność JWT token w nagłówku Authorization
2. **Walidacja parametrów:** Endpoint waliduje format UUID dla goal_id i wartości parametrów query
3. **Sprawdzenie własności:** Service sprawdza czy cel należy do uwierzytelnionego użytkownika
4. **Pobieranie danych:** Service wykonuje zapytanie do tabeli `goal_contributions` z filtrami i paginacją
5. **Formatowanie odpowiedzi:** Dane są mapowane na GoalContributionDTO i zwracane z metadanymi paginacji

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie:** Wymagany ważny JWT token Supabase w nagłówku Authorization
- **Autoryzacja:** Row Level Security (RLS) w Supabase zapewnia, że użytkownik może pobierać tylko swoje wpłaty (goal_contributions.user_id = auth.uid())
- **Walidacja wejścia:** Ścisła walidacja wszystkich parametrów wejściowych zapobiega iniekcji SQL i atakom typu DoS
- **Rate limiting:** Implementacja limitów zapytań przez Supabase Edge Functions (100 żądań/min per użytkownik)
- **Walidacja własności:** Dodatkowe sprawdzenie w aplikacji czy cel należy do użytkownika przed wykonaniem zapytania

## 7. Obsługa błędów

- **401 Unauthorized:** Gdy token JWT jest nieprawidłowy, wygasły lub nieobecny
- **404 Not Found:** Gdy cel o podanym goal_id nie istnieje lub nie należy do użytkownika
- **422 Unprocessable Entity:** Gdy parametry query mają nieprawidłowy format lub wartości poza zakresem
- **500 Internal Server Error:** Gdy wystąpi błąd serwera (błąd bazy danych, niespodziewany wyjątek)

Wszystkie błędy zwracają obiekt MessageDTO z opisem błędu w języku polskim.

## 8. Rozważania dotyczące wydajności

- **Indeksy bazy danych:** Wykorzystanie indeksów na kolumnach `goal_id`, `user_id`, `created_at` dla optymalnych zapytań
- **Paginacja:** Ograniczenie wyników do maksymalnie 100 elementów na stronę zapobiega dużym transferom danych
- **Sortowanie:** Walidacja dozwolonych pól sortowania zapobiega kosztownym operacjom na nieindeksowanych kolumnach
- **Buforowanie:** Możliwość implementacji cache w Supabase dla często pobieranych danych
- **Optymalizacja zapytań:** Użycie pojedynczego zapytania z JOIN do tabeli goals dla sprawdzenia własności

## 9. Etapy wdrożenia

1. **Utworzenie schematów walidacji Zod** w `src/lib/validation/goal-contributions.validation.ts`
2. **Implementacja GoalContributionsService** w `src/services/goal-contributions.service.ts` z metodami pobierania wpłat
3. **Utworzenie endpointu API** w `src/pages/api/goals/[goal_id]/contributions.ts` z pełną obsługą błędów
4. **Dodanie testów jednostkowych** dla service i walidacji
5. **Testowanie integracyjne** endpointu z różnymi scenariuszami (prawidłowe dane, błędy, edge cases)
6. **Aktualizacja dokumentacji API** w `.ai/api-plan.md`

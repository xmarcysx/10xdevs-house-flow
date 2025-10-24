# API Endpoint Implementation Plan: PUT /api/goals/{goal_id}/contributions/{id}

## 1. Przegląd punktu końcowego

Punkt końcowy PUT /api/goals/{goal_id}/contributions/{id} umożliwia aktualizację istniejącej wpłaty na konkretny cel oszczędnościowy. Endpoint wymaga uwierzytelnienia użytkownika oraz sprawdzenia własności zarówno celu jak i wpłaty przed wykonaniem aktualizacji. Jest to operacja modyfikująca dane, która aktualizuje rekord w tabeli goal_contributions.

## 2. Szczegóły żądania

- **Metoda HTTP:** PUT
- **Struktura URL:** `/api/goals/{goal_id}/contributions/{id}`
- **Parametry:**
  - **Wymagane:**
    - `goal_id` (path parameter, string): UUID identyfikatora celu oszczędnościowego
    - `id` (path parameter, string): UUID identyfikatora wpłaty do aktualizacji
- **Request Body:**

```json
{
  "amount": 150.75,
  "date": "2024-01-20",
  "description": "Zaktualizowana wpłata miesięczna"
}
```

- **Pola Request Body:**
  - `amount` (number, opcjonalne): Nowa kwota wpłaty (musi być większa od 0 jeśli podane)
  - `date` (string, opcjonalne): Nowa data wpłaty w formacie YYYY-MM-DD
  - `description` (string, opcjonalne): Nowy opis wpłaty (może być pusty string aby usunąć opis)

## 3. Wykorzystywane typy

- **UpdateGoalContributionCommand:** Typ danych wejściowych zawierający opcjonalne pola: `amount`, `date`, `description`
- **GoalContributionDTO:** Typ zwracanych danych wpłaty zawierający pola: `id`, `amount`, `date`, `description`, `created_at`

## 4. Szczegóły odpowiedzi

- **Kod sukcesu:** 200 OK
- **Struktura odpowiedzi:**

```json
{
  "id": "uuid",
  "amount": 150.75,
  "date": "2024-01-20",
  "description": "Zaktualizowana wpłata miesięczna",
  "created_at": "2024-01-15T10:30:00Z"
}
```

- **Kody błędów:**
  - `401 Unauthorized`: Brak lub nieprawidłowy token uwierzytelniania
  - `404 Not Found`: Cel lub wpłata o podanym ID nie istnieje lub nie należy do uwierzytelnionego użytkownika
  - `422 Unprocessable Entity`: Nieprawidłowe dane wejściowe (amount <= 0, nieprawidłowy format daty, itp.)

## 5. Przepływ danych

1. **Uwierzytelnianie:** Middleware Astro sprawdza obecność i ważność JWT token w nagłówku Authorization
2. **Walidacja parametrów:** Endpoint waliduje format UUID dla goal_id i id
3. **Parsowanie ciała żądania:** Endpoint parsuje i waliduje dane JSON z request body
4. **Sprawdzenie własności:** Service sprawdza czy cel i wpłata należą do uwierzytelnionego użytkownika oraz czy wpłata należy do wskazanego celu
5. **Walidacja biznesowa:** Service waliduje reguły biznesowe (amount > 0 jeśli podane)
6. **Aktualizacja wpłaty:** Service wykonuje UPDATE w tabeli `goal_contributions`
7. **Formatowanie odpowiedzi:** Zaktualizowane dane są mapowane na GoalContributionDTO i zwracane

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie:** Wymagany ważny JWT token Supabase w nagłówku Authorization
- **Autoryzacja:** Row Level Security (RLS) w Supabase zapewnia, że użytkownik może aktualizować tylko swoje wpłaty (goal_contributions.user_id = auth.uid())
- **Walidacja wejścia:** Ścisła walidacja wszystkich parametrów wejściowych zapobiega iniekcji SQL i nieprawidłowym danym
- **Walidacja biznesowa:** Sprawdzenie amount > 0 zapobiega nieprawidłowym aktualizacjom
- **Rate limiting:** Implementacja limitów zapytań przez Supabase Edge Functions (100 żądań/min per użytkownik)
- **Podwójna walidacja własności:** Sprawdzenie czy zarówno cel jak i wpłata należą do użytkownika, oraz czy wpłata jest powiązana z właściwym celem

## 7. Obsługa błędów

- **401 Unauthorized:** Gdy token JWT jest nieprawidłowy, wygasły lub nieobecny
- **404 Not Found:** Gdy:
  - Cel o podanym goal_id nie istnieje lub nie należy do użytkownika
  - Wpłata o podanym id nie istnieje
  - Wpłata nie należy do użytkownika
  - Wpłata nie jest powiązana z wskazanym celem
- **422 Unprocessable Entity:** Gdy dane wejściowe są nieprawidłowe:
  - amount <= 0 (jeśli podane)
  - nieprawidłowy format daty
  - nieprawidłowy format JSON
- **500 Internal Server Error:** Gdy wystąpi błąd serwera (błąd bazy danych, niespodziewany wyjątek)

Wszystkie błędy zwracają obiekt MessageDTO z opisem błędu w języku polskim.

## 8. Rozważania dotyczące wydajności

- **Indeksy bazy danych:** Wykorzystanie indeksów na kolumnach `id`, `goal_id`, `user_id` dla optymalnych zapytań
- **Transakcyjność:** Operacja UPDATE powinna być wykonywana w transakcji dla zapewnienia spójności danych
- **Optymalizacja zapytań:** Sprawdzanie własności celu i wpłaty w jednym zapytaniu z JOIN
- **Warunkowa aktualizacja:** Aktualizacja tylko zmienionych pól aby zminimalizować operacje bazy danych
- **Buforowanie:** Możliwość unieważnienia cache dla celów po aktualizacji wpłaty

## 9. Etapy wdrożenia

1. **Rozszerzenie schematów walidacji Zod** w `src/lib/validation/goal-contributions.validation.ts` o schematy dla UpdateGoalContributionCommand
2. **Rozszerzenie GoalContributionsService** w `src/services/goal-contributions.service.ts` o metodę update z walidacją biznesową
3. **Rozszerzenie endpointu API** w `src/pages/api/goals/[goal_id]/contributions/[id].ts` o obsługę metody PUT i pełną obsługą błędów
4. **Dodanie testów jednostkowych** dla nowej metody service i rozszerzonej walidacji
5. **Testowanie integracyjne** endpointu z różnymi scenariuszami (prawidłowe dane, błędy walidacji, błędy autoryzacji)
6. **Aktualizacja dokumentacji API** w `.ai/api-plan.md`

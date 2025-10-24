# API Endpoint Implementation Plan: POST /api/goals/{goal_id}/contributions

## 1. Przegląd punktu końcowego

Punkt końcowy POST /api/goals/{goal_id}/contributions umożliwia dodanie nowej wpłaty na konkretny cel oszczędnościowy. Endpoint wymaga uwierzytelnienia użytkownika oraz sprawdzenia własności celu przed utworzeniem wpłaty. Jest to operacja modyfikująca dane, która tworzy nowy rekord w tabeli goal_contributions.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** `/api/goals/{goal_id}/contributions`
- **Parametry:**
  - **Wymagane:**
    - `goal_id` (path parameter, string): UUID identyfikatora celu oszczędnościowego
- **Request Body:**

```json
{
  "amount": 100.5,
  "date": "2024-01-15",
  "description": "Wpłata miesięczna"
}
```

- **Pola Request Body:**
  - `amount` (number, wymagane): Kwota wpłaty (musi być większa od 0)
  - `date` (string, wymagane): Data wpłaty w formacie YYYY-MM-DD
  - `description` (string, opcjonalne): Opcjonalny opis wpłaty

## 3. Wykorzystywane typy

- **CreateGoalContributionCommand:** Typ danych wejściowych zawierający pola: `amount`, `date`, `description`
- **GoalContributionDTO:** Typ zwracanych danych wpłaty zawierający pola: `id`, `amount`, `date`, `description`, `created_at`

## 4. Szczegóły odpowiedzi

- **Kod sukcesu:** 201 Created
- **Struktura odpowiedzi:**

```json
{
  "id": "uuid",
  "amount": 100.5,
  "date": "2024-01-15",
  "description": "Wpłata miesięczna",
  "created_at": "2024-01-15T10:30:00Z"
}
```

- **Kody błędów:**
  - `401 Unauthorized`: Brak lub nieprawidłowy token uwierzytelniania
  - `404 Not Found`: Cel o podanym ID nie istnieje lub nie należy do uwierzytelnionego użytkownika
  - `422 Unprocessable Entity`: Nieprawidłowe dane wejściowe (amount <= 0, nieprawidłowy format daty, itp.)

## 5. Przepływ danych

1. **Uwierzytelnianie:** Middleware Astro sprawdza obecność i ważność JWT token w nagłówku Authorization
2. **Walidacja parametrów:** Endpoint waliduje format UUID dla goal_id
3. **Parsowanie ciała żądania:** Endpoint parsuje i waliduje dane JSON z request body
4. **Sprawdzenie własności:** Service sprawdza czy cel należy do uwierzytelnionego użytkownika
5. **Walidacja biznesowa:** Service waliduje reguły biznesowe (amount > 0)
6. **Utworzenie wpłaty:** Service wykonuje INSERT do tabeli `goal_contributions`
7. **Formatowanie odpowiedzi:** Nowo utworzone dane są mapowane na GoalContributionDTO i zwracane

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie:** Wymagany ważny JWT token Supabase w nagłówku Authorization
- **Autoryzacja:** Row Level Security (RLS) w Supabase zapewnia, że użytkownik może dodawać wpłaty tylko do swoich celów (goal_contributions.user_id = auth.uid())
- **Walidacja wejścia:** Ścisła walidacja wszystkich parametrów wejściowych zapobiega iniekcji SQL i nieprawidłowym danym
- **Walidacja biznesowa:** Sprawdzenie amount > 0 zapobiega utworzeniu nieprawidłowych wpłat
- **Rate limiting:** Implementacja limitów zapytań przez Supabase Edge Functions (100 żądań/min per użytkownik)
- **Walidacja własności:** Dodatkowe sprawdzenie w aplikacji czy cel należy do użytkownika przed wykonaniem operacji

## 7. Obsługa błędów

- **401 Unauthorized:** Gdy token JWT jest nieprawidłowy, wygasły lub nieobecny
- **404 Not Found:** Gdy cel o podanym goal_id nie istnieje lub nie należy do użytkownika
- **422 Unprocessable Entity:** Gdy dane wejściowe są nieprawidłowe:
  - amount <= 0
  - nieprawidłowy format daty
  - nieprawidłowy format JSON
  - brak wymaganych pól
- **500 Internal Server Error:** Gdy wystąpi błąd serwera (błąd bazy danych, niespodziewany wyjątek)

Wszystkie błędy zwracają obiekt MessageDTO z opisem błędu w języku polskim.

## 8. Rozważania dotyczące wydajności

- **Indeksy bazy danych:** Wykorzystanie indeksów na kolumnach `goal_id`, `user_id` dla szybkich sprawdzeń własności
- **Transakcyjność:** Operacja INSERT powinna być wykonywana w transakcji dla zapewnienia spójności danych
- **Walidacja wydajnościowa:** Sprawdzanie własności celu powinno być wykonane przed główną operacją INSERT
- **Optymalizacja zapytań:** Minimalizacja liczby zapytań do bazy - sprawdzenie własności i INSERT w jednym wywołaniu
- **Buforowanie:** Możliwość unieważnienia cache dla celów po dodaniu nowej wpłaty

## 9. Etapy wdrożenia

1. **Rozszerzenie schematów walidacji Zod** w `src/lib/validation/goal-contributions.validation.ts` o schematy dla CreateGoalContributionCommand
2. **Rozszerzenie GoalContributionsService** w `src/services/goal-contributions.service.ts` o metodę create z walidacją biznesową
3. **Utworzenie endpointu API** w `src/pages/api/goals/[goal_id]/contributions.ts` z obsługą metody POST i pełną obsługą błędów
4. **Dodanie testów jednostkowych** dla nowej metody service i rozszerzonej walidacji
5. **Testowanie integracyjne** endpointu z różnymi scenariuszami (prawidłowe dane, błędy walidacji, błędy autoryzacji)
6. **Aktualizacja dokumentacji API** w `.ai/api-plan.md`

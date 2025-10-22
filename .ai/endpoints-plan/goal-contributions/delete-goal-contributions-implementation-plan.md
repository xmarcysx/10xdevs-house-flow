# API Endpoint Implementation Plan: DELETE /api/goals/{goal_id}/contributions/{id}

## 1. Przegląd punktu końcowego

Punkt końcowy DELETE /api/goals/{goal_id}/contributions/{id} umożliwia usunięcie istniejącej wpłaty z konkretnego celu oszczędnościowego. Endpoint wymaga uwierzytelnienia użytkownika oraz sprawdzenia własności zarówno celu jak i wpłaty przed wykonaniem usunięcia. Jest to operacja modyfikująca dane, która usuwa rekord z tabeli goal_contributions.

## 2. Szczegóły żądania

- **Metoda HTTP:** DELETE
- **Struktura URL:** `/api/goals/{goal_id}/contributions/{id}`
- **Parametry:**
  - **Wymagane:**
    - `goal_id` (path parameter, string): UUID identyfikatora celu oszczędnościowego
    - `id` (path parameter, string): UUID identyfikatora wpłaty do usunięcia
- **Request Body:** Brak

## 3. Wykorzystywane typy

- **MessageDTO:** Typ odpowiedzi zawierający pole `message` z komunikatem o usunięciu

## 4. Szczegóły odpowiedzi

- **Kod sukcesu:** 200 OK
- **Struktura odpowiedzi:**

```json
{
  "message": "Contribution deleted"
}
```

- **Kody błędów:**
  - `401 Unauthorized`: Brak lub nieprawidłowy token uwierzytelniania
  - `404 Not Found`: Cel lub wpłata o podanym ID nie istnieje lub nie należy do uwierzytelnionego użytkownika

## 5. Przepływ danych

1. **Uwierzytelnianie:** Middleware Astro sprawdza obecność i ważność JWT token w nagłówku Authorization
2. **Walidacja parametrów:** Endpoint waliduje format UUID dla goal_id i id
3. **Sprawdzenie własności:** Service sprawdza czy cel i wpłata należą do uwierzytelnionego użytkownika oraz czy wpłata należy do wskazanego celu
4. **Usunięcie wpłaty:** Service wykonuje DELETE z tabeli `goal_contributions`
5. **Formatowanie odpowiedzi:** Zwracany jest komunikat potwierdzający usunięcie

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie:** Wymagany ważny JWT token Supabase w nagłówku Authorization
- **Autoryzacja:** Row Level Security (RLS) w Supabase zapewnia, że użytkownik może usuwać tylko swoje wpłaty (goal_contributions.user_id = auth.uid())
- **Walidacja wejścia:** Walidacja formatu UUID zapobiega atakom typu injection
- **Rate limiting:** Implementacja limitów zapytań przez Supabase Edge Functions (100 żądań/min per użytkownik)
- **Podwójna walidacja własności:** Sprawdzenie czy zarówno cel jak i wpłata należą do użytkownika, oraz czy wpłata jest powiązana z właściwym celem

## 7. Obsługa błędów

- **401 Unauthorized:** Gdy token JWT jest nieprawidłowy, wygasły lub nieobecny
- **404 Not Found:** Gdy:
  - Cel o podanym goal_id nie istnieje lub nie należy do użytkownika
  - Wpłata o podanym id nie istnieje
  - Wpłata nie należy do użytkownika
  - Wpłata nie jest powiązana z wskazanym celem
- **500 Internal Server Error:** Gdy wystąpi błąd serwera (błąd bazy danych, niespodziewany wyjątek)

Wszystkie błędy zwracają obiekt MessageDTO z opisem błędu w języku polskim.

## 8. Rozważania dotyczące wydajności

- **Indeksy bazy danych:** Wykorzystanie indeksów na kolumnach `id`, `goal_id`, `user_id` dla szybkich sprawdzeń własności
- **Optymalizacja zapytań:** Sprawdzanie własności celu i wpłaty w jednym zapytaniu z JOIN przed wykonaniem DELETE
- **Soft delete vs hard delete:** Rozważenie implementacji soft delete dla celów audytu i odzyskiwania danych
- **Kaskadowe efekty:** Zapewnienie, że usunięcie wpłaty nie wpływa negatywnie na inne dane (np. statystyki celów)
- **Buforowanie:** Unieważnienie cache dla celów po usunięciu wpłaty

## 9. Etapy wdrożenia

1. **Rozszerzenie GoalContributionsService** w `src/services/goal-contributions.service.ts` o metodę delete z walidacją własności
2. **Rozszerzenie endpointu API** w `src/pages/api/goals/[goal_id]/contributions/[id].ts` o obsługę metody DELETE i pełną obsługą błędów
3. **Dodanie testów jednostkowych** dla nowej metody service
4. **Testowanie integracyjne** endpointu z różnymi scenariuszami (prawidłowe usunięcie, błędy autoryzacji, próby usunięcia nieistniejących wpisów)
5. **Aktualizacja dokumentacji API** w `.ai/api-plan.md`

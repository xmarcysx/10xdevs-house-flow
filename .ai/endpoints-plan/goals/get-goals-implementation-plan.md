# API Endpoint Implementation Plan: GET /api/goals

## 1. Przegląd punktu końcowego

Endpoint GET /api/goals umożliwia pobieranie listy celów oszczędnościowych należących do uwierzytelnionego użytkownika z obsługą paginacji i sortowania. Punkt końcowy wykorzystuje Row Level Security w Supabase do automatycznej filtracji danych per użytkownik oraz zwraca wyniki w zunifikowanym formacie z metadanymi paginacji.

## 2. Szczegóły żądania

- **Metoda HTTP**: GET
- **Struktura URL**: `/api/goals`
- **Parametry**:
  - **Wymagane**: Brak
  - **Opcjonalne**:
    - `page` (integer, domyślnie 1): Numer strony (musi być > 0)
    - `limit` (integer, domyślnie 10): Liczba elementów na stronę (1-100)
    - `sort` (string, domyślnie "created_at DESC"): Pole sortowania z opcjami: "created_at ASC/DESC", "name ASC/DESC", "target_amount ASC/DESC", "current_amount ASC/DESC"
- **Request Body**: Brak

## 3. Wykorzystywane typy

- `GoalDTO` - struktura pojedynczego celu w odpowiedzi
- `PaginationDTO` - metadane paginacji
- `MessageDTO` - komunikaty błędów
- Nowa struktura `GoalsQueryParams` dla walidacji parametrów query

## 4. Szczegóły odpowiedzi

- **Kod sukcesu**: 200 OK
- **Struktura odpowiedzi**:

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "target_amount": "number",
      "current_amount": "number",
      "created_at": "timestamp"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

## 5. Przepływ danych

1. Klient wysyła żądanie GET z opcjonalnymi parametrami query
2. Middleware Astro wstrzykuje instancję Supabase do kontekstu
3. Handler parsuje i waliduje parametry query URL
4. GoalsService wykonuje zapytanie do bazy danych z filtrowaniem RLS per user_id
5. Wyniki są formatowane zgodnie ze specyfikacją GoalDTO
6. Zwracana jest struktura z danymi i metadanymi paginacji

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie**: Wymagany prawidłowy JWT token Supabase w nagłówku Authorization
- **Autoryzacja**: Row Level Security w Supabase automatycznie filtruje dane per user_id
- **Walidacja wejścia**: Wszystkie parametry query są sanityzowane i walidowane przed użyciem
- **SQL Injection**: Zapobiega Supabase SDK poprzez parametryzowane zapytania
- **Rate limiting**: Implementowane przez Supabase (100 żądań/min per użytkownik)
- **Dostęp do danych**: Użytkownik może widzieć tylko własne cele

## 7. Obsługa błędów

- **400 Bad Request**: Nieprawidłowe parametry query (ujemne wartości, nieprawidłowy format sort)
- **401 Unauthorized**: Brak lub nieprawidłowy token uwierzytelnienia
- **500 Internal Server Error**: Błędy połączenia z bazą danych lub nieoczekiwane błędy serwera
- Wszystkie błędy są logowane przez console.error() zgodnie z patternem projektu
- Komunikaty błędów zwracane są w formacie MessageDTO

## 8. Rozważania dotyczące wydajności

- **Indeksy bazy danych**: Wykorzystanie indeksów na user_id, created_at dla optymalizacji zapytań
- **Paginacja**: Efektywne ograniczanie wyników przez LIMIT/OFFSET
- **Sortowanie**: Obsługa indeksów dla popularnych pól sortowania
- **RLS**: Wydajne filtrowanie po user_id przez politykę bezpieczeństwa
- **Buforowanie**: Możliwość cache'owania wyników dla często używanych parametrów
- **Ograniczenia**: Maksymalny limit 100 elementów na stronę dla optymalizacji

## 9. Etapy wdrożenia

1. **Utworzyć schemat walidacji** w `src/lib/validation/goals.validation.ts` dla parametrów query
2. **Zaimplementować GoalsService** w `src/services/goals.service.ts` z metodą pobierania celów z paginacją
3. **Utworzyć endpoint handler** w `src/pages/api/goals.ts` z obsługą GET /api/goals
4. **Przetestować implementację** z różnymi scenariuszami (paginacja, sortowanie, nieprawidłowe parametry)
5. **Zaktualizować dokumentację** jeśli potrzebne i dodać integration tests

# API Endpoint Implementation Plan: GET /api/categories

## 1. Przegląd punktu końcowego

Endpoint umożliwia uwierzytelnionym użytkownikom pobranie listy swoich kategorii wydatków z opcjami paginacji i sortowania. Zwraca paginowaną listę kategorii należących wyłącznie do uwierzytelnionego użytkownika.

## 2. Szczegóły żądania

- **Metoda HTTP**: GET
- **Struktura URL**: `/api/categories`
- **Parametry**:
  - Wymagane: Brak (wszystkie parametry mają wartości domyślne)
  - Opcjonalne:
    - `page`: integer (domyślnie 1) - numer strony (minimum 1)
    - `limit`: integer (domyślnie 10) - liczba elementów na stronie (1-100)
    - `sort`: string (domyślnie "created_at DESC") - pole sortowania i kierunek
- **Request Body**: Brak

## 3. Wykorzystywane typy

- **CategoryDTO**: Typ wyjściowy zawierający dane kategorii
- **PaginationDTO**: Typ zawierający informacje o paginacji
- **MessageDTO**: Typ dla odpowiedzi z komunikatem (w przypadku błędów)

## 4. Szczegóły odpowiedzi

- **Sukces (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "string",
        "is_default": "boolean",
        "created_at": "timestamp"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100
    }
  }
  ```
- **Kody błędów**:
  - 400 Bad Request: Nieprawidłowe parametry zapytania
  - 401 Unauthorized: Brak autoryzacji lub nieprawidłowy token JWT
  - 500 Internal Server Error: Błąd serwera

## 5. Przepływ danych

1. **Walidacja tokenu JWT** przez middleware autoryzacji (jeśli zaimplementowane)
2. **Parsowanie i walidacja parametrów query** (page, limit, sort)
3. **Wywołanie CategoriesService.getCategories()** z user_id i parametrami paginacji
4. **Wykonanie zapytania do bazy danych** z filtrami RLS (tylko kategorie użytkownika)
5. **Obliczenie całkowitej liczby rekordów** dla paginacji
6. **Mapowanie wyników** na CategoryDTO[] i PaginationDTO
7. **Zwrot odpowiedzi** z paginowanymi danymi

## 6. Względy bezpieczeństwa

- **Autoryzacja JWT**: Wymagany prawidłowy token Supabase w nagłówku Authorization
- **RLS (Row Level Security)**: Zapewnia, że użytkownik może pobierać tylko własne kategorie
- **Walidacja parametrów**: Sanityzacja i walidacja wszystkich parametrów wejściowych
- **SQL Injection Protection**: Chronione przez parametryzowane zapytania Supabase
- **Rate limiting**: Rozważenie implementacji limitów żądań (np. 100/min per użytkownik)
- **Walidacja zakresów**: Ograniczenie limit do rozsądnych wartości (1-100)

## 7. Obsługa błędów

- **400 Bad Request**: Gdy parametry page lub limit są nieprawidłowe (page < 1, limit < 1 lub > 100)
- **400 Bad Request**: Gdy parametr sort zawiera niedozwoloną wartość
- **401 Unauthorized**: Gdy brakuje tokenu JWT lub jest nieprawidłowy
- **500 Internal Server Error**: Dla nieoczekiwanych błędów bazy danych lub serwera
- Wszystkie błędy zawierają opisowy komunikat w formacie `{ "message": "opis błędu" }`

## 8. Rozważania dotyczące wydajności

- **Optymalizacja zapytań**: Wykorzystanie indeksów na user_id i created_at dla szybkiego filtrowania i sortowania
- **Paginacja kursorowa**: Rozważenie implementacji dla lepszej wydajności przy dużych zbiorach danych
- **Cache**: Możliwość cache'owania wyników dla często używanych kategorii (jeśli potrzebne)
- **Database Connection**: Wykorzystanie connection poolingu Supabase
- **Query Optimization**: Użycie pojedynczego zapytania z COUNT(\*) dla paginacji

## 9. Etapy wdrożenia

1. **Dodać walidację parametrów query** w `src/lib/validation/categories.validation.ts`
2. **Rozszerzyć CategoriesService** o metodę `getCategories()` w `src/services/categories.service.ts`
3. **Dodać obsługę GET** w `/src/pages/api/categories.ts`
4. **Zaktualizować importy** aby używać `context.locals.supabase` zamiast bezpośredniego importu
5. **Przetestować endpoint** z różnymi scenariuszami (sukces, błędy walidacji, paginacja)
6. **Dodać integracyjne testy** dla pełnego przepływu
7. **Zaktualizować dokumentację API** jeśli potrzebne
8. **Zaimplementować rate limiting** jeśli wymagane dla bezpieczeństwa

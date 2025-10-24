# API Endpoint Implementation Plan: GET /api/expenses

## 1. Przegląd punktu końcowego

Endpoint umożliwia uwierzytelnionym użytkownikom pobranie listy swoich wydatków z opcjami filtrowania, paginacji i sortowania. Zwraca paginowaną listę wydatków należących wyłącznie do uwierzytelnionego użytkownika, włączając nazwę kategorii dla każdego wydatku.

## 2. Szczegóły żądania

- **Metoda HTTP**: GET
- **Struktura URL**: `/api/expenses`
- **Parametry**:
  - Wymagane: Brak (wszystkie parametry mają wartości domyślne)
  - Opcjonalne:
    - `page`: integer (domyślnie 1) - numer strony (minimum 1)
    - `limit`: integer (domyślnie 10) - liczba elementów na stronie (1-100)
    - `month`: string (format YYYY-MM) - filtr po miesiącu (np. "2024-01")
    - `category_id`: uuid - filtr po identyfikatorze kategorii
    - `sort`: string (domyślnie "date DESC") - pole sortowania i kierunek (dozwolone: date, amount, created_at)
- **Request Body**: Brak

## 3. Wykorzystywane typy

- **ExpenseDTO**: Typ wyjściowy zawierający dane wydatku z nazwą kategorii
- **PaginationDTO**: Typ zawierający informacje o paginacji
- **MessageDTO**: Typ dla odpowiedzi z komunikatem (w przypadku błędów)
- **GetExpensesQuery**: Nowy typ dla parametrów zapytania (page, limit, month?, category_id?, sort?)

## 4. Szczegóły odpowiedzi

- **Sukces (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "amount": "number",
        "date": "date",
        "description": "string?",
        "category_id": "uuid",
        "category_name": "string",
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
2. **Parsowanie i walidacja parametrów query** (page, limit, month, category_id, sort)
3. **Wywołanie ExpensesService.getExpenses()** z user_id i parametrami filtrowania
4. **Wykonanie zapytania do bazy danych** z JOIN na categories dla pobrania nazwy kategorii
5. **Zastosowanie filtrów RLS** (tylko wydatki użytkownika) i opcjonalnych filtrów (month, category_id)
6. **Sortowanie wyników** zgodnie z parametrem sort
7. **Obliczenie całkowitej liczby rekordów** dla paginacji
8. **Mapowanie wyników** na ExpenseDTO[] i PaginationDTO
9. **Zwrot odpowiedzi** z paginowanymi danymi

## 6. Względy bezpieczeństwa

- **Autoryzacja JWT**: Wymagany prawidłowy token Supabase w nagłówku Authorization
- **RLS (Row Level Security)**: Zapewnia, że użytkownik może pobierać tylko własne wydatki
- **Walidacja parametrów**: Sanityzacja i walidacja wszystkich parametrów wejściowych
- **SQL Injection Protection**: Chronione przez parametryzowane zapytania Supabase
- **Walidacja UUID**: category_id musi być prawidłowym UUID jeśli podany
- **Walidacja zakresów**: Ograniczenie limit do rozsądnych wartości (1-100)
- **Walidacja formatów**: month musi być w formacie YYYY-MM, sort zawiera tylko dozwolone wartości
- **Rate limiting**: Rozważenie implementacji limitów żądań (np. 100/min per użytkownik)

## 7. Obsługa błędów

- **400 Bad Request**: Gdy parametr page jest mniejszy niż 1
- **400 Bad Request**: Gdy parametr limit jest poza zakresem 1-100
- **400 Bad Request**: Gdy parametr month nie jest w formacie YYYY-MM
- **400 Bad Request**: Gdy parametr category_id nie jest prawidłowym UUID
- **400 Bad Request**: Gdy parametr sort zawiera niedozwoloną wartość
- **401 Unauthorized**: Gdy brakuje tokenu JWT lub jest nieprawidłowy
- **500 Internal Server Error**: Dla nieoczekiwanych błędów bazy danych lub serwera
- Wszystkie błędy zawierają opisowy komunikat w formacie `{ "message": "opis błędu" }`

## 8. Rozważania dotyczące wydajności

- **Optymalizacja zapytań**: Wykorzystanie indeksów na user_id, date, category_id i created_at dla szybkiego filtrowania i sortowania
- **JOIN optymalizacja**: Użycie LEFT JOIN z categories dla efektywnego pobrania nazw kategorii
- **Paginacja**: Implementacja offset-based pagination z COUNT(\*) dla dokładnych wyników
- **Database Connection**: Wykorzystanie connection poolingu Supabase
- **Query Optimization**: Użycie pojedynczego zapytania z CTE lub subquery dla paginacji
- **Cache**: Możliwość cache'owania wyników dla często używanych filtrów (jeśli potrzebne)
- **Indeksy**: Rozważenie indeksów złożonych dla kombinacji user_id + date, user_id + category_id

## 9. Etapy wdrożenia

1. **Dodać typy dla parametrów query** w `src/types.ts` (GetExpensesQuery)
2. **Utworzyć ExpensesService** w `src/services/expenses.service.ts` z metodą getExpenses()
3. **Dodać walidację parametrów query** w `src/lib/validation/expenses.validation.ts`
4. **Utworzyć endpoint GET** w `/src/pages/api/expenses.ts`
5. **Zaktualizować importy** aby używać `context.locals.supabase` zamiast bezpośredniego importu
6. **Przetestować endpoint** z różnymi scenariuszami (sukces, błędy walidacji, paginacja, filtrowanie)
7. **Dodać integracyjne testy** dla pełnego przepływu
8. **Zaktualizować dokumentację API** jeśli potrzebne
9. **Zaimplementować rate limiting** jeśli wymagane dla bezpieczeństwa
10. **Dodać indeksy bazy danych** jeśli potrzebne dla optymalizacji wydajności

# API Endpoint Implementation Plan: POST /api/expenses

## 1. Przegląd punktu końcowego

Endpoint POST /api/expenses umożliwia utworzenie nowego wydatku finansowego dla uwierzytelnionego użytkownika. Punkt końcowy waliduje dane wejściowe, sprawdza reguły biznesowe (kwota > 0, kategoria istnieje i należy do użytkownika) i zwraca utworzony rekord z pełnymi informacjami włączając nazwę kategorii.

## 2. Szczegóły żądania

- **Metoda HTTP**: POST
- **Struktura URL**: `/api/expenses`
- **Parametry**: Brak
- **Request Body**:

```json
{
  "amount": "number",
  "date": "date",
  "description": "string?",
  "category_id": "uuid"
}
```

## 3. Wykorzystywane typy

- **CreateExpenseCommand**: Struktura danych wejściowych dla tworzenia wydatku
- **ExpenseDTO**: Struktura odpowiedzi z utworzonym wydatkiem (zawiera category_name)
- **MessageDTO**: Typ dla komunikatów błędów

## 4. Szczegóły odpowiedzi

- **Kod sukcesu**: 201 Created
- **Struktura odpowiedzi**:

```json
{
  "id": "uuid",
  "amount": "number",
  "date": "date",
  "description": "string?",
  "category_id": "uuid",
  "category_name": "string",
  "created_at": "timestamp"
}
```

- **Kody błędów**:
  - 400 Bad Request: Nieprawidłowe dane JSON lub brak wymaganych pól
  - 401 Unauthorized: Brak lub nieprawidłowy token uwierzytelnienia
  - 422 Unprocessable Entity: Kwota ≤ 0, kategoria nie istnieje lub nie należy do użytkownika
  - 500 Internal Server Error: Błąd serwera

## 5. Przepływ danych

1. **Parsowanie ciała żądania**: Klient wysyła żądanie POST z danymi wydatku w JSON
2. **Walidacja tokenu JWT**: Middleware autoryzacji sprawdza prawidłowość tokenu
3. **Parsowanie i walidacja danych**: Handler parsuje JSON i waliduje strukturę danych
4. **Wywołanie ExpensesService.create()**: Service wykonuje walidację biznesową i tworzy rekord
5. **Sprawdzenie kategorii**: Weryfikacja czy kategoria istnieje i należy do użytkownika
6. **Tworzenie rekordu**: Wstawienie nowego wydatku do bazy danych z automatycznym przypisaniem user_id
7. **Pobranie pełnych danych**: Wykonanie JOIN z categories dla uzyskania nazwy kategorii
8. **Zwrot odpowiedzi**: Utworzony wydatek z pełnymi danymi i kodem 201

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie**: Wymagany ważny JWT token Supabase w nagłówku Authorization
- **Autoryzacja**: Row Level Security automatycznie przypisuje wydatek do uwierzytelnionego użytkownika
- **Walidacja wejścia**: Wszystkie pola są walidowane przed zapisem do bazy danych
- **Walidacja biznesowa**: Kwota musi być większa od zera, kategoria musi istnieć i należeć do użytkownika
- **SQL Injection Protection**: Zapobiega Supabase SDK poprzez parametryzowane zapytania
- **Sprawdzenie własności**: Dodatkowa weryfikacja czy kategoria należy do użytkownika przed utworzeniem wydatku
- **Sanityzacja danych**: Oczyszczanie i walidacja długości wszystkich pól tekstowych

## 7. Obsługa błędów

- **400 Bad Request**: Gdy ciało żądania nie jest prawidłowym JSON lub brakuje wymaganych pól
- **401 Unauthorized**: Gdy brakuje tokenu JWT lub jest nieprawidłowy
- **422 Unprocessable Entity**: Gdy kwota jest ≤ 0
- **422 Unprocessable Entity**: Gdy category_id nie jest prawidłowym UUID
- **422 Unprocessable Entity**: Gdy kategoria nie istnieje lub nie należy do użytkownika
- **422 Unprocessable Entity**: Gdy data jest nieprawidłowa lub w przyszłości
- **500 Internal Server Error**: Dla błędów połączenia z bazą danych lub nieoczekiwanych błędów serwera
- Wszystkie błędy zawierają opisowy komunikat w formacie `{ "message": "opis błędu" }`
- Błędy są logowane przez console.error() zgodnie ze wzorcem projektu

## 8. Rozważania dotyczące wydajności

- **Walidacja po stronie serwera**: Zapobiega niepotrzebnym zapytaniom do bazy danych poprzez wczesną walidację
- **Optymalizacja zapytań**: Pojedyncze zapytanie INSERT z SELECT dla zwrócenia utworzonego rekordu
- **Indeksy bazy danych**: Wykorzystanie indeksów na user_id, category_id dla optymalizacji sprawdzeń własności
- **Transakcyjność**: Operacja tworzenia jest atomowa
- **Ograniczone dane wejściowe**: Sanityzacja i walidacja długości pól (description max 1000 znaków)
- **Cache kategorii**: Możliwość cache'owania listy kategorii użytkownika dla zmniejszenia zapytań

## 9. Etapy wdrożenia

1. **Dodać walidację parametrów wejściowych** w `src/lib/validation/expenses.validation.ts` dla CreateExpenseCommand
2. **Utworzyć ExpensesService** w `src/services/expenses.service.ts` z metodą create()
3. **Utworzyć endpoint POST** w `/src/pages/api/expenses.ts`
4. **Zaktualizować importy** aby używać `context.locals.supabase` zamiast bezpośredniego importu
5. **Przetestować endpoint** z różnymi scenariuszami (sukces, błędy walidacji, nieprawidłowe kategorie)
6. **Dodać integracyjne testy** dla pełnego przepływu
7. **Zaktualizować dokumentację API** jeśli potrzebne
8. **Zaimplementować rate limiting** jeśli wymagane dla bezpieczeństwa

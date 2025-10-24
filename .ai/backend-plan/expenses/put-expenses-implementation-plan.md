# API Endpoint Implementation Plan: PUT /api/expenses/{id}

## 1. Przegląd punktu końcowego

Endpoint PUT /api/expenses/{id} umożliwia aktualizację istniejącego wydatku finansowego należącego do uwierzytelnionego użytkownika. Punkt końcowy waliduje dane wejściowe, sprawdza prawo własności wydatku oraz reguły biznesowe (kwota > 0 jeśli podana, kategoria istnieje jeśli podana), a następnie zwraca zaktualizowany rekord z pełnymi informacjami włączając nazwę kategorii.

## 2. Szczegóły żądania

- **Metoda HTTP**: PUT
- **Struktura URL**: `/api/expenses/{id}` (gdzie {id} to UUID wydatku)
- **Parametry**: Brak
- **Request Body** (wszystkie pola opcjonalne):

```json
{
  "amount": "number?",
  "date": "date?",
  "description": "string?",
  "category_id": "uuid?"
}
```

## 3. Wykorzystywane typy

- **UpdateExpenseCommand**: Struktura danych wejściowych dla aktualizacji wydatku (już istnieje w types.ts jako Partial)
- **ExpenseDTO**: Struktura odpowiedzi z zaktualizowanym wydatkiem (zawiera category_name)
- **MessageDTO**: Typ dla komunikatów błędów

## 4. Szczegóły odpowiedzi

- **Kod sukcesu**: 200 OK
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
  - 400 Bad Request: Nieprawidłowe dane JSON lub nieprawidłowy UUID
  - 401 Unauthorized: Brak lub nieprawidłowy token uwierzytelnienia
  - 404 Not Found: Wydatek o podanym ID nie istnieje lub nie należy do użytkownika
  - 422 Unprocessable Entity: Kwota ≤ 0, kategoria nie istnieje lub nie należy do użytkownika
  - 500 Internal Server Error: Błąd serwera

## 5. Przepływ danych

1. **Parsowanie parametrów URL**: Klient wysyła żądanie PUT z ID wydatku w URL
2. **Parsowanie ciała żądania**: Opcjonalne dane aktualizacji w JSON
3. **Walidacja tokenu JWT**: Middleware autoryzacji sprawdza prawidłowość tokenu
4. **Walidacja UUID**: Sprawdzenie czy ID wydatku jest prawidłowym UUID
5. **Wywołanie ExpensesService.update()**: Service sprawdza własność wydatku i wykonuje aktualizację
6. **Sprawdzenie kategorii**: Jeśli podana nowa kategoria, weryfikacja czy istnieje i należy do użytkownika
7. **Aktualizacja rekordu**: Częściowa aktualizacja pól w bazie danych z ustawieniem updated_at
8. **Pobranie pełnych danych**: Wykonanie JOIN z categories dla uzyskania aktualnej nazwy kategorii
9. **Zwrot odpowiedzi**: Zaktualizowany wydatek z pełnymi danymi i kodem 200

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie**: Wymagany ważny JWT token Supabase w nagłówku Authorization
- **Autoryzacja**: Sprawdzane jest prawo własności wydatku przez użytkownika przed aktualizacją
- **Walidacja wejścia**: Wszystkie pola są walidowane przed zapisem do bazy danych
- **Walidacja biznesowa**: Kwota musi być większa od zera (jeśli podana), kategoria musi istnieć i należeć do użytkownika (jeśli podana)
- **SQL Injection Protection**: Zapobiega Supabase SDK poprzez parametryzowane zapytania
- **Sprawdzenie własności**: Podwójna weryfikacja - zarówno istniejącego wydatku jak i nowej kategorii
- **Sanityzacja danych**: Oczyszczanie i walidacja długości wszystkich pól tekstowych

## 7. Obsługa błędów

- **400 Bad Request**: Gdy ciało żądania nie jest prawidłowym JSON
- **400 Bad Request**: Gdy parametr {id} nie jest prawidłowym UUID
- **401 Unauthorized**: Gdy brakuje tokenu JWT lub jest nieprawidłowy
- **404 Not Found**: Gdy wydatek o podanym ID nie istnieje
- **404 Not Found**: Gdy wydatek nie należy do uwierzytelnionego użytkownika
- **422 Unprocessable Entity**: Gdy amount jest podany i ≤ 0
- **422 Unprocessable Entity**: Gdy category_id jest podany ale kategoria nie istnieje
- **422 Unprocessable Entity**: Gdy category_id jest podany ale kategoria nie należy do użytkownika
- **422 Unprocessable Entity**: Gdy date jest nieprawidłowa lub w przyszłości
- **500 Internal Server Error**: Dla błędów połączenia z bazą danych lub nieoczekiwanych błędów serwera
- Wszystkie błędy zawierają opisowy komunikat w formacie `{ "message": "opis błędu" }`
- Błędy są logowane przez console.error() zgodnie ze wzorcem projektu

## 8. Rozważania dotyczące wydajności

- **Optymalizacja zapytań**: Wykorzystanie pojedynczego zapytania UPDATE z RETURNING dla atomowej operacji
- **Sprawdzenie własności**: Efektywne zapytanie sprawdzające przynależność wydatku do użytkownika
- **Walidacja po stronie serwera**: Zapobiega niepotrzebnym aktualizacjom poprzez wczesną walidację
- **Indeksy bazy danych**: Wykorzystanie indeksów na id, user_id i category_id dla optymalizacji
- **Transakcyjność**: Operacja aktualizacji jest atomowa
- **Ograniczone dane wejściowe**: Sanityzacja i walidacja długości pól (description max 1000 znaków)
- **Cache kategorii**: Możliwość cache'owania listy kategorii użytkownika dla zmniejszenia zapytań

## 9. Etapy wdrożenia

1. **Rozszerzyć walidację parametrów** w `src/lib/validation/expenses.validation.ts` dla UpdateExpenseCommand
2. **Rozszerzyć ExpensesService** w `src/services/expenses.service.ts` o metodę update()
3. **Zaktualizować endpoint handler** w `/src/pages/api/expenses.ts` o obsługę PUT /api/expenses/{id}
4. **Zaktualizować importy** aby używać `context.locals.supabase` zamiast bezpośredniego importu
5. **Przetestować endpoint** z różnymi scenariuszami (istniejący/nieistniejący ID, częściowe aktualizacje, błędne dane)
6. **Dodać integracyjne testy** dla pełnego przepływu
7. **Zaktualizować dokumentację API** jeśli potrzebne
8. **Zaimplementować rate limiting** jeśli wymagane dla bezpieczeństwa

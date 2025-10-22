# API Endpoint Implementation Plan: POST /api/incomes

## 1. Przegląd punktu końcowego

Endpoint POST /api/incomes umożliwia utworzenie nowego wpływu finansowego dla uwierzytelnionego użytkownika. Punkt końcowy waliduje dane wejściowe, sprawdza reguły biznesowe (kwota > 0) i zwraca utworzony rekord z pełnymi informacjami.

## 2. Szczegóły żądania

- Metoda HTTP: POST
- Struktura URL: `/api/incomes`
- Parametry: Brak
- Request Body:

```json
{
  "amount": "number",
  "date": "date",
  "description": "string?",
  "source": "string?"
}
```

## 3. Wykorzystywane typy

- `CreateIncomeCommand` - struktura danych wejściowych
- `IncomeDTO` - struktura odpowiedzi z utworzonym wpływem
- `MessageDTO` - dla komunikatów błędów

## 4. Szczegóły odpowiedzi

- Kod sukcesu: 201 Created
- Struktura odpowiedzi:

```json
{
  "id": "uuid",
  "amount": "number",
  "date": "date",
  "description": "string?",
  "source": "string?",
  "created_at": "timestamp"
}
```

## 5. Przepływ danych

1. Klient wysyła żądanie POST z danymi wpływu w JSON
2. Middleware Astro dodaje instancję Supabase do kontekstu
3. Handler parsuje i waliduje ciało żądania
4. IncomesService wykonuje walidację biznesową i tworzy rekord w bazie danych
5. Zwracany jest utworzony wpływ z pełnymi danymi

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie**: Wymagany ważny JWT token Supabase w nagłówku Authorization
- **Autoryzacja**: Row Level Security automatycznie przypisuje wpływ do uwierzytelnionego użytkownika
- **Walidacja wejścia**: Wszystkie pola są walidowane przed zapisem do bazy danych
- **Walidacja biznesowa**: Kwota musi być większa od zera, zapobiegając nieprawidłowym danym
- **SQL Injection**: Zapobiega Supabase SDK poprzez parametryzowane zapytania

## 7. Obsługa błędów

- **400 Bad Request**: Nieprawidłowe dane JSON lub brak wymaganych pól
- **401 Unauthorized**: Brak lub nieprawidłowy token uwierzytelnienia
- **422 Unprocessable Entity**: Kwota <= 0 lub inne błędy walidacji biznesowej
- **500 Internal Server Error**: Błędy połączenia z bazą danych lub nieoczekiwane błędy serwera
- Wszystkie błędy są logowane przez console.error() zgodnie ze wzorcem projektu

## 8. Rozważania dotyczące wydajności

- **Walidacja po stronie serwera**: Zapobiega niepotrzebnym zapytaniom do bazy danych
- **Indeksy bazy danych**: Wykorzystanie indeksów na user_id dla optymalizacji
- **Transakcyjność**: Operacja tworzenia jest atomowa
- **Ograniczone dane wejściowe**: Sanityzacja i walidacja długości pól

## 9. Etapy wdrożenia

1. **Utworzyć schemat walidacji** w `src/lib/validation/incomes.validation.ts` dla CreateIncomeCommand
2. **Zaimplementować IncomesService** w `src/services/incomes.service.ts` z metodą create
3. **Utworzyć/zaktualizować endpoint handler** w `src/pages/api/incomes.ts` z metodą POST
4. **Przetestować implementację** z różnymi scenariuszami walidacji
5. **Zaktualizować dokumentację API** w `.ai/api-plan.md` jeśli potrzebne

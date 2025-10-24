# API Endpoint Implementation Plan: PUT /api/incomes/{id}

## 1. Przegląd punktu końcowego

Endpoint PUT /api/incomes/{id} umożliwia aktualizację istniejącego wpływu finansowego należącego do uwierzytelnionego użytkownika. Punkt końcowy waliduje dane wejściowe, sprawdza prawo własności wpływu oraz reguły biznesowe (kwota > 0), a następnie zwraca zaktualizowany rekord.

## 2. Szczegóły żądania

- Metoda HTTP: PUT
- Struktura URL: `/api/incomes/{id}` (gdzie {id} to UUID wpływu)
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

- `UpdateIncomeCommand` - struktura danych wejściowych (już istnieje w types.ts)
- `IncomeDTO` - struktura odpowiedzi z zaktualizowanym wpływem
- `MessageDTO` - dla komunikatów błędów

## 4. Szczegóły odpowiedzi

- Kod sukcesu: 200 OK
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

1. Klient wysyła żądanie PUT z ID wpływu w URL i danymi aktualizacji w JSON
2. Middleware Astro dodaje instancję Supabase do kontekstu
3. Handler parsuje i waliduje ciało żądania oraz parametr ID z URL
4. IncomesService sprawdza czy wpływ należy do użytkownika
5. Wykonywana jest walidacja biznesowa i aktualizacja rekordu
6. Zwracany jest zaktualizowany wpływ z pełnymi danymi

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie**: Wymagany ważny JWT token Supabase w nagłówku Authorization
- **Autoryzacja**: Sprawdzane jest prawo własności wpływu przez użytkownika przed aktualizacją
- **Walidacja wejścia**: Wszystkie pola są walidowane przed zapisem do bazy danych
- **Walidacja biznesowa**: Kwota musi być większa od zera, zapobiegając nieprawidłowym danym
- **SQL Injection**: Zapobiega Supabase SDK poprzez parametryzowane zapytania

## 7. Obsługa błędów

- **400 Bad Request**: Nieprawidłowe dane JSON, nieprawidłowy UUID lub brak wymaganych pól
- **401 Unauthorized**: Brak lub nieprawidłowy token uwierzytelnienia
- **404 Not Found**: Wpływ o podanym ID nie istnieje lub nie należy do użytkownika
- **422 Unprocessable Entity**: Kwota <= 0 lub inne błędy walidacji biznesowej
- **500 Internal Server Error**: Błędy połączenia z bazą danych lub nieoczekiwane błędy serwera
- Wszystkie błędy są logowane przez console.error() zgodnie ze wzorcem projektu

## 8. Rozważania dotyczące wydajności

- **Sprawdzenie własności**: Efektywne zapytanie sprawdzające przynależność wpływu do użytkownika
- **Walidacja po stronie serwera**: Zapobiega niepotrzebnym aktualizacjom w bazie danych
- **Indeksy bazy danych**: Wykorzystanie indeksów na id i user_id dla optymalizacji
- **Transakcyjność**: Operacja aktualizacji jest atomowa
- **Ograniczone dane wejściowe**: Sanityzacja i walidacja długości pól

## 9. Etapy wdrożenia

1. **Rozszerzyć schemat walidacji** w `src/lib/validation/incomes.validation.ts` dla UpdateIncomeCommand
2. **Rozszerzyć IncomesService** w `src/services/incomes.service.ts` o metodę update
3. **Zaktualizować endpoint handler** w `src/pages/api/incomes.ts` o obsługę PUT /api/incomes/{id}
4. **Przetestować implementację** z różnymi scenariuszami (istniejący/nieważny ID, różne dane)
5. **Zaktualizować dokumentację API** w `.ai/api-plan.md` jeśli potrzebne

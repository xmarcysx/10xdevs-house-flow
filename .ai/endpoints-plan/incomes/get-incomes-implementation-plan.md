# API Endpoint Implementation Plan: GET /api/incomes

## 1. Przegląd punktu końcowego

Endpoint GET /api/incomes umożliwia pobranie paginowanej listy wpływów finansowych użytkownika z opcjonalnymi filtrami. Punkt końcowy obsługuje filtrowanie po miesiącu oraz sortowanie wyników, zapewniając efektywne przeglądanie danych historycznych wpływów.

## 2. Szczegóły żądania

- Metoda HTTP: GET
- Struktura URL: `/api/incomes`
- Parametry:
  - Wymagane: `page` (integer >= 1), `limit` (integer 1-100)
  - Opcjonalne: `month` (string, format YYYY-MM), `sort` (string, domyślnie "date DESC")
- Request Body: Brak

## 3. Wykorzystywane typy

- `IncomeDTO` - struktura pojedynczego wpływu w odpowiedzi
- `PaginationDTO` - metadane paginacji
- `GetIncomesQuery` - typ dla parametrów zapytania (do utworzenia)
- `MessageDTO` - dla komunikatów błędów

## 4. Szczegóły odpowiedzi

- Kod sukcesu: 200 OK
- Struktura odpowiedzi:

```json
{
  "data": [
    {
      "id": "uuid",
      "amount": "number",
      "date": "date",
      "description": "string?",
      "source": "string?",
      "created_at": "timestamp"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number"
  }
}
```

## 5. Przepływ danych

1. Klient wysyła żądanie GET z parametrami query
2. Middleware Astro dodaje instancję Supabase do kontekstu
3. Handler waliduje parametry zapytania
4. IncomesService wykonuje zapytanie do bazy danych z filtrami RLS
5. Dane są formatowane zgodnie ze specyfikacją API
6. Zwracana jest odpowiedź z danymi i metadanymi paginacji

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie**: Wymagany ważny JWT token Supabase w nagłówku Authorization
- **Autoryzacja**: Row Level Security (RLS) w Supabase filtruje dane tylko dla uwierzytelnionego użytkownika
- **Walidacja wejścia**: Wszystkie parametry query są walidowane przed wykonaniem zapytania
- **Rate limiting**: Implementacja powinna uwzględnić ograniczenia liczby żądań (100/min per użytkownik)
- **SQL Injection**: Zapobiega Supabase SDK poprzez parametryzowane zapytania

## 7. Obsługa błędów

- **400 Bad Request**: Nieprawidłowe parametry (format month, zakres page/limit)
- **401 Unauthorized**: Brak lub nieprawidłowy token uwierzytelnienia
- **500 Internal Server Error**: Błędy połączenia z bazą danych lub nieoczekiwane błędy serwera
- Wszystkie błędy są logowane przez console.error() zgodnie ze wzorcem projektu

## 8. Rozważania dotyczące wydajności

- **Indeksy bazy danych**: Wykorzystanie indeksów na kolumnach user_id, date dla optymalizacji zapytań
- **Paginacja**: Ograniczenie wyników do rozsądnych rozmiarów (max 100 elementów)
- **Filtrowanie**: Efektywne filtrowanie po miesiącu poprzez zakres dat
- **Sortowanie**: Optymalizacja zapytań sortowania poprzez indeksy
- **RLS**: Wydajne filtrowanie danych na poziomie bazy danych

## 9. Etapy wdrożenia

1. **Utworzyć schemat walidacji** w `src/lib/validation/incomes.validation.ts` dla parametrów query
2. **Zaimplementować IncomesService** w `src/services/incomes.service.ts` z metodą getIncomes
3. **Utworzyć endpoint handler** w `src/pages/api/incomes.ts` z metodą GET
4. **Dodać typy pomocnicze** do `src/types.ts` dla parametrów zapytania
5. **Przetestować implementację** z różnymi scenariuszami (paginacja, filtrowanie, sortowanie)
6. **Zaktualizować dokumentację API** w `.ai/api-plan.md` jeśli potrzebne

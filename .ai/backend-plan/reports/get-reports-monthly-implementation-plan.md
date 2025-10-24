# API Endpoint Implementation Plan: GET /api/reports/monthly/{month}

## 1. Przegląd punktu końcowego

Endpoint pobiera miesięczny raport wydatków dla zalogowanego użytkownika. Raport zawiera listę wszystkich wydatków z danego miesiąca wraz z sumami wydatków pogrupowanymi według kategorii. Endpoint wymaga autoryzacji i zwraca dane tylko dla aktualnie zalogowanego użytkownika.

## 2. Szczegóły żądania

- **Metoda HTTP:** GET
- **Struktura URL:** `/api/reports/monthly/{month}`
- **Parametry:**
  - **Wymagane:**
    - `month` (parametr ścieżki) - miesiąc w formacie YYYY-MM (np. "2024-01")
  - **Opcjonalne:** Brak
- **Request Body:** Brak

## 3. Wykorzystywane typy

- `MonthlyReportDTO` - główny DTO odpowiedzi zawierający expenses i category_totals
- `ExpenseReportItemDTO` - DTO pojedynczego wydatku w raporcie
- `CategoryTotalDTO` - DTO sumy wydatków dla kategorii

## 4. Szczegóły odpowiedzi

- **Kod sukcesu:** 200 OK
- **Struktura odpowiedzi:**

```typescript
{
  "expenses": [
    {
      "date": "string", // format: YYYY-MM-DD
      "amount": number,
      "category": "string"
    }
  ],
  "category_totals": [
    {
      "category": "string",
      "total": number
    }
  ]
}
```

- **Kody błędów:**
  - 400 Bad Request - nieprawidłowy format parametru month
  - 401 Unauthorized - brak autoryzacji lub nieprawidłowy token
  - 500 Internal Server Error - błąd serwera/bazy danych

## 5. Przepływ danych

1. **Walidacja parametru:** Sprawdź format miesiąca (YYYY-MM)
2. **Autoryzacja:** Pobierz user_id z kontekstu Supabase auth
3. **Pobranie danych:** Wykonaj zapytanie SQL do bazy danych łączące tabele expenses i categories
4. **Przetwarzanie:** Zgrupuj wydatki według kategorii i oblicz sumy
5. **Formatowanie odpowiedzi:** Przekształć dane do formatu MonthlyReportDTO

## 6. Względy bezpieczeństwa

- **Autoryzacja:** Wymagane jest poprawne uwierzytelnienie użytkownika poprzez Supabase Auth
- **RLS (Row Level Security):** Zapytania SQL automatycznie filtrowane przez polityki RLS w bazie danych
- **Walidacja wejścia:** Parametr month walidowany pod kątem formatu YYYY-MM
- **SQL Injection:** Zapobieganie poprzez używanie parameterized queries w Supabase
- **Rate limiting:** Rekomendowane na poziomie infrastruktury Supabase

## 7. Obsługa błędów

- **400 Bad Request:** Gdy parametr month nie jest w prawidłowym formacie YYYY-MM
- **401 Unauthorized:** Gdy użytkownik nie jest zalogowany lub token jest nieprawidłowy
- **500 Internal Server Error:** Dla wszelkich błędów bazy danych lub nieoczekiwanych wyjątków
- **Logging:** Wszystkie błędy logowane do konsoli z odpowiednim poziomem szczegółowości

## 8. Rozważania dotyczące wydajności

- **Indeksy:** Wykorzystanie istniejących indeksów `expenses_user_id_date_idx` i `expenses_category_id_idx`
- **Optymalizacja zapytań:** Pojedyncze zapytanie SQL z JOIN zamiast wielokrotnych zapytań
- **Caching:** Możliwe cachowanie na poziomie aplikacji dla często wyświetlanych miesięcy
- **Pagination:** Dla dużych zbiorów danych rozważyć paginację, choć dla miesięcznego raportu nie jest krytyczne
- **Database load:** Zapytanie powinno być lekkie dzięki filtrowaniu po user_id i miesiącu

## 9. Etapy wdrożenia

### Etap 1: Przygotowanie struktury plików

1. Utwórz katalog `src/services/reports/` jeśli nie istnieje
2. Utwórz plik `src/services/reports.service.ts`
3. Utwórz plik walidacji `src/lib/validation/reports.validation.ts`

### Etap 2: Implementacja walidacji

1. Utwórz schemat Zod dla parametru month
2. Zaimplementuj funkcję walidacji formatu miesiąca
3. Dodaj testy jednostkowe dla walidacji

### Etap 3: Implementacja service layer

1. Utwórz funkcję `getMonthlyReport(userId: string, month: string)` w reports.service.ts
2. Zaimplementuj zapytanie SQL do pobrania wydatków z JOIN categories
3. Dodaj logikę grupowania i sumowania wydatków
4. Przetestuj funkcję z przykładowymi danymi

### Etap 4: Implementacja endpointu API

1. Utwórz plik `src/pages/api/reports/monthly/[month].ts`
2. Zaimplementuj obsługę GET request
3. Dodaj walidację parametru month
4. Pobierz user_id z context.locals.supabase
5. Wywołaj service function
6. Zwróć odpowiedź w formacie JSON

### Etap 5: Obsługa błędów i bezpieczeństwo

1. Dodaj try-catch blocks w endpoint handler
2. Zaimplementuj odpowiednie kody błędów
3. Dodaj logging błędów
4. Sprawdź poprawność autoryzacji

### Etap 6: Testowanie

1. Testy jednostkowe dla service functions
2. Testy integracyjne dla endpointu
3. Testy bezpieczeństwa (autoryzacja, walidacja)
4. Testy wydajności z większymi zbiorami danych

### Etap 7: Dokumentacja i deployment

1. Zaktualizuj dokumentację API
2. Dodaj przykłady użycia
3. Przeprowadź code review
4. Deploy na środowisko testowe

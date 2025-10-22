# API Endpoint Implementation Plan: GET /api/budget/monthly

## 1. Przegląd punktu końcowego

Endpoint GET /api/budget/monthly umożliwia użytkownikowi pobranie miesięcznego podsumowania budżetu, obejmującego całkowite wpływy, wydatki, pozostałą kwotę oraz procentowy rozkład wydatków po kategoriach dla wybranego miesiąca. Dane są agregowane na podstawie wpływów i wydatków użytkownika, z uwzględnieniem kategorii wydatków. Endpoint wymaga autentyfikacji użytkownika i wykorzystuje Row Level Security (RLS) w bazie danych Supabase.

## 2. Szczegóły żądania

- **Metoda HTTP:** GET
- **Struktura URL:** `/api/budget/monthly`
- **Parametry:**
  - Wymagane: `month` (string, format YYYY-MM, np. "2023-10")
  - Opcjonalne: Brak
- **Request Body:** Brak

## 3. Wykorzystywane typy

- **MonthlyBudgetDTO:** Główny typ odpowiedzi, zawierający pola `total_income`, `total_expenses`, `remaining` oraz `category_breakdown`.
- **CategoryBreakdownDTO:** Typ dla elementów tablicy `category_breakdown`, z polami `category_name`, `percentage` i `amount`.
- Brak Command Modeli, ponieważ endpoint jest tylko do odczytu.

## 4. Szczegóły odpowiedzi

- **Kod powodzenia:** 200 OK
- **Struktura odpowiedzi:** Obiekt JSON zgodny z `MonthlyBudgetDTO`, np.:
  ```json
  {
    "total_income": 5000.0,
    "total_expenses": 3200.0,
    "remaining": 1800.0,
    "category_breakdown": [
      {
        "category_name": "żywność",
        "percentage": 40.0,
        "amount": 1280.0
      },
      {
        "category_name": "dom",
        "percentage": 30.0,
        "amount": 960.0
      }
    ]
  }
  ```
- **Kody błędów:**
  - 400 Bad Request: Nieprawidłowy lub brakujący parametr `month`.
  - 401 Unauthorized: Brak autentyfikacji użytkownika.
  - 500 Internal Server Error: Błędy wewnętrzne, np. problemy z bazą danych.

## 5. Przepływ danych

1. Użytkownik wysyła żądanie GET z parametrem `month`.
2. Middleware Astro sprawdza autentyfikację (poprzez Supabase auth).
3. Endpoint waliduje parametr `month` (format YYYY-MM).
4. Wywołuje funkcję z nowego service `budget.service.ts`, która:
   - Agreguje wpływy z tabeli `incomes` dla danego miesiąca i użytkownika (suma `amount`).
   - Agreguje wydatki z tabeli `expenses`, łącząc z `categories` dla nazw kategorii.
   - Oblicza `total_expenses` jako sumę wydatków.
   - Oblicza `remaining` jako `total_income - total_expenses`.
   - Dla `category_breakdown`: Grupuje wydatki po kategoriach, oblicza procenty względem `total_expenses`, sortuje malejąco.
5. Zwraca dane w formacie `MonthlyBudgetDTO`.
6. W przypadku błędów, zwraca odpowiedni kod HTTP z komunikatem błędu.

## 6. Względy bezpieczeństwa

- **Autentyfikacja:** Wymagana poprzez Supabase Auth; użytkownicy muszą być zalogowani (RLS zapewnia dostęp tylko do własnych danych).
- **Autoryzacja:** RLS policies w tabelach `incomes`, `expenses` i `categories` ograniczają dostęp do danych użytkownika (user_id = auth.uid()).
- **Walidacja wejścia:** Parametr `month` jest walidowany pod kątem formatu i zakresu (np. YYYY-MM), aby zapobiec SQL injection lub nieprawidłowym zapytaniom.
- **Ochrona przed atakami:** Używać parametryzowanych zapytań w Supabase; unikać bezpośredniego wstrzykiwania danych użytkownika do zapytań.
- **Dostęp do danych:** Endpoint nie ujawnia wrażliwych danych innych użytkowników dzięki RLS.

## 7. Obsługa błędów

- **Walidacja parametrów:** Jeśli `month` jest nieprawidłowy (np. niepasuje do regex YYYY-MM), zwróć 400 z komunikatem "Invalid month format".
- **Brak autentyfikacji:** Jeśli użytkownik nie jest uwierzytelniony, zwróć 401.
- **Błędy bazy danych:** Jeśli zapytania do Supabase zakończą się niepowodzeniem (np. problemy z połączeniem), zwróć 500 z komunikatem "Internal server error". Loguj szczegóły błędu w konsoli.
- **Brak danych:** Jeśli użytkownik nie ma wpływów/wydatków dla danego miesiąca, zwróć 200 z zerowymi wartościami (total_income: 0, itp.), aby uniknąć 404.
- **Obsługa edge cases:** Jeśli total_expenses wynosi 0, procenty w category_breakdown mogą być obliczone jako 0; sortować kategorię alfabetycznie lub malejąco.

## 8. Rozważania dotyczące wydajności

- **Agregacje w bazie danych:** Używać SQL agregacji (SUM, GROUP BY) w Supabase, aby uniknąć przetwarzania danych po stronie aplikacji.
- **Indeksy:** Wykorzystać istniejące indeksy na `incomes(user_id, date)` i `expenses(user_id, date)` dla szybkich zapytań miesięcznych.
- **Cache:** Rozważyć cache wyników na poziomie aplikacji dla często zapytywanych miesięcy, ale dla MVP nie jest konieczne.
- **Optymalizacja zapytań:** Jedno zapytanie do agregacji wpływów, jedno do wydatków z JOIN na categories; unikać N+1 queries.
- **Limity:** Brak limitów na dane, ale monitorować wydajność dla użytkowników z dużą liczbą transakcji.

## 9. Etapy wdrożenia

1. **Przygotowanie struktury:** Utworzyć katalog `.ai/endpoints-plan/budget/` jeśli nie istnieje.
2. **Stworzenie walidacji:** Rozszerzyć lub stworzyć `src/lib/validation/budget.validation.ts` dla walidacji parametru `month`.
3. **Implementacja service:** Utworzyć `src/services/budget.service.ts` z funkcją `getMonthlyBudget(userId: string, month: string): Promise<MonthlyBudgetDTO>`, wykorzystującą Supabase klienta do zapytań agregacyjnych.
4. **Implementacja endpointa:** Utworzyć plik `src/pages/api/budget/monthly.ts` jako Astro API route, obsługujący GET, walidujący parametry i wywołujący service.
5. **Integracja middleware:** Upewnić się, że middleware w `src/middleware/index.ts` obsługuje autentyfikację dla API routes.
6. **Testowanie:** Napisać testy jednostkowe dla service i endpointa; przetestować z różnymi miesiącami, użytkownikami i edge cases (np. brak danych).
7. **Linting i czyszczenie kodu:** Uruchomić lintery i zastosować reguły czyszczenia kodu (early returns, guard clauses).
8. **Dokumentacja:** Zaktualizować README lub dokumentację API z nowym endpointem.

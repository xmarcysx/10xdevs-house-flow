# REST API Plan

## 1. Zasoby

- `users`: Odpowiada tabeli `users` (zarządzanej przez Supabase Auth). Zawiera dane użytkowników (email, hasło, imię, nazwisko).
- `categories`: Odpowiada tabeli `categories`. Zawiera kategorie wydatków (nazwa, czy domyślna).
- `incomes`: Odpowiada tabeli `incomes`. Zawiera wpływy (kwota, data, opis, źródło).
- `expenses`: Odpowiada tabeli `expenses`. Zawiera wydatki (kwota, data, kategoria, opis).
- `goals`: Odpowiada tabeli `goals`. Zawiera cele oszczędnościowe (nazwa, kwota docelowa, aktualna kwota).
- `goal_contributions`: Odpowiada tabeli `goal_contributions`. Zawiera wpłaty na cele (kwota, data, opis).
- `budget`: Wirtualny zasób dla logiki biznesowej budżetu miesięcznego (obliczenia sum i procentów).
- `reports`: Wirtualny zasób dla raportów miesięcznych i celów (agregacje).
- `metrics`: Wirtualny zasób dla metryk aktywności (timestampy logowań).

## 2. Punkty końcowe

### Users

### Categories

- **GET /api/categories**
  - Opis: Pobierz listę kategorii użytkownika.
  - Parametry zapytania: `page` (int, domyślnie 1), `limit` (int, domyślnie 10), `sort` (string, domyślnie "created_at DESC").
  - Ładunek żądania: Brak.
  - Ładunek odpowiedzi: `{ "data": [{ "id": "uuid", "name": "string", "is_default": "boolean", "created_at": "timestamp" }], "pagination": { "page": 1, "limit": 10, "total": 100 } }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized.

- **POST /api/categories**
  - Opis: Utwórz nową kategorię.
  - Parametry zapytania: Brak.
  - Ładunek żądania: `{ "name": "string" }`.
  - Ładunek odpowiedzi: `{ "id": "uuid", "name": "string", "is_default": false, "created_at": "timestamp" }`.
  - Kody powodzenia: 201 Created.
  - Kody błędów: 400 Bad Request (nazwa zajęta), 401 Unauthorized, 422 Unprocessable Entity (walidacja: name unikalne per user).

- **PUT /api/categories/{id}**
  - Opis: Zaktualizuj kategorię.
  - Parametry zapytania: Brak.
  - Ładunek żądania: `{ "name": "string" }`.
  - Ładunek odpowiedzi: `{ "id": "uuid", "name": "string", "is_default": "boolean", "updated_at": "timestamp" }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 400 Bad Request (nazwa zajęta), 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity.

- **DELETE /api/categories/{id}**
  - Opis: Usuń kategorię (tylko własne, nie domyślne).
  - Parametry zapytania: Brak.
  - Ładunek żądania: Brak.
  - Ładunek odpowiedzi: `{ "message": "Category deleted" }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 400 Bad Request (domyślna kategoria), 401 Unauthorized, 404 Not Found.

### Incomes

- **GET /api/incomes**
  - Opis: Pobierz listę wpływów z filtrem.
  - Parametry zapytania: `page` (int), `limit` (int), `month` (string, YYYY-MM), `sort` (string, domyślnie "date DESC").
  - Ładunek żądania: Brak.
  - Ładunek odpowiedzi: `{ "data": [{ "id": "uuid", "amount": "number", "date": "date", "description": "string?", "source": "string?", "created_at": "timestamp" }], "pagination": {...} }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized.

- **POST /api/incomes**
  - Opis: Utwórz nowy wpływ.
  - Parametry zapytania: Brak.
  - Ładunek żądania: `{ "amount": "number", "date": "date", "description": "string?", "source": "string?" }`.
  - Ładunek odpowiedzi: `{ "id": "uuid", "amount": "number", "date": "date", "description": "string?", "source": "string?", "created_at": "timestamp" }`.
  - Kody powodzenia: 201 Created.
  - Kody błędów: 401 Unauthorized, 422 Unprocessable Entity (amount > 0).

- **PUT /api/incomes/{id}**
  - Opis: Zaktualizuj wpływ.
  - Parametry zapytania: Brak.
  - Ładunek żądania: Podobne do POST.
  - Ładunek odpowiedzi: Podobne do POST.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity.

- **DELETE /api/incomes/{id}**
  - Opis: Usuń wpływ.
  - Parametry zapytania: Brak.
  - Ładunek żądania: Brak.
  - Ładunek odpowiedzi: `{ "message": "Income deleted" }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized, 404 Not Found.

### Expenses

- **GET /api/expenses**
  - Opis: Pobierz listę wydatków z filtrem.
  - Parametry zapytania: `page` (int), `limit` (int), `month` (string), `category_id` (uuid), `sort` (string).
  - Ładunek żądania: Brak.
  - Ładunek odpowiedzi: `{ "data": [{ "id": "uuid", "amount": "number", "date": "date", "description": "string?", "category_id": "uuid", "category_name": "string", "created_at": "timestamp" }], "pagination": {...} }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized.

- **POST /api/expenses**
  - Opis: Utwórz nowy wydatek.
  - Parametry zapytania: Brak.
  - Ładunek żądania: `{ "amount": "number", "date": "date", "description": "string?", "category_id": "uuid" }`.
  - Ładunek odpowiedzi: Podobne do GET z pojedynczym obiektem.
  - Kody powodzenia: 201 Created.
  - Kody błędów: 401 Unauthorized, 422 Unprocessable Entity (amount > 0, category istnieje).

- **PUT /api/expenses/{id}**
  - Opis: Zaktualizuj wydatek.
  - Parametry zapytania: Brak.
  - Ładunek żądania: Podobne do POST.
  - Ładunek odpowiedzi: Podobne do POST.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity.

- **DELETE /api/expenses/{id}**
  - Opis: Usuń wydatek.
  - Parametry zapytania: Brak.
  - Ładunek żądania: Brak.
  - Ładunek odpowiedzi: `{ "message": "Expense deleted" }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized, 404 Not Found.

### Goals

- **GET /api/goals**
  - Opis: Pobierz listę celów.
  - Parametry zapytania: `page` (int), `limit` (int), `sort` (string).
  - Ładunek żądania: Brak.
  - Ładunek odpowiedzi: `{ "data": [{ "id": "uuid", "name": "string", "target_amount": "number", "current_amount": "number", "created_at": "timestamp" }], "pagination": {...} }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized.

- **POST /api/goals**
  - Opis: Utwórz nowy cel.
  - Parametry zapytania: Brak.
  - Ładunek żądania: `{ "name": "string", "target_amount": "number" }`.
  - Ładunek odpowiedzi: Podobne do GET z pojedynczym obiektem.
  - Kody powodzenia: 201 Created.
  - Kody błędów: 401 Unauthorized, 422 Unprocessable Entity (target_amount > 0).

- **PUT /api/goals/{id}**
  - Opis: Zaktualizuj cel.
  - Parametry zapytania: Brak.
  - Ładunek żądania: Podobne do POST.
  - Ładunek odpowiedzi: Podobne do POST.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity.

- **DELETE /api/goals/{id}**
  - Opis: Usuń cel.
  - Parametry zapytania: Brak.
  - Ładunek żądania: Brak.
  - Ładunek odpowiedzi: `{ "message": "Goal deleted" }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized, 404 Not Found.

### Goal Contributions

- **GET /api/goals/{goal_id}/contributions**
  - Opis: Pobierz wpłaty na cel.
  - Parametry zapytania: `page` (int), `limit` (int), `sort` (string).
  - Ładunek żądania: Brak.
  - Ładunek odpowiedzi: `{ "data": [{ "id": "uuid", "amount": "number", "date": "date", "description": "string?", "created_at": "timestamp" }], "pagination": {...} }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized, 404 Not Found (cel nie istnieje).

- **POST /api/goals/{goal_id}/contributions**
  - Opis: Dodaj wpłatę na cel.
  - Parametry zapytania: Brak.
  - Ładunek żądania: `{ "amount": "number", "date": "date", "description": "string?" }`.
  - Ładunek odpowiedzi: Podobne do GET z pojedynczym obiektem.
  - Kody powodzenia: 201 Created.
  - Kody błędów: 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity (amount > 0).

- **PUT /api/goals/{goal_id}/contributions/{id}**
  - Opis: Zaktualizuj wpłatę.
  - Parametry zapytania: Brak.
  - Ładunek żądania: Podobne do POST.
  - Ładunek odpowiedzi: Podobne do POST.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity.

- **DELETE /api/goals/{goal_id}/contributions/{id}**
  - Opis: Usuń wpłatę.
  - Parametry zapytania: Brak.
  - Ładunek żądania: Brak.
  - Ładunek odpowiedzi: `{ "message": "Contribution deleted" }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized, 404 Not Found.

### Budget

- **GET /api/budget/monthly**
  - Opis: Pobierz budżet miesięczny (sumy wpływów/wydatków, procenty kategorii).
  - Parametry zapytania: `month` (string, wymagane, YYYY-MM).
  - Ładunek żądania: Brak.
  - Ładunek odpowiedzi: `{ "total_income": "number", "total_expenses": "number", "remaining": "number", "category_breakdown": [{ "category_name": "string", "percentage": "number", "amount": "number" }] }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 400 Bad Request (brak month), 401 Unauthorized.

### Reports

- **GET /api/reports/monthly/{month}**
  - Opis: Pobierz raport miesięczny wydatków.
  - Parametry zapytania: Brak.
  - Ładunek żądania: Brak.
  - Ładunek odpowiedzi: `{ "expenses": [{ "date": "date", "amount": "number", "category": "string" }], "category_totals": [{ "category": "string", "total": "number" }] }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized.

- **GET /api/reports/goals**
  - Opis: Pobierz raport celów z progresem.
  - Parametry zapytania: Brak.
  - Ładunek żądania: Brak.
  - Ładunek odpowiedzi: `{ "goals": [{ "id": "uuid", "name": "string", "progress_percentage": "number", "remaining_amount": "number", "predicted_completion_date": "date?" }] }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized.

### Metrics

- **POST /api/metrics/login**
  - Opis: Zarejestruj timestamp logowania (jeśli włączone przez użytkownika).
  - Parametry zapytania: Brak.
  - Ładunek żądania: Brak (automatyczne z kontekstu auth).
  - Ładunek odpowiedzi: `{ "message": "Metric recorded" }`.
  - Kody powodzenia: 200 OK.
  - Kody błędów: 401 Unauthorized.

## 3. Uwierzytelnianie i autoryzacja

- Mechanizm: JWT tokens przez Supabase Auth. Każdy endpoint wymaga nagłówka `Authorization: Bearer <token>`. Token zawiera `user_id`, używany do egzekwowania RLS w bazie danych. Rejestracja/logowanie przez Supabase SDK, automatyczne generowanie tokenów. Rate limiting: 100 żądań/min per użytkownik (implementacja w Supabase Edge Functions).

## 4. Walidacja i logika biznesowa

- **Warunki walidacji:** Dla amount w incomes/expenses/goal_contributions: > 0. Dla goals: target_amount > 0, current_amount >= 0. Dla categories: name unikalne per user. Walidacja w API przed zapisem do DB.
- **Logika biznesowa:** Obliczenia w endpoints (np. agregacje w /api/budget/monthly używają SUM z DB). Predykcja celu: średnia miesięczna wpłat z ostatnich 6 miesięcy, obliczana w /api/goals/{id}/prediction. Cached current_amount aktualizowany przez DB trigger. Domyślne kategorie tworzone przy rejestracji przez DB trigger.

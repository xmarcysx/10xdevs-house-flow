# API Endpoint Implementation Plan: DELETE /api/categories/{id}

## 1. Przegląd punktu końcowego

Endpoint `DELETE /api/categories/{id}` umożliwia usunięcie istniejącej kategorii dla uwierzytelnionego użytkownika. Endpoint sprawdza uprawnienia użytkownika, weryfikuje czy kategoria nie jest domyślna oraz zapewnia że użytkownik może usuwać tylko własne kategorie.

## 2. Szczegóły żądania

- **Metoda HTTP:** DELETE
- **Struktura URL:** `/api/categories/{id}`
- **Parametry:**
  - **Wymagane:**
    - `id` (path parameter): UUID identyfikatora kategorii do usunięcia
  - **Opcjonalne:** brak
- **Request Body:** brak

## 3. Wykorzystywane typy

- **Request Body:** brak
- **Response Body:** `MessageDTO` (istniejący typ z `src/types.ts`)

## 4. Szczegóły odpowiedzi

- **Status Codes:**
  - `200 OK` - kategoria została pomyślnie usunięta
  - `400 Bad Request` - próba usunięcia domyślnej kategorii
  - `401 Unauthorized` - użytkownik nie jest uwierzytelniony
  - `404 Not Found` - kategoria nie istnieje lub nie należy do użytkownika
  - `500 Internal Server Error` - błąd serwera
- **Response Body (200 OK):**
  ```json
  {
    "message": "Category deleted"
  }
  ```
- **Response Body (błędy):** `{ "message": "string" }`

## 5. Przepływ danych

1. **Walidacja path parameter:** sprawdź czy `id` jest prawidłowym UUID
2. **Sprawdzenie istnienia kategorii:** upewnij się że kategoria istnieje i należy do użytkownika
3. **Sprawdzenie typu kategorii:** upewnij się że kategoria nie jest domyślna (`is_default = false`)
4. **Usunięcie z bazy:** wykonaj DELETE na tabeli `categories`
5. **Zwróć odpowiedź:** zwróć komunikat potwierdzający usunięcie

**Interakcje z zewnętrznymi usługami:**

- Supabase PostgreSQL: zapytania do tabeli `categories`

## 6. Względy bezpieczeństwa

- **Uwierzytelnienie:** endpoint wymaga uwierzytelnionego użytkownika (aktualnie używa `DEFAULT_USER_ID`)
- **Autoryzacja:** użytkownik może usuwać tylko swoje własne kategorie poprzez sprawdzenie `user_id`
- **Walidacja inputu:**
  - UUID validation dla path parameter `id`
- **Ochrona przed usunięciem krytycznych danych:** blokada usunięcia domyślnych kategorii (`is_default = true`)
- **SQL Injection Protection:** używanie parameterized queries przez Supabase SDK
- **Rate Limiting:** brak implementacji (do rozważenia w przyszłości)

## 7. Obsługa błędów

- **400 Bad Request:** próba usunięcia domyślnej kategorii
  - "Nie można usunąć domyślnej kategorii"
- **401 Unauthorized:** użytkownik nie uwierzytelniony
  - Obecnie nie zaimplementowane (używa DEFAULT_USER_ID)
- **404 Not Found:** kategoria nie istnieje lub nie należy do użytkownika
  - "Kategoria nie została znaleziona"
- **500 Internal Server Error:** błędy bazy danych, niespodziewane wyjątki
- **Logging:** wszystkie błędy są logowane do `console.error` z kontekstem

## 8. Rozważania dotyczące wydajności

- **Indeksy bazy danych:** zakładamy istnienie indeksów na `id` i `user_id`
- **Optymalizacja zapytań:** pojedyncze zapytanie DELETE
- **Cache:** brak (operacje DELETE wymagają aktualizacji cache w innych miejscach aplikacji)
- **Potencjalne wąskie gardła:**
  - Częste operacje usuwania
  - Sprawdzenie istnienia kategorii przed usunięciem
- **Strategie optymalizacji:**
  - Batch deletes jeśli potrzebne w przyszłości
  - Connection pooling przez Supabase

## 9. Etapy wdrożenia

### Etap 1: Rozszerzenie walidacji

1. Dodaj funkcję walidacji dla path parameter w `src/lib/validation/categories.validation.ts`:
   - `validateCategoryId()` - sprawdzenie czy id jest prawidłowym UUID

### Etap 2: Rozszerzenie CategoriesService

2. Dodaj metodę `delete()` w `src/services/categories.service.ts`:
   - Sprawdzenie własności kategorii przez użytkownika
   - Sprawdzenie czy kategoria nie jest domyślna
   - Wykonanie DELETE z odpowiednią obsługą błędów

### Etap 3: Implementacja endpointu

3. Dodaj obsługę `DELETE` w `src/pages/api/categories.ts`:
   - Parsowanie path parameter `id`
   - Wywołanie `categoriesService.delete()`
   - Obsługa błędów zgodnie ze specyfikacją
   - Zwrócenie MessageDTO z statusem 200

### Etap 4: Testowanie

4. Przetestuj endpoint z różnymi scenariuszami:
   - Pomyślne usunięcie własnej kategorii niestandardowej
   - Próba usunięcia nieistniejącej kategorii
   - Próba usunięcia cudzej kategorii
   - Próba usunięcia domyślnej kategorii
   - Nieprawidłowy UUID w path parameter

### Etap 5: Refaktoryzacja (opcjonalne)

5. Jeśli zajdzie potrzeba, refaktoryzuj wspólny kod obsługi błędów do utility funkcji

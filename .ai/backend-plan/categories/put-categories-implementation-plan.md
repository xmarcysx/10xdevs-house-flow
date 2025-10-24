# API Endpoint Implementation Plan: PUT /api/categories/{id}

## 1. Przegląd punktu końcowego

Endpoint `PUT /api/categories/{id}` umożliwia aktualizację nazwy istniejącej kategorii dla uwierzytelnionego użytkownika. Endpoint sprawdza uprawnienia użytkownika, waliduje dane wejściowe oraz zapewnia unikalność nazwy kategorii w ramach użytkownika.

## 2. Szczegóły żądania

- **Metoda HTTP:** PUT
- **Struktura URL:** `/api/categories/{id}`
- **Parametry:**
  - **Wymagane:**
    - `id` (path parameter): UUID identyfikatora kategorii do aktualizacji
    - `name` (request body): nowa nazwa kategorii (string, 1-100 znaków)
  - **Opcjonalne:** brak
- **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```

## 3. Wykorzystywane typy

- **Request Body:** `UpdateCategoryCommand` (istniejący typ z `src/types.ts`)
- **Response Body:** `UpdateCategoryDTO` (nowy typ do utworzenia w `src/types.ts`)
  ```typescript
  export type UpdateCategoryDTO = Pick<Tables<"categories">, "id" | "name" | "is_default" | "updated_at">;
  ```

## 4. Szczegóły odpowiedzi

- **Status Codes:**
  - `200 OK` - kategoria została pomyślnie zaktualizowana
  - `400 Bad Request` - nieprawidłowe dane wejściowe lub nazwa kategorii już zajęta
  - `401 Unauthorized` - użytkownik nie jest uwierzytelniony
  - `404 Not Found` - kategoria nie istnieje lub nie należy do użytkownika
  - `422 Unprocessable Entity` - dane wejściowe nie przeszły walidacji biznesowej
  - `500 Internal Server Error` - błąd serwera
- **Response Body (200 OK):**
  ```json
  {
    "id": "uuid",
    "name": "string",
    "is_default": "boolean",
    "updated_at": "timestamp"
  }
  ```
- **Response Body (błędy):** `{ "message": "string" }`

## 5. Przepływ danych

1. **Walidacja path parameter:** sprawdź czy `id` jest prawidłowym UUID
2. **Parsowanie request body:** sparsuj JSON i zwaliduj strukturę
3. **Walidacja biznesowa:** sprawdź poprawność danych zgodnie ze schematem walidacji
4. **Sanityzacja:** oczyść i przygotuj dane do przetwarzania
5. **Sprawdzenie uprawnień:** upewnij się że użytkownik jest właścicielem kategorii
6. **Sprawdzenie unikalności:** sprawdź czy nowa nazwa nie koliduje z innymi kategoriami użytkownika
7. **Aktualizacja w bazie:** wykonaj UPDATE na tabeli `categories`
8. **Zwróć odpowiedź:** zwróć zaktualizowane dane kategorii

**Interakcje z zewnętrznymi usługami:**

- Supabase PostgreSQL: zapytania do tabeli `categories`

## 6. Względy bezpieczeństwa

- **Uwierzytelnienie:** endpoint wymaga uwierzytelnionego użytkownika (aktualnie używa `DEFAULT_USER_ID`)
- **Autoryzacja:** użytkownik może aktualizować tylko swoje własne kategorie poprzez sprawdzenie `user_id`
- **Walidacja inputu:**
  - UUID validation dla path parameter `id`
  - Zod schema validation dla request body
  - Sanityzacja danych (trim, length checks, allowed characters)
- **SQL Injection Protection:** używanie parameterized queries przez Supabase SDK
- **Rate Limiting:** brak implementacji (do rozważenia w przyszłości)

## 7. Obsługa błędów

- **400 Bad Request:** nieprawidłowe dane wejściowe lub nazwa zajęta
  - Walidacja schematu: "Nazwa kategorii nie może być pusta"
  - Unikalność: "Kategoria o podanej nazwie już istnieje"
- **401 Unauthorized:** użytkownik nie uwierzytelniony
  - Obecnie nie zaimplementowane (używa DEFAULT_USER_ID)
- **404 Not Found:** kategoria nie istnieje lub nie należy do użytkownika
- **422 Unprocessable Entity:** dane nie przeszły walidacji biznesowej
- **500 Internal Server Error:** błędy bazy danych, niespodziewane wyjątki
- **Logging:** wszystkie błędy są logowane do `console.error` z kontekstem

## 8. Rozważania dotyczące wydajności

- **Indeksy bazy danych:** zakładamy istnienie indeksów na `(user_id, name)` dla UNIQUE constraint
- **Optymalizacja zapytań:** pojedyncze zapytanie UPDATE z RETURNING
- **Cache:** brak (kategorie nie są często cache'owane)
- **Potencjalne wąskie gardła:**
  - Częste aktualizacje tej samej kategorii
  - Duża liczba kategorii per użytkownik
- **Strategie optymalizacji:**
  - Batch updates jeśli potrzebne w przyszłości
  - Connection pooling przez Supabase

## 9. Etapy wdrożenia

### Etap 1: Rozszerzenie typów

1. Dodaj nowy typ `UpdateCategoryDTO` w `src/types.ts`:
   ```typescript
   export type UpdateCategoryDTO = Pick<Tables<"categories">, "id" | "name" | "is_default" | "updated_at">;
   ```

### Etap 2: Rozszerzenie walidacji

2. Dodaj funkcje walidacji w `src/lib/validation/categories.validation.ts`:
   - `validateUpdateCategoryCommand()`
   - `sanitizeUpdateCategoryCommand()`
   - `validateCategoryId()` dla path parameter

### Etap 3: Rozszerzenie CategoriesService

3. Dodaj metodę `update()` w `src/services/categories.service.ts`:
   - Sprawdzenie własności kategorii przez użytkownika
   - Walidacja unikalności nazwy (z wykluczeniem aktualnej kategorii)
   - Wykonanie UPDATE z RETURNING

### Etap 4: Implementacja endpointu

4. Dodaj obsługę `PUT` w `src/pages/api/categories.ts`:
   - Parsowanie path parameter `id`
   - Walidacja i sanityzacja request body
   - Wywołanie `categoriesService.update()`
   - Obsługa błędów zgodnie ze specyfikacją
   - Zwrócenie `UpdateCategoryDTO` z statusem 200

### Etap 5: Testowanie

5. Przetestuj endpoint z różnymi scenariuszami:
   - Pomyślna aktualizacja
   - Próba aktualizacji nieistniejącej kategorii
   - Próba aktualizacji cudzej kategorii
   - Próba użycia zajętej nazwy
   - Nieprawidłowe dane wejściowe

### Etap 6: Refaktoryzacja (opcjonalne)

6. Jeśli zajdzie potrzeba, refaktoryzuj wspólny kod obsługi błędów do utility funkcji

# API Endpoint Implementation Plan: POST /api/categories

## 1. Przegląd punktu końcowego
Endpoint umożliwia uwierzytelnionym użytkownikom tworzenie nowych kategorii wydatków. Nowa kategoria jest zawsze oznaczana jako niestandardowa (is_default = false) i musi mieć unikalną nazwę w obrębie danego użytkownika.

## 2. Szczegóły żądania
- **Metoda HTTP**: POST
- **Struktura URL**: `/api/categories`
- **Parametry**:
  - Wymagane: Brak
  - Opcjonalne: Brak
- **Request Body**:
  ```json
  {
    "name": "string"
  }
  ```

## 3. Wykorzystywane typy
- **CreateCategoryCommand**: Typ wejściowy dla tworzenia kategorii
- **CategoryDTO**: Typ wyjściowy zawierający pełny obiekt kategorii
- **MessageDTO**: Typ dla odpowiedzi z komunikatem (w przypadku błędów)

## 4. Szczegóły odpowiedzi
- **Sukces (201 Created)**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "is_default": false,
    "created_at": "timestamp"
  }
  ```
- **Kody błędów**:
  - 400 Bad Request: Nieprawidłowe dane wejściowe
  - 401 Unauthorized: Brak autoryzacji
  - 422 Unprocessable Entity: Nazwa kategorii już istnieje
  - 500 Internal Server Error: Błąd serwera

## 5. Przepływ danych
1. **Walidacja tokenu JWT** przez middleware autoryzacji
2. **Parsowanie request body** i mapowanie na CreateCategoryCommand
3. **Walidacja strukturalna** danych wejściowych
4. **Wywołanie CategoriesService.create()** z wstrzykniętym user_id
5. **Sprawdzenie unikalności nazwy** w bazie danych per użytkownik
6. **Zapis do tabeli categories** z automatycznym ustawieniem pól
7. **Mapowanie wyniku** na CategoryDTO i zwrot odpowiedzi

## 6. Względy bezpieczeństwa
- **Autoryzacja JWT**: Wymagany prawidłowy token Supabase w nagłówku Authorization
- **RLS (Row Level Security)**: Zapewnia, że użytkownik może tworzyć tylko własne kategorie
- **Walidacja danych**: Sanityzacja i walidacja nazwy kategorii przed zapisem
- **Rate limiting**: 100 żądań/min per użytkownik (implementacja w Supabase Edge Functions)
- **SQL Injection Protection**: Chronione przez parametryzowane zapytania Supabase

## 7. Obsługa błędów
- **400 Bad Request**: Gdy nazwa kategorii jest pusta, null lub przekracza limit długości
- **401 Unauthorized**: Gdy brakuje tokenu JWT lub jest nieprawidłowy
- **422 Unprocessable Entity**: Gdy kategoria o podanej nazwie już istnieje dla użytkownika
- **500 Internal Server Error**: Dla nieoczekiwanych błędów bazy danych lub serwera
- Wszystkie błędy zawierają opisowy komunikat w formacie `{ "message": "opis błędu" }`

## 8. Rozważania dotyczące wydajności
- **Optymalizacja zapytań**: Wykorzystanie indeksów na (user_id, name) dla szybkiej weryfikacji unikalności
- **Transakcyjność**: Operacja INSERT powinna być atomowa z sprawdzeniem unikalności
- **Cache**: Brak potrzeby cache'owania dla tego endpointu (CREATE operation)
- **Database Connection**: Wykorzystanie connection poolingu Supabase

## 9. Etapy wdrożenia
1. **Utworzyć strukturę katalogów** dla API routes w Astro
2. **Zaimplementować CategoriesService** z metodą create()
3. **Utworzyć walidację** dla CreateCategoryCommand
4. **Zaimplementować API route handler** w `/pages/api/categories.ts`
5. **Dodać middleware autoryzacji** dla endpointu
6. **Przetestować endpoint** z różnymi scenariuszami (sukces, błędy walidacji, błędy autoryzacji)
7. **Dodać integracyjne testy** dla pełnego przepływu
8. **Zaktualizować dokumentację API** jeśli potrzebne

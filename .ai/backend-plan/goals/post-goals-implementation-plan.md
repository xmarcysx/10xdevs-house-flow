# API Endpoint Implementation Plan: POST /api/goals

## 1. Przegląd punktu końcowego

Endpoint POST /api/goals umożliwia tworzenie nowego celu oszczędnościowego dla uwierzytelnionego użytkownika. Punkt końcowy waliduje dane wejściowe, sprawdza unikalność nazwy celu w ramach użytkownika oraz reguły biznesowe (target_amount > 0), a następnie zwraca utworzony rekord z pełnymi danymi.

## 2. Szczegóły żądania

- **Metoda HTTP**: POST
- **Struktura URL**: `/api/goals`
- **Parametry**: Brak
- **Request Body**:

```json
{
  "name": "string",
  "target_amount": "number"
}
```

## 3. Wykorzystywane typy

- `CreateGoalCommand` - struktura danych wejściowych (już istnieje w types.ts)
- `GoalDTO` - struktura odpowiedzi z utworzonym celem
- `MessageDTO` - dla komunikatów błędów

## 4. Szczegóły odpowiedzi

- **Kod sukcesu**: 201 Created
- **Struktura odpowiedzi**:

```json
{
  "id": "uuid",
  "name": "string",
  "target_amount": "number",
  "current_amount": 0,
  "created_at": "timestamp"
}
```

## 5. Przepływ danych

1. Klient wysyła żądanie POST z danymi nowego celu w JSON
2. Middleware Astro dodaje instancję Supabase do kontekstu
3. Handler parsuje i waliduje ciało żądania JSON
4. GoalsService sprawdza unikalność nazwy celu dla użytkownika
5. Wykonywana jest walidacja biznesowa i tworzenie rekordu
6. Zwracany jest utworzony cel z pełnymi danymi

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie**: Wymagany prawidłowy JWT token Supabase w nagłówku Authorization
- **Autoryzacja**: Row Level Security automatycznie przypisuje user_id przy tworzeniu rekordu
- **Walidacja wejścia**: Wszystkie pola są walidowane i sanityzowane przed zapisem do bazy danych
- **Walidacja biznesowa**: target_amount > 0, unikalność nazwy per użytkownik
- **SQL Injection**: Zapobiega Supabase SDK poprzez parametryzowane zapytania

## 7. Obsługa błędów

- **400 Bad Request**: Nieprawidłowe dane JSON lub brak wymaganych pól
- **401 Unauthorized**: Brak lub nieprawidłowy token uwierzytelnienia
- **422 Unprocessable Entity**: target_amount <= 0, nieprawidłowa nazwa, duplikacja nazwy celu
- **500 Internal Server Error**: Błędy połączenia z bazą danych lub nieoczekiwane błędy serwera
- Wszystkie błędy są logowane przez console.error() zgodnie z patternem projektu
- Komunikaty błędów zwracane są w formacie MessageDTO

## 8. Rozważania dotyczące wydajności

- **Sprawdzenie unikalności**: Efektywne zapytanie sprawdzające duplikację nazwy per użytkownik
- **Walidacja po stronie serwera**: Zapobiega niepotrzebnym wstawieniom do bazy danych
- **Indeksy bazy danych**: Wykorzystanie indeksów na user_id i name dla optymalizacji
- **Transakcyjność**: Operacja tworzenia jest atomowa
- **Ograniczone dane wejściowe**: Sanityzacja i walidacja długości pól

## 9. Etapy wdrożenia

1. **Utworzyć schemat walidacji** w `src/lib/validation/goals.validation.ts` dla CreateGoalCommand
2. **Zaimplementować GoalsService** w `src/services/goals.service.ts` z metodą create
3. **Utworzyć endpoint handler** w `src/pages/api/goals.ts` z obsługą POST /api/goals
4. **Przetestować implementację** z różnymi scenariuszami (prawidłowe dane, duplikacja nazwy, nieprawidłowe wartości)
5. **Zaktualizować dokumentację** jeśli potrzebne i dodać integration tests

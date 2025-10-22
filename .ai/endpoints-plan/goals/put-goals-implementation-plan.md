# API Endpoint Implementation Plan: PUT /api/goals/{id}

## 1. Przegląd punktu końcowego

Endpoint PUT /api/goals/{id} umożliwia aktualizację istniejącego celu oszczędnościowego należącego do uwierzytelnionego użytkownika. Punkt końcowy sprawdza prawo własności celu, waliduje dane wejściowe oraz reguły biznesowe (target_amount > 0 jeśli podany, unikalność nazwy), a następnie zwraca zaktualizowany rekord z pełnymi danymi.

## 2. Szczegóły żądania

- **Metoda HTTP**: PUT
- **Struktura URL**: `/api/goals/{id}` (gdzie {id} to UUID celu)
- **Parametry**: Brak
- **Request Body** (wszystkie pola opcjonalne):

```json
{
  "name": "string",
  "target_amount": "number"
}
```

## 3. Wykorzystywane typy

- `UpdateGoalCommand` - struktura danych wejściowych (już istnieje w types.ts)
- `GoalDTO` - struktura odpowiedzi z zaktualizowanym celem
- `MessageDTO` - dla komunikatów błędów

## 4. Szczegóły odpowiedzi

- **Kod sukcesu**: 200 OK
- **Struktura odpowiedzi**:

```json
{
  "id": "uuid",
  "name": "string",
  "target_amount": "number",
  "current_amount": "number",
  "created_at": "timestamp"
}
```

## 5. Przepływ danych

1. Klient wysyła żądanie PUT z ID celu w URL i opcjonalnymi danymi aktualizacji w JSON
2. Middleware Astro wstrzykuje instancję Supabase do kontekstu
3. Handler parsuje i waliduje parametr ID z URL oraz ciało żądania
4. GoalsService sprawdza czy cel należy do użytkownika
5. Sprawdzana jest unikalność nowej nazwy jeśli podana
6. Wykonywana jest walidacja biznesowa i aktualizacja rekordu
7. Zwracany jest zaktualizowany cel z pełnymi danymi

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie**: Wymagany prawidłowy JWT token Supabase w nagłówku Authorization
- **Autoryzacja**: Sprawdzane jest prawo własności celu przed aktualizacją
- **Walidacja wejścia**: Wszystkie pola są walidowane i sanityzowane przed zapisem do bazy danych
- **Walidacja biznesowa**: target_amount > 0 jeśli podany, unikalność nazwy per użytkownik
- **SQL Injection**: Zapobiega Supabase SDK poprzez parametryzowane zapytania

## 7. Obsługa błędów

- **400 Bad Request**: Nieprawidłowe dane JSON, nieprawidłowy UUID lub brak wymaganych pól
- **401 Unauthorized**: Brak lub nieprawidłowy token uwierzytelnienia
- **404 Not Found**: Cel o podanym ID nie istnieje lub nie należy do użytkownika
- **422 Unprocessable Entity**: target_amount <= 0, nieprawidłowa nazwa, duplikacja nazwy celu
- **500 Internal Server Error**: Błędy połączenia z bazą danych lub nieoczekiwane błędy serwera
- Wszystkie błędy są logowane przez console.error() zgodnie z patternem projektu
- Komunikaty błędów zwracane są w formacie MessageDTO

## 8. Rozważania dotyczące wydajności

- **Sprawdzenie własności**: Efektywne zapytanie sprawdzające przynależność celu do użytkownika
- **Sprawdzenie unikalności**: Optymalne zapytanie sprawdzające duplikację nazwy tylko przy zmianie nazwy
- **Walidacja po stronie serwera**: Zapobiega niepotrzebnym aktualizacjom w bazie danych
- **Indeksy bazy danych**: Wykorzystanie indeksów na id, user_id i name dla optymalizacji
- **Transakcyjność**: Operacja aktualizacji jest atomowa
- **Ograniczone dane wejściowe**: Sanityzacja i walidacja długości pól

## 9. Etapy wdrożenia

1. **Rozszerzyć schemat walidacji** w `src/lib/validation/goals.validation.ts` dla UpdateGoalCommand
2. **Rozszerzyć GoalsService** w `src/services/goals.service.ts` o metodę update
3. **Zaktualizować endpoint handler** w `src/pages/api/goals.ts` o obsługę PUT /api/goals/{id}
4. **Przetestować implementację** z różnymi scenariuszami (istniejący/nieważny ID, różne dane aktualizacji)
5. **Zaktualizować dokumentację** jeśli potrzebne i dodać integration tests

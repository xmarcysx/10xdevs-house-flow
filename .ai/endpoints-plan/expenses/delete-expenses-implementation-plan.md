# API Endpoint Implementation Plan: DELETE /api/expenses/{id}

## 1. Przegląd punktu końcowego

Endpoint DELETE /api/expenses/{id} umożliwia usunięcie istniejącego wydatku finansowego należącego do uwierzytelnionego użytkownika. Punkt końcowy sprawdza prawo własności wydatku przed wykonaniem operacji usunięcia i zwraca potwierdzenie usunięcia.

## 2. Szczegóły żądania

- **Metoda HTTP**: DELETE
- **Struktura URL**: `/api/expenses/{id}` (gdzie {id} to UUID wydatku)
- **Parametry**: Brak
- **Request Body**: Brak

## 3. Wykorzystywane typy

- **MessageDTO**: Typ dla komunikatu potwierdzającego usunięcie

## 4. Szczegóły odpowiedzi

- **Kod sukcesu**: 200 OK
- **Struktura odpowiedzi**:

```json
{
  "message": "Expense deleted"
}
```

- **Kody błędów**:
  - 400 Bad Request: Nieprawidłowy format UUID
  - 401 Unauthorized: Brak lub nieprawidłowy token uwierzytelnienia
  - 404 Not Found: Wydatek o podanym ID nie istnieje lub nie należy do użytkownika
  - 500 Internal Server Error: Błąd serwera

## 5. Przepływ danych

1. **Parsowanie parametrów URL**: Klient wysyła żądanie DELETE z ID wydatku w URL
2. **Walidacja tokenu JWT**: Middleware autoryzacji sprawdza prawidłowość tokenu
3. **Walidacja UUID**: Sprawdzenie czy ID wydatku jest prawidłowym UUID
4. **Wywołanie ExpensesService.delete()**: Service sprawdza własność wydatku i wykonuje usunięcie
5. **Sprawdzenie własności**: Weryfikacja czy wydatek istnieje i należy do użytkownika
6. **Usunięcie rekordu**: Permanentne usunięcie wydatku z bazy danych
7. **Zwrot odpowiedzi**: Komunikat potwierdzający usunięcie z kodem 200

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie**: Wymagany ważny JWT token Supabase w nagłówku Authorization
- **Autoryzacja**: Sprawdzane jest prawo własności wydatku przez użytkownika przed usunięciem
- **Walidacja ID**: UUID jest walidowany przed wykonaniem operacji
- **SQL Injection Protection**: Zapobiega Supabase SDK poprzez parametryzowane zapytania
- **RLS Protection**: Row Level Security zapewnia dodatkowe zabezpieczenie na poziomie bazy danych
- **Permanentne usunięcie**: Operacja jest permanentna, ale chroniona przez sprawdzenie własności
- **Brak cascade issues**: Baza danych ma odpowiednie CASCADE constraints dla bezpieczeństwa referential

## 7. Obsługa błędów

- **400 Bad Request**: Gdy parametr {id} nie jest prawidłowym UUID
- **401 Unauthorized**: Gdy brakuje tokenu JWT lub jest nieprawidłowy
- **404 Not Found**: Gdy wydatek o podanym ID nie istnieje
- **404 Not Found**: Gdy wydatek nie należy do uwierzytelnionego użytkownika
- **500 Internal Server Error**: Dla błędów połączenia z bazą danych lub nieoczekiwanych błędów serwera
- Wszystkie błędy zawierają opisowy komunikat w formacie `{ "message": "opis błędu" }`
- Błędy są logowane przez console.error() zgodnie ze wzorcem projektu

## 8. Rozważania dotyczące wydajności

- **Optymalizacja zapytań**: Wykorzystanie pojedynczego zapytania DELETE dla atomowej operacji
- **Sprawdzenie własności**: Efektywne zapytanie sprawdzające przynależność wydatku do użytkownika
- **Indeksy bazy danych**: Wykorzystanie indeksów na id i user_id dla optymalizacji
- **Transakcyjność**: Operacja usunięcia jest atomowa
- **Minimalne obciążenie**: Prosta operacja bez złożonych obliczeń lub JOIN-ów
- **Connection pooling**: Wykorzystanie connection poolingu Supabase dla optymalizacji

## 9. Etapy wdrożenia

1. **Rozszerzyć walidację parametrów** w `src/lib/validation/expenses.validation.ts` o funkcję walidacji UUID
2. **Rozszerzyć ExpensesService** w `src/services/expenses.service.ts` o metodę delete()
3. **Zaktualizować endpoint handler** w `/src/pages/api/expenses.ts` o obsługę DELETE /api/expenses/{id}
4. **Zaktualizować importy** aby używać `context.locals.supabase` zamiast bezpośredniego importu
5. **Przetestować endpoint** z różnymi scenariuszami (istniejący/nieistniejący ID, cudze wydatki)
6. **Dodać integracyjne testy** dla pełnego przepływu
7. **Zaktualizować dokumentację API** jeśli potrzebne
8. **Zaimplementować rate limiting** jeśli wymagane dla bezpieczeństwa

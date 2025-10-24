# API Endpoint Implementation Plan: DELETE /api/goals/{id}

## 1. Przegląd punktu końcowego

Endpoint DELETE /api/goals/{id} umożliwia usunięcie istniejącego celu oszczędnościowego należącego do uwierzytelnionego użytkownika. Punkt końcowy sprawdza prawo własności celu oraz bezpiecznie usuwa rekord wraz z powiązanymi danymi (goal_contributions), zwracając komunikat potwierdzający operację.

## 2. Szczegóły żądania

- **Metoda HTTP**: DELETE
- **Struktura URL**: `/api/goals/{id}` (gdzie {id} to UUID celu)
- **Parametry**: Brak
- **Request Body**: Brak

## 3. Wykorzystywane typy

- `MessageDTO` - dla komunikatu potwierdzającego usunięcie

## 4. Szczegóły odpowiedzi

- **Kod sukcesu**: 200 OK
- **Struktura odpowiedzi**:

```json
{
  "message": "Goal deleted"
}
```

## 5. Przepływ danych

1. Klient wysyła żądanie DELETE z ID celu w URL
2. Middleware Astro wstrzykuje instancję Supabase do kontekstu
3. Handler parsuje i waliduje parametr ID z URL
4. GoalsService sprawdza czy cel należy do użytkownika
5. Wykonywane jest bezpieczne usunięcie celu wraz z powiązanymi danymi
6. Zwracany jest komunikat potwierdzający usunięcie

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie**: Wymagany prawidłowy JWT token Supabase w nagłówku Authorization
- **Autoryzacja**: Sprawdzane jest prawo własności celu przed usunięciem
- **Bezpieczne usuwanie**: Kaskadowe usunięcie powiązanych danych (goal_contributions)
- **SQL Injection**: Zapobiega Supabase SDK poprzez parametryzowane zapytania
- **Ochrona danych**: Użytkownik może usuwać tylko własne cele

## 7. Obsługa błędów

- **400 Bad Request**: Nieprawidłowy format UUID w parametrze URL
- **401 Unauthorized**: Brak lub nieprawidłowy token uwierzytelnienia
- **404 Not Found**: Cel o podanym ID nie istnieje lub nie należy do użytkownika
- **500 Internal Server Error**: Błędy połączenia z bazą danych lub nieoczekiwane błędy serwera
- Wszystkie błędy są logowane przez console.error() zgodnie z patternem projektu
- Komunikaty błędów zwracane są w formacie MessageDTO

## 8. Rozważania dotyczące wydajności

- **Sprawdzenie własności**: Efektywne zapytanie sprawdzające przynależność celu do użytkownika
- **Kaskadowe usunięcie**: Optymalne usunięcie powiązanych danych przez mechanizm referencyjny bazy danych
- **Indeksy bazy danych**: Wykorzystanie indeksów na id i user_id dla optymalizacji
- **Transakcyjność**: Operacja usunięcia jest atomowa
- **Minimalne obciążenie**: Brak przetwarzania dużych zbiorów danych

## 9. Etapy wdrożenia

1. **Rozszerzyć GoalsService** w `src/services/goals.service.ts` o metodę delete
2. **Zaktualizować endpoint handler** w `src/pages/api/goals.ts` o obsługę DELETE /api/goals/{id}
3. **Przetestować implementację** z różnymi scenariuszami (istniejący/nieważny ID, powiązane dane)
4. **Zaktualizować dokumentację** jeśli potrzebne i dodać integration tests
5. **Zweryfikować politykę kaskadowego usuwania** w bazie danych dla goal_contributions

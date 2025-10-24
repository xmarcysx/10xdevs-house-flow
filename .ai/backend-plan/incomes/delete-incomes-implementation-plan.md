# API Endpoint Implementation Plan: DELETE /api/incomes/{id}

## 1. Przegląd punktu końcowego

Endpoint DELETE /api/incomes/{id} umożliwia usunięcie istniejącego wpływu finansowego należącego do uwierzytelnionego użytkownika. Punkt końcowy sprawdza prawo własności wpływu przed wykonaniem operacji usunięcia i zwraca potwierdzenie usunięcia.

## 2. Szczegóły żądania

- Metoda HTTP: DELETE
- Struktura URL: `/api/incomes/{id}` (gdzie {id} to UUID wpływu)
- Parametry: Brak
- Request Body: Brak

## 3. Wykorzystywane typy

- `MessageDTO` - dla komunikatu potwierdzającego usunięcie

## 4. Szczegóły odpowiedzi

- Kod sukcesu: 200 OK
- Struktura odpowiedzi:

```json
{
  "message": "Wydatek usunięty"
}
```

## 5. Przepływ danych

1. Klient wysyła żądanie DELETE z ID wpływu w URL
2. Middleware Astro dodaje instancję Supabase do kontekstu
3. Handler waliduje parametr ID z URL
4. IncomesService sprawdza czy wpływ należy do użytkownika
5. Wykonywane jest usunięcie rekordu z bazy danych
6. Zwracany jest komunikat potwierdzający usunięcie

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie**: Wymagany ważny JWT token Supabase w nagłówku Authorization
- **Autoryzacja**: Sprawdzane jest prawo własności wpływu przez użytkownika przed usunięciem
- **Walidacja ID**: UUID jest walidowany przed wykonaniem operacji
- **SQL Injection**: Zapobiega Supabase SDK poprzez parametryzowane zapytania
- **Soft Delete**: Brak - operacja jest permanentna, ale chroniona przez sprawdzenie własności

## 7. Obsługa błędów

- **400 Bad Request**: Nieprawidłowy format UUID
- **401 Unauthorized**: Brak lub nieprawidłowy token uwierzytelnienia
- **404 Not Found**: Wpływ o podanym ID nie istnieje lub nie należy do użytkownika
- **500 Internal Server Error**: Błędy połączenia z bazą danych lub nieoczekiwane błędy serwera
- Wszystkie błędy są logowane przez console.error() zgodnie ze wzorcem projektu

## 8. Rozważania dotyczące wydajności

- **Sprawdzenie własności**: Efektywne zapytanie sprawdzające przynależność wpływu do użytkownika
- **Indeksy bazy danych**: Wykorzystanie indeksów na id i user_id dla optymalizacji
- **Transakcyjność**: Operacja usunięcia jest atomowa
- **Minimalne obciążenie**: Prosta operacja bez złożonych obliczeń

## 9. Etapy wdrożenia

1. **Rozszerzyć schemat walidacji** w `src/lib/validation/incomes.validation.ts` o funkcję walidacji UUID
2. **Rozszerzyć IncomesService** w `src/services/incomes.service.ts` o metodę delete
3. **Zaktualizować endpoint handler** w `src/pages/api/incomes.ts` o obsługę DELETE /api/incomes/{id}
4. **Przetestować implementację** z różnymi scenariuszami (istniejący/nieważny ID)
5. **Zaktualizować dokumentację API** w `.ai/api-plan.md` jeśli potrzebne

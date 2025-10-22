# API Endpoint Implementation Plan: GET /api/reports/goals

## 1. Przegląd punktu końcowego

Endpoint GET /api/reports/goals umożliwia uwierzytelnionym użytkownikom pobranie raportu zawierającego wszystkie ich cele oszczędnościowe wraz z informacjami o postępie. Dla każdego celu obliczany jest procentowy postęp oraz pozostała kwota do osiągnięcia. Endpoint zwraca dane w formacie JSON zgodnie ze specyfikacją GoalsReportDTO.

## 2. Szczegóły żądania

- **Metoda HTTP**: GET
- **Struktura URL**: `/api/reports/goals`
- **Parametry**:
  - Wymagane: Brak
  - Opcjonalne: Brak
- **Request Body**: Brak
- **Uwierzytelnianie**: Wymagane (Supabase Auth przez RLS)

## 3. Wykorzystywane typy

- `GoalsReportDTO`: Główny typ odpowiedzi zawierający tablicę celów
- `GoalReportItemDTO`: Typ pojedynczego elementu celu z polami:
  - `id: string` - UUID celu
  - `name: string` - Nazwa celu
  - `progress_percentage: number` - Procentowy postęp (0-100)
  - `remaining_amount: number` - Pozostała kwota do osiągnięcia
  - `predicted_completion_date?: string` - Przewidywana data ukończenia (opcjonalne)

## 4. Szczegóły odpowiedzi

- **Kod sukcesu**: 200 OK
- **Struktura odpowiedzi**:

```json
{
  "goals": [
    {
      "id": "uuid",
      "name": "string",
      "progress_percentage": 75.5,
      "remaining_amount": 250.0,
      "predicted_completion_date": "2024-12-31"
    }
  ]
}
```

- **Kody błędów**:
  - 401 Unauthorized - Brak uwierzytelnienia lub nieprawidłowy token dostępu

## 5. Przepływ danych

1. Żądanie GET dociera do endpointu `/api/reports/goals`
2. Middleware Astro przekazuje kontekst z Supabase client
3. Endpoint wywołuje `ReportsService.getGoalsReport(userId)`
4. Service wykonuje zapytanie do tabeli `goals` filtrowane przez `user_id`
5. Dla każdego rekordu obliczane są:
   - `progress_percentage = (current_amount / target_amount) * 100`
   - `remaining_amount = target_amount - current_amount`
   - `predicted_completion_date` - na razie `null` (rozszerzenie przyszłe)
6. Dane są mapowane na `GoalReportItemDTO[]`
7. Zwracany jest `GoalsReportDTO` z kodem 200

## 6. Względy bezpieczeństwa

- **Row Level Security (RLS)**: Wszystkie zapytania do tabeli `goals` są automatycznie filtrowane przez politykę RLS, która sprawdza `user_id = auth.uid()`
- **Uwierzytelnianie**: Endpoint wymaga ważnego tokenu dostępu Supabase
- **Autoryzacja**: Tylko właściciel celów może uzyskać dostęp do swoich danych
- **Ochrona przed SQL injection**: Wszystkie zapytania używają parameterized queries przez Supabase SDK
- **Walidacja danych**: Brak danych wejściowych, więc nie ma ryzyka związanego z walidacją

## 7. Obsługa błędów

- **401 Unauthorized**: Zwracany automatycznie przez RLS gdy użytkownik nie jest uwierzytelniony
- **500 Internal Server Error**: Dla błędów bazy danych, problemów z połączeniem lub błędów obliczeń
- **Logowanie błędów**: Wszystkie błędy są logowane do konsoli z kontekstem dla debugowania
- **Error response format**: `{ "message": "string" }` zgodnie z MessageDTO

## 8. Wydajność

- **Optymalizacja zapytań**: Proste zapytanie SELECT z indeksem na `user_id`
- **Obliczenia po stronie serwera**: Progress i remaining amount obliczane w runtime
- **Caching**: Brak specjalnego cachowania (cele mogą być aktualizowane często)
- **Skalowalność**: Zapytanie skaluje się liniowo z liczbą celów użytkownika
- **Potencjalne optymalizacje**: Możliwość dodania indeksu złożonego jeśli potrzebne

## 9. Etapy wdrożenia

### Etap 1: Utworzenie ReportsService

1. Utwórz plik `src/services/reports.service.ts`
2. Zaimplementuj klasę `ReportsService` z konstruktorem przyjmującym `SupabaseClient`
3. Dodaj metodę `getGoalsReport(userId: string): Promise<GoalsReportDTO>`

### Etap 2: Implementacja logiki biznesowej

1. W `ReportsService.getGoalsReport()` wykonaj zapytanie do tabeli `goals`
2. Dla każdego rekordu oblicz `progress_percentage` i `remaining_amount`
3. Mapuj wyniki na `GoalReportItemDTO[]`
4. Zwróć `GoalsReportDTO`

### Etap 3: Utworzenie endpointu API

1. Utwórz plik `src/pages/api/reports/goals.ts`
2. Zaimplementuj handler `GET` zgodnie ze wzorcem z istniejących endpointów
3. Dodaj obsługę błędów i logowanie
4. Przetestuj endpoint z różnymi scenariuszami

### Etap 4: Testowanie i walidacja

1. Testuj z uwierzytelnionym użytkownikiem
2. Testuj bez uwierzytelnienia (powinien zwrócić 401)
3. Sprawdź obliczenia progress_percentage i remaining_amount
4. Waliduj format odpowiedzi zgodnie z GoalsReportDTO

### Etap 5: Refaktoryzacja i optymalizacja (jeśli potrzebne)

1. Przejrzyj kod pod kątem zgodności z zasadami clean code
2. Dodaj dodatkowe logowanie jeśli potrzebne
3. Rozważ optymalizacje wydajności jeśli pojawią się wąskie gardła

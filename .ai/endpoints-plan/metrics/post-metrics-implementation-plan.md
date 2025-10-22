# API Endpoint Implementation Plan: POST /api/metrics/login

## 1. Przegląd punktu końcowego

Endpoint `POST /api/metrics/login` służy do automatycznej rejestracji timestampu logowania użytkownika w systemie HouseFlow. Metryka jest tworzona automatycznie na podstawie kontekstu uwierzytelniania, bez konieczności przekazywania jakichkolwiek danych w żądaniu.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** `/api/metrics/login`
- **Parametry:**
  - **Wymagane:** Brak
  - **Opcjonalne:** Brak
- **Request Body:** Brak (dane pobierane automatycznie z kontekstu autoryzacji)

## 3. Szczegóły odpowiedzi

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "message": "Metric recorded"
}
```

- **Content-Type:** application/json

## 4. Przepływ danych

1. Sprawdzenie kontekstu autoryzacji (`auth.uid()`)
2. Jeśli użytkownik nie jest uwierzytelniony → 401 Unauthorized
3. Utworzenie rekordu metryki w tabeli `metrics` z danymi:
   - `user_id`: z `auth.uid()`
   - `type`: "login"
   - `timestamp`: aktualny timestamp
4. Zwrot komunikatu potwierdzającego

## 5. Względy bezpieczeństwa

- **Uwierzytelnianie:** Wymagane - endpoint dostępny tylko dla uwierzytelnionych użytkowników
- **Autoryzacja:** RLS zapewnia, że użytkownicy mogą tworzyć metryki tylko dla siebie
- **RLS Policy:** `user_id = auth.uid()` dla wszystkich operacji na tabeli `metrics`
- **Rate limiting:** Rozważyć implementację aby zapobiec nadużyciom

## 6. Obsługa błędów

- **401 Unauthorized:** Brak uwierzytelnienia użytkownika
- **500 Internal Server Error:** Błędy bazy danych lub nieoczekiwane wyjątki
- Wszystkie błędy logowane do konsoli z kontekstem

## 7. Rozważania dotyczące wydajności

- Prosta operacja INSERT - minimalne obciążenie bazy danych
- Indeksy na `user_id` i `(user_id, timestamp)` dla optymalizacji
- Brak złożonych obliczeń czy agregacji

## 8. Etapy wdrożenia

1. Utworzyć tabelę `metrics` w bazie danych z kolumnami i indeksami
2. Skonfigurować RLS dla tabeli `metrics`
3. Dodać typ `MetricDTO` do `src/types.ts`
4. Utworzyć `MetricsService` z metodą `createLoginMetric`
5. Zaimplementować endpoint `POST /api/metrics/login`
6. Przetestować endpoint (uwierzytelniony i nieuwierzytelniony użytkownik)
7. Zaktualizować dokumentację API

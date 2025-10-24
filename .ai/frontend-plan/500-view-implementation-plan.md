# Plan implementacji widoku błędu 500

## 1. Przegląd

Widok błędu 500 to strona obsługująca krytyczne błędy aplikacji, takie jak błędy API. Umożliwia użytkownikowi ponowienie próby lub powrót do dashboardu. Widok skupia się na prostocie i responsywności, zapewniając intuicyjne rozwiązanie dla sytuacji błędów.

## 2. Routing widoku

Widok powinien być dostępny pod ścieżką `/500`. Będzie to strona Astro w katalogu `src/pages/500.astro`.

## 3. Struktura komponentów

- Główna strona: `src/pages/500.astro`
  - Layout: `src/layouts/Layout.astro`
    - Komponent karty błędu: `ErrorCard` (komponent React w `src/components/ErrorCard.tsx`)

## 4. Szczegóły komponentów

### ErrorCard

- **Opis komponentu**: Główny komponent odpowiedzialny za wyświetlanie informacji o błędzie i zapewnienie akcji użytkownikowi. Składa się z komunikatu błędu, przycisku ponowienia próby i linku do dashboardu.
- **Główne elementy**: Karta (Card z Shadcn/ui), nagłówek z ikoną błędu, tekst komunikatu, przycisk "Spróbuj ponownie" i przycisk/link "Powrót do dashboardu".
- **Obsługiwane zdarzenia**:
  - onClick na przycisku "Spróbuj ponownie" - wywołuje funkcję retry
  - onClick na linku do dashboardu - nawiguje do strony głównej
- **Warunki walidacji**: Brak specyficznych warunków walidacji, ponieważ to widok błędu.
- **Typy**: Brak specjalnych DTO. Używa standardowych komponentów Shadcn/ui.
- **Propsy**:
  - `errorMessage?: string` - opcjonalny komunikat błędu do wyświetlenia
  - `onRetry?: () => void` - funkcja wywoływana przy ponowieniu próby

## 5. Typy

Widok błędu 500 nie wymaga specjalnych nowych typów DTO ani ViewModel. Wykorzystuje istniejące typy z `src/types.ts`, takie jak `MessageDTO` dla ogólnych komunikatów. Wszystkie komponenty używają standardowych typów TypeScript i komponentów Shadcn/ui.

## 6. Zarządzanie stanem

Widok nie wymaga złożonego zarządzania stanem. Stan lokalny komponentu `ErrorCard` może obejmować opcjonalny komunikat błędu przekazany przez props. Nie jest potrzebny customowy hook ani globalny stan, ponieważ akcje ograniczają się do nawigacji i ponowienia próby.

## 7. Integracja API

Widok błędu 500 nie integruje się z żadnymi endpointami API. Jest to strona fallback dla błędów krytycznych. W przypadku przycisku "Spróbuj ponownie" może być zaimplementowany prosty reload strony lub wywołanie funkcji przekazanej przez props do retry poprzedniej akcji.

## 8. Interakcje użytkownika

- **Spróbuj ponownie**: Użytkownik klika przycisk "Spróbuj ponownie", co wywołuje funkcję retry (np. reload strony lub ponowienie poprzedniej akcji). Rezultat: Strona przeładowuje się lub akcja zostaje powtórzona.
- **Powrót do dashboardu**: Użytkownik klika link do dashboardu, co powoduje nawigację do strony głównej aplikacji.

## 9. Warunki i walidacja

Widok nie zawiera warunków walidacji danych wejściowych. Brak formularzy ani pól do walidacji. Wszystkie interakcje są proste i nie wymagają sprawdzenia warunków.

## 10. Obsługa błędów

- **Scenariusz**: Wyświetlanie strony 500 przy krytycznych błędach aplikacji.
- **Obsługa**: Komponent wyświetla statyczny komunikat błędu. Przycisk retry pozwala na ponowienie akcji. W przypadku problemów z nawigacją, użytkownik może ręcznie przejść do dashboardu.

## 11. Kroki implementacji

1. Utworzyć plik strony `src/pages/500.astro` z podstawowym layoutem.
2. Zaimplementować komponent `ErrorCard` w `src/components/ErrorCard.tsx` używając komponentów Shadcn/ui (Card, Button).
3. Dodać obsługę zdarzeń dla przycisków w komponencie ErrorCard.
4. Zapewnić responsywność komponentu używając klas Tailwind.
5. Przetestować widok pod kątem różnych scenariuszy błędów i urządzeń mobilnych.
6. Dodać ewentualną logikę retry, jeśli wymagana dla konkretnych przypadków użycia.

# Plan implementacji widoku Raport celów

## 1. Przegląd

Widok Raport celów umożliwia użytkownikom przegląd wszystkich swoich celów oszczędnościowych wraz z informacjami o postępie. Dla każdego celu wyświetlany jest procentowy postęp, pozostała kwota do osiągnięcia oraz przewidywana data ukończenia. Widok stanowi część systemu raportowego aplikacji HouseFlow i skupia się na wizualizacji danych bez możliwości edycji.

## 2. Routing widoku

Widok będzie dostępny pod ścieżką `/reports/goals` jako strona Astro.

## 3. Struktura komponentów

```
GoalsReportPage (strona Astro)
└── GoalsReport (główny komponent React)
    ├── LoadingState (komponent ładowania)
    ├── ErrorState (komponent błędów)
    └── GoalCard[] (lista kart celów)
        └── ProgressBar (komponent paska progresu)
```

## 4. Szczegóły komponentów

### GoalsReportPage

- **Opis komponentu**: Główna strona Astro zawierająca layout aplikacji i główny komponent GoalsReport. Odpowiada za strukturę strony i przekazywanie kontekstu Supabase.
- **Główne elementy**: Layout Astro z komponentem GoalsReport jako zawartością.
- **Obsługiwane interakcje**: Brak bezpośrednich interakcji użytkownika.
- **Obsługiwana walidacja**: Brak walidacji na poziomie strony.
- **Typy**: Brak specyficznych typów.
- **Propsy**: Brak propsów (komponent strony).

### GoalsReport

- **Opis komponentu**: Główny komponent React zarządzający stanem widoku, wywołaniami API i renderowaniem listy celów. Obsługuje ładowanie danych, obsługę błędów i wyświetlanie odpowiednich stanów UI.
- **Główne elementy**: Kontener główny z warunkowym renderowaniem LoadingState, ErrorState lub listy GoalCard. Używa hooka useGoalsReport do zarządzania stanem.
- **Obsługiwane interakcje**: Automatyczne ładowanie danych przy montowaniu komponentu.
- **Obsługiwana walidacja**: Sprawdzanie struktury odpowiedzi API zgodnie z GoalsReportDTO.
- **Typy**: GoalsReportViewModel, GoalsReportDTO, GoalReportItemDTO.
- **Propsy**: Brak propsów (komponent główny).

### GoalCard

- **Opis komponentu**: Komponent karty pojedynczego celu wyświetlający nazwę, postęp procentowy, pozostałą kwotę i przewidywana datę ukończenia. Zawiera pasek progresu dla wizualizacji.
- **Główne elementy**: Karta z Shadcn/ui Card, nagłówek z nazwą celu, sekcja z paskiem progresu (ProgressBar), informacje o pozostałej kwocie i dacie ukończenia.
- **Obsługiwane interakcje**: Brak interakcji użytkownika (tylko wyświetlanie).
- **Obsługiwana walidacja**: Walidacja wartości progress_percentage (0-100), remaining_amount (>=0), sprawdzenie obecności wymaganych pól.
- **Typy**: GoalCardViewModel, GoalReportItemDTO.
- **Propsy**:
  ```typescript
  interface GoalCardProps {
    goal: GoalCardViewModel;
  }
  ```

### ProgressBar

- **Opis komponentu**: Komponent wizualizacji paska progresu liniowego dla celów oszczędnościowych. Wyświetla procentowy postęp w formie graficznej.
- **Główne elementy**: Kontener z paskiem progresu stylizowanym przez Tailwind CSS, etykieta z wartością procentową.
- **Obsługiwane interakcje**: Brak interakcji użytkownika.
- **Obsługiwana walidacja**: Walidacja wartości percentage (0-100), wyświetlanie jako liczba całkowita.
- **Typy**: Brak specyficznych typów (używa number).
- **Propsy**:
  ```typescript
  interface ProgressBarProps {
    percentage: number;
    className?: string;
  }
  ```

### LoadingState

- **Opis komponentu**: Komponent wyświetlany podczas ładowania danych z API. Zapewnia informację zwrotną użytkownikowi o trwającym przetwarzaniu.
- **Główne elementy**: Kontener z animacją ładowania i tekstem informacyjnym.
- **Obsługiwane interakcje**: Brak interakcji użytkownika.
- **Obsługiwana walidacja**: Brak walidacji.
- **Typy**: Brak specyficznych typów.
- **Propsy**: Brak propsów.

### ErrorState

- **Opis komponentu**: Komponent wyświetlany w przypadku błędów ładowania danych. Umożliwia użytkownikowi ponowne próbę załadowania.
- **Główne elementy**: Kontener z komunikatem błędu, przyciskiem ponowienia próby i opcjonalnymi szczegółami błędu.
- **Obsługiwane interakcje**: Kliknięcie przycisku "Spróbuj ponownie" wywołuje ponowne załadowanie danych.
- **Obsługiwana walidacja**: Brak walidacji.
- **Typy**: Brak specyficznych typów.
- **Propsy**:
  ```typescript
  interface ErrorStateProps {
    error: string;
    onRetry: () => void;
  }
  ```

## 5. Typy

### Istniejące typy (z types.ts)

- `GoalsReportDTO`: Główny typ odpowiedzi API zawierający tablicę celów.
- `GoalReportItemDTO`: Typ pojedynczego elementu celu z polami id, name, progress_percentage, remaining_amount, predicted_completion_date.

### Nowe typy ViewModel

```typescript
// ViewModel dla głównego komponentu GoalsReport
interface GoalsReportViewModel {
  isLoading: boolean;
  error: string | null;
  goals: GoalCardViewModel[];
}

// ViewModel dla komponentu GoalCard z dodatkowymi polami computed
interface GoalCardViewModel extends GoalReportItemDTO {
  formatted_percentage: string; // np. "75%"
  formatted_remaining_amount: string; // np. "250.00 PLN"
  formatted_predicted_date?: string; // np. "31 grudnia 2024" lub undefined
}
```

## 6. Zarządzanie stanem

Stan widoku będzie zarządzany przez customowy hook `useGoalsReport` w pliku `src/hooks/useGoalsReport.ts`. Hook będzie zawierał:

- `isLoading: boolean` - stan ładowania danych
- `error: string | null` - komunikat błędu lub null
- `goals: GoalCardViewModel[]` - przetworzone dane celów

Hook będzie używał `useState` dla lokalnego stanu i `useEffect` do wywołania API przy montowaniu komponentu. Dane będą przetwarzane z formatu DTO na ViewModel, włącznie z formatowaniem wartości walutowych i procentowych.

## 7. Integracja API

Integracja odbędzie się przez wywołanie endpointu `GET /api/reports/goals` przy użyciu Supabase client. Wywołanie będzie wykonane w hooku `useGoalsReport` przy pomocy metody:

```typescript
const { data, error } = await supabase
  .from("goals")
  .select("id, name, target_amount, current_amount")
  .eq("user_id", userId);
```

**Typy żądania**: Brak ciała żądania (GET request).
**Typ odpowiedzi**: `GoalsReportDTO` z tablicą `GoalReportItemDTO[]`.

Obliczenia `progress_percentage` i `remaining_amount` będą wykonane po stronie serwera zgodnie z implementacją endpointu.

## 8. Interakcje użytkownika

- **Ładowanie strony**: Automatyczne pobranie danych celów przy wejściu na stronę
- **Wyświetlanie listy celów**: Przeglądanie kart celów w formie listy lub siatki
- **Responsywność**: Automatyczne dostosowanie layoutu na urządzeniach mobilnych (Tailwind responsive classes)
- **Obsługa błędów**: Możliwość ponowienia próby załadowania w przypadku błędu

## 9. Warunki i walidacja

- **Uwierzytelnianie**: Sprawdzane przez middleware Astro - brak sesji powoduje przekierowanie na stronę logowania
- **Struktura danych**: Walidacja obecności wymaganych pól w odpowiedzi API (id, name, progress_percentage, remaining_amount)
- **Wartości liczbowe**:
  - `progress_percentage`: zakres 0-100, wyświetlanie jako procent
  - `remaining_amount`: wartość >= 0, formatowanie jako waluta PLN
- **Daty**: `predicted_completion_date` opcjonalne, formatowanie do czytelnej formy jeśli obecne
- **Puste stany**: Wyświetlanie odpowiedniego komunikatu gdy użytkownik nie ma celów

## 10. Obsługa błędów

- **401 Unauthorized**: Automatyczne przekierowanie do strony logowania przez middleware
- **Błędy sieciowe**: Wyświetlanie komponentu ErrorState z przyciskiem ponowienia próby
- **Błędy serwera (5xx)**: Wyświetlanie ogólnego komunikatu błędu z opcją retry
- **Nieprawidłowe dane**: Logowanie błędu do konsoli, wyświetlanie fallback content
- **Puste wyniki**: Wyświetlanie komunikatu "Brak celów do wyświetlenia"
- **Timeout**: Implementacja timeout dla wywołań API z odpowiednią obsługą

## 11. Kroki implementacji

1. **Utworzenie struktury plików**:
   - Utwórz `src/pages/reports/goals.astro` - strona główna
   - Utwórz `src/components/reports/GoalsReport.tsx` - główny komponent
   - Utwórz `src/components/reports/GoalCard.tsx` - komponent karty celu
   - Utwórz `src/components/ui/ProgressBar.tsx` - komponent paska progresu
   - Utwórz `src/hooks/useGoalsReport.ts` - custom hook do zarządzania stanem

2. **Implementacja hooka useGoalsReport**:
   - Dodaj stany isLoading, error, goals
   - Zaimplementuj funkcję fetchGoalsReport wywołującą API
   - Dodaj przetwarzanie danych z DTO na ViewModel
   - Obsłuż błędy i edge cases

3. **Implementacja komponentów UI**:
   - Zaimplementuj LoadingState i ErrorState (mogą być reużywalne z innych widoków)
   - Zaimplementuj ProgressBar używając Tailwind CSS
   - Zaimplementuj GoalCard z odpowiednim layoutem i formatowaniem

4. **Implementacja głównego komponentu GoalsReport**:
   - Użyj hooka useGoalsReport do zarządzania stanem
   - Zaimplementuj warunkowe renderowanie stanów (loading, error, success)
   - Renderuj listę GoalCard w responsywnym layoutcie

5. **Implementacja strony Astro**:
   - Utwórz goals.astro z podstawowym layoutem
   - Zaimportuj i użyj komponentu GoalsReport
   - Dodaj odpowiednie meta tagi i tytuł strony

6. **Testowanie i walidacja**:
   - Przetestuj z różnymi scenariuszami (loading, error, empty state)
   - Sprawdź responsywność na różnych urządzeniach
   - Waliduj formatowanie wartości i obsługę błędów
   - Przetestuj integrację z API

7. **Optymalizacja i refaktoryzacja**:
   - Dodaj memoization komponentów jeśli potrzebne
   - Przejrzyj kod pod kątem zgodności z zasadami clean code
   - Dodaj dodatkowe testy jednostkowe jeśli wymagane

# Plan implementacji widoku logowania użytkownika

## 1. Przegląd

Widok logowania umożliwia uwierzytelnienie istniejących użytkowników aplikacji HouseFlow poprzez formularz z polami email i hasło. Po pomyślnym logowaniu użytkownik zostaje przekierowany do dashboardu. Widok obsługuje również opcjonalne przypomnienie hasła oraz link do rejestracji. Używa komponentów Shadcn/ui dla formularza i toastów do wyświetlania błędów. Integruje się z Supabase Auth SDK dla autentyfikacji oraz opcjonalnie z endpointem metryk.

## 2. Routing widoku

Widok powinien być dostępny pod ścieżką `/login`. W aplikacji opartej na Astro, należy utworzyć plik strony `src/pages/login.astro`.

## 3. Struktura komponentów

- **LoginPage** (strona Astro): Główny kontener strony, zawiera layout i komponent LoginForm.
  - **LoginForm** (komponent React): Główny formularz logowania.
    - **Form** (Shadcn/ui): Kontener formularza.
      - **EmailInput** (Shadcn/ui Input): Pole na email.
      - **PasswordInput** (Shadcn/ui Input): Pole na hasło.
      - **LoginButton** (Shadcn/ui Button): Przycisk logowania.
      - **ForgotPasswordLink** (Shadcn/ui Link): Link do przypomnienia hasła.
      - **RegisterLink** (Shadcn/ui Link): Link do rejestracji.
    - **ErrorToast** (Shadcn/ui Toast): Komponent do wyświetlania błędów.

## 4. Szczegóły komponentów

### LoginForm

- **Opis komponentu**: Główny komponent formularza logowania, zarządza stanem pól, walidacją i obsługuje submit. Składa się z pól wejściowych, przycisków i linków. Przeprowadza walidację przed wysłaniem żądania.
- **Główne elementy HTML i komponenty dzieci**: Form (Shadcn Form), Input dla email i password, Button dla logowania, Link dla forgot password i register, Toast dla błędów.
- **Obsługiwane zdarzenia**: onSubmit (walidacja i logowanie), onChange dla pól (aktualizacja stanu), onClick dla linków (przekierowanie lub reset hasła).
- **Warunki walidacji**: Email musi mieć prawidłowy format (regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/), hasło nie może być puste. Walidacja odbywa się na poziomie formularza przed submit.
- **Typy**: LoginViewModel: { email: string; password: string; }; ErrorDTO: { message: string; }.
- **Propsy**: Brak propsów od rodzica; komponent jest samodzielny.

### LoginButton

- **Opis komponentu**: Przycisk do wysłania formularza logowania. Wyświetla stan ładowania podczas przetwarzania.
- **Główne elementy HTML i komponenty dzieci**: Button (Shadcn/ui).
- **Obsługiwane zdarzenia**: onClick (wywołuje submit formularza).
- **Warunki walidacji**: Przycisk jest wyłączony, jeśli formularz nie jest prawidłowy lub trwa ładowanie.
- **Typy**: Brak specjalnych typów; używa propsów z Button.
- **Propsy**: disabled: boolean (na podstawie walidacji i stanu ładowania).

### ForgotPasswordLink

- **Opis komponentu**: Link do funkcji przypomnienia hasła. Wywołuje reset hasła poprzez Supabase.
- **Główne elementy HTML i komponenty dzieci**: Link (Shadcn/ui).
- **Obsługiwane zdarzenia**: onClick (wywołuje resetPasswordForEmail).
- **Warunki walidacji**: Brak; link zawsze dostępny.
- **Typy**: Brak.
- **Propsy**: Brak.

### RegisterLink

- **Opis komponentu**: Link przekierowujący do strony rejestracji.
- **Główne elementy HTML i komponenty dzieci**: Link (Shadcn/ui).
- **Obsługiwane zdarzenia**: onClick (navigate do /register).
- **Warunki walidacji**: Brak.
- **Typy**: Brak.
- **Propsy**: Brak.

### ErrorToast

- **Opis komponentu**: Wyświetla komunikaty błędów podczas logowania.
- **Główne elementy HTML i komponenty dzieci**: Toast (Shadcn/ui).
- **Obsługiwane zdarzenia**: Automatyczne zamknięcie po czasie.
- **Warunki walidacji**: Brak.
- **Typy**: ErrorDTO: { message: string; }.
- **Propsy**: error: string | null.

## 5. Typy

- **LoginViewModel**: Model widoku dla formularza logowania. Pola: email (string): adres email użytkownika; password (string): hasło użytkownika. Używany do zarządzania stanem komponentu LoginForm.
- **ErrorDTO**: Struktura dla błędów. Pola: message (string): komunikat błędu. Używany w ErrorToast i obsłudze błędów z Supabase.

## 6. Zarządzanie stanem

Stan zarządzany jest w komponencie LoginForm przy użyciu useState: email, password, isLoading (boolean dla stanu ładowania), error (string | null dla błędów). Dla logowania używany jest custom hook useAuth, który enkapsuluje wywołania Supabase Auth.signInWithPassword, obsługuje błędy i przekierowuje po sukcesie.

## 7. Integracja API

Integracja z Supabase Auth SDK: wywołanie signInWithPassword(email, password), które zwraca obiekt z user i session lub błąd. Opcjonalnie, jeśli metryki są włączone, wysyła POST /api/metrics/login z timestampem (typ żądania: { timestamp: string }, odpowiedź: MessageDTO: { message: string }).

## 8. Interakcje użytkownika

- Użytkownik wypełnia pola email i password.
- Po kliknięciu przycisku logowania: walidacja pól, wywołanie API logowania, wyświetlenie toasta w przypadku błędu lub przekierowanie do dashboardu.
- Kliknięcie linku "Przypomnij hasło": wywołanie resetu hasła, wyświetlenie potwierdzenia.
- Kliknięcie linku "Zarejestruj się": przekierowanie do /register.

## 9. Warunki i walidacja

- Email: sprawdzany na format podczas wprowadzania i przed submit (wpływa na włączenie przycisku i wyświetlenie błędu).
- Hasło: sprawdzane na niepustość przed submit (blokuje submit jeśli puste).
- Stan interfejsu: przycisk wyłączony przy błędnej walidacji lub ładowaniu; toast widoczny przy błędach.

## 10. Obsługa błędów

Błędy z Supabase (np. nieprawidłowe dane) są przechwytywane w useAuth, ustawiane w stanie error i wyświetlane w ErrorToast. Dla błędów sieci: ogólny komunikat "Błąd połączenia". Przypadki brzegowe: pusty formularz (walidacja blokuje), nieprawidłowy email (komunikat walidacji).

## 11. Kroki implementacji

1. Utwórz plik strony `src/pages/login.astro` z podstawowym layoutem.
2. Zaimplementuj komponent LoginForm w `src/components/LoginForm.tsx`, używając Shadcn/ui Form i pól.
3. Dodaj zarządzanie stanem (useState) i walidację w LoginForm.
4. Zintegruj Supabase Auth w custom hook useAuth w `src/lib/hooks/useAuth.ts`.
5. Dodaj obsługę błędów i toast w LoginForm.
6. Dodaj linki ForgotPassword i Register z obsługą zdarzeń.
7. Przetestuj integrację z Supabase i endpoint metryk (jeśli włączony).
8. Dodaj responsywność przy użyciu Tailwind CSS.
9. Przeprowadź testy: poprawne logowanie, błędne dane, walidacja, przekierowania.

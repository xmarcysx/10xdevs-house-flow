# Plan implementacji widoku rejestracji użytkownika

## 1. Przegląd

Widok rejestracji użytkownika umożliwia nowym użytkownikom aplikacji HouseFlow utworzenie konta poprzez formularz rejestracyjny. Po pomyślnej rejestracji użytkownik zostaje automatycznie zalogowany i przekierowany do dashboardu. Widok skupia się na walidacji danych wejściowych zgodnie z wymaganiami bezpieczeństwa oraz na zapewnieniu intuicyjnego interfejsu użytkownika.

## 2. Routing widoku

Widok powinien być dostępny pod ścieżką `/register` jako strona Astro w katalogu `src/pages/register.astro`.

## 3. Struktura komponentów

- **RegisterPage**: Główna strona Astro zawierająca layout i komponent RegisterForm.
- **RegisterForm**: Komponent React odpowiedzialny za formularz rejestracyjny, zawierający pola wejściowe, walidację i obsługę submit.

## 4. Szczegóły komponentów

### RegisterPage

- **Opis komponentu**: Główna strona Astro dla rejestracji, zawiera layout aplikacji i komponent RegisterForm. Odpowiada za renderowanie strony i integrację z frameworkiem Astro.
- **Główne elementy**: Layout aplikacji (Layout.astro), komponent RegisterForm jako dziecko.
- **Obsługiwane interakcje**: Brak bezpośrednich interakcji, deleguje do RegisterForm.
- **Obsługiwana walidacja**: Brak, walidacja odbywa się w RegisterForm.
- **Typy**: Brak specyficznych typów, korzysta z ogólnych typów Astro.
- **Propsy**: Brak, jako strona Astro nie przyjmuje propsów.

### RegisterForm

- **Opis komponentu**: Komponent React z formularzem rejestracyjnym, zawiera pola dla email, hasła i potwierdzenia hasła, przycisk submit oraz link do logowania. Obsługuje walidację po stronie klienta i integrację z Supabase Auth.
- **Główne elementy**: Form z Shadcn/ui, Input dla email, Input dla password, Input dla confirmPassword, Button dla submit, Link do strony logowania, Toast dla komunikatów błędów/sukcesu.
- **Obsługiwane interakcje**: onSubmit formularza (wysłanie danych rejestracji), onChange dla pól wejściowych (aktualizacja stanu), onClick dla linku logowania (nawigacja).
- **Obsługiwana walidacja**:
  - Email: Wymagany, format email, unikalność sprawdzana przez Supabase.
  - Hasło: Wymagane, minimum 8 znaków, zawiera przynajmniej jedną wielką i jedną małą literę.
  - Potwierdzenie hasła: Wymagane, musi być identyczne z hasłem.
  - Walidacja w czasie rzeczywistym po zmianie pól, wyświetlanie błędów pod polami.
- **Typy**: RegisterFormData (ViewModel), MessageDTO (dla błędów), typy z Supabase Auth SDK.
- **Propsy**: Brak, komponent jest samodzielny.

## 5. Typy

- **RegisterFormData**: ViewModel dla stanu formularza.
  - email: string - Adres email użytkownika.
  - password: string - Hasło użytkownika.
  - confirmPassword: string - Potwierdzenie hasła.
- **MessageDTO**: Istniejący typ z types.ts, używany dla komunikatów błędów.
  - message: string - Treść komunikatu.
- Dodatkowo, wykorzystane typy z Supabase Auth SDK, takie jak AuthResponse i AuthError.

## 6. Zarządzanie stanem

Stan formularza zarządzany jest lokalnie w komponencie RegisterForm przy użyciu hooka useState React. Dla obsługi rejestracji używany jest customowy hook useRegister, który enkapsuluje logikę wywołania API Supabase, obsługę błędów i nawigację po sukcesie. Hook zwraca funkcje do submit formularza oraz stan ładowania i błędów.

## 7. Integracja API

Integracja odbywa się przez Supabase Auth SDK. Przy submit formularza wywoływane jest `supabase.auth.signUp({ email, password })`, które zwraca AuthResponse zawierający dane użytkownika lub AuthError. Po pomyślnej rejestracji następuje automatyczne logowanie poprzez `supabase.auth.signInWithPassword`. Typy żądania: { email: string, password: string }, typy odpowiedzi: AuthResponse lub AuthError.

## 8. Interakcje użytkownika

- Użytkownik wypełnia pola email, password i confirmPassword.
- Po kliknięciu przycisku "Zarejestruj się" następuje walidacja i wysłanie danych.
- W przypadku sukcesu: Wyświetlenie toastu sukcesu, automatyczne logowanie i przekierowanie do dashboardu.
- W przypadku błędów: Wyświetlenie toastu z błędem lub błędów pod polami.
- Link "Zaloguj się" przekierowuje do strony logowania.

## 9. Warunki i walidacja

- **Email**: Sprawdzany format email i unikalność przez Supabase przy rejestracji. Błędne dane powodują wyświetlenie komunikatu błędu.
- **Hasło**: Walidacja długości (min 8 znaków) i obecności wielkiej/małej litery przy pomocy regex. Niezgodność blokuje submit i wyświetla błąd.
- **Potwierdzenie hasła**: Sprawdzane równość z hasłem. Błąd wyświetla komunikat "Hasła nie są identyczne".
- Walidacja wpływa na stan interfejsu poprzez wyłączenie przycisku submit i wyświetlanie błędów.

## 10. Obsługa błędów

- Błędy walidacji: Wyświetlane natychmiast pod polami wejściowymi.
- Błędy API: Obsługiwane przez toast z komunikatem z AuthError.message.
- Błędy sieci: Ogólny komunikat "Wystąpił błąd podczas rejestracji".
- Edge cases: Próba rejestracji z istniejącym emailem - komunikat "Email już istnieje".

## 11. Kroki implementacji

1. Utworzyć stronę Astro `src/pages/register.astro` z podstawowym layoutem i miejscem na RegisterForm.
2. Zaimplementować komponent RegisterForm w `src/components/RegisterForm.tsx` z formularzem Shadcn/ui.
3. Dodać pola wejściowe dla email, password, confirmPassword z walidacją.
4. Zaimplementować customowy hook useRegister dla obsługi rejestracji i logowania przez Supabase.
5. Dodać obsługę submit formularza z wywołaniem hooka i nawigacją.
6. Zintegrować toast dla komunikatów błędów i sukcesu.
7. Dodać link do strony logowania.
8. Przetestować walidację i integrację API.
9. Dodać responsywność dla urządzeń mobilnych zgodnie z PRD.

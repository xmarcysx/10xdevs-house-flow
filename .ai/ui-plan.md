# Architektura UI dla HouseFlow

## 1. Przegląd struktury UI

Architektura interfejsu użytkownika dla HouseFlow została zaprojektowana w oparciu o wymagania produktu (PRD), plan API oraz notatki z sesji planowania. Główny nacisk położono na prostotę, responsywność i mobilność, z wykorzystaniem komponentów Shadcn/ui, Tailwind 4 oraz integracją z Supabase Auth. Struktura obejmuje dashboard główny jako centrum nawigacji, dedykowane widoki dla zarządzania wpływami, wydatkami, kategoriami i celami oszczędnościowymi, a także raporty. Wszystkie widoki są chronione przez middleware JWT, z obsługą błędów poprzez toast notifications i strony błędów. Architektura zapewnia płynne podróże użytkownika między widokami, z priorytetem na szybkie formularze, filtry i wizualizacje danych, rozwiązując punkty bólu związane z ręcznym śledzeniem budżetu poprzez intuicyjne narzędzia.

## 2. Lista widoków

- **Nazwa widoku**: Rejestracja użytkownika  
  **Ścieżka widoku**: /register  
  **Główny cel**: Pozwolić nowym użytkownikom na utworzenie konta z walidacją danych.  
  **Kluczowe informacje do wyświetlenia**: Formularz z polami email, hasło i potwierdzenie hasła; komunikaty błędów walidacji.  
  **Kluczowe komponenty widoku**: Formularz Shadcn/ui z przyciskiem rejestracji, link do logowania.  
  **UX, dostępność i względy bezpieczeństwa**: Prosty formularz z natychmiastową walidacją; dostępny dla czytników ekranowych; bezpieczeństwo przez wymuszanie silnych haseł i sprawdzenie unikalności email w API.

- **Nazwa widoku**: Logowanie użytkownika  
  **Ścieżka widoku**: /login  
  **Główny cel**: Uwierzytelnienie istniejących użytkowników i przekierowanie do dashboardu.  
  **Kluczowe informacje do wyświetlenia**: Formularz z polami email i hasło; opcja przypomnienia hasła.  
  **Kluczowe komponenty widoku**: Formularz Shadcn/ui z przyciskiem logowania, link do rejestracji.  
  **UX, dostępność i względy bezpieczeństwa**: Szybkie logowanie z opcjami; touch-friendly na mobile; JWT token przechowywany bezpiecznie w localStorage z obsługą wygaśnięcia.

- **Nazwa widoku**: Dashboard główny  
  **Ścieżka widoku**: /  
  **Główny cel**: Zapewnić przegląd ogólny budżetu miesięcznego i szybki dostęp do kluczowych sekcji.  
  **Kluczowe informacje do wyświetlenia**: Karta podsumowania z wpływami, wydatkami, pozostałą kwotą; wykres kołowy procentowego podziału kategorii; szybkie linki do wydatków, wpływów i celów.  
  **Kluczowe komponenty widoku**: Karty Shadcn/ui dla podsumowania, wykres kołowy (lazy-loaded), przyciski nawigacyjne.  
  **UX, dostępność i względy bezpieczeństwa**: Responsywny layout z dużymi liczbami na mobile; animacje Tailwind dla płynności; chroniony przez middleware JWT.

- **Nazwa widoku**: Lista wydatków  
  **Ścieżka widoku**: /expenses  
  **Główny cel**: Wyświetlić listę wydatków z opcjami filtrowania i zarządzania.  
  **Kluczowe informacje do wyświetlenia**: Tabela wydatków z kolumnami data, kwota, kategoria, opis; filtry po miesiącu i kategorii; przyciski dodaj/edytuj/usuń.  
  **Kluczowe komponenty widoku**: Tabela Shadcn/ui z paginacją, przycisk eksportu do CSV, modalne formularze dla akcji.  
  **UX, dostępność i względy bezpieczeństwa**: Filtry dla szybkiego przeszukiwania; touch-friendly przyciski; synchronizacja z API przez hooks, z toastami dla błędów.

- **Nazwa widoku**: Dodaj/Edytuj wydatek  
  **Ścieżka widoku**: Modal w /expenses lub strona /expenses/add/edit  
  **Główny cel**: Umożliwić dodanie lub edycję wydatku z walidacją.  
  **Kluczowe informacje do wyświetlenia**: Formularz z polami kwota, data, kategoria (select z API), opis; przyciski zapisz/anuluj.  
  **Kluczowe komponenty widoku**: Formularz Shadcn/ui z date picker i select, toast dla sukcesu/błędu.  
  **UX, dostępność i względy bezpieczeństwa**: Szybka walidacja po stronie klienta; potwierdzenie usunięcia bez dodatkowych kroków; bezpieczna wysyłka przez hooks.

- **Nazwa widoku**: Lista wpływów  
  **Ścieżka widoku**: /incomes  
  **Główny cel**: Wyświetlić listę wpływów z opcjami filtrowania i zarządzania.  
  **Kluczowe informacje do wyświetlenia**: Tabela wpływów z kolumnami data, kwota, opis, źródło; filtry po miesiącu; przyciski dodaj/edytuj/usuń.  
  **Kluczowe komponenty widoku**: Tabela Shadcn/ui z paginacją, przycisk eksportu do CSV, modalne formularze.  
  **UX, dostępność i względy bezpieczeństwa**: Podobne do listy wydatków; filtry i toasty dla błędów.

- **Nazwa widoku**: Dodaj/Edytuj wpływ  
  **Ścieżka widoku**: Modal w /incomes lub strona /incomes/add/edit  
  **Główny cel**: Umożliwić dodanie lub edycję wpływu z walidacją.  
  **Kluczowe informacje do wyświetlenia**: Formularz z polami kwota, data, opis, źródło; przyciski zapisz/anuluj.  
  **Kluczowe komponenty widoku**: Formularz Shadcn/ui, toast dla wyników.  
  **UX, dostępność i względy bezpieczeństwa**: Walidacja kwoty > 0; bezpieczna integracja z API.

- **Nazwa widoku**: Lista kategorii  
  **Ścieżka widoku**: /categories  
  **Główny cel**: Zarządzać kategoriami wydatków użytkownika.  
  **Kluczowe informacje do wyświetlenia**: Lista kategorii z nazwą i statusem domyślny; przyciski dodaj/edytuj/usuń (tylko własne).  
  **Kluczowe komponenty widoku**: Lista Shadcn/ui, formularze modalne.  
  **UX, dostępność i względy bezpieczeństwa**: Proste zarządzanie; toast dla błędów, np. próba usunięcia domyślnej kategorii.

- **Nazwa widoku**: Dodaj/Edytuj kategorię  
  **Ścieżka widoku**: Modal w /categories  
  **Główny cel**: Tworzyć lub edytować kategorię.  
  **Kluczowe informacje do wyświetlenia**: Formularz z polem nazwa; przyciski zapisz/anuluj.  
  **Kluczowe komponenty widoku**: Formularz Shadcn/ui, toast.  
  **UX, dostępność i względy bezpieczeństwa**: Walidacja unikalności per użytkownik; bezpieczna wysyłka.

- **Nazwa widoku**: Lista celów oszczędnościowych  
  **Ścieżka widoku**: /goals  
  **Główny cel**: Wyświetlić cele z progresem i opcjami zarządzania.  
  **Kluczowe informacje do wyświetlenia**: Lista celów z nazwą, progresem procentowym, pozostałą kwotą, predykcją daty; przyciski dodaj/edytuj/usuń.  
  **Kluczowe komponenty widoku**: Karty Shadcn/ui z paskami progresu, wykres liniowy lazy-loaded, modalne formularze.  
  **UX, dostępność i względy bezpieczeństwa**: Wizualizacja progresu; filtry i toasty.

- **Nazwa widoku**: Dodaj/Edytuj cel  
  **Ścieżka widoku**: Modal w /goals  
  **Główny cel**: Tworzyć lub edytować cel oszczędnościowy.  
  **Kluczowe informacje do wyświetlenia**: Formularz z nazwą i kwotą docelową; przyciski zapisz/anuluj.  
  **Kluczowe komponenty widoku**: Formularz Shadcn/ui, toast.  
  **UX, dostępność i względy bezpieczeństwa**: Walidacja kwoty > 0; bezpieczna integracja.

- **Nazwa widoku**: Szczegóły celu (wpłaty)  
  **Ścieżka widoku**: /goals/{id}  
  **Główny cel**: Zarządzać wpłatami na konkretny cel.  
  **Kluczowe informacje do wyświetlenia**: Lista wpłat z datą, kwotą, opisem; formularz dodania wpłaty; wykres progresu.  
  **Kluczowe komponenty widoku**: Tabela wpłat, formularz, wykres liniowy.  
  **UX, dostępność i względy bezpieczeństwa**: Aktualizacja progresu po mutacjach; toast dla błędów.

- **Nazwa widoku**: Raport miesięczny  
  **Ścieżka widoku**: /reports/monthly  
  **Główny cel**: Wyświetlić podsumowanie wydatków miesięcznych.  
  **Kluczowe informacje do wyświetlenia**: Lista wydatków z sumami per kategoria; wybór miesiąca.  
  **Kluczowe komponenty widoku**: Tabela Shadcn/ui, przycisk eksportu CSV.  
  **UX, dostępność i względy bezpieczeństwa**: Filtry po miesiącu; toasty dla błędów API.

- **Nazwa widoku**: Raport celów  
  **Ścieżka widoku**: /reports/goals  
  **Główny cel**: Przegląd wszystkich celów z progresem.  
  **Kluczowe informacje do wyświetlenia**: Lista celów z paskami progresu i predykcjami.  
  **Kluczowe komponenty widoku**: Karty z paskami, wykresy liniowe.  
  **UX, dostępność i względy bezpieczeństwa**: Wizualizacja całościowa; chroniony widok.

- **Nazwa widoku**: Ustawienia (opcjonalne metryki)  
  **Ścieżka widoku**: /settings  
  **Główny cel**: Zarządzać opcjami metryk aktywności.  
  **Kluczowe informacje do wyświetlenia**: Przełącznik dla zbierania timestampów logowań.  
  **Kluczowe komponenty widoku**: Formularz Shadcn/ui.  
  **UX, dostępność i względy bezpieczeństwa**: Proste ustawienia; bezpieczna aktualizacja.

- **Nazwa widoku**: Błąd 500  
  **Ścieżka widoku**: /500  
  **Główny cel**: Obsłużyć krytyczne błędy aplikacji.  
  **Kluczowe informacje do wyświetlenia**: Komunikat błędu, przycisk "Spróbuj ponownie", link do dashboardu.  
  **Kluczowe komponenty widoku**: Karta błędu z przyciskami.  
  **UX, dostępność i względy bezpieczeństwa**: Fallback dla błędów; bezpieczne przekierowania.

## 3. Mapa podróży użytkownika

Podróż użytkownika zaczyna się od rejestracji lub logowania, prowadząc do dashboardu głównego, gdzie użytkownik widzi podsumowanie budżetu i ma szybki dostęp do sekcji. Główny przypadek użycia (zarządzanie wydatkami): Z dashboardu -> Lista wydatków -> Dodaj wydatek (formularz modalny) -> Powrót do listy z toastem sukcesu -> Edytuj lub usuń (potwierdzenie dla usunięcia) -> Filtruj listę. Podobnie dla wpływów i celów. Dla celów: Lista celów -> Szczegóły celu -> Dodaj wpłatę -> Aktualizacja progresu. Raporty dostępne z nawigacji dla przeglądu. Wszędzie obsługa błędów (np. 401 przekierowanie do logowania) i płynne przejścia bez przeładowań.

## 4. Układ i struktura nawigacji

Nawigacja opiera się na sidebarze na desktopie (ukrytym na mobile) i drawerze (hamburger menu) na mobile, z linkami do dashboardu, wydatków, wpływów, kategorii, celów i raportów. Routing przez Astro zapewnia płynne przejścia. Wszystkie chronione widoki wymagają JWT; błędne tokeny powodują przekierowanie do logowania. Struktura jest hierarchiczna: dashboard jako root, sekcje jako podstrony z modalami dla akcji, aby uniknąć przeładowań.

## 5. Kluczowe komponenty

- **Karta podsumowania**: Shadcn/ui Card do wyświetlania liczb budżetu, używana w dashboardzie.
- **Formularz**: Shadcn/ui Form z walidacją, używany w rejestracji, logowaniu, dodawaniu/ediytowaniu zasobów.
- **Tabela**: Shadcn/ui Table z paginacją i filtrami, dla list wydatków/wpływów/wpłat.
- **Wykres kołowy/liniowy**: Lazy-loaded komponenty dla wizualizacji, używane w dashboardzie i sekcji celów.
- **Toast**: Shadcn/ui Toast dla błędów/sukcesów, globalny dla wszystkich widoków.
- **Sidebar/Drawer**: Shadcn/ui dla nawigacji, responsywny.
- **Error Boundary**: React dla obsługi błędów sieciowych.

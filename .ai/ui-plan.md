# Architektura UI dla HouseFlow

## 1. Przegląd struktury UI

Architektura interfejsu użytkownika dla HouseFlow została zaprojektowana w oparciu o wymagania produktu (PRD), plan API oraz notatki z sesji planowania. Główny nacisk położono na prostotę, responsywność i mobilność, z wykorzystaniem komponentów Shadcn/ui, Tailwind 4 oraz integracją z Supabase Auth. Struktura obejmuje dashboard główny jako centrum nawigacji, dedykowane widoki dla zarządzania wpływami, wydatkami, kategoriami i celami oszczędnościowymi, a także raporty. Wszystkie widoki są chronione przez middleware JWT, z obsługą błędów poprzez toast notifications i strony błędów. Architektura zapewnia płynne podróże użytkownika między widokami, z priorytetem na szybkie formularze, filtry i wizualizacje danych, rozwiązując punkty bólu związane z ręcznym śledzeniem budżetu poprzez intuicyjne narzędzia.

## 2. Lista Widoków

### 1. Rejestracja użytkownika

- **URL**: /register
- **Co tam się robi**: Pozwolić nowym użytkownikom na utworzenie konta z walidacją danych (email unikalny, hasło 8+ znaków z wielką i małą literą). Po rejestracji automatyczne logowanie i przekierowanie do dashboardu.
- **Co ma się znaleźć**: Formularz z polami email, hasło i potwierdzenie hasła; komunikaty błędów walidacji (np. "Hasło zbyt słabe"); przycisk rejestracji; link do logowania. Komponenty: Form Shadcn/ui z walidacją po stronie klienta, toast dla błędów/sukcesu.
- **Z jakich endpointów skorzystamy**: Brak bezpośrednich endpointów API (rejestracja przez Supabase Auth SDK, ale jeśli trzeba, można użyć POST /api/users jeśli zaimplementowane; w planie API to głównie przez Auth).

### 2. Logowanie użytkownika

- **URL**: /login
- **Co tam się robi**: Uwierzytelnienie istniejących użytkowników i przekierowanie do dashboardu. Obsługa przypomnienia hasła (opcjonalne).
- **Co ma się znaleźć**: Formularz z polami email i hasło; opcja przypomnienia hasła (link do resetu); przycisk logowania; link do rejestracji. Komponenty: Form Shadcn/ui, toast dla błędów (np. "Nieprawidłowe dane").
- **Z jakich endpointów skorzystamy**: Brak bezpośrednich endpointów API (logowanie przez Supabase Auth SDK; opcjonalnie POST /api/metrics/login dla metryk, jeśli włączone).

### 3. Dashboard główny

- **URL**: /
- **Co tam się robi**: Zapewnić centrum dowodzenia z kompleksowym przeglądem budżetu miesięcznego, trendów, celów oszczędnościowych, ostatnich transakcji, alertów i szybkim dostępem do kluczowych akcji. Aktualizacja w czasie rzeczywistym, aby użytkownik mógł szybko ocenić sytuację finansową i podjąć decyzje.
- **Co ma się znaleźć**: Karta podsumowania miesięcznego (wpływy, wydatki, pozostała kwota); wykres kołowy procentowego podziału kategorii wydatków; wykres liniowy trendów wpływów/wydatków (porównanie z poprzednim miesiącem); podsumowanie celów (najbliższy cel z paskiem progresu i predykcją daty); lista ostatnich 5-10 transakcji (wydatki i wpływy); alerty (np. ostrzeżenie jeśli wydatki > wpływy lub zbliżający się koniec miesiąca); szybkie przyciski do dodania wydatku/wpływu/celu oraz linki do pełnych sekcji. Komponenty: Card Shadcn/ui, wykres kołowy (lazy-loaded), wykres liniowy (lazy-loaded), paski progresu dla celów, tabela ostatnich transakcji (mini), alerty (toast/badge), przyciski nawigacyjne.
- **Z jakich endpointów skorzystamy**: GET /api/budget/monthly (dla podsumowania i wykresu kołowego z parametrem month, np. bieżący miesiąc); GET /api/goals (dla podsumowania celów, z limit=3 dla najbliższych); GET /api/expenses (dla ostatnich transakcji, z limit=10, sort="date DESC"); GET /api/incomes (opcjonalnie dla ostatnich wpływów, jeśli nie połączone z expenses).

### 4. Lista wydatków

- **URL**: /expenses
- **Co tam się robi**: Wyświetlić listę wydatków z opcjami filtrowania (miesiąc/kategoria), dodawania, edycji i usuwania.
- **Co ma się znaleźć**: Tabela wydatków (kolumny: data, kwota, kategoria, opis); filtry (select dla miesiąca i kategorii); przyciski dodaj/edytuj/usuń (otwierające modal); paginacja. Komponenty: Table Shadcn/ui z paginacją, przyciski, modalne formularze.
- **Z jakich endpointów skorzystamy**: GET /api/expenses (z parametrami page, limit, month, category_id, sort); DELETE /api/expenses/{id} (dla usunięcia).

### 5. Dodaj/Edytuj wydatek

- **URL**: Modal w /expenses lub strona /expenses/add/edit (modal preferowany dla płynności)
- **Co tam się robi**: Umożliwić dodanie lub edycję wydatku (kwota, data, kategoria, opis) z walidacją. Po zapisaniu toast sukcesu i odświeżenie listy.
- **Co ma się znaleźć**: Formularz z polami kwota (number), data (date picker), kategoria (select z API), opis (text); przyciski zapisz/anuluj. Komponenty: Form Shadcn/ui z walidacją, date picker, toast.
- **Z jakich endpointów skorzystamy**: POST /api/expenses (dla dodania); PUT /api/expenses/{id} (dla edycji); GET /api/categories (dla wypełnienia select kategorii).

### 6. Lista wpływów

- **URL**: /incomes
- **Co tam się robi**: Wyświetlić listę wpływów z opcjami filtrowania (miesiąc), dodawania, edycji i usuwania. Podobne do listy wydatków.
- **Co ma się znaleźć**: Tabela wpływów (kolumny: data, kwota, opis, źródło); filtry (select dla miesiąca); przyciski dodaj/edytuj/usuń (modal). Komponenty: Table Shadcn/ui z paginacją, przyciski, modalne formularze.
- **Z jakich endpointów skorzystamy**: GET /api/incomes (z parametrami page, limit, month, sort); DELETE /api/incomes/{id} (dla usunięcia).

### 7. Dodaj/Edytuj wpływ

- **URL**: Modal w /incomes lub strona /incomes/add/edit (modal)
- **Co tam się robi**: Umożliwić dodanie lub edycję wpływu (kwota, data, opis, źródło) z walidacją. Toast po zapisaniu.
- **Co ma się znaleźć**: Formularz z polami kwota, data, opis, źródło; przyciski zapisz/anuluj. Komponenty: Form Shadcn/ui z walidacją, toast.
- **Z jakich endpointów skorzystamy**: POST /api/incomes (dla dodania); PUT /api/incomes/{id} (dla edycji).

### 8. Lista kategorii

- **URL**: /categories
- **Co tam się robi**: Zarządzać kategoriami wydatków (wyświetlanie listy, dodawanie/ediytowanie/usuwanie własnych kategorii; domyślne nieedytowalne).
- **Co ma się znaleźć**: Lista kategorii (nazwa, status domyślny); przyciski dodaj/edytuj/usuń (tylko dla własnych); modal dla akcji. Komponenty: Lista Shadcn/ui, przyciski, modalne formularze.
- **Z jakich endpointów skorzystamy**: GET /api/categories (z parametrami page, limit, sort); DELETE /api/categories/{id} (dla usunięcia własnych).

### 9. Dodaj/Edytuj kategorię

- **URL**: Modal w /categories
- **Co tam się robi**: Tworzyć lub edytować własną kategorię (nazwa) z walidacją unikalności per użytkownik.
- **Co ma się znaleźć**: Formularz z polem nazwa; przyciski zapisz/anuluj. Komponenty: Form Shadcn/ui z walidacją, toast.
- **Z jakich endpointów skorzystamy**: POST /api/categories (dla dodania); PUT /api/categories/{id} (dla edycji).

### 10. Lista celów oszczędnościowych

- **URL**: /goals
- **Co tam się robi**: Wyświetlić cele z progresem (nazwa, %, pozostała kwota, predykcja daty), opcjami zarządzania.
- **Co ma się znaleźć**: Lista celów z paskami progresu; przyciski dodaj/edytuj/usuń; linki do szczegółów. Komponenty: Karty Shadcn/ui z paskami progresu, przyciski, modalne formularze.
- **Z jakich endpointów skorzystamy**: GET /api/goals (z parametrami page, limit, sort); DELETE /api/goals/{id} (dla usunięcia).

### 11. Dodaj/Edytuj cel

- **URL**: Modal w /goals
- **Co tam się robi**: Tworzyć lub edytować cel (nazwa, kwota docelowa) z walidacją.
- **Co ma się znaleźć**: Formularz z polami nazwa i kwota docelowa; przyciski zapisz/anuluj. Komponenty: Form Shadcn/ui z walidacją, toast.
- **Z jakich endpointów skorzystamy**: POST /api/goals (dla dodania); PUT /api/goals/{id} (dla edycji).

### 12. Szczegóły celu (wpłaty)

- **URL**: /goals/{id}
- **Co tam się robi**: Zarządzać wpłatami na cel (lista wpłat, dodawanie/edycja/usunięcie, wykres progresu).
- **Co ma się znaleźć**: Lista wpłat (data, kwota, opis); formularz dodania wpłaty; wykres liniowy progresu. Komponenty: Tabela wpłat, formularz, wykres liniowy lazy-loaded.
- **Z jakich endpointów skorzystamy**: GET /api/goals/{goal_id}/contributions (z parametrami page, limit, sort); POST /api/goals/{goal_id}/contributions (dla dodania); PUT /api/goals/{goal_id}/contributions/{id} (dla edycji); DELETE /api/goals/{goal_id}/contributions/{id} (dla usunięcia); GET /api/goals (dla danych celu).

### 13. Raport miesięczny

- **URL**: /reports/monthly
- **Co tam się robi**: Wyświetlić podsumowanie wydatków miesięcznych (lista z sumami per kategoria, wybór miesiąca).
- **Co ma się znaleźć**: Lista wydatków z sumami per kategoria; select dla miesiąca; przycisk eksportu CSV. Komponenty: Tabela Shadcn/ui, przycisk eksportu.
- **Z jakich endpointów skorzystamy**: GET /api/reports/monthly/{month} (dla danych raportu).

### 14. Raport celów

- **URL**: /reports/goals
- **Co tam się robi**: Przegląd wszystkich celów z progresem (paski, predykcje).
- **Co ma się znaleźć**: Lista celów z paskami progresu i predykcjami dat. Komponenty: Karty z paskami, wykresy liniowe lazy-loaded.
- **Z jakich endpointów skorzystamy**: GET /api/reports/goals (dla listy celów z progresem).

### 15. Ustawienia (opcjonalne metryki)

- **URL**: /settings
- **Co tam się robi**: Zarządzać opcjami metryk (przełącznik dla zbierania timestampów logowań).
- **Co ma się znaleźć**: Przełącznik dla metryk; przycisk zapisz. Komponenty: Form Shadcn/ui.
- **Z jakich endpointów skorzystamy**: POST /api/metrics/login (opcjonalnie, dla aktualizacji ustawień jeśli endpoint rozszerzony; obecnie tylko dla logowań).

### 16. Błąd 500

- **URL**: /500
- **Co tam się robi**: Obsłużyć krytyczne błędy aplikacji (np. błędy API) i pozwolić użytkownikowi spróbować ponownie.
- **Co ma się znaleźć**: Komunikat błędu; przycisk "Spróbuj ponownie"; link do dashboardu. Komponenty: Karta błędu z przyciskami.
- **Z jakich endpointów skorzystamy**: Brak (to fallback; ewentualnie retry dla poprzedniego endpointu).

Ten plan pokrywa wszystkie kluczowe widoki z UI planu, skupiając się na prostocie i responsywności. Endpointy są dopasowane do potrzeb (np. filtrowanie, paginacja). Przed implementacją zalecam sprawdzenie istniejących usług (w `src/services/`) i walidacji (w `src/lib/validation/`), aby uniknąć duplikacji kodu.

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

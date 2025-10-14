# Dokument wymagań produktu (PRD) - HouseFlow

## 1. Przegląd produktu

HouseFlow to aplikacja MVP przeznaczona do upraszczania zarządzania domowym budżetem. Umożliwia użytkownikom rejestrowanie wpływów i wydatków, śledzenie kategorii wydatków oraz monitorowanie postępów w osiąganiu celów oszczędnościowych. Aplikacja skupia się na prostocie i responsywności, wspierając urządzenia mobilne z pełną funkcjonalnością. Głównym celem jest zastąpienie męczącego śledzenia budżetu w arkuszach kalkulacyjnych i notatkach, dostarczając intuicyjne narzędzia do szybkiego sprawdzania stanu finansów.

## 2. Problem użytkownika

Użytkownicy borykają się z trudnościami w śledzeniu domowego budżetu za pomocą arkuszy kalkulacyjnych i notatek, co jest podatne na błędy i czasochłonne. Trudno szybko określić pozostałą kwotę po wypłatach, rozkład wydatków na kategorie (np. dom, apteka, środki czystości, przyjemności, rozrywka, ubrania, żywność) oraz postęp w osiąganiu długoterminowych celów oszczędnościowych (np. budowa domu). HouseFlow rozwiązuje ten problem poprzez uproszczenie rejestracji transakcji, automatyczne pilnowanie kategorii i dostarczanie prostych predykcji dotyczących osiągnięcia celów.

## 3. Wymagania funkcjonalne

- Rejestrowanie wpływów: Dodanie wypłaty z kwotą, datą i opcjonalnym opisem. Możliwość edycji i usunięcia wypłat bez dodatkowych potwierdzeń.
- Rejestrowanie wydatków: Dodanie, edycja i usunięcie wydatku z kwotą, datą, kategorią (predefiniowane: dom, apteka, środki czystości, przyjemności, rozrywka, ubrania, żywność, inne; plus własne kategorie per użytkownik) i opisem.
- Przegląd listy wydatków: Lista z filtrem po miesiącu lub kategorii.
- System kont użytkowników: Rejestracja i logowanie z walidacją email i hasła (wymagania: 8 znaków, wielkie i małe litery), opcjonalne przypomnienie hasła. Dane powiązane z użytkownikiem.
- Widok „Budżet miesiąca”: Obliczenie suma wypłat minus suma wydatków równa pozostałej kwocie, procentowy podział wydatków po kategoriach (prosty wykres lub summary tekstowe).
- Cele oszczędnościowe: Tworzenie celu z nazwą i kwotą docelową, dodawanie wpłat na cel, wyświetlanie progresu w procentach i pozostałej kwoty, automatyczna predykcja daty osiągnięcia na podstawie średniej z ostatnich miesięcy, liniowy wykres progresu z uproszczoną historią wpłat.
- Interfejs raportowy: Widok miesięczny z listą wydatków i sumami per kategoria, widok celów z paskiem progresu liniowym.
- Responsywność i mobilność: Pełna funkcjonalność z optymalizacją układów dla urządzeń mobilnych.
- Bezpieczeństwo: Standardowe środki bezpieczeństwa bez dodatkowego szyfrowania wrażliwych danych.
- Baza danych: Zaprojektowana z myślą o przyszłym eksporcie danych (np. CSV).
- Metryki: Własne mechanizmy mierzenia aktywności (timestampy logowań) z opcjami wyłączenia.

## 4. Granice produktu

- Brak importu transakcji z plików, CSV, raportów bankowych lub URL.
- Brak zdjęć paragonów, OCR i bogatych multimediów.
- Brak współdzielonych budżetów, kont rodzinnych i ról użytkowników.
- Brak integracji bankowych i automatycznych synchronizacji.
- Brak zaawansowanej analityki (prognozy ML, sezonowość, alerty push).
- Obsługa tylko waluty PLN.
- Brak elementów motywacyjnych, takich jak powiadomienia lub gamifikacja.
- Brak dodatkowych potwierdzeń dla edycji danych finansowych.

## 5. Historyjki użytkowników

US-001  
Tytuł: Rejestracja nowego użytkownika  
Opis: Jako nowy użytkownik, chcę się zarejestrować w aplikacji, aby móc bezpiecznie przechowywać swoje dane finansowe.  
Kryteria akceptacji:

- Formularz rejestracji wymaga email i hasła zgodnego z wymaganiami (8 znaków, wielkie i małe litery).
- Po rejestracji użytkownik zostaje zalogowany automatycznie.
- Email jest unikalny w systemie.
- Testowalność: Weryfikacja przez próby rejestracji z nieprawidłowymi danymi.

US-002  
Tytuł: Logowanie użytkownika  
Opis: Jako zarejestrowany użytkownik, chcę się zalogować, aby uzyskać dostęp do swoich danych finansowych.  
Kryteria akceptacji:

- Formularz logowania wymaga email i hasła.
- Po poprawnym logowaniu użytkownik ma dostęp do swoich danych.
- Opcjonalne przypomnienie hasła wysyła link resetujący.
- Testowalność: Weryfikacja przez próby logowania z poprawnymi i nieprawidłowymi danymi.

US-003  
Tytuł: Dodanie wypłaty  
Opis: Jako użytkownik, chcę dodać wypłatę, aby śledzić wpływy do budżetu.  
Kryteria akceptacji:

- Formularz pozwala wprowadzić kwotę, datę i opcjonalny opis.
- Wypłata zostaje zapisana i widoczna w obliczeniach budżetu.
- Testowalność: Sprawdzenie, czy nowa wypłata wpływa na sumę wpływów.

US-004  
Tytuł: Edycja wypłaty  
Opis: Jako użytkownik, chcę edytować wypłatę, aby poprawić błędne dane.  
Kryteria akceptacji:

- Możliwość edycji kwoty, daty i opisu istniejącej wypłaty.
- Zmiany od razu aktualizują obliczenia budżetu.
- Testowalność: Weryfikacja zmian w bazie danych i interfejsie.

US-005  
Tytuł: Usunięcie wypłaty  
Opis: Jako użytkownik, chcę usunąć wypłatę, jeśli została dodana błędnie.  
Kryteria akceptacji:

- Potwierdzenie usunięcia wypłaty.
- Wypłata zostaje usunięta i nie wpływa na obliczenia.
- Testowalność: Sprawdzenie braku wpływu usuniętej wypłaty na sumy.

US-006  
Tytuł: Dodanie wydatku  
Opis: Jako użytkownik, chcę dodać wydatek, aby rejestrować transakcje.  
Kryteria akceptacji:

- Formularz pozwala wybrać kategorię (predefiniowane lub własne), wprowadzić kwotę, datę i opis.
- Wydatek zostaje zapisany i widoczny w liście.
- Testowalność: Weryfikacja dodania w bazie danych i liście wydatków.

US-007  
Tytuł: Edycja wydatku  
Opis: Jako użytkownik, chcę edytować wydatek, aby poprawić dane.  
Kryteria akceptacji:

- Możliwość zmiany kategorii, kwoty, daty i opisu.
- Zmiany aktualizują listę i obliczenia.
- Testowalność: Sprawdzenie poprawności edycji w interfejsie.

US-008  
Tytuł: Usunięcie wydatku  
Opis: Jako użytkownik, chcę usunąć wydatek, jeśli jest błędny.  
Kryteria akceptacji:

- Potwierdzenie usunięcia wydatku.
- Wydatek zostaje usunięty z listy i obliczeń.
- Testowalność: Weryfikacja usunięcia z bazy danych.

US-009  
Tytuł: Tworzenie własnej kategorii wydatków  
Opis: Jako użytkownik, chcę stworzyć własną kategorię, aby lepiej zorganizować wydatki.  
Kryteria akceptacji:

- Formularz pozwala dodać nową kategorię per użytkownik.
- Nowa kategoria jest dostępna w wyborze przy dodawaniu wydatków.
- Testowalność: Sprawdzenie dostępności nowej kategorii w interfejsie.

US-010  
Tytuł: Przegląd listy wydatków z filtrem  
Opis: Jako użytkownik, chcę przeglądać wydatki filtrowane po miesiącu lub kategorii.  
Kryteria akceptacji:

- Lista wyświetla wydatki z opcjami filtra.
- Filtry działają poprawnie, ograniczając wyświetlane elementy.
- Testowalność: Testowanie różnych kombinacji filtrów.

US-011  
Tytuł: Wyświetlanie budżetu miesiąca  
Opis: Jako użytkownik, chcę zobaczyć podsumowanie budżetu miesięcznego.  
Kryteria akceptacji:

- Wyświetlana suma wypłat minus wydatki równa pozostałej kwocie.
- Procentowy podział wydatków po kategoriach (wykres lub tekst).
- Testowalność: Weryfikacja obliczeń na podstawie przykładowych danych.

US-012  
Tytuł: Tworzenie celu oszczędnościowego  
Opis: Jako użytkownik, chcę stworzyć cel oszczędnościowy.  
Kryteria akceptacji:

- Formularz pozwala wprowadzić nazwę i kwotę docelową.
- Cel zostaje zapisany i widoczny w widoku celów.
- Testowalność: Sprawdzenie dodania celu w bazie danych.

US-013  
Tytuł: Dodanie wpłaty na cel  
Opis: Jako użytkownik, chcę dodać wpłatę na cel, aby śledzić progres.  
Kryteria akceptacji:

- Formularz pozwala wybrać cel i kwotę wpłaty.
- Wpłata aktualizuje progres i historię.
- Testowalność: Weryfikacja aktualizacji progresu.

US-014  
Tytuł: Wyświetlanie progresu celu  
Opis: Jako użytkownik, chcę zobaczyć progres celu oszczędnościowego.  
Kryteria akceptacji:

- Wyświetlany procent ukończenia i pozostała kwota.
- Liniowy wykres z historią wpłat.
- Testowalność: Sprawdzenie wizualizacji na podstawie danych.

US-015  
Tytuł: Predykcja daty osiągnięcia celu  
Opis: Jako użytkownik, chcę zobaczyć szacowaną datę osiągnięcia celu.  
Kryteria akceptacji:

- Predykcja oparta na średniej z ostatnich miesięcy, aktualizowana automatycznie.
- Wyświetlana data w widoku celu.
- Testowalność: Obliczenia na przykładowych danych historycznych.

US-016  
Tytuł: Wyświetlanie miesięcznego raportu  
Opis: Jako użytkownik, chcę zobaczyć miesięczny raport wydatków.  
Kryteria akceptacji:

- Lista wydatków z sumami per kategoria.
- Możliwość wyboru miesiąca.
- Testowalność: Weryfikacja sum i list dla różnych miesięcy.

US-017  
Tytuł: Wyświetlanie raportu celów  
Opis: Jako użytkownik, chcę zobaczyć przegląd wszystkich celów.  
Kryteria akceptacji:

- Lista celów z paskami progresu liniowymi.
- Każdy cel pokazuje nazwę, progres i predykcję.
- Testowalność: Sprawdzenie wyświetlania dla wielu celów.

US-018  
Tytuł: Responsywność aplikacji na urządzeniach mobilnych  
Opis: Jako użytkownik mobilny, chcę korzystać z aplikacji na smartfonie bez utraty funkcjonalności.  
Kryteria akceptacji:

- Interfejs dostosowuje się do małych ekranów.
- Wszystkie funkcje dostępne bez problemów.
- Testowalność: Testowanie na różnych urządzeniach mobilnych.

US-019  
Tytuł: Mierzenie aktywności użytkownika  
Opis: Jako administrator, chcę mierzyć aktywność użytkowników do oceny sukcesu.  
Kryteria akceptacji:

- Timestampy logowań zbierane anonimowo z opcjami wyłączenia.
- Dane dostępne do analizy.
- Testowalność: Weryfikacja zbierania danych przy logowaniu.

## 6. Metryki sukcesu

- ≥90% aktywnych użytkowników dodaje przynajmniej jedną wypłatę w pierwszym tygodniu użycia – mierzone przez własne mechanizmy aplikacji (timestampy i sprawdzenie dodanych wypłat).
- ≥80% użytkowników rejestruje min. 5 wydatków w pierwszym miesiącu – mierzone przez liczbę dodanych wydatków per użytkownik.
- ≥60% użytkowników zakłada co najmniej 1 cel oszczędnościowy – mierzone przez liczbę utworzonych celów.
- Średnio ≥1 sesja tygodniowo na użytkownika w ciągu pierwszych 4 tygodni – mierzone przez timestampy logowań z opcjami wyłączenia.

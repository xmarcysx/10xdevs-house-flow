# Tech Stack - HouseFlow

## Opis Projektu

HouseFlow to aplikacja MVP do zarządzania budżetem domowym, umożliwiająca rejestrowanie dochodów i wydatków, śledzenie kategorii wydatków oraz monitorowanie postępów w realizacji celów oszczędnościowych.

## Stos Technologiczny

### Frontend

- **Astro 5** - Framework do tworzenia szybkich, efektywnych stron i aplikacji z minimalną ilością JavaScript
- **React 19** - Zapewnia interaktywność tam, gdzie jest potrzebna
- **TypeScript 5** - Statyczne typowanie i lepsze wsparcie IDE
- **Tailwind 4** - Wygodne stylizowanie aplikacji
- **Shadcn/ui** - Biblioteka dostępnych komponentów React dla fundamentu UI

### Testowanie

- **Vitest** - Nowoczesny framework testowy do testów jednostkowych i integracyjnych
- **@testing-library/react** - Narzędzia testowe dla komponentów React
- **@testing-library/jest-dom** - Niestandardowe matchery Jest dla elementów DOM
- **@testing-library/user-event** - Narzędzia do symulacji interakcji użytkownika
- **jsdom** - Środowisko DOM do testowania
- **Playwright** - Framework do testów end-to-end (E2E)

### Backend

- **Supabase** - Kompleksowe rozwiązanie backendowe zapewniające:
  - Bazę danych PostgreSQL
  - SDK w wielu językach jako Backend-as-a-Service
  - Otwarte źródło, które można hostować lokalnie lub na własnym serwerze
  - Wbudowaną autentyfikację użytkowników

### CI/CD i Hosting

- **GitHub Actions** - Do tworzenia potoków CI/CD
- **DigitalOcean** - Do hostowania aplikacji poprzez obraz Docker

## Struktura Projektu

```
src/
├── components/          # Komponenty klienckie (Astro/React)
├── layouts/            # Layouty Astro
├── pages/              # Strony Astro
├── lib/                # Serwisy i helpery
├── db/                 # Klienci Supabase i typy
├── test/               # Konfiguracja testów
├── services/           # Logika biznesowa
└── types.ts           # Wspólne typy

test/                   # Testy jednostkowe i integracyjne
e2e/                    # Testy end-to-end (Playwright)
```

## Wymagania Systemowe

- Node.js wersja 22.14.0 (użyj pliku `.nvmrc` do automatycznego przełączania wersji z nvm)
- npm lub yarn jako menedżer pakietów

## Skrypty NPM

- `npm run dev` - Uruchomienie serwera deweloperskiego z hot reload
- `npm run build` - Budowanie aplikacji na produkcję
- `npm run preview` - Podgląd buildu produkcyjnego lokalnie
- `npm run test` - Uruchomienie testów jednostkowych (Vitest)
- `npm run test:e2e` - Uruchomienie testów E2E (Playwright)
- `npm run lint` - Sprawdzanie jakości kodu przez ESLint
- `npm run format` - Formatowanie kodu przez Prettier




# Diagram Architektury UI - System Autentyfikacji HouseFlow

```mermaid
flowchart TD
    %% Definicje stylów CSS
    classDef authComponent fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef existingComponent fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef pageComponent fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef hookComponent fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef middlewareComponent fill:#ffebee,stroke:#b71c1c,stroke-width:2px
    classDef flowComponent fill:#f9fbe7,stroke:#827717,stroke-width:2px

    %% Subgraf: Moduł Autentyfikacji (Nowe komponenty)
    subgraph "Moduł Autentyfikacji"
        AG[AuthGuard.tsx<br/>Komponent ochronny tras]:::authComponent
        AL[AuthLayout.astro<br/>Layout dla stron auth]:::authComponent
        RPF[ResetPasswordForm.tsx<br/>Formularz resetowania hasła]:::authComponent
        UAS[useAuthState.ts<br/>Hook monitorowania sesji]:::hookComponent
        AV[auth.validation.ts<br/>Schematy walidacji]:::hookComponent
    end

    %% Subgraf: Istniejące Komponenty UI
    subgraph "Istniejące Komponenty UI"
        LF[LoginForm.tsx<br/>Formularz logowania]:::existingComponent
        RF[RegisterForm.tsx<br/>Formularz rejestracyjny]:::existingComponent
        NB[Navbar.tsx<br/>Nawigacja + menu użytkownika]:::existingComponent
    end

    %% Subgraf: Strony Aplikacji
    subgraph "Strony Aplikacji"
        GUEST[(guest.astro<br/>Landing page)]:::pageComponent
        LOGIN[(login.astro<br/>Strona logowania)]:::pageComponent
        REGISTER[(register.astro<br/>Strona rejestracji)]:::pageComponent
        DASHBOARD[(index.astro<br/>Dashboard główny)]:::pageComponent
        EXPENSES[(expenses.astro<br/>Zarządzanie wydatkami)]:::pageComponent
        GOALS[(goals.astro<br/>Cele oszczędnościowe)]:::pageComponent
        REPORTS[(reports/index.astro<br/>Raporty)]:::pageComponent
    end

    %% Subgraf: Hooki i Logika Biznesowa
    subgraph "Hooki i Logika Biznesowa"
        UA[useAuth.ts<br/>Hook autentyfikacji]:::hookComponent
        UR[useRegister.ts<br/>Hook rejestracji]:::hookComponent
        SC[supabase.client.ts<br/>Klient Supabase]:::hookComponent
    end

    %% Subgraf: Middleware i Ochrona Tras
    subgraph "Middleware i Ochrona Tras"
        MW[index.ts<br/>Middleware autentyfikacji]:::middlewareComponent
        API_AUTH[API Endpoints Auth<br/>logout, session, reset-password]:::middlewareComponent
    end

    %% Subgraf: Przepływy Użytkownika
    subgraph "Przepływy Użytkownika"
        START{{Początek<br/>Użytkownik niezalogowany}}:::flowComponent
        LOGIN_FLOW[Logowanie<br/>Walidacja → API → Przekierowanie]:::flowComponent
        REGISTER_FLOW[Rejestracja<br/>Walidacja → API → Auto-login]:::flowComponent
        RESET_FLOW[Reset hasła<br/>Email → Link → Nowe hasło]:::flowComponent
        LOGOUT_FLOW>Wylogowanie<br/>Czyszczenie sesji]:::flowComponent
        END{{Koniec<br/>Dostęp do aplikacji}}:::flowComponent
    end

    %% Połączenia między komponentami

    %% Struktura hierarchiczna - komponenty używają hooków
    LF --> UA
    RF --> UR
    AG --> UAS
    NB --> UAS

    %% Hooki używają klienta Supabase
    UA --> SC
    UR --> SC
    UAS --> SC

    %% Schematy walidacji używane przez komponenty
    AV -.-> LF
    AV -.-> RF
    AV -.-> RPF

    %% Strony używają layoutów i komponentów
    LOGIN --> AL
    REGISTER --> AL
    LOGIN --> LF
    REGISTER --> RF

    %% AuthGuard chroni strony zalogowane
    AG -.-> DASHBOARD
    AG -.-> EXPENSES
    AG -.-> GOALS
    AG -.-> REPORTS

    %% Wszystkie strony chronione mają Navbar
    DASHBOARD --> NB
    EXPENSES --> NB
    GOALS --> NB
    REPORTS --> NB

    %% Middleware sprawdza wszystkie żądania
    MW -.-> GUEST
    MW -.-> LOGIN
    MW -.-> REGISTER
    MW -.-> DASHBOARD
    MW -.-> EXPENSES
    MW -.-> GOALS
    MW -.-> REPORTS

    %% API endpoints obsługują operacje autentyfikacyjne
    API_AUTH --> UA
    API_AUTH --> UR
    API_AUTH --> RPF

    %% Przepływy użytkownika
    START --> GUEST
    GUEST --> LOGIN
    GUEST --> REGISTER
    LOGIN --> LOGIN_FLOW
    REGISTER --> REGISTER_FLOW
    LF --> LOGIN_FLOW
    RF --> REGISTER_FLOW
    LOGIN_FLOW --> END
    REGISTER_FLOW --> END
    NB --> LOGOUT_FLOW
    LOGOUT_FLOW --> START

    %% Reset hasła dostępny z logowania
    LF -.-> RPF
    RPF --> RESET_FLOW
    RESET_FLOW --> LOGIN

    %% Aktualizacje istniejących komponentów (wyróżnione połączenia)
    UA -.->|"wymaga aktualizacji<br/>integracja Supabase"| LF
    UR -.->|"wymaga aktualizacji<br/>integracja Supabase"| RF
    MW -.->|"wymaga rozszerzenia<br/>o logikę auth"| API_AUTH
    NB -.->|"wymaga aktualizacji<br/>prawdziwe dane user"| UAS
```

## Opis Diagramu

### Architektura Poziomów
Diagram przedstawia wielopoziomową architekturę systemu autentyfikacji HouseFlow:

1. **Warstwa UI** - Komponenty React i strony Astro
2. **Warstwa Logiki Biznesowej** - Hooki i serwisy autentyfikacyjne  
3. **Warstwa Infrastruktury** - Supabase, middleware, API
4. **Warstwa Przepływów** - Scenariusze użycia systemu

### Kluczowe Zależności
- **AuthGuard** chroni wszystkie strony wymagające autentyfikacji
- **Middleware** sprawdza stan sesji dla każdej strony
- **Hooki** dostarczają stan autentyfikacji wszystkim komponentom
- **Supabase Client** jest centralnym punktem integracji z backendem

### Komponenty Wymagające Aktualizacji
Diagram wyróżnia komponenty oznaczone jako "wymaga aktualizacji", które muszą zostać zmodyfikowane zgodnie ze specyfikacją:
- `useAuth.ts` - integracja z Supabase Auth SDK
- `useRegister.ts` - integracja z Supabase Auth SDK  
- `Navbar.tsx` - prawdziwe dane użytkownika zamiast mocków
- `middleware/index.ts` - logika sprawdzania sesji

### Nowe Komponenty do Utworzenia
- `AuthGuard.tsx` - ochrona tras aplikacji
- `AuthLayout.astro` - spójny layout dla stron autentyfikacyjnych
- `ResetPasswordForm.tsx` - obsługa resetowania hasła
- `useAuthState.ts` - monitorowanie stanu sesji w czasie rzeczywistym
- `auth.validation.ts` - współdzielone schematy walidacji

### Przepływy Użytkownika
Diagram ilustruje główne scenariusze użycia:
- **Logowanie**: guest → login → dashboard
- **Rejestracja**: guest → register → dashboard  
- **Reset hasła**: login → reset form → login
- **Wylogowanie**: dowolna strona → logout → guest

Taka architektura zapewnia bezpieczeństwo, spójność UX i łatwość utrzymania systemu autentyfikacji.

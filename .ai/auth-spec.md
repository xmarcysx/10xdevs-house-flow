# Specyfikacja Techniczna Systemu Autentykacji - HouseFlow

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1 Tryby Aplikacji i Ochrona Tras

#### Tryb Niezalogowany (Publiczny)

- **Strona główna** (`/guest`): Landing page z prezentacją funkcjonalności, przyciskami do rejestracji i logowania
- **Strona rejestracji** (`/register`): Dedykowany formularz rejestracyjny
- **Strona logowania** (`/login`): Dedykowany formularz logowania z opcją resetowania hasła
- **Dostępne zasoby**: Wszystkie strony publiczne bez ograniczeń

#### Tryb Zalogowany (Chroniony)

- **Dashboard** (`/`): Główna strona aplikacji z pełną funkcjonalnością
- **Zarządzanie wydatkami** (`/expenses`): Lista i zarządzanie transakcjami
- **Zarządzanie wpływami** (`/incomes`): Lista i zarządzanie przychodami
- **Cele oszczędnościowe** (`/goals`): Zarządzanie celami i wpłatami
- **Raporty** (`/reports/*`): Wszystkie widoki raportowe
- **Kategorie** (`/categories`): Zarządzanie kategoriami wydatków

#### System Ochrony Tras

- **Middleware autentyfikacji**: Rozszerzenie `src/middleware/index.ts` o sprawdzanie sesji Supabase
- **Przekierowania automatyczne**:
  - Użytkownik niezalogowany → próba dostępu do chronionej strony → przekierowanie na `/login`
  - Użytkownik zalogowany → próba dostępu do `/guest`, `/login`, `/register` → przekierowanie na `/`
- **Stan ładowania**: Komponent `AuthGuard` wyświetlający loader podczas sprawdzania autentyfikacji

### 1.2 Komponenty i Strony Frontend

#### Nowe Komponenty do Utworzenia

**`AuthGuard.tsx`** - Komponent ochronny tras

- Lokalizacja: `src/components/AuthGuard.tsx`
- Funkcjonalność: Wrapper sprawdzający stan autentyfikacji, renderuje children lub przekierowuje
- Props: `children: React.ReactNode`, `fallback?: React.ReactNode`
- Integracja: Wykorzystuje hook `useAuthState` do monitorowania zmian sesji

**`AuthLayout.astro`** - Layout dla stron autentyfikacyjnych

- Lokalizacja: `src/layouts/AuthLayout.astro`
- Dziedziczy po `Layout.astro` z dodatkowymi stylami dla centracji formularzy
- Używany przez: `login.astro`, `register.astro`

**`ResetPasswordForm.tsx`** - Formularz resetowania hasła

- Lokalizacja: `src/components/ResetPasswordForm.tsx`
- Stan: "request" (wysyłanie linku), "email-sent" (potwierdzenie wysłania), "reset" (ustawianie nowego hasła)
- Walidacja: Email format + wymagane pola dla nowego hasła

#### Rozszerzone Istniejące Komponenty

**`LoginForm.tsx`** - Aktualizacja integracji z Supabase

- Usunięcie symulacji, pełne połączenie z `useAuth.login()`
- Dodanie obsługi błędów specyficznych dla Supabase Auth
- Poprawiona obsługa "Zapomniałeś hasła?" - integracja z nowym formularzem

**`RegisterForm.tsx`** - Aktualizacja integracji z Supabase

- Usunięcie symulacji, pełne połączenie z `useRegister.register()`
- Dodanie automatycznego logowania po rejestracji
- Obsługa błędów duplikacji email i walidacji po stronie serwera

**`Navbar.tsx`** - Dodanie informacji o użytkowniku i przycisku wylogowania

- Wyświetlanie: email użytkownika, przycisk "Wyloguj się"
- Funkcjonalność: Integracja z `useAuth.logout()`
- Responsywność: Dropdown menu na urządzeniach mobilnych

### 1.3 Logika Komponentów Client-Side React

#### Hooki Autentyfikacyjne (Rozszerzenie Istniejących)

**`useAuth.ts`** - Aktualizacja implementacji

- `login()`: Integracja z `supabase.auth.signInWithPassword()`
- `resetPassword()`: Integracja z `supabase.auth.resetPasswordForEmail()`
- Dodanie: `logout()`: Integracja z `supabase.auth.signOut()`
- Dodanie: `getCurrentUser()`: Pobieranie aktualnego użytkownika z sesji

**`useRegister.ts`** - Aktualizacja implementacji

- `register()`: Integracja z `supabase.auth.signUp()`
- Automatyczne logowanie po pomyślnej rejestracji
- Obsługa confirmation email (opcjonalne w zależności od ustawień Supabase)

**Nowy Hook: `useAuthState.ts`**

- Lokalizacja: `src/lib/hooks/useAuthState.ts` (należy utworzyć)
- Funkcjonalność: Monitorowanie zmian stanu autentyfikacji w czasie rzeczywistym
- Implementacja: `supabase.auth.onAuthStateChange()`
- Zwraca: `{ user, session, isLoading, isAuthenticated }`

#### Schematy Walidacji (Rozszerzenie Zod)

**`auth.validation.ts`** - Nowe schematy walidacyjne

- Lokalizacja: `src/lib/validation/auth.validation.ts` (należy utworzyć)
- `loginSchema`: Walidacja email + hasło (rozszerzenie istniejącego)
- `registerSchema`: Walidacja email + hasło + confirmPassword (rozszerzenie istniejącego)
- `resetPasswordSchema`: Walidacja email
- `newPasswordSchema`: Walidacja nowego hasła + potwierdzenia

#### Komunikaty Błędów i Walidacji

**Komunikaty walidacyjne formularzy**:

- Email: "Adres email jest wymagany", "Podaj prawidłowy adres email"
- Hasło: "Hasło jest wymagane", "Hasło musi mieć przynajmniej 8 znaków", "Hasło musi zawierać przynajmniej jedną małą i jedną wielką literę"
- Potwierdzenie hasła: "Hasła nie są identyczne"

**Komunikaty błędów API**:

- "Nieprawidłowy email lub hasło"
- "Konto z tym adresem email już istnieje"
- "Link resetowania hasła został wysłany na Twój adres email"
- "Wystąpił błąd podczas wysyłania linku resetowania"
- "Sesja wygasła - zaloguj się ponownie"

**Obsługa scenariuszy**:

- **Błąd sieci**: Timeout, brak połączenia - komunikaty + retry
- **Sesja wygasła**: Automatyczne przekierowanie na `/login` + komunikat
- **Email niepotwierdzony**: Komunikat z linkiem do ponownego wysłania
- **Reset hasła**: Przekierowanie na dedykowaną stronę po kliknięciu linku

### 1.4 Integracja z Nawigacją i Akcjami Użytkownika

#### Przepływ Rejestracji

1. Użytkownik wypełnia formularz → walidacja client-side
2. Wysyłanie danych do Supabase Auth → walidacja server-side
3. Sukces: Automatyczne logowanie + przekierowanie na `/`
4. Błąd: Wyświetlenie komunikatu + focus na polu błędnym

#### Przepływ Logowania

1. Użytkownik wypełnia formularz → walidacja client-side
2. Wysyłanie danych do Supabase Auth → walidacja server-side
3. Sukces: Przekierowanie na `/` (lub na stronę, z której przyszedł)
4. Błąd: Wyświetlenie komunikatu + możliwość resetowania hasła

#### Przepływ Resetowania Hasła

1. Użytkownik wprowadza email → wysłanie linku przez Supabase
2. Email z linkiem resetowania → przekierowanie na stronę ustawiania nowego hasła
3. Ustawienie nowego hasła → automatyczne logowanie + przekierowanie na `/`

#### Przepływ Wylogowania

1. Kliknięcie "Wyloguj się" → wywołanie `supabase.auth.signOut()`
2. Czyszczenie sesji → przekierowanie na `/guest`
3. Komunikat potwierdzający wylogowanie

## 2. LOGIKA BACKENDOWA

### 2.1 Endpointy API (Rozszerzenie Istniejące)

#### Nowe Endpointy Autentyfikacyjne

**`src/pages/api/auth/logout.ts`** (należy utworzyć folder `auth`)

- Metoda: `POST`
- Funkcjonalność: Wylogowanie użytkownika, czyszczenie sesji
- Odpowiedź: `{ success: true }`
- Middleware: Wymaga autentyfikacji

**`src/pages/api/auth/session.ts`** (należy utworzyć folder `auth`)

- Metoda: `GET`
- Funkcjonalność: Pobieranie aktualnej sesji użytkownika
- Odpowiedź: `{ user: User | null, session: Session | null }`
- Middleware: Publiczny, ale zwraca dane tylko dla zalogowanych

**`src/pages/api/auth/reset-password.ts`** (należy utworzyć folder `auth`)

- Metoda: `POST`
- Body: `{ email: string }`
- Funkcjonalność: Wysyłanie linku resetowania hasła
- Odpowiedź: `{ success: true, message: string }`
- Walidacja: Zod schema dla email

#### Rozszerzone Endpointy Istniejące

**Wszystkie istniejące endpointy finansowe** (`/api/budget/*`, `/api/categories/*`, `/api/expenses/*`, `/api/goals/*`, `/api/incomes/*`, `/api/reports/*`) zostają rozszerzone o:

- Middleware sprawdzający autentyfikację (wymagane dla bezpieczeństwa danych finansowych)
- Zwracanie `401 Unauthorized` dla niezalogowanych użytkowników
- Dodanie pola `user_id` do zapytań na podstawie sesji Supabase
- **Uzasadnienie**: Chociaż PRD US-001/US-002 nie wymaga ochrony endpointów, bezpieczeństwo danych finansowych wymaga autentyfikacji dla wszystkich operacji na wrażliwych danych

### 2.2 Modele Danych i Typy

#### Rozszerzenie `src/types.ts`

```typescript
// Auth related types
interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// API Response types
interface AuthResponse {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
```

#### Schematy Bazy Danych Supabase

**Tabela `profiles`** (rozszerzenie istniejącej struktury):

```sql
-- Rozszerzenie istniejącej tabeli profiles o pola autentyfikacyjne
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;
```

### 2.3 Mechanizm Walidacji Danych Wejściowych

#### Walidacja na Poziomie API

- **Zod schemas** dla wszystkich endpointów autentyfikacyjnych
- **Sanityzacja danych**: Trim, lowercase dla email
- **Rate limiting**: Zapobieganie atakom brute force (do implementacji w Supabase)

#### Walidacja Biznesowa

- **Unikalność email**: Sprawdzana przez Supabase Auth
- **Siła hasła**: Wymuszana przez Supabase (8+ znaków, wielkie/małe litery)
- **Sesja**: Automatyczne odświeżanie tokenów przez Supabase

### 2.4 Obsługa Wyjątków

#### Typy Błędów Autentyfikacyjnych

```typescript
enum AuthErrorType {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  EMAIL_NOT_CONFIRMED = "EMAIL_NOT_CONFIRMED",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  WEAK_PASSWORD = "WEAK_PASSWORD",
  NETWORK_ERROR = "NETWORK_ERROR",
  SESSION_EXPIRED = "SESSION_EXPIRED",
}
```

#### Strategia Obsługi Błędów

- **Client-side**: Toast notifications + form validation errors
- **Server-side**: Strukturalne odpowiedzi błędów z kodami HTTP
- **Logging**: Szczegółowe logi błędów do monitorowania
- **Fallback**: Graceful degradation dla problemów z siecią

### 2.5 Server-Side Rendering i Middleware

#### Rozszerzenie Middleware (`src/middleware/index.ts`)

```typescript
export const onRequest = defineMiddleware(async (context, next) => {
  // Istniejące inicjalizacje
  context.locals.supabase = supabaseClient;

  // Nowe: Sprawdzanie autentyfikacji dla chronionych tras
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  // Ustawienie kontekstu autentyfikacji
  context.locals.user = session?.user ?? null;
  context.locals.session = session;

  // Chronione trasy - przekierowanie na login jeśli niezalogowany
  const protectedRoutes = ["/", "/expenses", "/incomes", "/goals", "/reports", "/categories"];
  const isProtectedRoute = protectedRoutes.some((route) => context.url.pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    return Response.redirect(new URL("/login", context.url));
  }

  // Publiczne trasy autentyfikacyjne - przekierowanie na dashboard jeśli zalogowany
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(context.url.pathname);

  if (isAuthRoute && session) {
    return Response.redirect(new URL("/", context.url));
  }

  return next();
});
```

#### Server-Side Rendering dla Stron Chronionych

- **SSR dla dashboard**: Dane użytkownika pobierane na serwerze
- **Hydratacja**: React components inicjalizowane z danymi z SSR
- **SEO**: Meta tagi zawierające informacje o użytkowniku (bezpieczne dane)

## 3. SYSTEM AUTENTYKACJI

### 3.1 Integracja z Supabase Auth

#### Konfiguracja Supabase

```typescript
// src/db/supabase.client.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

#### Strategie Autentyfikacji

- **Email + Password**: Standardowa metoda logowania
- **Email Confirmation**: Opcjonalne potwierdzanie rejestracji
- **Password Reset**: Linki resetowania wysyłane na email
- **Session Management**: Automatyczne odświeżanie tokenów

### 3.2 Zarządzanie Sesją

#### Stan Sesji w Aplikacji

- **Persistent Session**: Przechowywana w localStorage przez Supabase
- **Real-time Updates**: `onAuthStateChange` listener
- **SSR Compatibility**: Sprawdzanie sesji po stronie serwera

#### Bezpieczeństwo Sesji

- **Token Rotation**: Automatyczne odświeżanie przez Supabase
- **Secure Cookies**: Dla wrażliwych operacji (opcjonalne)
- **Session Timeout**: Konfigurowalne w Supabase Dashboard

### 3.3 Polityka Bezpieczeństwa

#### Standardy Bezpieczeństwa

- **Password Requirements**: 8+ znaków, wielkie + małe litery (wymagania z PRD)
- **Email Validation**: RFC-compliant email validation
- **Rate Limiting**: Wbudowane w Supabase Auth
- **HTTPS Only**: Wymuszane przez hosting (DigitalOcean)

#### Prywatność Danych

- **Minimal Data Collection**: Tylko email + timestamps logowań
- **No Sensitive Data**: Brak przechowywania danych finansowych w tabelach auth
- **GDPR Compliance**: Możliwość usunięcia konta użytkownika

### 3.4 Metryki i Monitorowanie

#### Zbierane Metryki (zgodnie z PRD US-019)

- **Login Timestamps**: Czas ostatniego logowania
- **Registration Dates**: Data rejestracji użytkowników
- **Active Users**: Liczenie unikalnych sesji miesięcznie

#### Implementacja Metryk

```typescript
// src/services/metrics.service.ts (należy utworzyć)
export const trackLogin = async (userId: string) => {
  await supabaseClient
    .from("profiles")
    .update({
      last_login: new Date().toISOString(),
      login_count: supabaseClient.sql`login_count + 1`,
    })
    .eq("id", userId);
};
```

### 3.5 Kontrakty i Interfejsy

#### Główne Kontrakty Systemu

**AuthService Interface**:

```typescript
interface AuthService {
  signUp(email: string, password: string): Promise<AuthResponse>;
  signIn(email: string, password: string): Promise<AuthResponse>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<ResetPasswordResponse>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChange(callback: (event: string, session: Session | null) => void): () => void;
}
```

**AuthUI Interface**:

```typescript
interface AuthUI {
  renderLoginForm(): React.ReactElement;
  renderRegisterForm(): React.ReactElement;
  renderResetPasswordForm(): React.ReactElement;
  renderAuthGuard(children: React.ReactNode): React.ReactElement;
}
```

### 3.6 Architektura Komponentów

```
src/
├── components/
│   ├── AuthGuard.tsx               # Komponent ochronny (nowy)
│   ├── ResetPasswordForm.tsx       # Formularz resetowania (nowy)
│   ├── LoginForm.tsx               # Zaktualizowany formularz logowania
│   └── RegisterForm.tsx            # Zaktualizowany formularz rejestracji
├── layouts/
│   └── AuthLayout.astro            # Layout dla stron auth (nowy)
├── lib/
│   ├── hooks/
│   │   ├── useAuth.ts              # Zaktualizowany hook
│   │   ├── useAuthState.ts         # Nowy hook stanu
│   │   └── useRegister.ts          # Zaktualizowany hook
│   └── validation/
│       └── auth.validation.ts      # Schematy walidacji (nowy)
├── services/
│   └── metrics.service.ts          # Serwis metryk (nowy)
├── middleware/
│   └── index.ts                    # Rozszerzony middleware
├── pages/
│   ├── api/
│   │   └── auth/                   # Nowe endpointy API (folder do utworzenia)
│   │       ├── logout.ts
│   │       ├── session.ts
│   │       └── reset-password.ts
│   ├── login.astro                 # Istniejący, bez zmian
│   └── register.astro              # Istniejący, bez zmian
└── types.ts                        # Rozszerzone o typy auth
```

---

## Podsumowanie Implementacyjne

### Kluczowe Wymagania z PRD Zrealizowane

✅ **US-001**: Rejestracja z walidacją email i hasła (8+ znaków, wielkie/małe litery)  
✅ **US-002**: Logowanie z walidacją + opcjonalne przypomnienie hasła  
✅ **Architektura**: Supabase Auth z pełną integracją Astro + React  
✅ **Bezpieczeństwo**: Standardowe praktyki bezpieczeństwa bez nadmiarowej kryptografii  
✅ **Responsywność**: Komponenty dostosowane do urządzeń mobilnych

### Strategia Wdrożenia

1. **Faza 1**: Aktualizacja hooków `useAuth` i `useRegister` z integracją Supabase
2. **Faza 2**: Implementacja `AuthGuard` i rozszerzenie middleware
3. **Faza 3**: Dodanie `ResetPasswordForm` i endpointów API
4. **Faza 4**: Aktualizacja UI komponentów i testowanie pełnego przepływu
5. **Faza 5**: Dodanie metryk i monitorowania aktywności użytkowników

### Zgodność z Istniejącą Architekturą

✅ Zachowana struktura projektu i konwencje nazewnictwa  
✅ Integracja z istniejącymi komponentami Shadcn/ui  
✅ Zachowanie SSR przez Astro z adapterem Node.js  
✅ Kompatybilność z istniejącymi endpointami API  
✅ Rozszerzenie zamiast zastąpienia obecnej logiki aplikacji

Specyfikacja została opracowana na podstawie analizy istniejącego kodu źródłowego i wymagań z dokumentu PRD, zapewniając pełną zgodność z obecną architekturą aplikacji HouseFlow.

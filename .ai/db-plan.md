# Schemat bazy danych HouseFlow

## 1. Lista tabel z ich kolumnami, typami danych i ograniczeniami

### Tabela: `users`

Ta tabela będzie zarządzana przez Supabase Auth.

| Kolumna         | Typ            | Ograniczenia                            | Opis                               |
| --------------- | -------------- | --------------------------------------- | ---------------------------------- |
| `id`            | `uuid`         | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unikalny identyfikator użytkownika |
| `email`         | `varchar(255)` | `NOT NULL UNIQUE`                       | Adres email użytkownika            |
| `password_hash` | `varchar(255)` | `NOT NULL`                              | Zahashowane hasło                  |
| `first_name`    | `varchar(50)`  | `NULL`                                  | Imię użytkownika                   |
| `last_name`     | `varchar(50)`  | `NULL`                                  | Nazwisko użytkownika               |
| `created_at`    | `timestamptz`  | `NOT NULL DEFAULT now()`                | Data utworzenia konta              |

### Tabela: `categories`

| Kolumna      | Typ            | Ograniczenia                                      | Opis                             |
| ------------ | -------------- | ------------------------------------------------- | -------------------------------- |
| `id`         | `uuid`         | `PRIMARY KEY DEFAULT gen_random_uuid()`           | Unikalny identyfikator kategorii |
| `user_id`    | `uuid`         | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | Identyfikator użytkownika        |
| `name`       | `varchar(100)` | `NOT NULL`                                        | Nazwa kategorii                  |
| `is_default` | `boolean`      | `NOT NULL DEFAULT false`                          | Czy kategoria jest domyślna      |
| `created_at` | `timestamptz`  | `NOT NULL DEFAULT now()`                          | Data utworzenia                  |
| `updated_at` | `timestamptz`  | `NOT NULL DEFAULT now()`                          | Data ostatniej aktualizacji      |

**Unikalny constraint:** `UNIQUE(user_id, name)`

### Tabela: `incomes`

| Kolumna       | Typ             | Ograniczenia                                      | Opis                                      |
| ------------- | --------------- | ------------------------------------------------- | ----------------------------------------- |
| `id`          | `uuid`          | `PRIMARY KEY DEFAULT gen_random_uuid()`           | Unikalny identyfikator wpływu             |
| `user_id`     | `uuid`          | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | Identyfikator użytkownika                 |
| `amount`      | `numeric(10,2)` | `NOT NULL CHECK(amount > 0)`                      | Kwota wpływu                              |
| `date`        | `date`          | `NOT NULL`                                        | Data wpływu                               |
| `description` | `text`          | `NULL`                                            | Opcjonalny opis wpływu                    |
| `source`      | `varchar(100)`  | `NULL`                                            | Źródło wpływu (np. 'salary', 'freelance') |
| `created_at`  | `timestamptz`   | `NOT NULL DEFAULT now()`                          | Data utworzenia                           |
| `updated_at`  | `timestamptz`   | `NOT NULL DEFAULT now()`                          | Data ostatniej aktualizacji               |

### Tabela: `expenses`

| Kolumna       | Typ             | Ograniczenia                                           | Opis                           |
| ------------- | --------------- | ------------------------------------------------------ | ------------------------------ |
| `id`          | `uuid`          | `PRIMARY KEY DEFAULT gen_random_uuid()`                | Unikalny identyfikator wydatku |
| `user_id`     | `uuid`          | `NOT NULL REFERENCES users(id) ON DELETE CASCADE`      | Identyfikator użytkownika      |
| `category_id` | `uuid`          | `NOT NULL REFERENCES categories(id) ON DELETE CASCADE` | Identyfikator kategorii        |
| `amount`      | `numeric(10,2)` | `NOT NULL CHECK(amount > 0)`                           | Kwota wydatku                  |
| `date`        | `date`          | `NOT NULL`                                             | Data wydatku                   |
| `description` | `text`          | `NULL`                                                 | Opcjonalny opis wydatku        |
| `created_at`  | `timestamptz`   | `NOT NULL DEFAULT now()`                               | Data utworzenia                |
| `updated_at`  | `timestamptz`   | `NOT NULL DEFAULT now()`                               | Data ostatniej aktualizacji    |

### Tabela: `goals`

| Kolumna          | Typ             | Ograniczenia                                      | Opis                        |
| ---------------- | --------------- | ------------------------------------------------- | --------------------------- |
| `id`             | `uuid`          | `PRIMARY KEY DEFAULT gen_random_uuid()`           | Unikalny identyfikator celu |
| `user_id`        | `uuid`          | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | Identyfikator użytkownika   |
| `name`           | `varchar(255)`  | `NOT NULL`                                        | Nazwa celu                  |
| `target_amount`  | `numeric(10,2)` | `NOT NULL CHECK(target_amount > 0)`               | Docelowa kwota              |
| `current_amount` | `numeric(10,2)` | `NOT NULL DEFAULT 0 CHECK(current_amount >= 0)`   | Aktualna kwota (cached)     |
| `created_at`     | `timestamptz`   | `NOT NULL DEFAULT now()`                          | Data utworzenia             |
| `updated_at`     | `timestamptz`   | `NOT NULL DEFAULT now()`                          | Data ostatniej aktualizacji |

### Tabela: `goal_contributions`

| Kolumna       | Typ             | Ograniczenia                                      | Opis                          |
| ------------- | --------------- | ------------------------------------------------- | ----------------------------- |
| `id`          | `uuid`          | `PRIMARY KEY DEFAULT gen_random_uuid()`           | Unikalny identyfikator wpłaty |
| `goal_id`     | `uuid`          | `NOT NULL REFERENCES goals(id) ON DELETE CASCADE` | Identyfikator celu            |
| `user_id`     | `uuid`          | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | Identyfikator użytkownika     |
| `amount`      | `numeric(10,2)` | `NOT NULL CHECK(amount > 0)`                      | Kwota wpłaty                  |
| `date`        | `date`          | `NOT NULL`                                        | Data wpłaty                   |
| `description` | `text`          | `NULL`                                            | Opcjonalny opis wpłaty        |
| `created_at`  | `timestamptz`   | `NOT NULL DEFAULT now()`                          | Data utworzenia               |

## 2. Relacje między tabelami

### Relacje jeden-do-wielu:

- `users` → `categories` (1:N) - Jeden użytkownik może mieć wiele kategorii
- `users` → `incomes` (1:N) - Jeden użytkownik może mieć wiele wpływów
- `users` → `expenses` (1:N) - Jeden użytkownik może mieć wiele wydatków
- `users` → `goals` (1:N) - Jeden użytkownik może mieć wiele celów
- `users` → `goal_contributions` (1:N) - Jeden użytkownik może mieć wiele wpłat na cele
- `categories` → `expenses` (1:N) - Jedna kategoria może być użyta w wielu wydatkach
- `goals` → `goal_contributions` (1:N) - Jeden cel może mieć wiele wpłat

**Wszystkie relacje używają `ON DELETE CASCADE` dla zachowania prywatności danych przy usunięciu konta użytkownika.**

## 3. Indeksy

### Indeksy pojedyncze:

- `categories_user_id_idx` na `categories(user_id)`
- `incomes_user_id_idx` na `incomes(user_id)`
- `expenses_user_id_idx` na `expenses(user_id)`
- `goals_user_id_idx` na `goals(user_id)`
- `goal_contributions_user_id_idx` na `goal_contributions(user_id)`
- `goal_contributions_goal_id_idx` na `goal_contributions(goal_id)`
- `expenses_category_id_idx` na `expenses(category_id)`

### Indeksy złożone:

- `incomes_user_id_date_idx` na `incomes(user_id, date DESC)`
- `expenses_user_id_date_idx` na `expenses(user_id, date DESC)`
- `categories_user_id_name_idx` na `categories(user_id, name)` (dodatkowy indeks dla unique constraint)

## 4. Zasady Row Level Security (RLS)

**RLS włączone dla wszystkich tabel zawierających dane użytkownika:**

### `categories`:

```sql
CREATE POLICY "Users can only access their own categories" ON categories
FOR ALL USING (user_id = auth.uid());
```

### `incomes`:

```sql
CREATE POLICY "Users can only access their own incomes" ON incomes
FOR ALL USING (user_id = auth.uid());
```

### `expenses`:

```sql
CREATE POLICY "Users can only access their own expenses" ON expenses
FOR ALL USING (user_id = auth.uid());
```

### `goals`:

```sql
CREATE POLICY "Users can only access their own goals" ON goals
FOR ALL USING (user_id = auth.uid());
```

### `goal_contributions`:

```sql
CREATE POLICY "Users can only access their own goal contributions" ON goal_contributions
FOR ALL USING (user_id = auth.uid());
```

## 5. Dodatkowe uwagi i wyjaśnienia

### Trigger do aktualizacji `current_amount` w tabeli `goals`:

```sql
CREATE OR REPLACE FUNCTION update_goal_current_amount()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE goals SET current_amount = current_amount + NEW.amount WHERE id = NEW.goal_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE goals SET current_amount = current_amount - OLD.amount + NEW.amount WHERE id = NEW.goal_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE goals SET current_amount = current_amount - OLD.amount WHERE id = OLD.goal_id;
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER goal_contributions_update_current_amount
AFTER INSERT OR UPDATE OR DELETE ON goal_contributions
FOR EACH ROW EXECUTE FUNCTION update_goal_current_amount();
```

### Trigger do aktualizacji `updated_at`:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incomes_updated_at BEFORE UPDATE ON incomes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
FOR EACH ROW EXECUTE FUNCTION update_expenses_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Funkcja do tworzenia domyślnych kategorii dla nowych użytkowników:

```sql
CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO categories (user_id, name, is_default) VALUES
    (NEW.id, 'dom', true),
    (NEW.id, 'apteka', true),
    (NEW.id, 'lekarz', true),
    (NEW.id, 'środki czystości', true),
    (NEW.id, 'abonament', true),
    (NEW.id, 'przyjemności', true),
    (NEW.id, 'rozrywka', true),
    (NEW.id, 'ubrania', true),
    (NEW.id, 'żywność', true),
    (NEW.id, 'dzieci', true),
    (NEW.id, 'inne', true);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_default_categories_on_user_insert
AFTER INSERT ON users
FOR EACH ROW EXECUTE FUNCTION create_default_categories();
```

### Decyzje projektowe:

- **UUID jako klucze podstawowe**: Zapewnia lepszą dystrybucję danych i uniknięcie konfliktów w środowiskach rozproszonych
- **NUMERIC(10,2)**: Zapewnia precyzję obliczeń finansowych bez problemów z zaokrągleniami zmiennoprzecinkowymi
- **Cached current_amount**: Optymalizuje wydajność zapytań o cele oszczędnościowe, aktualizowane automatycznie przez trigger
- **RLS**: Zapewnia bezpieczeństwo danych na poziomie bazy danych
- **ON DELETE CASCADE**: Automatycznie usuwa wszystkie dane użytkownika przy usunięciu konta dla zachowania prywatności
- **Indeksy złożone na (user_id, date DESC)**: Optymalizują zapytania miesięczne i filtrowanie po dacie
- **Unikalność kategorii per użytkownik**: Zapobiega duplikatom nazw kategorii dla tego samego użytkownika

### Uwagi dotyczące skalowalności:

- Schemat jest zoptymalizowany dla MVP bez partycjonowania
- Indeksy zapewniają wydajność dla oczekiwanych wzorców zapytań
- Relacje CASCADE DELETE upraszczają zarządzanie danymi
- Cached wartości zmniejszają potrzebę kosztownych agregacji w czasie rzeczywistym

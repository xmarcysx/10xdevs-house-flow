import type { CreateIncomeCommand, GetIncomesQuery, UpdateIncomeCommand } from "../../types";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Maksymalna wartość limitu dla zapytań
 */
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;

/**
 * Domyślne wartości dla parametrów query
 */
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "date DESC";

/**
 * Dozwolone pola sortowania dla wpływów
 */
const ALLOWED_SORT_FIELDS = ["date", "amount", "source", "created_at"] as const;

/**
 * Dozwolone kierunki sortowania
 */
const ALLOWED_SORT_DIRECTIONS = ["ASC", "DESC"] as const;

/**
 * Waliduje parametry query dla pobierania wpływów
 * @param query Obiekt zawierający parametry query
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateGetIncomesQuery(query: URLSearchParams): ValidationResult {
  const errors: string[] = [];

  // Walidacja parametru page
  const pageParam = query.get("page");
  if (pageParam !== null) {
    const page = parseInt(pageParam, 10);
    if (isNaN(page) || page < 1) {
      errors.push("Parametr 'page' musi być liczbą całkowitą większą lub równą 1");
    }
  }

  // Walidacja parametru limit
  const limitParam = query.get("limit");
  if (limitParam !== null) {
    const limit = parseInt(limitParam, 10);
    if (isNaN(limit) || limit < MIN_LIMIT || limit > MAX_LIMIT) {
      errors.push(`Parametr 'limit' musi być liczbą całkowitą w zakresie ${MIN_LIMIT}-${MAX_LIMIT}`);
    }
  }

  // Walidacja parametru month
  const monthParam = query.get("month");
  if (monthParam !== null && monthParam.trim() !== "") {
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(monthParam)) {
      errors.push("Parametr 'month' musi mieć format YYYY-MM");
    } else {
      // Dodatkowa walidacja czy miesiąc jest prawidłowy
      const [year, month] = monthParam.split("-").map(Number);
      if (month < 1 || month > 12) {
        errors.push("Miesiąc w parametrze 'month' musi być w zakresie 01-12");
      }
      // Opcjonalnie można sprawdzić zakres lat, np. 2000-2030
      if (year < 2000 || year > 2030) {
        errors.push("Rok w parametrze 'month' musi być w zakresie 2000-2030");
      }
    }
  }

  // Walidacja parametru sort
  const sortParam = query.get("sort");
  if (sortParam !== null && sortParam.trim() !== "") {
    const sortParts = sortParam.trim().split(/\s+/);
    if (sortParts.length === 1 || sortParts.length === 2) {
      const field = sortParts[0].toLowerCase();
      const direction = sortParts.length === 2 ? sortParts[1].toUpperCase() : "ASC";

      if (!ALLOWED_SORT_FIELDS.includes(field as (typeof ALLOWED_SORT_FIELDS)[number])) {
        errors.push(`Pole sortowania '${field}' nie jest dozwolone. Dozwolone pola: ${ALLOWED_SORT_FIELDS.join(", ")}`);
      }

      if (!ALLOWED_SORT_DIRECTIONS.includes(direction as (typeof ALLOWED_SORT_DIRECTIONS)[number])) {
        errors.push(
          `Kierunek sortowania '${direction}' nie jest dozwolony. Dozwolone kierunki: ${ALLOWED_SORT_DIRECTIONS.join(", ")}`
        );
      }
    } else {
      errors.push("Parametr 'sort' musi mieć format 'pole ASC' lub 'pole DESC'");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanityzuje i ustawia domyślne wartości dla parametrów query pobierania wpływów
 * @param query Obiekt URLSearchParams zawierający parametry query
 * @returns Sanityzowany obiekt GetIncomesQuery z wartościami domyślnymi
 */
export function sanitizeGetIncomesQuery(query: URLSearchParams): GetIncomesQuery {
  // Parsowanie i sanityzacja parametru page
  const pageParam = query.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : DEFAULT_PAGE;
  const sanitizedPage = !isNaN(page) && page >= 1 ? page : DEFAULT_PAGE;

  // Parsowanie i sanityzacja parametru limit
  const limitParam = query.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : DEFAULT_LIMIT;
  const sanitizedLimit = !isNaN(limit) && limit >= MIN_LIMIT && limit <= MAX_LIMIT ? limit : DEFAULT_LIMIT;

  // Parsowanie i sanityzacja parametru month
  const monthParam = query.get("month");
  let sanitizedMonth: string | undefined;
  if (monthParam && monthParam.trim() !== "") {
    const monthRegex = /^\d{4}-\d{2}$/;
    if (monthRegex.test(monthParam)) {
      const [year, month] = monthParam.split("-").map(Number);
      if (month >= 1 && month <= 12 && year >= 2000 && year <= 2030) {
        sanitizedMonth = monthParam;
      }
    }
  }

  // Parsowanie i sanityzacja parametru sort
  const sortParam = query.get("sort");
  let sanitizedSort = DEFAULT_SORT;
  if (sortParam && sortParam.trim() !== "") {
    const sortParts = sortParam.trim().split(/\s+/);
    if (sortParts.length === 1 || sortParts.length === 2) {
      const field = sortParts[0].toLowerCase();
      const direction = sortParts.length === 2 ? sortParts[1].toUpperCase() : "ASC";

      if (
        ALLOWED_SORT_FIELDS.includes(field as (typeof ALLOWED_SORT_FIELDS)[number]) &&
        ALLOWED_SORT_DIRECTIONS.includes(direction as (typeof ALLOWED_SORT_DIRECTIONS)[number])
      ) {
        sanitizedSort = `${field} ${direction}`;
      }
    }
  }

  return {
    page: sanitizedPage,
    limit: sanitizedLimit,
    month: sanitizedMonth,
    sort: sanitizedSort,
  };
}

/**
 * Minimalna i maksymalna kwota wpływu
 */
const MIN_INCOME_AMOUNT = 0.01;
const MAX_INCOME_AMOUNT = 10000000;

/**
 * Maksymalna długość opisu wpływu
 */
const MAX_DESCRIPTION_LENGTH = 500;

/**
 * Maksymalna długość źródła wpływu
 */
const MAX_SOURCE_LENGTH = 100;

/**
 * Waliduje dane wejściowe dla tworzenia wpływu
 * @param data Dane do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateCreateIncomeCommand(data: unknown): ValidationResult {
  const errors: string[] = [];

  // Sprawdź czy dane są obiektem
  if (!data || typeof data !== "object") {
    errors.push("Dane wejściowe muszą być obiektem");
    return { isValid: false, errors };
  }

  const command = data as Record<string, unknown>;

  // Sprawdź czy pole 'amount' istnieje
  if (!("amount" in command)) {
    errors.push("Pole 'amount' jest wymagane");
    return { isValid: false, errors };
  }

  // Sprawdź czy pole 'date' istnieje
  if (!("date" in command)) {
    errors.push("Pole 'date' jest wymagane");
    return { isValid: false, errors };
  }

  // Walidacja kwoty
  const amount = command.amount;
  if (typeof amount !== "number") {
    errors.push("Pole 'amount' musi być liczbą");
  } else {
    if (amount < MIN_INCOME_AMOUNT) {
      errors.push(`Kwota wpływu nie może być mniejsza niż ${MIN_INCOME_AMOUNT}`);
    }
    if (amount > MAX_INCOME_AMOUNT) {
      errors.push(`Kwota wpływu nie może przekraczać ${MAX_INCOME_AMOUNT}`);
    }
  }

  // Walidacja daty
  const date = command.date;
  if (typeof date !== "string") {
    errors.push("Pole 'date' musi być tekstem w formacie YYYY-MM-DD");
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      errors.push("Pole 'date' musi mieć format YYYY-MM-DD");
    } else {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        errors.push("Pole 'date' zawiera nieprawidłową datę");
      }
    }
  }

  // Walidacja opisu (opcjonalne)
  if ("description" in command) {
    const description = command.description;
    if (description !== null && typeof description !== "string") {
      errors.push("Pole 'description' musi być tekstem lub null");
    } else if (typeof description === "string" && description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push(`Opis wpływu nie może przekraczać ${MAX_DESCRIPTION_LENGTH} znaków`);
    }
  }

  // Walidacja źródła (opcjonalne)
  if ("source" in command) {
    const source = command.source;
    if (source !== null && typeof source !== "string") {
      errors.push("Pole 'source' musi być tekstem lub null");
    } else if (typeof source === "string" && source.length > MAX_SOURCE_LENGTH) {
      errors.push(`Źródło wpływu nie może przekraczać ${MAX_SOURCE_LENGTH} znaków`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanityzuje dane wejściowe dla CreateIncomeCommand
 * @param data Dane do sanityzacji
 * @returns Sanityzowany CreateIncomeCommand lub null jeśli dane są nieprawidłowe
 */
export function sanitizeCreateIncomeCommand(data: unknown): CreateIncomeCommand | null {
  const validation = validateCreateIncomeCommand(data);

  if (!validation.isValid) {
    return null;
  }

  const command = data as Record<string, unknown>;
  const amount = command.amount as number;
  const date = command.date as string;
  const description = command.description as string | null;
  const source = command.source as string | null;

  return {
    amount,
    date,
    description: description?.trim() || null,
    source: source?.trim() || null,
  };
}

/**
 * Waliduje dane wejściowe dla aktualizacji wpływu
 * @param data Dane do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateUpdateIncomeCommand(data: unknown): ValidationResult {
  const errors: string[] = [];

  // Sprawdź czy dane są obiektem
  if (!data || typeof data !== "object") {
    errors.push("Dane wejściowe muszą być obiektem");
    return { isValid: false, errors };
  }

  const command = data as Record<string, unknown>;

  // Wszystkie pola są opcjonalne w aktualizacji, ale przynajmniej jedno musi być podane
  const hasAmount = "amount" in command;
  const hasDate = "date" in command;
  const hasDescription = "description" in command;
  const hasSource = "source" in command;

  if (!hasAmount && !hasDate && !hasDescription && !hasSource) {
    errors.push("Przynajmniej jedno pole do aktualizacji musi być podane");
    return { isValid: false, errors };
  }

  // Walidacja kwoty (jeśli podana)
  if (hasAmount) {
    const amount = command.amount;
    if (typeof amount !== "number") {
      errors.push("Pole 'amount' musi być liczbą");
    } else {
      if (amount < MIN_INCOME_AMOUNT) {
        errors.push(`Kwota wpływu nie może być mniejsza niż ${MIN_INCOME_AMOUNT}`);
      }
      if (amount > MAX_INCOME_AMOUNT) {
        errors.push(`Kwota wpływu nie może przekraczać ${MAX_INCOME_AMOUNT}`);
      }
    }
  }

  // Walidacja daty (jeśli podana)
  if (hasDate) {
    const date = command.date;
    if (typeof date !== "string") {
      errors.push("Pole 'date' musi być tekstem w formacie YYYY-MM-DD");
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        errors.push("Pole 'date' musi mieć format YYYY-MM-DD");
      } else {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          errors.push("Pole 'date' zawiera nieprawidłową datę");
        }
      }
    }
  }

  // Walidacja opisu (jeśli podany)
  if (hasDescription) {
    const description = command.description;
    if (description !== null && typeof description !== "string") {
      errors.push("Pole 'description' musi być tekstem lub null");
    } else if (typeof description === "string" && description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push(`Opis wpływu nie może przekraczać ${MAX_DESCRIPTION_LENGTH} znaków`);
    }
  }

  // Walidacja źródła (jeśli podane)
  if (hasSource) {
    const source = command.source;
    if (source !== null && typeof source !== "string") {
      errors.push("Pole 'source' musi być tekstem lub null");
    } else if (typeof source === "string" && source.length > MAX_SOURCE_LENGTH) {
      errors.push(`Źródło wpływu nie może przekraczać ${MAX_SOURCE_LENGTH} znaków`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanityzuje dane wejściowe dla UpdateIncomeCommand
 * @param data Dane do sanityzacji
 * @returns Sanityzowany UpdateIncomeCommand lub null jeśli dane są nieprawidłowe
 */
export function sanitizeUpdateIncomeCommand(data: unknown): UpdateIncomeCommand | null {
  const validation = validateUpdateIncomeCommand(data);

  if (!validation.isValid) {
    return null;
  }

  const command = data as Record<string, unknown>;
  const result: UpdateIncomeCommand = {};

  if ("amount" in command) {
    result.amount = command.amount as number;
  }

  if ("date" in command) {
    result.date = command.date as string;
  }

  if ("description" in command) {
    const description = command.description as string | null;
    result.description = description?.trim() || null;
  }

  if ("source" in command) {
    const source = command.source as string | null;
    result.source = source?.trim() || null;
  }

  return result;
}

/**
 * Waliduje ID wpływu (UUID)
 * @param incomeId ID wpływu do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateIncomeId(incomeId: string): ValidationResult {
  const errors: string[] = [];

  // Sprawdź czy ID jest stringiem
  if (typeof incomeId !== "string") {
    errors.push("ID wpływu musi być tekstem");
    return { isValid: false, errors };
  }

  // Sprawdź czy ID nie jest pusty
  const trimmedId = incomeId.trim();
  if (trimmedId.length === 0) {
    errors.push("ID wpływu nie może być pusty");
    return { isValid: false, errors };
  }

  // Sprawdź format UUID (podstawowa walidacja)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(trimmedId)) {
    errors.push("ID wpływu musi być prawidłowym UUID");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

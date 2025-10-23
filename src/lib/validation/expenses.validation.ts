import type { CreateExpenseCommand, GetExpensesQuery, UpdateExpenseCommand } from "../../types";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface GetExpensesQueryInternal {
  page: number;
  limit: number;
  month?: string;
  category_id?: string;
  sort: string;
}

/**
 * Domyślne wartości dla parametrów query
 */
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "date DESC";
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;

/**
 * Dozwolone pola sortowania dla wydatków
 */
const ALLOWED_SORT_FIELDS = ["date", "amount", "created_at"] as const;

/**
 * Dozwolone kierunki sortowania
 */
const ALLOWED_SORT_DIRECTIONS = ["ASC", "DESC"] as const;

/**
 * Waliduje parametry query dla pobierania wydatków
 * @param query Obiekt zawierający parametry query
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateGetExpensesQuery(query: URLSearchParams): ValidationResult {
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
      // Sprawdź czy miesiąc jest prawidłowy (01-12)
      const [, year, month] = monthParam.match(/^(\d{4})-(\d{2})$/) || [];
      const monthNum = parseInt(month, 10);
      if (monthNum < 1 || monthNum > 12) {
        errors.push("Miesiąc w parametrze 'month' musi być w zakresie 01-12");
      }
    }
  }

  // Walidacja parametru category_id
  const categoryIdParam = query.get("category_id");
  if (categoryIdParam !== null && categoryIdParam.trim() !== "") {
    // Sprawdź format UUID (podstawowa walidacja)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(categoryIdParam)) {
      errors.push("Parametr 'category_id' musi być prawidłowym UUID");
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
 * Sanityzuje i ustawia domyślne wartości dla parametrów query pobierania wydatków
 * @param query Obiekt URLSearchParams zawierający parametry query
 * @returns Sanityzowany obiekt GetExpensesQuery z wartościami domyślnymi
 */
export function sanitizeGetExpensesQuery(query: URLSearchParams): GetExpensesQuery {
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
      const [, year, month] = monthParam.match(/^(\d{4})-(\d{2})$/) || [];
      const monthNum = parseInt(month, 10);
      if (monthNum >= 1 && monthNum <= 12) {
        sanitizedMonth = monthParam;
      }
    }
  }

  // Parsowanie i sanityzacja parametru category_id
  const categoryIdParam = query.get("category_id");
  let sanitizedCategoryId: string | undefined;
  if (categoryIdParam && categoryIdParam.trim() !== "") {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(categoryIdParam)) {
      sanitizedCategoryId = categoryIdParam;
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
    category_id: sanitizedCategoryId,
    sort: sanitizedSort,
  };
}

/**
 * Maksymalna długość opisu wydatku
 */
const MAX_DESCRIPTION_LENGTH = 1000;

/**
 * Minimalna kwota wydatku
 */
const MIN_AMOUNT = 0.01;

/**
 * Waliduje dane wejściowe dla tworzenia wydatku
 * @param data Dane do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateCreateExpenseCommand(data: unknown): ValidationResult {
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

  const amount = command.amount;

  // Sprawdź czy amount jest liczbą
  if (typeof amount !== "number" || isNaN(amount)) {
    errors.push("Pole 'amount' musi być prawidłową liczbą");
  } else {
    // Sprawdź czy kwota jest większa od zera
    if (amount <= MIN_AMOUNT) {
      errors.push(`Kwota wydatku musi być większa niż ${MIN_AMOUNT}`);
    }
  }

  // Sprawdź czy pole 'date' istnieje
  if (!("date" in command)) {
    errors.push("Pole 'date' jest wymagane");
    return { isValid: false, errors };
  }

  const date = command.date;

  // Sprawdź czy date jest stringiem
  if (typeof date !== "string") {
    errors.push("Pole 'date' musi być tekstem w formacie ISO");
    return { isValid: false, errors };
  }

  // Sprawdź format daty ISO
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    errors.push("Pole 'date' musi być prawidłową datą w formacie ISO");
  } else {
    // Sprawdź czy data nie jest w przyszłości
    const now = new Date();
    if (dateObj > now) {
      errors.push("Data wydatku nie może być w przyszłości");
    }
  }

  // Sprawdź czy pole 'category_id' istnieje
  if (!("category_id" in command)) {
    errors.push("Pole 'category_id' jest wymagane");
    return { isValid: false, errors };
  }

  const categoryId = command.category_id;

  // Sprawdź czy category_id jest stringiem
  if (typeof categoryId !== "string") {
    errors.push("Pole 'category_id' musi być tekstem");
    return { isValid: false, errors };
  }

  // Sprawdź format UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(categoryId.trim())) {
    errors.push("Pole 'category_id' musi być prawidłowym UUID");
  }

  // Sprawdź opcjonalne pole 'description'
  if ("description" in command) {
    const description = command.description;
    if (description !== null && description !== undefined) {
      if (typeof description !== "string") {
        errors.push("Pole 'description' musi być tekstem");
      } else {
        // Sprawdź długość opisu
        const trimmedDescription = description.trim();
        if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
          errors.push(`Opis wydatku nie może przekraczać ${MAX_DESCRIPTION_LENGTH} znaków`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanityzuje dane wejściowe dla CreateExpenseCommand
 * @param data Dane do sanityzacji
 * @returns Sanityzowany CreateExpenseCommand lub null jeśli dane są nieprawidłowe
 */
export function sanitizeCreateExpenseCommand(data: unknown): CreateExpenseCommand | null {
  const validation = validateCreateExpenseCommand(data);

  if (!validation.isValid) {
    return null;
  }

  const command = data as Record<string, unknown>;
  const amount = command.amount as number;
  const date = (command.date as string).trim();
  const categoryId = (command.category_id as string).trim();

  // Sanityzacja opisu (opcjonalne pole)
  let description: string | undefined;
  if ("description" in command) {
    const desc = command.description;
    if (typeof desc === "string") {
      const trimmedDesc = desc.trim();
      description = trimmedDesc.length > 0 ? trimmedDesc : undefined;
    }
  }

  return {
    amount,
    date,
    category_id: categoryId,
    description,
  };
}

/**
 * Waliduje ID wydatku (UUID)
 * @param expenseId ID wydatku do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateExpenseId(expenseId: string): ValidationResult {
  const errors: string[] = [];

  // Sprawdź czy ID jest stringiem
  if (typeof expenseId !== "string") {
    errors.push("ID wydatku musi być tekstem");
    return { isValid: false, errors };
  }

  // Sprawdź czy ID nie jest pusty
  const trimmedId = expenseId.trim();
  if (trimmedId.length === 0) {
    errors.push("ID wydatku nie może być pusty");
    return { isValid: false, errors };
  }

  // Sprawdź format UUID (podstawowa walidacja)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(trimmedId)) {
    errors.push("ID wydatku musi być prawidłowym UUID");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Waliduje dane wejściowe dla aktualizacji wydatku
 * @param data Dane do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateUpdateExpenseCommand(data: unknown): ValidationResult {
  const errors: string[] = [];

  // Sprawdź czy dane są obiektem
  if (!data || typeof data !== "object") {
    errors.push("Dane wejściowe muszą być obiektem");
    return { isValid: false, errors };
  }

  const command = data as Record<string, unknown>;

  // Sprawdź czy przynajmniej jedno pole zostało podane
  const hasAnyField = "amount" in command || "date" in command || "description" in command || "category_id" in command;

  if (!hasAnyField) {
    errors.push("Przynajmniej jedno pole do aktualizacji musi być podane");
    return { isValid: false, errors };
  }

  // Walidacja opcjonalnego pola 'amount'
  if ("amount" in command) {
    const amount = command.amount;
    if (amount !== null && amount !== undefined) {
      if (typeof amount !== "number" || isNaN(amount)) {
        errors.push("Pole 'amount' musi być prawidłową liczbą");
      } else {
        // Sprawdź czy kwota jest większa od zera
        if (amount <= MIN_AMOUNT) {
          errors.push(`Kwota wydatku musi być większa niż ${MIN_AMOUNT}`);
        }
      }
    }
  }

  // Walidacja opcjonalnego pola 'date'
  if ("date" in command) {
    const date = command.date;
    if (date !== null && date !== undefined) {
      if (typeof date !== "string") {
        errors.push("Pole 'date' musi być tekstem w formacie ISO");
      } else {
        // Sprawdź format daty ISO
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          errors.push("Pole 'date' musi być prawidłową datą w formacie ISO");
        } else {
          // Sprawdź czy data nie jest w przyszłości
          const now = new Date();
          if (dateObj > now) {
            errors.push("Data wydatku nie może być w przyszłości");
          }
        }
      }
    }
  }

  // Walidacja opcjonalnego pola 'category_id'
  if ("category_id" in command) {
    const categoryId = command.category_id;
    if (categoryId !== null && categoryId !== undefined) {
      if (typeof categoryId !== "string") {
        errors.push("Pole 'category_id' musi być tekstem");
      } else {
        // Sprawdź format UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(categoryId.trim())) {
          errors.push("Pole 'category_id' musi być prawidłowym UUID");
        }
      }
    }
  }

  // Walidacja opcjonalnego pola 'description'
  if ("description" in command) {
    const description = command.description;
    if (description !== null && description !== undefined) {
      if (typeof description !== "string") {
        errors.push("Pole 'description' musi być tekstem");
      } else {
        // Sprawdź długość opisu
        const trimmedDescription = description.trim();
        if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
          errors.push(`Opis wydatku nie może przekraczać ${MAX_DESCRIPTION_LENGTH} znaków`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanityzuje dane wejściowe dla UpdateExpenseCommand
 * @param data Dane do sanityzacji
 * @returns Sanityzowany UpdateExpenseCommand lub null jeśli dane są nieprawidłowe
 */
export function sanitizeUpdateExpenseCommand(data: unknown): UpdateExpenseCommand | null {
  const validation = validateUpdateExpenseCommand(data);

  if (!validation.isValid) {
    return null;
  }

  const command = data as Record<string, unknown>;
  const sanitizedCommand: UpdateExpenseCommand = {};

  // Sanityzacja opcjonalnego pola 'amount'
  if ("amount" in command && command.amount !== null && command.amount !== undefined) {
    sanitizedCommand.amount = command.amount as number;
  }

  // Sanityzacja opcjonalnego pola 'date'
  if ("date" in command && command.date !== null && command.date !== undefined) {
    sanitizedCommand.date = (command.date as string).trim();
  }

  // Sanityzacja opcjonalnego pola 'category_id'
  if ("category_id" in command && command.category_id !== null && command.category_id !== undefined) {
    sanitizedCommand.category_id = (command.category_id as string).trim();
  }

  // Sanityzacja opcjonalnego pola 'description'
  if ("description" in command && command.description !== null && command.description !== undefined) {
    const desc = command.description as string;
    const trimmedDesc = desc.trim();
    sanitizedCommand.description = trimmedDesc.length > 0 ? trimmedDesc : undefined;
  }

  return sanitizedCommand;
}

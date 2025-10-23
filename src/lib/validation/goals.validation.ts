import type { CreateGoalCommand, UpdateGoalCommand } from "../../types";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface GetGoalsQuery {
  page: number;
  limit: number;
  sort: string;
}

/**
 * Maksymalna długość nazwy celu
 */
const MAX_GOAL_NAME_LENGTH = 200;

/**
 * Minimalna długość nazwy celu
 */
const MIN_GOAL_NAME_LENGTH = 1;

/**
 * Minimalna kwota docelowa
 */
const MIN_TARGET_AMOUNT = 0.01;

/**
 * Maksymalna kwota docelowa
 */
const MAX_TARGET_AMOUNT = 10000000; // 10 milionów

/**
 * Waliduje dane wejściowe dla tworzenia celu
 * @param data Dane do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateCreateGoalCommand(data: unknown): ValidationResult {
  const errors: string[] = [];

  // Sprawdź czy dane są obiektem
  if (!data || typeof data !== "object") {
    errors.push("Dane wejściowe muszą być obiektem");
    return { isValid: false, errors };
  }

  const command = data as Record<string, unknown>;

  // Sprawdź czy pole 'name' istnieje
  if (!("name" in command)) {
    errors.push("Pole 'name' jest wymagane");
    return { isValid: false, errors };
  }

  const name = command.name;

  // Sprawdź czy name jest stringiem
  if (typeof name !== "string") {
    errors.push("Pole 'name' musi być tekstem");
    return { isValid: false, errors };
  }

  // Sprawdź długość nazwy
  const trimmedName = name.trim();
  if (trimmedName.length < MIN_GOAL_NAME_LENGTH) {
    errors.push("Nazwa celu nie może być pusta");
  }

  if (trimmedName.length > MAX_GOAL_NAME_LENGTH) {
    errors.push(`Nazwa celu nie może przekraczać ${MAX_GOAL_NAME_LENGTH} znaków`);
  }

  // Sprawdź czy nazwa zawiera tylko dozwolone znaki
  if (!/^[a-zA-Z0-9\s\-_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ.,!?]+$/.test(trimmedName)) {
    errors.push(
      "Nazwa celu może zawierać tylko litery, cyfry, spacje, myślniki, podkreślenia oraz znaki interpunkcyjne"
    );
  }

  // Sprawdź czy pole 'target_amount' istnieje
  if (!("target_amount" in command)) {
    errors.push("Pole 'target_amount' jest wymagane");
    return { isValid: false, errors };
  }

  const targetAmount = command.target_amount;

  // Sprawdź czy target_amount jest liczbą
  if (typeof targetAmount !== "number") {
    errors.push("Pole 'target_amount' musi być liczbą");
  } else {
    // Sprawdź zakres kwoty docelowej
    if (targetAmount < MIN_TARGET_AMOUNT) {
      errors.push("Kwota docelowa musi być większa od zera");
    }

    if (targetAmount > MAX_TARGET_AMOUNT) {
      errors.push(`Kwota docelowa nie może przekraczać ${MAX_TARGET_AMOUNT}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanityzuje dane wejściowe dla CreateGoalCommand
 * @param data Dane do sanityzacji
 * @returns Sanityzowany CreateGoalCommand lub null jeśli dane są nieprawidłowe
 */
export function sanitizeCreateGoalCommand(data: unknown): CreateGoalCommand | null {
  const validation = validateCreateGoalCommand(data);

  if (!validation.isValid) {
    return null;
  }

  const command = data as Record<string, unknown>;
  const name = (command.name as string).trim();
  const targetAmount = command.target_amount as number;

  return {
    name,
    target_amount: targetAmount,
  };
}

/**
 * Domyślne wartości dla parametrów query
 */
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "created_at DESC";
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;

/**
 * Dozwolone pola sortowania dla celów
 */
const ALLOWED_SORT_FIELDS = ["name", "created_at", "target_amount", "current_amount"] as const;

/**
 * Dozwolone kierunki sortowania
 */
const ALLOWED_SORT_DIRECTIONS = ["ASC", "DESC"] as const;

/**
 * Waliduje parametry query dla pobierania celów
 * @param query Obiekt zawierający parametry query
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateGetGoalsQuery(query: URLSearchParams): ValidationResult {
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
 * Sanityzuje i ustawia domyślne wartości dla parametrów query pobierania celów
 * @param query Obiekt URLSearchParams zawierający parametry query
 * @returns Sanityzowany obiekt GetGoalsQuery z wartościami domyślnymi
 */
export function sanitizeGetGoalsQuery(query: URLSearchParams): GetGoalsQuery {
  // Parsowanie i sanityzacja parametru page
  const pageParam = query.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : DEFAULT_PAGE;
  const sanitizedPage = !isNaN(page) && page >= 1 ? page : DEFAULT_PAGE;

  // Parsowanie i sanityzacja parametru limit
  const limitParam = query.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : DEFAULT_LIMIT;
  const sanitizedLimit = !isNaN(limit) && limit >= MIN_LIMIT && limit <= MAX_LIMIT ? limit : DEFAULT_LIMIT;

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
    sort: sanitizedSort,
  };
}

/**
 * Waliduje ID celu (UUID)
 * @param goalId ID celu do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateGoalId(goalId: string): ValidationResult {
  const errors: string[] = [];

  // Sprawdź czy ID jest stringiem
  if (typeof goalId !== "string") {
    errors.push("ID celu musi być tekstem");
    return { isValid: false, errors };
  }

  // Sprawdź czy ID nie jest pusty
  const trimmedId = goalId.trim();
  if (trimmedId.length === 0) {
    errors.push("ID celu nie może być pusty");
    return { isValid: false, errors };
  }

  // Sprawdź format UUID (podstawowa walidacja)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(trimmedId)) {
    errors.push("ID celu musi być prawidłowym UUID");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Waliduje dane wejściowe dla aktualizacji celu
 * @param data Dane do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateUpdateGoalCommand(data: unknown): ValidationResult {
  const errors: string[] = [];

  // Sprawdź czy dane są obiektem
  if (!data || typeof data !== "object") {
    errors.push("Dane wejściowe muszą być obiektem");
    return { isValid: false, errors };
  }

  const command = data as Record<string, unknown>;

  // Sprawdź czy przynajmniej jedno pole zostało podane
  if (!("name" in command) && !("target_amount" in command)) {
    errors.push("Przynajmniej jedno pole ('name' lub 'target_amount') musi być podane");
    return { isValid: false, errors };
  }

  // Walidacja pola 'name' jeśli zostało podane
  if ("name" in command) {
    const name = command.name;

    if (typeof name !== "string") {
      errors.push("Pole 'name' musi być tekstem");
    } else {
      // Sprawdź długość nazwy
      const trimmedName = name.trim();
      if (trimmedName.length < MIN_GOAL_NAME_LENGTH) {
        errors.push("Nazwa celu nie może być pusta");
      }

      if (trimmedName.length > MAX_GOAL_NAME_LENGTH) {
        errors.push(`Nazwa celu nie może przekraczać ${MAX_GOAL_NAME_LENGTH} znaków`);
      }

      // Sprawdź czy nazwa zawiera tylko dozwolone znaki
      if (!/^[a-zA-Z0-9\s\-_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ.,!?]+$/.test(trimmedName)) {
        errors.push(
          "Nazwa celu może zawierać tylko litery, cyfry, spacje, myślniki, podkreślenia oraz znaki interpunkcyjne"
        );
      }
    }
  }

  // Walidacja pola 'target_amount' jeśli zostało podane
  if ("target_amount" in command) {
    const targetAmount = command.target_amount;

    if (typeof targetAmount !== "number") {
      errors.push("Pole 'target_amount' musi być liczbą");
    } else {
      // Sprawdź zakres kwoty docelowej
      if (targetAmount < MIN_TARGET_AMOUNT) {
        errors.push("Kwota docelowa musi być większa od zera");
      }

      if (targetAmount > MAX_TARGET_AMOUNT) {
        errors.push(`Kwota docelowa nie może przekraczać ${MAX_TARGET_AMOUNT}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanityzuje dane wejściowe dla UpdateGoalCommand
 * @param data Dane do sanityzacji
 * @returns Sanityzowany UpdateGoalCommand lub null jeśli dane są nieprawidłowe
 */
export function sanitizeUpdateGoalCommand(data: unknown): UpdateGoalCommand | null {
  const validation = validateUpdateGoalCommand(data);

  if (!validation.isValid) {
    return null;
  }

  const command = data as Record<string, unknown>;
  const result: UpdateGoalCommand = {};

  if ("name" in command) {
    result.name = (command.name as string).trim();
  }

  if ("target_amount" in command) {
    result.target_amount = command.target_amount as number;
  }

  return result;
}

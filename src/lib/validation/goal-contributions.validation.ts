import type { CreateGoalContributionCommand, UpdateGoalContributionCommand } from "../../types";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface GetGoalContributionsQuery {
  page: number;
  limit: number;
  sort: string;
}

/**
 * Maksymalna długość opisu wpłaty
 */
const MAX_DESCRIPTION_LENGTH = 500;

/**
 * Minimalna długość opisu wpłaty
 */
const MIN_DESCRIPTION_LENGTH = 0;

/**
 * Maksymalna kwota wpłaty
 */
const MAX_AMOUNT = 1000000;

/**
 * Minimalna kwota wpłaty
 */
const MIN_AMOUNT = 0.01;

/**
 * Waliduje dane wejściowe dla tworzenia wpłaty na cel oszczędnościowy
 * @param data Dane do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateCreateGoalContributionCommand(data: unknown): ValidationResult {
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
  if (typeof amount !== "number") {
    errors.push("Pole 'amount' musi być liczbą");
  } else {
    // Sprawdź zakres kwoty
    if (amount <= MIN_AMOUNT) {
      errors.push(`Kwota wpłaty musi być większa od ${MIN_AMOUNT}`);
    }
    if (amount > MAX_AMOUNT) {
      errors.push(`Kwota wpłaty nie może przekraczać ${MAX_AMOUNT}`);
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
    errors.push("Pole 'date' musi być tekstem");
  } else {
    // Sprawdź format daty (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      errors.push("Pole 'date' musi mieć format YYYY-MM-DD");
    } else {
      // Sprawdź czy data jest prawidłowa
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        errors.push("Pole 'date' zawiera nieprawidłową datę");
      } else {
        // Sprawdź czy data nie jest w przyszłości (opcjonalne, można usunąć jeśli wpłaty w przyszłości są dozwolone)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (parsedDate > today) {
          errors.push("Data wpłaty nie może być w przyszłości");
        }
      }
    }
  }

  // Sprawdź pole 'description' jeśli istnieje
  if ("description" in command) {
    const description = command.description;
    if (description !== null && typeof description !== "string") {
      errors.push("Pole 'description' musi być tekstem lub null");
    } else if (typeof description === "string") {
      // Sprawdź długość opisu
      const trimmedDescription = description.trim();
      if (trimmedDescription.length < MIN_DESCRIPTION_LENGTH) {
        errors.push("Opis wpłaty nie może być pusty (użyj null aby pominąć opis)");
      }
      if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
        errors.push(`Opis wpłaty nie może przekraczać ${MAX_DESCRIPTION_LENGTH} znaków`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanityzuje dane wejściowe dla CreateGoalContributionCommand
 * @param data Dane do sanityzacji
 * @returns Sanityzowany CreateGoalContributionCommand lub null jeśli dane są nieprawidłowe
 */
export function sanitizeCreateGoalContributionCommand(data: unknown): CreateGoalContributionCommand | null {
  const validation = validateCreateGoalContributionCommand(data);

  if (!validation.isValid) {
    return null;
  }

  const command = data as Record<string, unknown>;
  const amount = command.amount as number;
  const date = command.date as string;
  const description = command.description as string | null;

  return {
    amount,
    date,
    description: description ? description.trim() : null,
  };
}

/**
 * Waliduje dane wejściowe dla aktualizacji wpłaty na cel oszczędnościowy
 * @param data Dane do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateUpdateGoalContributionCommand(data: unknown): ValidationResult {
  const errors: string[] = [];

  // Sprawdź czy dane są obiektem
  if (!data || typeof data !== "object") {
    errors.push("Dane wejściowe muszą być obiektem");
    return { isValid: false, errors };
  }

  const command = data as Record<string, unknown>;

  // Wszystkie pola są opcjonalne dla aktualizacji
  // Sprawdź pole 'amount' jeśli istnieje
  if ("amount" in command) {
    const amount = command.amount;
    if (typeof amount !== "number") {
      errors.push("Pole 'amount' musi być liczbą");
    } else {
      // Sprawdź zakres kwoty
      if (amount <= MIN_AMOUNT) {
        errors.push(`Kwota wpłaty musi być większa od ${MIN_AMOUNT}`);
      }
      if (amount > MAX_AMOUNT) {
        errors.push(`Kwota wpłaty nie może przekraczać ${MAX_AMOUNT}`);
      }
    }
  }

  // Sprawdź pole 'date' jeśli istnieje
  if ("date" in command) {
    const date = command.date;
    if (typeof date !== "string") {
      errors.push("Pole 'date' musi być tekstem");
    } else {
      // Sprawdź format daty (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        errors.push("Pole 'date' musi mieć format YYYY-MM-DD");
      } else {
        // Sprawdź czy data jest prawidłowa
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          errors.push("Pole 'date' zawiera nieprawidłową datę");
        } else {
          // Sprawdź czy data nie jest w przyszłości (opcjonalne)
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (parsedDate > today) {
            errors.push("Data wpłaty nie może być w przyszłości");
          }
        }
      }
    }
  }

  // Sprawdź pole 'description' jeśli istnieje
  if ("description" in command) {
    const description = command.description;
    if (description !== null && typeof description !== "string") {
      errors.push("Pole 'description' musi być tekstem lub null");
    } else if (typeof description === "string") {
      // Sprawdź długość opisu
      const trimmedDescription = description.trim();
      if (trimmedDescription.length < MIN_DESCRIPTION_LENGTH) {
        errors.push("Opis wpłaty nie może być pusty (użyj null aby pominąć opis)");
      }
      if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
        errors.push(`Opis wpłaty nie może przekraczać ${MAX_DESCRIPTION_LENGTH} znaków`);
      }
    }
  }

  // Sprawdź czy przynajmniej jedno pole zostało podane do aktualizacji
  const hasAmount = "amount" in command;
  const hasDate = "date" in command;
  const hasDescription = "description" in command;

  if (!hasAmount && !hasDate && !hasDescription) {
    errors.push("Przynajmniej jedno pole musi zostać podane do aktualizacji");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanityzuje dane wejściowe dla UpdateGoalContributionCommand
 * @param data Dane do sanityzacji
 * @returns Sanityzowany UpdateGoalContributionCommand lub null jeśli dane są nieprawidłowe
 */
export function sanitizeUpdateGoalContributionCommand(data: unknown): UpdateGoalContributionCommand | null {
  const validation = validateUpdateGoalContributionCommand(data);

  if (!validation.isValid) {
    return null;
  }

  const command = data as Record<string, unknown>;
  const result: UpdateGoalContributionCommand = {};

  if ("amount" in command) {
    result.amount = command.amount as number;
  }

  if ("date" in command) {
    result.date = command.date as string;
  }

  if ("description" in command) {
    const description = command.description as string | null;
    result.description = description ? description.trim() : null;
  }

  return result;
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
 * Dozwolone pola sortowania dla wpłat na cele
 */
const ALLOWED_SORT_FIELDS = ["amount", "date", "created_at"] as const;

/**
 * Dozwolone kierunki sortowania
 */
const ALLOWED_SORT_DIRECTIONS = ["ASC", "DESC"] as const;

/**
 * Waliduje parametry query dla pobierania wpłat na cel
 * @param query Obiekt zawierający parametry query
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateGetGoalContributionsQuery(query: URLSearchParams): ValidationResult {
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
 * Sanityzuje i ustawia domyślne wartości dla parametrów query pobierania wpłat na cel
 * @param query Obiekt URLSearchParams zawierający parametry query
 * @returns Sanityzowany obiekt GetGoalContributionsQuery z wartościami domyślnymi
 */
export function sanitizeGetGoalContributionsQuery(query: URLSearchParams): GetGoalContributionsQuery {
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
 * Waliduje ID wpłaty (UUID)
 * @param contributionId ID wpłaty do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateGoalContributionId(contributionId: string): ValidationResult {
  const errors: string[] = [];

  // Sprawdź czy ID jest stringiem
  if (typeof contributionId !== "string") {
    errors.push("ID wpłaty musi być tekstem");
    return { isValid: false, errors };
  }

  // Sprawdź czy ID nie jest pusty
  const trimmedId = contributionId.trim();
  if (trimmedId.length === 0) {
    errors.push("ID wpłaty nie może być pusty");
    return { isValid: false, errors };
  }

  // Sprawdź format UUID (podstawowa walidacja)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(trimmedId)) {
    errors.push("ID wpłaty musi być prawidłowym UUID");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Waliduje ID celu oszczędnościowego (UUID)
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

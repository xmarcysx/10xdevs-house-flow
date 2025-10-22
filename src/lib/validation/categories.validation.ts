import type { CreateCategoryCommand, UpdateCategoryCommand } from "../../types";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface GetCategoriesQuery {
  page: number;
  limit: number;
  sort: string;
}

/**
 * Maksymalna długość nazwy kategorii
 */
const MAX_CATEGORY_NAME_LENGTH = 100;

/**
 * Minimalna długość nazwy kategorii
 */
const MIN_CATEGORY_NAME_LENGTH = 1;

/**
 * Waliduje dane wejściowe dla tworzenia kategorii
 * @param data Dane do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateCreateCategoryCommand(data: unknown): ValidationResult {
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
  if (trimmedName.length < MIN_CATEGORY_NAME_LENGTH) {
    errors.push("Nazwa kategorii nie może być pusta");
  }

  if (trimmedName.length > MAX_CATEGORY_NAME_LENGTH) {
    errors.push(`Nazwa kategorii nie może przekraczać ${MAX_CATEGORY_NAME_LENGTH} znaków`);
  }

  // Sprawdź czy nazwa zawiera tylko dozwolone znaki (bez specjalnych znaków kontrolnych)
  if (!/^[a-zA-Z0-9\s\-_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(trimmedName)) {
    errors.push("Nazwa kategorii może zawierać tylko litery, cyfry, spacje, myślniki i podkreślenia");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanityzuje dane wejściowe dla CreateCategoryCommand
 * @param data Dane do sanityzacji
 * @returns Sanityzowany CreateCategoryCommand lub null jeśli dane są nieprawidłowe
 */
export function sanitizeCreateCategoryCommand(data: unknown): CreateCategoryCommand | null {
  const validation = validateCreateCategoryCommand(data);

  if (!validation.isValid) {
    return null;
  }

  const command = data as Record<string, unknown>;
  const name = (command.name as string).trim();

  return {
    name,
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
 * Dozwolone pola sortowania dla kategorii
 */
const ALLOWED_SORT_FIELDS = ["name", "created_at", "is_default"] as const;

/**
 * Dozwolone kierunki sortowania
 */
const ALLOWED_SORT_DIRECTIONS = ["ASC", "DESC"] as const;

/**
 * Waliduje parametry query dla pobierania kategorii
 * @param query Obiekt zawierający parametry query
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateGetCategoriesQuery(query: URLSearchParams): ValidationResult {
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
 * Sanityzuje i ustawia domyślne wartości dla parametrów query pobierania kategorii
 * @param query Obiekt URLSearchParams zawierający parametry query
 * @returns Sanityzowany obiekt GetCategoriesQuery z wartościami domyślnymi
 */
export function sanitizeGetCategoriesQuery(query: URLSearchParams): GetCategoriesQuery {
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
 * Waliduje ID kategorii (UUID)
 * @param categoryId ID kategorii do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateCategoryId(categoryId: string): ValidationResult {
  const errors: string[] = [];

  // Sprawdź czy ID jest stringiem
  if (typeof categoryId !== "string") {
    errors.push("ID kategorii musi być tekstem");
    return { isValid: false, errors };
  }

  // Sprawdź czy ID nie jest pusty
  const trimmedId = categoryId.trim();
  if (trimmedId.length === 0) {
    errors.push("ID kategorii nie może być pusty");
    return { isValid: false, errors };
  }

  // Sprawdź format UUID (podstawowa walidacja)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(trimmedId)) {
    errors.push("ID kategorii musi być prawidłowym UUID");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Waliduje dane wejściowe dla aktualizacji kategorii
 * @param data Dane do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateUpdateCategoryCommand(data: unknown): ValidationResult {
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
  if (trimmedName.length < MIN_CATEGORY_NAME_LENGTH) {
    errors.push("Nazwa kategorii nie może być pusta");
  }

  if (trimmedName.length > MAX_CATEGORY_NAME_LENGTH) {
    errors.push(`Nazwa kategorii nie może przekraczać ${MAX_CATEGORY_NAME_LENGTH} znaków`);
  }

  // Sprawdź czy nazwa zawiera tylko dozwolone znaki (bez specjalnych znaków kontrolnych)
  if (!/^[a-zA-Z0-9\s\-_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(trimmedName)) {
    errors.push("Nazwa kategorii może zawierać tylko litery, cyfry, spacje, myślniki i podkreślenia");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanityzuje dane wejściowe dla UpdateCategoryCommand
 * @param data Dane do sanityzacji
 * @returns Sanityzowany UpdateCategoryCommand lub null jeśli dane są nieprawidłowe
 */
export function sanitizeUpdateCategoryCommand(data: unknown): UpdateCategoryCommand | null {
  const validation = validateUpdateCategoryCommand(data);

  if (!validation.isValid) {
    return null;
  }

  const command = data as Record<string, unknown>;
  const name = (command.name as string).trim();

  return {
    name,
  };
}

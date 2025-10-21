import type { CreateCategoryCommand } from "../../types";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
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

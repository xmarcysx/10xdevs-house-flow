export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Waliduje parametr month w formacie YYYY-MM
 * @param month Miesiąc do walidacji
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateMonthParameter(month: string): ValidationResult {
  const errors: string[] = [];

  // Sprawdź czy month jest stringiem
  if (typeof month !== "string") {
    errors.push("Parametr month musi być tekstem");
    return { isValid: false, errors };
  }

  // Sprawdź czy month nie jest pusty
  const trimmedMonth = month.trim();
  if (trimmedMonth.length === 0) {
    errors.push("Parametr month nie może być pusty");
    return { isValid: false, errors };
  }

  // Sprawdź format YYYY-MM używając regex
  const monthRegex = /^\d{4}-\d{2}$/;
  if (!monthRegex.test(trimmedMonth)) {
    errors.push("Parametr month musi być w formacie YYYY-MM (np. 2024-01)");
    return { isValid: false, errors };
  }

  // Sprawdź czy rok i miesiąc są prawidłowe
  const [yearStr, monthStr] = trimmedMonth.split("-");
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);

  // Sprawdź zakres roku (rozsądny zakres: 2000-2100)
  if (year < 2000 || year > 2100) {
    errors.push("Rok musi być w zakresie 2000-2100");
  }

  // Sprawdź zakres miesiąca (1-12)
  if (monthNum < 1 || monthNum > 12) {
    errors.push("Miesiąc musi być w zakresie 1-12");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanityzuje parametr month
 * @param month Miesiąc do sanityzacji
 * @returns Sanityzowany miesiąc w formacie YYYY-MM lub null jeśli nieprawidłowy
 */
export function sanitizeMonthParameter(month: string): string | null {
  const validation = validateMonthParameter(month);

  if (!validation.isValid) {
    return null;
  }

  // Zwróć miesiąc po usunięciu białych znaków
  return month.trim();
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface GetMonthlyBudgetQuery {
  month: string;
}

/**
 * Regex dla walidacji formatu miesiąca (YYYY-MM)
 */
const MONTH_FORMAT_REGEX = /^\d{4}-\d{2}$/;

/**
 * Waliduje parametry query dla pobierania miesięcznego budżetu
 * @param query Obiekt zawierający parametry query
 * @returns Rezultat walidacji z błędami jeśli występują
 */
export function validateGetMonthlyBudgetQuery(query: URLSearchParams): ValidationResult {
  const errors: string[] = [];

  // Walidacja parametru month
  const monthParam = query.get("month");
  if (!monthParam) {
    errors.push("Parametr 'month' jest wymagany");
    return { isValid: false, errors };
  }

  const month = monthParam.trim();

  // Sprawdź format YYYY-MM
  if (!MONTH_FORMAT_REGEX.test(month)) {
    errors.push("Parametr 'month' musi mieć format YYYY-MM (np. 2023-10)");
    return { isValid: false, errors };
  }

  // Sprawdź czy rok jest w rozsądnym zakresie (np. 2000-2100)
  const [yearStr, monthStr] = month.split("-");
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);

  if (year < 2000 || year > 2100) {
    errors.push("Rok w parametrze 'month' musi być w zakresie 2000-2100");
  }

  if (monthNum < 1 || monthNum > 12) {
    errors.push("Miesiąc w parametrze 'month' musi być w zakresie 01-12");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanityzuje parametry query dla pobierania miesięcznego budżetu
 * @param query Obiekt URLSearchParams zawierający parametry query
 * @returns Sanityzowany obiekt GetMonthlyBudgetQuery
 */
export function sanitizeGetMonthlyBudgetQuery(query: URLSearchParams): GetMonthlyBudgetQuery {
  const monthParam = query.get("month");
  const month = monthParam ? monthParam.trim() : "";

  return {
    month,
  };
}

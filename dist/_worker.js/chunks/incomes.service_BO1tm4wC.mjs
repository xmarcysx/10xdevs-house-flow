
            // MessageChannel polyfill for Cloudflare Workers
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = function() {
                return {
                  port1: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} },
                  port2: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} }
                };
              };
            }
          
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "date DESC";
const ALLOWED_SORT_FIELDS = ["date", "amount", "source", "created_at"];
const ALLOWED_SORT_DIRECTIONS = ["ASC", "DESC"];
function validateGetIncomesQuery(query) {
  const errors = [];
  const pageParam = query.get("page");
  if (pageParam !== null) {
    const page = parseInt(pageParam, 10);
    if (isNaN(page) || page < 1) {
      errors.push("Parametr 'page' musi być liczbą całkowitą większą lub równą 1");
    }
  }
  const limitParam = query.get("limit");
  if (limitParam !== null) {
    const limit = parseInt(limitParam, 10);
    if (isNaN(limit) || limit < MIN_LIMIT || limit > MAX_LIMIT) {
      errors.push(`Parametr 'limit' musi być liczbą całkowitą w zakresie ${MIN_LIMIT}-${MAX_LIMIT}`);
    }
  }
  const yearParam = query.get("year");
  if (yearParam !== null) {
    const year = parseInt(yearParam, 10);
    if (isNaN(year) || year < 2e3 || year > 2030) {
      errors.push("Parametr 'year' musi być liczbą całkowitą w zakresie 2000-2030");
    }
  }
  const monthParam = query.get("month");
  if (monthParam !== null) {
    const month = parseInt(monthParam, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      errors.push("Parametr 'month' musi być liczbą całkowitą w zakresie 1-12");
    }
  }
  const sortParam = query.get("sort");
  if (sortParam !== null && sortParam.trim() !== "") {
    const sortParts = sortParam.trim().split(/\s+/);
    if (sortParts.length === 1 || sortParts.length === 2) {
      const field = sortParts[0].toLowerCase();
      const direction = sortParts.length === 2 ? sortParts[1].toUpperCase() : "ASC";
      if (!ALLOWED_SORT_FIELDS.includes(field)) {
        errors.push(`Pole sortowania '${field}' nie jest dozwolone. Dozwolone pola: ${ALLOWED_SORT_FIELDS.join(", ")}`);
      }
      if (!ALLOWED_SORT_DIRECTIONS.includes(direction)) {
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
    errors
  };
}
function sanitizeGetIncomesQuery(query) {
  const pageParam = query.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : DEFAULT_PAGE;
  const sanitizedPage = !isNaN(page) && page >= 1 ? page : DEFAULT_PAGE;
  const limitParam = query.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : DEFAULT_LIMIT;
  const sanitizedLimit = !isNaN(limit) && limit >= MIN_LIMIT && limit <= MAX_LIMIT ? limit : DEFAULT_LIMIT;
  const yearParam = query.get("year");
  let sanitizedYear;
  if (yearParam) {
    const year = parseInt(yearParam, 10);
    if (!isNaN(year) && year >= 2e3 && year <= 2030) {
      sanitizedYear = year;
    }
  }
  const monthParam = query.get("month");
  let sanitizedMonth;
  if (monthParam) {
    const month = parseInt(monthParam, 10);
    if (!isNaN(month) && month >= 1 && month <= 12) {
      sanitizedMonth = month;
    }
  }
  const sortParam = query.get("sort");
  let sanitizedSort = DEFAULT_SORT;
  if (sortParam && sortParam.trim() !== "") {
    const sortParts = sortParam.trim().split(/\s+/);
    if (sortParts.length === 1 || sortParts.length === 2) {
      const field = sortParts[0].toLowerCase();
      const direction = sortParts.length === 2 ? sortParts[1].toUpperCase() : "ASC";
      if (ALLOWED_SORT_FIELDS.includes(field) && ALLOWED_SORT_DIRECTIONS.includes(direction)) {
        sanitizedSort = `${field} ${direction}`;
      }
    }
  }
  return {
    page: sanitizedPage,
    limit: sanitizedLimit,
    year: sanitizedYear,
    month: sanitizedMonth,
    sort: sanitizedSort
  };
}
const MIN_INCOME_AMOUNT = 0.01;
const MAX_INCOME_AMOUNT = 1e7;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_SOURCE_LENGTH = 100;
function validateCreateIncomeCommand(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    errors.push("Dane wejściowe muszą być obiektem");
    return { isValid: false, errors };
  }
  const command = data;
  if (!("amount" in command)) {
    errors.push("Pole 'amount' jest wymagane");
    return { isValid: false, errors };
  }
  if (!("date" in command)) {
    errors.push("Pole 'date' jest wymagane");
    return { isValid: false, errors };
  }
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
  if ("description" in command) {
    const description = command.description;
    if (description !== null && typeof description !== "string") {
      errors.push("Pole 'description' musi być tekstem lub null");
    } else if (typeof description === "string" && description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push(`Opis wpływu nie może przekraczać ${MAX_DESCRIPTION_LENGTH} znaków`);
    }
  }
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
    errors
  };
}
function sanitizeCreateIncomeCommand(data) {
  const validation = validateCreateIncomeCommand(data);
  if (!validation.isValid) {
    return null;
  }
  const command = data;
  const amount = command.amount;
  const date = command.date;
  const description = command.description;
  const source = command.source;
  return {
    amount,
    date,
    description: description?.trim() || null,
    source: source?.trim() || null
  };
}
function validateUpdateIncomeCommand(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    errors.push("Dane wejściowe muszą być obiektem");
    return { isValid: false, errors };
  }
  const command = data;
  const hasAmount = "amount" in command;
  const hasDate = "date" in command;
  const hasDescription = "description" in command;
  const hasSource = "source" in command;
  if (!hasAmount && !hasDate && !hasDescription && !hasSource) {
    errors.push("Przynajmniej jedno pole do aktualizacji musi być podane");
    return { isValid: false, errors };
  }
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
  if (hasDescription) {
    const description = command.description;
    if (description !== null && typeof description !== "string") {
      errors.push("Pole 'description' musi być tekstem lub null");
    } else if (typeof description === "string" && description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push(`Opis wpływu nie może przekraczać ${MAX_DESCRIPTION_LENGTH} znaków`);
    }
  }
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
    errors
  };
}
function sanitizeUpdateIncomeCommand(data) {
  const validation = validateUpdateIncomeCommand(data);
  if (!validation.isValid) {
    return null;
  }
  const command = data;
  const result = {};
  if ("amount" in command) {
    result.amount = command.amount;
  }
  if ("date" in command) {
    result.date = command.date;
  }
  if ("description" in command) {
    const description = command.description;
    result.description = description?.trim() || null;
  }
  if ("source" in command) {
    const source = command.source;
    result.source = source?.trim() || null;
  }
  return result;
}
function validateIncomeId(incomeId) {
  const errors = [];
  if (typeof incomeId !== "string") {
    errors.push("ID wpływu musi być tekstem");
    return { isValid: false, errors };
  }
  const trimmedId = incomeId.trim();
  if (trimmedId.length === 0) {
    errors.push("ID wpływu nie może być pusty");
    return { isValid: false, errors };
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(trimmedId)) {
    errors.push("ID wpływu musi być prawidłowym UUID");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}

class IncomesService {
  constructor(supabase) {
    this.supabase = supabase;
  }
  /**
   * Pobiera paginowaną listę wpływów dla uwierzytelnionego użytkownika
   * @param userId ID użytkownika
   * @param query Parametry zapytania zawierające page, limit, year, month i sort
   * @returns Obiekt zawierający dane wpływów i informacje o paginacji
   */
  async getIncomes(userId, query) {
    const { page, limit, year, month, sort } = query;
    const offset = (page - 1) * limit;
    const [sortField, sortDirection] = sort.split(" ");
    let incomesQuery = this.supabase.from("incomes").select("id, amount, date, description, source, created_at").eq("user_id", userId);
    if (year || month) {
      let startDate;
      let endDate;
      if (year && month) {
        startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
        endDate = new Date(year, month, 0).toISOString().split("T")[0];
      } else if (year) {
        startDate = `${year}-01-01`;
        endDate = `${year}-12-31`;
      } else {
        const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
        startDate = `${currentYear}-${month.toString().padStart(2, "0")}-01`;
        endDate = new Date(currentYear, month, 0).toISOString().split("T")[0];
      }
      incomesQuery = incomesQuery.gte("date", startDate).lte("date", endDate);
    }
    const { data: incomes, error: dataError } = await incomesQuery.order(sortField, { ascending: sortDirection === "ASC" }).range(offset, offset + limit - 1);
    if (dataError) {
      throw new Error(`Błąd podczas pobierania wpływów: ${dataError.message}`);
    }
    let countQuery = this.supabase.from("incomes").select("*", { count: "exact", head: true }).eq("user_id", userId);
    if (year || month) {
      let startDate;
      let endDate;
      if (year && month) {
        startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
        endDate = new Date(year, month, 0).toISOString().split("T")[0];
      } else if (year) {
        startDate = `${year}-01-01`;
        endDate = `${year}-12-31`;
      } else {
        const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
        startDate = `${currentYear}-${month.toString().padStart(2, "0")}-01`;
        endDate = new Date(currentYear, month, 0).toISOString().split("T")[0];
      }
      countQuery = countQuery.gte("date", startDate).lte("date", endDate);
    }
    const { count, error: countError } = await countQuery;
    if (countError) {
      throw new Error(`Błąd podczas liczenia wpływów: ${countError.message}`);
    }
    const total = count || 0;
    const pagination = {
      page,
      limit,
      total
    };
    return {
      data: incomes || [],
      pagination
    };
  }
  /**
   * Sprawdza czy wpływ należy do użytkownika
   * @param incomeId ID wpływu
   * @param userId ID użytkownika
   * @returns true jeśli wpływ należy do użytkownika
   */
  async belongsToUser(incomeId, userId) {
    const { data, error } = await this.supabase.from("incomes").select("id").eq("id", incomeId).eq("user_id", userId).maybeSingle();
    if (error) {
      throw new Error(`Błąd podczas sprawdzania własności wpływu: ${error.message}`);
    }
    return !!data;
  }
  /**
   * Tworzy nowy wpływ dla uwierzytelnionego użytkownika
   * @param command Dane wpływu do utworzenia
   * @param userId ID użytkownika
   * @returns Utworzony wpływ
   */
  async create(command, userId) {
    const { data: newIncome, error: insertError } = await this.supabase.from("incomes").insert({
      amount: command.amount,
      date: command.date,
      description: command.description,
      source: command.source,
      user_id: userId
    }).select("id, amount, date, description, source, created_at").single();
    if (insertError) {
      throw new Error(`Błąd podczas tworzenia wpływu: ${insertError.message}`);
    }
    if (!newIncome) {
      throw new Error("Nie udało się utworzyć wpływu");
    }
    return newIncome;
  }
  /**
   * Aktualizuje istniejący wpływ dla uwierzytelnionego użytkownika
   * @param incomeId ID wpływu do aktualizacji
   * @param command Dane wpływu do aktualizacji
   * @param userId ID użytkownika
   * @returns Zaktualizowany wpływ
   * @throws Error gdy wpływ nie istnieje lub nie należy do użytkownika
   */
  async update(incomeId, command, userId) {
    const belongsToUser = await this.belongsToUser(incomeId, userId);
    if (!belongsToUser) {
      throw new Error("Wpływ nie istnieje lub nie należy do użytkownika");
    }
    const updateData = {
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (command.amount !== void 0) {
      updateData.amount = command.amount;
    }
    if (command.date !== void 0) {
      updateData.date = command.date;
    }
    if (command.description !== void 0) {
      updateData.description = command.description;
    }
    if (command.source !== void 0) {
      updateData.source = command.source;
    }
    const { data: updatedIncome, error: updateError } = await this.supabase.from("incomes").update(updateData).eq("id", incomeId).eq("user_id", userId).select("id, amount, date, description, source, created_at").single();
    if (updateError) {
      throw new Error(`Błąd podczas aktualizacji wpływu: ${updateError.message}`);
    }
    if (!updatedIncome) {
      throw new Error("Nie udało się zaktualizować wpływu");
    }
    return updatedIncome;
  }
  /**
   * Usuwa istniejący wpływ dla uwierzytelnionego użytkownika
   * @param incomeId ID wpływu do usunięcia
   * @param userId ID użytkownika
   * @throws Error gdy wpływ nie istnieje lub nie należy do użytkownika
   */
  async delete(incomeId, userId) {
    const belongsToUser = await this.belongsToUser(incomeId, userId);
    if (!belongsToUser) {
      throw new Error("Wpływ nie istnieje lub nie należy do użytkownika");
    }
    const { error: deleteError } = await this.supabase.from("incomes").delete().eq("id", incomeId).eq("user_id", userId);
    if (deleteError) {
      throw new Error(`Błąd podczas usuwania wpływu: ${deleteError.message}`);
    }
  }
}

export { IncomesService as I, validateUpdateIncomeCommand as a, validateGetIncomesQuery as b, sanitizeGetIncomesQuery as c, validateCreateIncomeCommand as d, sanitizeCreateIncomeCommand as e, sanitizeUpdateIncomeCommand as s, validateIncomeId as v };

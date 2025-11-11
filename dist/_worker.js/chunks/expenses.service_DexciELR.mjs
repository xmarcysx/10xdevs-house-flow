
            // MessageChannel polyfill for Cloudflare Workers
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = function() {
                return {
                  port1: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} },
                  port2: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} }
                };
              };
            }
          
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "date DESC";
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;
const ALLOWED_SORT_FIELDS = ["date", "amount", "created_at"];
const ALLOWED_SORT_DIRECTIONS = ["ASC", "DESC"];
function validateGetExpensesQuery(query) {
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
  if (yearParam !== null && yearParam.trim() !== "") {
    const year = parseInt(yearParam, 10);
    if (isNaN(year) || year < 2025 || year > 2030) {
      errors.push("Parametr 'year' musi być liczbą całkowitą w zakresie 2025-2030");
    }
  }
  const monthParam = query.get("month");
  if (monthParam !== null && monthParam.trim() !== "") {
    const month = parseInt(monthParam, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      errors.push("Parametr 'month' musi być liczbą całkowitą w zakresie 1-12");
    }
  }
  const categoryIdParam = query.get("category_id");
  if (categoryIdParam !== null && categoryIdParam.trim() !== "") {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(categoryIdParam)) {
      errors.push("Parametr 'category_id' musi być prawidłowym UUID");
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
function sanitizeGetExpensesQuery(query) {
  const pageParam = query.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : DEFAULT_PAGE;
  const sanitizedPage = !isNaN(page) && page >= 1 ? page : DEFAULT_PAGE;
  const limitParam = query.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : DEFAULT_LIMIT;
  const sanitizedLimit = !isNaN(limit) && limit >= MIN_LIMIT && limit <= MAX_LIMIT ? limit : DEFAULT_LIMIT;
  const yearParam = query.get("year");
  let sanitizedYear;
  if (yearParam && yearParam.trim() !== "") {
    const year = parseInt(yearParam, 10);
    if (!isNaN(year) && year >= 2025 && year <= 2030) {
      sanitizedYear = year;
    }
  }
  const monthParam = query.get("month");
  let sanitizedMonth;
  if (monthParam && monthParam.trim() !== "") {
    const month = parseInt(monthParam, 10);
    if (!isNaN(month) && month >= 1 && month <= 12) {
      sanitizedMonth = month;
    }
  }
  const categoryIdParam = query.get("category_id");
  let sanitizedCategoryId;
  if (categoryIdParam && categoryIdParam.trim() !== "") {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(categoryIdParam)) {
      sanitizedCategoryId = categoryIdParam;
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
    category_id: sanitizedCategoryId,
    sort: sanitizedSort
  };
}
const MAX_DESCRIPTION_LENGTH = 1e3;
const MIN_AMOUNT = 0.01;
function validateCreateExpenseCommand(data) {
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
  const amount = command.amount;
  if (typeof amount !== "number" || isNaN(amount)) {
    errors.push("Pole 'amount' musi być prawidłową liczbą");
  } else {
    if (amount <= MIN_AMOUNT) {
      errors.push(`Kwota wydatku musi być większa niż ${MIN_AMOUNT}`);
    }
  }
  if (!("date" in command)) {
    errors.push("Pole 'date' jest wymagane");
    return { isValid: false, errors };
  }
  const date = command.date;
  if (typeof date !== "string") {
    errors.push("Pole 'date' musi być tekstem w formacie ISO");
    return { isValid: false, errors };
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    errors.push("Pole 'date' musi być prawidłową datą w formacie ISO");
  } else {
    const now = /* @__PURE__ */ new Date();
    if (dateObj > now) {
      errors.push("Data wydatku nie może być w przyszłości");
    }
  }
  if (!("category_id" in command)) {
    errors.push("Pole 'category_id' jest wymagane");
    return { isValid: false, errors };
  }
  const categoryId = command.category_id;
  if (typeof categoryId !== "string") {
    errors.push("Pole 'category_id' musi być tekstem");
    return { isValid: false, errors };
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(categoryId.trim())) {
    errors.push("Pole 'category_id' musi być prawidłowym UUID");
  }
  if ("description" in command) {
    const description = command.description;
    if (description !== null && description !== void 0) {
      if (typeof description !== "string") {
        errors.push("Pole 'description' musi być tekstem");
      } else {
        const trimmedDescription = description.trim();
        if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
          errors.push(`Opis wydatku nie może przekraczać ${MAX_DESCRIPTION_LENGTH} znaków`);
        }
      }
    }
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function sanitizeCreateExpenseCommand(data) {
  const validation = validateCreateExpenseCommand(data);
  if (!validation.isValid) {
    return null;
  }
  const command = data;
  const amount = command.amount;
  const date = command.date.trim();
  const categoryId = command.category_id.trim();
  let description;
  if ("description" in command) {
    const desc = command.description;
    if (typeof desc === "string") {
      const trimmedDesc = desc.trim();
      description = trimmedDesc.length > 0 ? trimmedDesc : void 0;
    }
  }
  return {
    amount,
    date,
    category_id: categoryId,
    description
  };
}
function validateExpenseId(expenseId) {
  const errors = [];
  if (typeof expenseId !== "string") {
    errors.push("ID wydatku musi być tekstem");
    return { isValid: false, errors };
  }
  const trimmedId = expenseId.trim();
  if (trimmedId.length === 0) {
    errors.push("ID wydatku nie może być pusty");
    return { isValid: false, errors };
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(trimmedId)) {
    errors.push("ID wydatku musi być prawidłowym UUID");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function validateUpdateExpenseCommand(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    errors.push("Dane wejściowe muszą być obiektem");
    return { isValid: false, errors };
  }
  const command = data;
  const hasAnyField = "amount" in command || "date" in command || "description" in command || "category_id" in command;
  if (!hasAnyField) {
    errors.push("Przynajmniej jedno pole do aktualizacji musi być podane");
    return { isValid: false, errors };
  }
  if ("amount" in command) {
    const amount = command.amount;
    if (amount !== null && amount !== void 0) {
      if (typeof amount !== "number" || isNaN(amount)) {
        errors.push("Pole 'amount' musi być prawidłową liczbą");
      } else {
        if (amount <= MIN_AMOUNT) {
          errors.push(`Kwota wydatku musi być większa niż ${MIN_AMOUNT}`);
        }
      }
    }
  }
  if ("date" in command) {
    const date = command.date;
    if (date !== null && date !== void 0) {
      if (typeof date !== "string") {
        errors.push("Pole 'date' musi być tekstem w formacie ISO");
      } else {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          errors.push("Pole 'date' musi być prawidłową datą w formacie ISO");
        } else {
          const now = /* @__PURE__ */ new Date();
          if (dateObj > now) {
            errors.push("Data wydatku nie może być w przyszłości");
          }
        }
      }
    }
  }
  if ("category_id" in command) {
    const categoryId = command.category_id;
    if (categoryId !== null && categoryId !== void 0) {
      if (typeof categoryId !== "string") {
        errors.push("Pole 'category_id' musi być tekstem");
      } else {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(categoryId.trim())) {
          errors.push("Pole 'category_id' musi być prawidłowym UUID");
        }
      }
    }
  }
  if ("description" in command) {
    const description = command.description;
    if (description !== null && description !== void 0) {
      if (typeof description !== "string") {
        errors.push("Pole 'description' musi być tekstem");
      } else {
        const trimmedDescription = description.trim();
        if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
          errors.push(`Opis wydatku nie może przekraczać ${MAX_DESCRIPTION_LENGTH} znaków`);
        }
      }
    }
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function sanitizeUpdateExpenseCommand(data) {
  const validation = validateUpdateExpenseCommand(data);
  if (!validation.isValid) {
    return null;
  }
  const command = data;
  const sanitizedCommand = {};
  if ("amount" in command && command.amount !== null && command.amount !== void 0) {
    sanitizedCommand.amount = command.amount;
  }
  if ("date" in command && command.date !== null && command.date !== void 0) {
    sanitizedCommand.date = command.date.trim();
  }
  if ("category_id" in command && command.category_id !== null && command.category_id !== void 0) {
    sanitizedCommand.category_id = command.category_id.trim();
  }
  if ("description" in command && command.description !== null && command.description !== void 0) {
    const desc = command.description;
    const trimmedDesc = desc.trim();
    sanitizedCommand.description = trimmedDesc.length > 0 ? trimmedDesc : void 0;
  }
  return sanitizedCommand;
}

class ExpensesService {
  constructor(supabase) {
    this.supabase = supabase;
  }
  /**
   * Pobiera paginowaną listę wydatków dla uwierzytelnionego użytkownika
   * @param userId ID użytkownika
   * @param query Parametry zapytania zawierające page, limit, year, month, category_id i sort
   * @returns Obiekt zawierający dane wydatków i informacje o paginacji
   */
  async getExpenses(userId, query) {
    const { page, limit, year, month, category_id, sort } = query;
    const offset = (page - 1) * limit;
    const [sortField, sortDirection] = sort.split(" ");
    let expensesQuery = this.supabase.from("expenses").select(
      `
        id,
        amount,
        date,
        description,
        category_id,
        created_at,
        categories (
          name
        )
      `
    ).eq("user_id", userId);
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
      expensesQuery = expensesQuery.gte("date", startDate).lte("date", endDate);
    }
    if (category_id) {
      expensesQuery = expensesQuery.eq("category_id", category_id);
    }
    expensesQuery = expensesQuery.order(sortField, { ascending: sortDirection === "ASC" }).range(offset, offset + limit - 1);
    const { data: expensesData, error: dataError } = await expensesQuery;
    if (dataError) {
      throw new Error(`Błąd podczas pobierania wydatków: ${dataError.message}`);
    }
    const expenses = (expensesData || []).map((expense) => ({
      id: expense.id,
      amount: expense.amount,
      date: expense.date,
      description: expense.description,
      category_id: expense.category_id,
      created_at: expense.created_at,
      category_name: expense.categories?.name || ""
    }));
    let countQuery = this.supabase.from("expenses").select("*", { count: "exact", head: true }).eq("user_id", userId);
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
    if (category_id) {
      countQuery = countQuery.eq("category_id", category_id);
    }
    const { count, error: countError } = await countQuery;
    if (countError) {
      throw new Error(`Błąd podczas liczenia wydatków: ${countError.message}`);
    }
    const total = count || 0;
    const pagination = {
      page,
      limit,
      total
    };
    return {
      data: expenses,
      pagination
    };
  }
  /**
   * Tworzy nowy wydatek dla uwierzytelnionego użytkownika
   * @param command Dane wydatku do utworzenia
   * @param userId ID użytkownika
   * @returns Utworzony wydatek z nazwą kategorii
   * @throws Error gdy kategoria nie istnieje lub nie należy do użytkownika
   */
  async create(command, userId) {
    const { data: category, error: categoryCheckError } = await this.supabase.from("categories").select("id, name").eq("id", command.category_id).eq("user_id", userId).maybeSingle();
    if (categoryCheckError) {
      throw new Error(`Błąd podczas sprawdzania kategorii: ${categoryCheckError.message}`);
    }
    if (!category) {
      throw new Error("Kategoria nie istnieje lub nie należy do użytkownika");
    }
    const { data: newExpense, error: insertError } = await this.supabase.from("expenses").insert({
      amount: command.amount,
      date: command.date,
      description: command.description,
      category_id: command.category_id,
      user_id: userId
    }).select("id, amount, date, description, category_id, created_at").single();
    if (insertError) {
      throw new Error(`Błąd podczas tworzenia wydatku: ${insertError.message}`);
    }
    if (!newExpense) {
      throw new Error("Nie udało się utworzyć wydatku");
    }
    return {
      ...newExpense,
      category_name: category.name
    };
  }
  /**
   * Sprawdza czy wydatek należy do użytkownika
   * @param expenseId ID wydatku
   * @param userId ID użytkownika
   * @returns true jeśli wydatek należy do użytkownika
   */
  async belongsToUser(expenseId, userId) {
    const { data, error } = await this.supabase.from("expenses").select("id").eq("id", expenseId).eq("user_id", userId).maybeSingle();
    if (error) {
      throw new Error(`Błąd podczas sprawdzania własności wydatku: ${error.message}`);
    }
    return !!data;
  }
  /**
   * Aktualizuje istniejący wydatek dla uwierzytelnionego użytkownika
   * @param expenseId ID wydatku do aktualizacji
   * @param command Dane wydatku do aktualizacji
   * @param userId ID użytkownika
   * @returns Zaktualizowany wydatek z nazwą kategorii
   * @throws Error gdy wydatek nie istnieje, nie należy do użytkownika lub nowa kategoria nie istnieje
   */
  async update(expenseId, command, userId) {
    const belongsToUser = await this.belongsToUser(expenseId, userId);
    if (!belongsToUser) {
      throw new Error("Wydatek nie istnieje lub nie należy do użytkownika");
    }
    if (command.category_id) {
      const { data: category2, error: categoryCheckError } = await this.supabase.from("categories").select("id, name").eq("id", command.category_id).eq("user_id", userId).maybeSingle();
      if (categoryCheckError) {
        throw new Error(`Błąd podczas sprawdzania kategorii: ${categoryCheckError.message}`);
      }
      if (!category2) {
        throw new Error("Kategoria nie istnieje lub nie należy do użytkownika");
      }
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
    if (command.category_id !== void 0) {
      updateData.category_id = command.category_id;
    }
    const { data: updatedExpense, error: updateError } = await this.supabase.from("expenses").update(updateData).eq("id", expenseId).eq("user_id", userId).select("id, amount, date, description, category_id, created_at").single();
    if (updateError) {
      throw new Error(`Błąd podczas aktualizacji wydatku: ${updateError.message}`);
    }
    if (!updatedExpense) {
      throw new Error("Nie udało się zaktualizować wydatku");
    }
    const { data: category, error: categoryError } = await this.supabase.from("categories").select("name").eq("id", updatedExpense.category_id).single();
    if (categoryError) {
      throw new Error(`Błąd podczas pobierania nazwy kategorii: ${categoryError.message}`);
    }
    return {
      ...updatedExpense,
      category_name: category.name
    };
  }
  /**
   * Usuwa istniejący wydatek dla uwierzytelnionego użytkownika
   * @param expenseId ID wydatku do usunięcia
   * @param userId ID użytkownika
   * @throws Error gdy wydatek nie istnieje lub nie należy do użytkownika
   */
  async delete(expenseId, userId) {
    const belongsToUser = await this.belongsToUser(expenseId, userId);
    if (!belongsToUser) {
      throw new Error("Wydatek nie istnieje lub nie należy do użytkownika");
    }
    const { error: deleteError } = await this.supabase.from("expenses").delete().eq("id", expenseId).eq("user_id", userId);
    if (deleteError) {
      throw new Error(`Błąd podczas usuwania wydatku: ${deleteError.message}`);
    }
  }
}

export { ExpensesService as E, validateUpdateExpenseCommand as a, validateGetExpensesQuery as b, sanitizeGetExpensesQuery as c, validateCreateExpenseCommand as d, sanitizeCreateExpenseCommand as e, sanitizeUpdateExpenseCommand as s, validateExpenseId as v };

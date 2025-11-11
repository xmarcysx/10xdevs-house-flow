globalThis.process ??= {}; globalThis.process.env ??= {};
const MAX_CATEGORY_NAME_LENGTH = 100;
const MIN_CATEGORY_NAME_LENGTH = 1;
function validateCreateCategoryCommand(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    errors.push("Dane wejściowe muszą być obiektem");
    return { isValid: false, errors };
  }
  const command = data;
  if (!("name" in command)) {
    errors.push("Pole 'name' jest wymagane");
    return { isValid: false, errors };
  }
  const name = command.name;
  if (typeof name !== "string") {
    errors.push("Pole 'name' musi być tekstem");
    return { isValid: false, errors };
  }
  const trimmedName = name.trim();
  if (trimmedName.length < MIN_CATEGORY_NAME_LENGTH) {
    errors.push("Nazwa kategorii nie może być pusta");
  }
  if (trimmedName.length > MAX_CATEGORY_NAME_LENGTH) {
    errors.push(`Nazwa kategorii nie może przekraczać ${MAX_CATEGORY_NAME_LENGTH} znaków`);
  }
  if (!/^[a-zA-Z0-9\s\-_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(trimmedName)) {
    errors.push("Nazwa kategorii może zawierać tylko litery, cyfry, spacje, myślniki i podkreślenia");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function sanitizeCreateCategoryCommand(data) {
  const validation = validateCreateCategoryCommand(data);
  if (!validation.isValid) {
    return null;
  }
  const command = data;
  const name = command.name.trim();
  return {
    name
  };
}
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "created_at DESC";
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;
const ALLOWED_SORT_FIELDS = ["name", "created_at", "is_default"];
const ALLOWED_SORT_DIRECTIONS = ["ASC", "DESC"];
function validateGetCategoriesQuery(query) {
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
function sanitizeGetCategoriesQuery(query) {
  const pageParam = query.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : DEFAULT_PAGE;
  const sanitizedPage = !isNaN(page) && page >= 1 ? page : DEFAULT_PAGE;
  const limitParam = query.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : DEFAULT_LIMIT;
  const sanitizedLimit = !isNaN(limit) && limit >= MIN_LIMIT && limit <= MAX_LIMIT ? limit : DEFAULT_LIMIT;
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
    sort: sanitizedSort
  };
}
function validateCategoryId(categoryId) {
  const errors = [];
  if (typeof categoryId !== "string") {
    errors.push("ID kategorii musi być tekstem");
    return { isValid: false, errors };
  }
  const trimmedId = categoryId.trim();
  if (trimmedId.length === 0) {
    errors.push("ID kategorii nie może być pusty");
    return { isValid: false, errors };
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(trimmedId)) {
    errors.push("ID kategorii musi być prawidłowym UUID");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function validateUpdateCategoryCommand(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    errors.push("Dane wejściowe muszą być obiektem");
    return { isValid: false, errors };
  }
  const command = data;
  if (!("name" in command)) {
    errors.push("Pole 'name' jest wymagane");
    return { isValid: false, errors };
  }
  const name = command.name;
  if (typeof name !== "string") {
    errors.push("Pole 'name' musi być tekstem");
    return { isValid: false, errors };
  }
  const trimmedName = name.trim();
  if (trimmedName.length < MIN_CATEGORY_NAME_LENGTH) {
    errors.push("Nazwa kategorii nie może być pusta");
  }
  if (trimmedName.length > MAX_CATEGORY_NAME_LENGTH) {
    errors.push(`Nazwa kategorii nie może przekraczać ${MAX_CATEGORY_NAME_LENGTH} znaków`);
  }
  if (!/^[a-zA-Z0-9\s\-_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(trimmedName)) {
    errors.push("Nazwa kategorii może zawierać tylko litery, cyfry, spacje, myślniki i podkreślenia");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function sanitizeUpdateCategoryCommand(data) {
  const validation = validateUpdateCategoryCommand(data);
  if (!validation.isValid) {
    return null;
  }
  const command = data;
  const name = command.name.trim();
  return {
    name
  };
}

class CategoriesService {
  constructor(supabase) {
    this.supabase = supabase;
  }
  /**
   * Tworzy nową kategorię dla uwierzytelnionego użytkownika
   * @param command Dane kategorii do utworzenia
   * @param userId ID użytkownika
   * @returns Utworzona kategoria
   * @throws Error gdy nazwa kategorii już istnieje dla użytkownika
   */
  async create(command, userId) {
    const { data: existingCategory, error: checkError } = await this.supabase.from("categories").select("id").eq("user_id", userId).eq("name", command.name).maybeSingle();
    if (checkError) {
      throw new Error(`Błąd podczas sprawdzania unikalności kategorii: ${checkError.message}`);
    }
    if (existingCategory) {
      throw new Error("Kategoria o podanej nazwie już istnieje");
    }
    const { data: newCategory, error: insertError } = await this.supabase.from("categories").insert({
      name: command.name,
      user_id: userId,
      is_default: false
      // Nowe kategorie są zawsze niestandardowe
    }).select("id, name, is_default, created_at").single();
    if (insertError) {
      throw new Error(`Błąd podczas tworzenia kategorii: ${insertError.message}`);
    }
    if (!newCategory) {
      throw new Error("Nie udało się utworzyć kategorii");
    }
    return newCategory;
  }
  /**
   * Sprawdza czy kategoria należy do użytkownika
   * @param categoryId ID kategorii
   * @param userId ID użytkownika
   * @returns true jeśli kategoria należy do użytkownika
   */
  async belongsToUser(categoryId, userId) {
    const { data, error } = await this.supabase.from("categories").select("id").eq("id", categoryId).eq("user_id", userId).maybeSingle();
    if (error) {
      throw new Error(`Błąd podczas sprawdzania własności kategorii: ${error.message}`);
    }
    return !!data;
  }
  /**
   * Pobiera paginowaną listę kategorii dla uwierzytelnionego użytkownika
   * @param userId ID użytkownika
   * @param query Parametry zapytania zawierające page, limit i sort
   * @returns Obiekt zawierający dane kategorii i informacje o paginacji
   */
  async getCategories(userId, query) {
    const { page, limit, sort } = query;
    const offset = (page - 1) * limit;
    const [sortField, sortDirection] = sort.split(" ");
    const { data: categories, error: dataError } = await this.supabase.from("categories").select("id, name, is_default, created_at").eq("user_id", userId).order(sortField, { ascending: sortDirection === "ASC" }).range(offset, offset + limit - 1);
    if (dataError) {
      throw new Error(`Błąd podczas pobierania kategorii: ${dataError.message}`);
    }
    const { count, error: countError } = await this.supabase.from("categories").select("*", { count: "exact", head: true }).eq("user_id", userId);
    if (countError) {
      throw new Error(`Błąd podczas liczenia kategorii: ${countError.message}`);
    }
    const total = count || 0;
    const pagination = {
      page,
      limit,
      total
    };
    return {
      data: categories || [],
      pagination
    };
  }
  /**
   * Aktualizuje istniejącą kategorię dla uwierzytelnionego użytkownika
   * @param categoryId ID kategorii do aktualizacji
   * @param command Dane kategorii do aktualizacji
   * @param userId ID użytkownika
   * @returns Zaktualizowana kategoria
   * @throws Error gdy kategoria nie istnieje, nie należy do użytkownika lub nazwa już istnieje
   */
  async update(categoryId, command, userId) {
    const belongsToUser = await this.belongsToUser(categoryId, userId);
    if (!belongsToUser) {
      throw new Error("Kategoria nie istnieje lub nie należy do użytkownika");
    }
    const { data: existingCategory, error: checkError } = await this.supabase.from("categories").select("id").eq("user_id", userId).eq("name", command.name).neq("id", categoryId).maybeSingle();
    if (checkError) {
      throw new Error(`Błąd podczas sprawdzania unikalności kategorii: ${checkError.message}`);
    }
    if (existingCategory) {
      throw new Error("Kategoria o podanej nazwie już istnieje");
    }
    const { data: updatedCategory, error: updateError } = await this.supabase.from("categories").update({
      name: command.name,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", categoryId).eq("user_id", userId).select("id, name, is_default, updated_at").single();
    if (updateError) {
      throw new Error(`Błąd podczas aktualizacji kategorii: ${updateError.message}`);
    }
    if (!updatedCategory) {
      throw new Error("Nie udało się zaktualizować kategorii");
    }
    return updatedCategory;
  }
  /**
   * Usuwa istniejącą kategorię dla uwierzytelnionego użytkownika
   * @param categoryId ID kategorii do usunięcia
   * @param userId ID użytkownika
   * @throws Error gdy kategoria nie istnieje, nie należy do użytkownika lub jest domyślna
   */
  async delete(categoryId, userId) {
    const belongsToUser = await this.belongsToUser(categoryId, userId);
    if (!belongsToUser) {
      throw new Error("Kategoria nie istnieje lub nie należy do użytkownika");
    }
    const { data: category, error: checkError } = await this.supabase.from("categories").select("is_default").eq("id", categoryId).eq("user_id", userId).single();
    if (checkError) {
      throw new Error(`Błąd podczas sprawdzania typu kategorii: ${checkError.message}`);
    }
    if (category?.is_default) {
      throw new Error("Nie można usunąć domyślnej kategorii");
    }
    const { error: deleteError } = await this.supabase.from("categories").delete().eq("id", categoryId).eq("user_id", userId);
    if (deleteError) {
      throw new Error(`Błąd podczas usuwania kategorii: ${deleteError.message}`);
    }
  }
}

export { CategoriesService as C, validateUpdateCategoryCommand as a, validateGetCategoriesQuery as b, sanitizeGetCategoriesQuery as c, validateCreateCategoryCommand as d, sanitizeCreateCategoryCommand as e, sanitizeUpdateCategoryCommand as s, validateCategoryId as v };

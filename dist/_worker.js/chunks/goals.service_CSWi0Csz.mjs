
            // MessageChannel polyfill for Cloudflare Workers
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = function() {
                return {
                  port1: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} },
                  port2: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} }
                };
              };
            }
          
const MAX_GOAL_NAME_LENGTH = 200;
const MIN_GOAL_NAME_LENGTH = 1;
const MIN_TARGET_AMOUNT = 0.01;
const MAX_TARGET_AMOUNT = 1e7;
function validateCreateGoalCommand(data) {
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
  if (trimmedName.length < MIN_GOAL_NAME_LENGTH) {
    errors.push("Nazwa celu nie może być pusta");
  }
  if (trimmedName.length > MAX_GOAL_NAME_LENGTH) {
    errors.push(`Nazwa celu nie może przekraczać ${MAX_GOAL_NAME_LENGTH} znaków`);
  }
  if (!/^[a-zA-Z0-9\s\-_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ.,!?]+$/.test(trimmedName)) {
    errors.push(
      "Nazwa celu może zawierać tylko litery, cyfry, spacje, myślniki, podkreślenia oraz znaki interpunkcyjne"
    );
  }
  if (!("target_amount" in command)) {
    errors.push("Pole 'target_amount' jest wymagane");
    return { isValid: false, errors };
  }
  const targetAmount = command.target_amount;
  if (typeof targetAmount !== "number") {
    errors.push("Pole 'target_amount' musi być liczbą");
  } else {
    if (targetAmount < MIN_TARGET_AMOUNT) {
      errors.push("Kwota docelowa musi być większa od zera");
    }
    if (targetAmount > MAX_TARGET_AMOUNT) {
      errors.push(`Kwota docelowa nie może przekraczać ${MAX_TARGET_AMOUNT}`);
    }
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function sanitizeCreateGoalCommand(data) {
  const validation = validateCreateGoalCommand(data);
  if (!validation.isValid) {
    return null;
  }
  const command = data;
  const name = command.name.trim();
  const targetAmount = command.target_amount;
  return {
    name,
    target_amount: targetAmount
  };
}
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "created_at DESC";
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;
const ALLOWED_SORT_FIELDS = ["name", "created_at", "target_amount", "current_amount"];
const ALLOWED_SORT_DIRECTIONS = ["ASC", "DESC"];
function validateGetGoalsQuery(query) {
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
function sanitizeGetGoalsQuery(query) {
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
function validateGoalId(goalId) {
  const errors = [];
  if (typeof goalId !== "string") {
    errors.push("ID celu musi być tekstem");
    return { isValid: false, errors };
  }
  const trimmedId = goalId.trim();
  if (trimmedId.length === 0) {
    errors.push("ID celu nie może być pusty");
    return { isValid: false, errors };
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(trimmedId)) {
    errors.push("ID celu musi być prawidłowym UUID");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function validateUpdateGoalCommand(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    errors.push("Dane wejściowe muszą być obiektem");
    return { isValid: false, errors };
  }
  const command = data;
  if (!("name" in command) && !("target_amount" in command)) {
    errors.push("Przynajmniej jedno pole ('name' lub 'target_amount') musi być podane");
    return { isValid: false, errors };
  }
  if ("name" in command) {
    const name = command.name;
    if (typeof name !== "string") {
      errors.push("Pole 'name' musi być tekstem");
    } else {
      const trimmedName = name.trim();
      if (trimmedName.length < MIN_GOAL_NAME_LENGTH) {
        errors.push("Nazwa celu nie może być pusta");
      }
      if (trimmedName.length > MAX_GOAL_NAME_LENGTH) {
        errors.push(`Nazwa celu nie może przekraczać ${MAX_GOAL_NAME_LENGTH} znaków`);
      }
      if (!/^[a-zA-Z0-9\s\-_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ.,!?]+$/.test(trimmedName)) {
        errors.push(
          "Nazwa celu może zawierać tylko litery, cyfry, spacje, myślniki, podkreślenia oraz znaki interpunkcyjne"
        );
      }
    }
  }
  if ("target_amount" in command) {
    const targetAmount = command.target_amount;
    if (typeof targetAmount !== "number") {
      errors.push("Pole 'target_amount' musi być liczbą");
    } else {
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
    errors
  };
}
function sanitizeUpdateGoalCommand(data) {
  const validation = validateUpdateGoalCommand(data);
  if (!validation.isValid) {
    return null;
  }
  const command = data;
  const result = {};
  if ("name" in command) {
    result.name = command.name.trim();
  }
  if ("target_amount" in command) {
    result.target_amount = command.target_amount;
  }
  return result;
}

class GoalsService {
  constructor(supabase) {
    this.supabase = supabase;
  }
  /**
   * Tworzy nowy cel oszczędnościowy dla uwierzytelnionego użytkownika
   * @param command Dane celu do utworzenia
   * @param userId ID użytkownika
   * @returns Utworzony cel
   * @throws Error gdy nazwa celu już istnieje dla użytkownika lub target_amount <= 0
   */
  async create(command, userId) {
    if (command.target_amount <= 0) {
      throw new Error("Kwota docelowa musi być większa od zera");
    }
    const { data: existingGoal, error: checkError } = await this.supabase.from("goals").select("id").eq("user_id", userId).eq("name", command.name).maybeSingle();
    if (checkError) {
      throw new Error(`Błąd podczas sprawdzania unikalności celu: ${checkError.message}`);
    }
    if (existingGoal) {
      throw new Error("Cel o podanej nazwie już istnieje");
    }
    const { data: newGoal, error: insertError } = await this.supabase.from("goals").insert({
      name: command.name,
      target_amount: command.target_amount,
      current_amount: 0,
      // Nowe cele zaczynają od 0
      user_id: userId
    }).select("id, name, target_amount, current_amount, created_at").single();
    if (insertError) {
      throw new Error(`Błąd podczas tworzenia celu: ${insertError.message}`);
    }
    if (!newGoal) {
      throw new Error("Nie udało się utworzyć celu");
    }
    return newGoal;
  }
  /**
   * Sprawdza czy cel należy do użytkownika
   * @param goalId ID celu
   * @param userId ID użytkownika
   * @returns true jeśli cel należy do użytkownika
   */
  async belongsToUser(goalId, userId) {
    const { data, error } = await this.supabase.from("goals").select("id").eq("id", goalId).eq("user_id", userId).maybeSingle();
    if (error) {
      throw new Error(`Błąd podczas sprawdzania własności celu: ${error.message}`);
    }
    return !!data;
  }
  /**
   * Pobiera paginowaną listę celów oszczędnościowych dla uwierzytelnionego użytkownika
   * @param userId ID użytkownika
   * @param query Parametry zapytania zawierające page, limit i sort
   * @returns Obiekt zawierający dane celów i informacje o paginacji
   */
  async getGoals(userId, query) {
    const { page, limit, sort } = query;
    const offset = (page - 1) * limit;
    const [sortField, sortDirection] = sort.split(" ");
    const { data: goals, error: dataError } = await this.supabase.from("goals").select("id, name, target_amount, current_amount, created_at").eq("user_id", userId).order(sortField, { ascending: sortDirection === "ASC" }).range(offset, offset + limit - 1);
    if (dataError) {
      throw new Error(`Błąd podczas pobierania celów: ${dataError.message}`);
    }
    const { count, error: countError } = await this.supabase.from("goals").select("*", { count: "exact", head: true }).eq("user_id", userId);
    if (countError) {
      throw new Error(`Błąd podczas liczenia celów: ${countError.message}`);
    }
    const total = count || 0;
    const pagination = {
      page,
      limit,
      total
    };
    return {
      data: goals || [],
      pagination
    };
  }
  /**
   * Aktualizuje istniejący cel oszczędnościowy dla uwierzytelnionego użytkownika
   * @param goalId ID celu do aktualizacji
   * @param command Dane celu do aktualizacji
   * @param userId ID użytkownika
   * @returns Zaktualizowany cel
   * @throws Error gdy cel nie istnieje, nie należy do użytkownika lub nazwa już istnieje
   */
  async update(goalId, command, userId) {
    const belongsToUser = await this.belongsToUser(goalId, userId);
    if (!belongsToUser) {
      throw new Error("Cel nie istnieje lub nie należy do użytkownika");
    }
    if (command.target_amount !== void 0 && command.target_amount <= 0) {
      throw new Error("Kwota docelowa musi być większa od zera");
    }
    if (command.name !== void 0) {
      const { data: existingGoal, error: checkError } = await this.supabase.from("goals").select("id").eq("user_id", userId).eq("name", command.name).neq("id", goalId).maybeSingle();
      if (checkError) {
        throw new Error(`Błąd podczas sprawdzania unikalności celu: ${checkError.message}`);
      }
      if (existingGoal) {
        throw new Error("Cel o podanej nazwie już istnieje");
      }
    }
    const updateData = {
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (command.name !== void 0) {
      updateData.name = command.name;
    }
    if (command.target_amount !== void 0) {
      updateData.target_amount = command.target_amount;
    }
    const { data: updatedGoal, error: updateError } = await this.supabase.from("goals").update(updateData).eq("id", goalId).eq("user_id", userId).select("id, name, target_amount, current_amount, updated_at").single();
    if (updateError) {
      throw new Error(`Błąd podczas aktualizacji celu: ${updateError.message}`);
    }
    if (!updatedGoal) {
      throw new Error("Nie udało się zaktualizować celu");
    }
    return updatedGoal;
  }
  /**
   * Usuwa istniejący cel oszczędnościowy dla uwierzytelnionego użytkownika
   * @param goalId ID celu do usunięcia
   * @param userId ID użytkownika
   * @throws Error gdy cel nie istnieje lub nie należy do użytkownika
   */
  async delete(goalId, userId) {
    const belongsToUser = await this.belongsToUser(goalId, userId);
    if (!belongsToUser) {
      throw new Error("Cel nie istnieje lub nie należy do użytkownika");
    }
    const { error: contributionsDeleteError } = await this.supabase.from("goal_contributions").delete().eq("goal_id", goalId);
    if (contributionsDeleteError) {
      throw new Error(`Błąd podczas usuwania powiązanych wpłat do celu: ${contributionsDeleteError.message}`);
    }
    const { error: deleteError } = await this.supabase.from("goals").delete().eq("id", goalId).eq("user_id", userId);
    if (deleteError) {
      throw new Error(`Błąd podczas usuwania celu: ${deleteError.message}`);
    }
  }
  /**
   * Pobiera pojedynczy cel oszczędnościowy dla uwierzytelnionego użytkownika
   * @param goalId ID celu do pobrania
   * @param userId ID użytkownika
   * @returns Cel oszczędnościowy
   * @throws Error gdy cel nie istnieje lub nie należy do użytkownika
   */
  async getGoalById(goalId, userId) {
    const { data: goal, error } = await this.supabase.from("goals").select("id, name, target_amount, current_amount, created_at").eq("id", goalId).eq("user_id", userId).single();
    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Cel nie istnieje lub nie należy do użytkownika");
      }
      throw new Error(`Błąd podczas pobierania celu: ${error.message}`);
    }
    if (!goal) {
      throw new Error("Cel nie istnieje lub nie należy do użytkownika");
    }
    return goal;
  }
  /**
   * Pobiera pojedynczy cel oszczędnościowy wraz z historią wpłat dla uwierzytelnionego użytkownika
   * @param goalId ID celu do pobrania
   * @param userId ID użytkownika
   * @returns Cel oszczędnościowy wraz z historią wpłat
   * @throws Error gdy cel nie istnieje lub nie należy do użytkownika
   */
  async getGoalWithContributionsById(goalId, userId) {
    const goal = await this.getGoalById(goalId, userId);
    const { data: contributions, error: contributionsError } = await this.supabase.from("goal_contributions").select("id, amount, date, description, created_at").eq("goal_id", goalId).order("date", { ascending: false });
    if (contributionsError) {
      throw new Error(`Błąd podczas pobierania historii wpłat: ${contributionsError.message}`);
    }
    return {
      ...goal,
      contributions: contributions || []
    };
  }
}

export { GoalsService as G, validateUpdateGoalCommand as a, validateGetGoalsQuery as b, sanitizeGetGoalsQuery as c, validateCreateGoalCommand as d, sanitizeCreateGoalCommand as e, sanitizeUpdateGoalCommand as s, validateGoalId as v };

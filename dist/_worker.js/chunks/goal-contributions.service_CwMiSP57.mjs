
            // MessageChannel polyfill for Cloudflare Workers
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = function() {
                return {
                  port1: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} },
                  port2: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} }
                };
              };
            }
          
const MAX_DESCRIPTION_LENGTH = 500;
const MIN_DESCRIPTION_LENGTH = 0;
const MAX_AMOUNT = 1e6;
const MIN_AMOUNT = 0.01;
function validateCreateGoalContributionCommand(data) {
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
  if (typeof amount !== "number") {
    errors.push("Pole 'amount' musi być liczbą");
  } else {
    if (amount <= MIN_AMOUNT) {
      errors.push(`Kwota wpłaty musi być większa od ${MIN_AMOUNT}`);
    }
    if (amount > MAX_AMOUNT) {
      errors.push(`Kwota wpłaty nie może przekraczać ${MAX_AMOUNT}`);
    }
  }
  if (!("date" in command)) {
    errors.push("Pole 'date' jest wymagane");
    return { isValid: false, errors };
  }
  const date = command.date;
  if (typeof date !== "string") {
    errors.push("Pole 'date' musi być tekstem");
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      errors.push("Pole 'date' musi mieć format YYYY-MM-DD");
    } else {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        errors.push("Pole 'date' zawiera nieprawidłową datę");
      } else {
        const today = /* @__PURE__ */ new Date();
        const todayString = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
        if (date > todayString) {
          errors.push("Data wpłaty nie może być w przyszłości");
        }
      }
    }
  }
  if ("description" in command) {
    const description = command.description;
    if (description !== null && typeof description !== "string") {
      errors.push("Pole 'description' musi być tekstem lub null");
    } else if (typeof description === "string") {
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
    errors
  };
}
function sanitizeCreateGoalContributionCommand(data) {
  const validation = validateCreateGoalContributionCommand(data);
  if (!validation.isValid) {
    return null;
  }
  const command = data;
  const amount = command.amount;
  const date = command.date;
  const description = command.description;
  return {
    amount,
    date,
    description: description ? description.trim() : null
  };
}
function validateUpdateGoalContributionCommand(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    errors.push("Dane wejściowe muszą być obiektem");
    return { isValid: false, errors };
  }
  const command = data;
  if ("amount" in command) {
    const amount = command.amount;
    if (typeof amount !== "number") {
      errors.push("Pole 'amount' musi być liczbą");
    } else {
      if (amount <= MIN_AMOUNT) {
        errors.push(`Kwota wpłaty musi być większa od ${MIN_AMOUNT}`);
      }
      if (amount > MAX_AMOUNT) {
        errors.push(`Kwota wpłaty nie może przekraczać ${MAX_AMOUNT}`);
      }
    }
  }
  if ("date" in command) {
    const date = command.date;
    if (typeof date !== "string") {
      errors.push("Pole 'date' musi być tekstem");
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        errors.push("Pole 'date' musi mieć format YYYY-MM-DD");
      } else {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          errors.push("Pole 'date' zawiera nieprawidłową datę");
        } else {
          const today = /* @__PURE__ */ new Date();
          const todayString = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
          if (date > todayString) {
            errors.push("Data wpłaty nie może być w przyszłości");
          }
        }
      }
    }
  }
  if ("description" in command) {
    const description = command.description;
    if (description !== null && typeof description !== "string") {
      errors.push("Pole 'description' musi być tekstem lub null");
    } else if (typeof description === "string") {
      const trimmedDescription = description.trim();
      if (trimmedDescription.length < MIN_DESCRIPTION_LENGTH) {
        errors.push("Opis wpłaty nie może być pusty (użyj null aby pominąć opis)");
      }
      if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
        errors.push(`Opis wpłaty nie może przekraczać ${MAX_DESCRIPTION_LENGTH} znaków`);
      }
    }
  }
  const hasAmount = "amount" in command;
  const hasDate = "date" in command;
  const hasDescription = "description" in command;
  if (!hasAmount && !hasDate && !hasDescription) {
    errors.push("Przynajmniej jedno pole musi zostać podane do aktualizacji");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function sanitizeUpdateGoalContributionCommand(data) {
  const validation = validateUpdateGoalContributionCommand(data);
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
    result.description = description ? description.trim() : null;
  }
  return result;
}
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "created_at DESC";
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;
const ALLOWED_SORT_FIELDS = ["amount", "date", "created_at"];
const ALLOWED_SORT_DIRECTIONS = ["ASC", "DESC"];
function validateGetGoalContributionsQuery(query) {
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
function sanitizeGetGoalContributionsQuery(query) {
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
function validateGoalContributionId(contributionId) {
  const errors = [];
  if (typeof contributionId !== "string") {
    errors.push("ID wpłaty musi być tekstem");
    return { isValid: false, errors };
  }
  const trimmedId = contributionId.trim();
  if (trimmedId.length === 0) {
    errors.push("ID wpłaty nie może być pusty");
    return { isValid: false, errors };
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(trimmedId)) {
    errors.push("ID wpłaty musi być prawidłowym UUID");
  }
  return {
    isValid: errors.length === 0,
    errors
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

class GoalContributionsService {
  constructor(supabase) {
    this.supabase = supabase;
  }
  /**
   * Tworzy nową wpłatę na cel oszczędnościowy dla uwierzytelnionego użytkownika
   * @param goalId ID celu oszczędnościowego
   * @param command Dane wpłaty do utworzenia
   * @param userId ID użytkownika
   * @returns Utworzona wpłata
   * @throws Error gdy cel nie istnieje, nie należy do użytkownika lub wystąpił błąd bazy danych
   */
  async create(goalId, command, userId) {
    const goalBelongsToUser = await this.goalBelongsToUser(goalId, userId);
    if (!goalBelongsToUser) {
      throw new Error("Cel nie istnieje lub nie należy do użytkownika");
    }
    const { data: newContribution, error: insertError } = await this.supabase.from("goal_contributions").insert({
      goal_id: goalId,
      user_id: userId,
      amount: command.amount,
      date: command.date,
      description: command.description
    }).select("id, amount, date, description, created_at").single();
    if (insertError) {
      throw new Error(`Błąd podczas tworzenia wpłaty: ${insertError.message}`);
    }
    if (!newContribution) {
      throw new Error("Nie udało się utworzyć wpłaty");
    }
    return newContribution;
  }
  /**
   * Sprawdza czy cel należy do użytkownika
   * @param goalId ID celu
   * @param userId ID użytkownika
   * @returns true jeśli cel należy do użytkownika
   */
  async goalBelongsToUser(goalId, userId) {
    const { data, error } = await this.supabase.from("goals").select("id").eq("id", goalId).eq("user_id", userId).maybeSingle();
    if (error) {
      throw new Error(`Błąd podczas sprawdzania własności celu: ${error.message}`);
    }
    return !!data;
  }
  /**
   * Sprawdza czy wpłata należy do użytkownika
   * @param contributionId ID wpłaty
   * @param userId ID użytkownika
   * @returns true jeśli wpłata należy do użytkownika
   */
  async belongsToUser(contributionId, userId) {
    const { data, error } = await this.supabase.from("goal_contributions").select("id").eq("id", contributionId).eq("user_id", userId).maybeSingle();
    if (error) {
      throw new Error(`Błąd podczas sprawdzania własności wpłaty: ${error.message}`);
    }
    return !!data;
  }
  /**
   * Sprawdza czy wpłata należy do wskazanego celu i użytkownika
   * @param contributionId ID wpłaty
   * @param goalId ID celu
   * @param userId ID użytkownika
   * @returns true jeśli wpłata należy do celu i użytkownika
   */
  async contributionBelongsToGoalAndUser(contributionId, goalId, userId) {
    const { data, error } = await this.supabase.from("goal_contributions").select("id").eq("id", contributionId).eq("goal_id", goalId).eq("user_id", userId).maybeSingle();
    if (error) {
      throw new Error(`Błąd podczas sprawdzania przynależności wpłaty: ${error.message}`);
    }
    return !!data;
  }
  /**
   * Pobiera paginowaną listę wpłat dla konkretnego celu oszczędnościowego
   * @param goalId ID celu oszczędnościowego
   * @param userId ID użytkownika
   * @param query Parametry zapytania zawierające page, limit i sort
   * @returns Obiekt zawierający dane wpłat i informacje o paginacji
   */
  async getGoalContributions(goalId, userId, query) {
    const goalBelongsToUser = await this.goalBelongsToUser(goalId, userId);
    if (!goalBelongsToUser) {
      throw new Error("Cel nie istnieje lub nie należy do użytkownika");
    }
    const { page, limit, sort } = query;
    const offset = (page - 1) * limit;
    const [sortField, sortDirection] = sort.split(" ");
    const { data: contributions, error: dataError } = await this.supabase.from("goal_contributions").select("id, amount, date, description, created_at").eq("goal_id", goalId).eq("user_id", userId).order(sortField, { ascending: sortDirection === "ASC" }).range(offset, offset + limit - 1);
    if (dataError) {
      throw new Error(`Błąd podczas pobierania wpłat: ${dataError.message}`);
    }
    const { count, error: countError } = await this.supabase.from("goal_contributions").select("*", { count: "exact", head: true }).eq("goal_id", goalId).eq("user_id", userId);
    if (countError) {
      throw new Error(`Błąd podczas liczenia wpłat: ${countError.message}`);
    }
    const total = count || 0;
    const pagination = {
      page,
      limit,
      total
    };
    return {
      data: contributions || [],
      pagination
    };
  }
  /**
   * Aktualizuje istniejącą wpłatę dla uwierzytelnionego użytkownika
   * @param contributionId ID wpłaty do aktualizacji
   * @param goalId ID celu oszczędnościowego
   * @param command Dane wpłaty do aktualizacji
   * @param userId ID użytkownika
   * @returns Zaktualizowana wpłata
   * @throws Error gdy wpłata lub cel nie istnieje, nie należy do użytkownika lub wystąpił błąd bazy danych
   */
  async update(contributionId, goalId, command, userId) {
    const belongsToGoalAndUser = await this.contributionBelongsToGoalAndUser(contributionId, goalId, userId);
    if (!belongsToGoalAndUser) {
      throw new Error("Wpłata nie istnieje, nie należy do użytkownika lub nie jest powiązana z wskazanym celem");
    }
    const updateData = {};
    if (command.amount !== void 0) {
      updateData.amount = command.amount;
    }
    if (command.date !== void 0) {
      updateData.date = command.date;
    }
    if (command.description !== void 0) {
      updateData.description = command.description;
    }
    if (Object.keys(updateData).length === 0) {
      throw new Error("Brak pól do aktualizacji");
    }
    const { data: updatedContribution, error: updateError } = await this.supabase.from("goal_contributions").update(updateData).eq("id", contributionId).eq("goal_id", goalId).eq("user_id", userId).select("id, amount, date, description, created_at").single();
    if (updateError) {
      throw new Error(`Błąd podczas aktualizacji wpłaty: ${updateError.message}`);
    }
    if (!updatedContribution) {
      throw new Error("Nie udało się zaktualizować wpłaty");
    }
    return updatedContribution;
  }
  /**
   * Usuwa istniejącą wpłatę dla uwierzytelnionego użytkownika
   * @param contributionId ID wpłaty do usunięcia
   * @param goalId ID celu oszczędnościowego
   * @param userId ID użytkownika
   * @throws Error gdy wpłata lub cel nie istnieje, nie należy do użytkownika lub wystąpił błąd bazy danych
   */
  async delete(contributionId, goalId, userId) {
    const belongsToGoalAndUser = await this.contributionBelongsToGoalAndUser(contributionId, goalId, userId);
    if (!belongsToGoalAndUser) {
      throw new Error("Wpłata nie istnieje, nie należy do użytkownika lub nie jest powiązana z wskazanym celem");
    }
    const { error: deleteError } = await this.supabase.from("goal_contributions").delete().eq("id", contributionId).eq("goal_id", goalId).eq("user_id", userId);
    if (deleteError) {
      throw new Error(`Błąd podczas usuwania wpłaty: ${deleteError.message}`);
    }
  }
}

export { GoalContributionsService as G, validateGoalContributionId as a, validateUpdateGoalContributionCommand as b, validateGetGoalContributionsQuery as c, sanitizeGetGoalContributionsQuery as d, validateCreateGoalContributionCommand as e, sanitizeCreateGoalContributionCommand as f, sanitizeUpdateGoalContributionCommand as s, validateGoalId as v };

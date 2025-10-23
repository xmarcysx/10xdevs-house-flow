import type { Database } from "../db/database.types";
import type { SupabaseClient } from "../db/supabase.client";
import type { CreateExpenseCommand, ExpenseDTO, GetExpensesQuery, PaginationDTO, UpdateExpenseCommand } from "../types";

export class ExpensesService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Pobiera paginowaną listę wydatków dla uwierzytelnionego użytkownika
   * @param userId ID użytkownika
   * @param query Parametry zapytania zawierające page, limit, month, category_id i sort
   * @returns Obiekt zawierający dane wydatków i informacje o paginacji
   */
  async getExpenses(
    userId: string,
    query: GetExpensesQuery
  ): Promise<{ data: ExpenseDTO[]; pagination: PaginationDTO }> {
    const { page, limit, month, category_id, sort } = query;

    // Oblicz offset dla paginacji
    const offset = (page - 1) * limit;

    // Parsowanie parametru sortowania
    const [sortField, sortDirection] = sort.split(" ");

    // Budowanie zapytania bazowego z JOIN na categories
    let expensesQuery = this.supabase
      .from("expenses")
      .select(
        `
        id,
        amount,
        date,
        description,
        category_id,
        created_at,
        categories!inner (
          name
        )
      `
      )
      .eq("user_id", userId);

    // Dodaj opcjonalny filtr po miesiącu
    if (month) {
      const [year, monthNum] = month.split("-").map(Number);
      const startDate = `${month}-01`;
      const endDate = new Date(year, monthNum, 0).toISOString().split("T")[0]; // ostatni dzień miesiąca
      expensesQuery = expensesQuery.gte("date", startDate).lte("date", endDate);
    }

    // Dodaj opcjonalny filtr po kategorii
    if (category_id) {
      expensesQuery = expensesQuery.eq("category_id", category_id);
    }

    // Dodaj sortowanie i paginację
    expensesQuery = expensesQuery
      .order(sortField, { ascending: sortDirection === "ASC" })
      .range(offset, offset + limit - 1);

    // Wykonaj zapytanie pobierające wydatki
    const { data: expensesData, error: dataError } = await expensesQuery;

    if (dataError) {
      throw new Error(`Błąd podczas pobierania wydatków: ${dataError.message}`);
    }

    // Mapuj dane na ExpenseDTO
    const expenses: ExpenseDTO[] = (expensesData || []).map((expense) => ({
      id: expense.id,
      amount: expense.amount,
      date: expense.date,
      description: expense.description,
      category_id: expense.category_id,
      created_at: expense.created_at,
      category_name: (expense.categories as any)?.name || "",
    }));

    // Budowanie zapytania dla liczenia całkowitej liczby rekordów
    let countQuery = this.supabase.from("expenses").select("*", { count: "exact", head: true }).eq("user_id", userId);

    // Dodaj te same filtry co dla danych
    if (month) {
      const [year, monthNum] = month.split("-").map(Number);
      const startDate = `${month}-01`;
      const endDate = new Date(year, monthNum, 0).toISOString().split("T")[0];
      countQuery = countQuery.gte("date", startDate).lte("date", endDate);
    }

    if (category_id) {
      countQuery = countQuery.eq("category_id", category_id);
    }

    // Wykonaj zapytanie liczące
    const { count, error: countError } = await countQuery;

    if (countError) {
      throw new Error(`Błąd podczas liczenia wydatków: ${countError.message}`);
    }

    const total = count || 0;

    // Przygotowanie obiektu paginacji
    const pagination: PaginationDTO = {
      page,
      limit,
      total,
    };

    return {
      data: expenses,
      pagination,
    };
  }

  /**
   * Tworzy nowy wydatek dla uwierzytelnionego użytkownika
   * @param command Dane wydatku do utworzenia
   * @param userId ID użytkownika
   * @returns Utworzony wydatek z nazwą kategorii
   * @throws Error gdy kategoria nie istnieje lub nie należy do użytkownika
   */
  async create(command: CreateExpenseCommand, userId: string): Promise<ExpenseDTO> {
    // Sprawdź czy kategoria istnieje i należy do użytkownika
    const { data: category, error: categoryCheckError } = await this.supabase
      .from("categories")
      .select("id, name")
      .eq("id", command.category_id)
      .eq("user_id", userId)
      .maybeSingle();

    if (categoryCheckError) {
      throw new Error(`Błąd podczas sprawdzania kategorii: ${categoryCheckError.message}`);
    }

    if (!category) {
      throw new Error("Kategoria nie istnieje lub nie należy do użytkownika");
    }

    // Utwórz nowy wydatek
    const { data: newExpense, error: insertError } = await this.supabase
      .from("expenses")
      .insert({
        amount: command.amount,
        date: command.date,
        description: command.description,
        category_id: command.category_id,
        user_id: userId,
      })
      .select("id, amount, date, description, category_id, created_at")
      .single();

    if (insertError) {
      throw new Error(`Błąd podczas tworzenia wydatku: ${insertError.message}`);
    }

    if (!newExpense) {
      throw new Error("Nie udało się utworzyć wydatku");
    }

    // Zwróć wydatek z nazwą kategorii
    return {
      ...newExpense,
      category_name: category.name,
    };
  }

  /**
   * Sprawdza czy wydatek należy do użytkownika
   * @param expenseId ID wydatku
   * @param userId ID użytkownika
   * @returns true jeśli wydatek należy do użytkownika
   */
  async belongsToUser(expenseId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("expenses")
      .select("id")
      .eq("id", expenseId)
      .eq("user_id", userId)
      .maybeSingle();

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
  async update(expenseId: string, command: UpdateExpenseCommand, userId: string): Promise<ExpenseDTO> {
    // Sprawdź czy wydatek istnieje i należy do użytkownika
    const belongsToUser = await this.belongsToUser(expenseId, userId);
    if (!belongsToUser) {
      throw new Error("Wydatek nie istnieje lub nie należy do użytkownika");
    }

    // Jeśli podana nowa kategoria, sprawdź czy istnieje i należy do użytkownika
    if (command.category_id) {
      const { data: category, error: categoryCheckError } = await this.supabase
        .from("categories")
        .select("id, name")
        .eq("id", command.category_id)
        .eq("user_id", userId)
        .maybeSingle();

      if (categoryCheckError) {
        throw new Error(`Błąd podczas sprawdzania kategorii: ${categoryCheckError.message}`);
      }

      if (!category) {
        throw new Error("Kategoria nie istnieje lub nie należy do użytkownika");
      }
    }

    // Przygotuj dane do aktualizacji
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    // Dodaj tylko pola które zostały podane
    if (command.amount !== undefined) {
      updateData.amount = command.amount;
    }
    if (command.date !== undefined) {
      updateData.date = command.date;
    }
    if (command.description !== undefined) {
      updateData.description = command.description;
    }
    if (command.category_id !== undefined) {
      updateData.category_id = command.category_id;
    }

    // Aktualizuj wydatek
    const { data: updatedExpense, error: updateError } = await this.supabase
      .from("expenses")
      .update(updateData)
      .eq("id", expenseId)
      .eq("user_id", userId)
      .select("id, amount, date, description, category_id, created_at")
      .single();

    if (updateError) {
      throw new Error(`Błąd podczas aktualizacji wydatku: ${updateError.message}`);
    }

    if (!updatedExpense) {
      throw new Error("Nie udało się zaktualizować wydatku");
    }

    // Pobierz nazwę kategorii dla zaktualizowanego wydatku
    const { data: category, error: categoryError } = await this.supabase
      .from("categories")
      .select("name")
      .eq("id", updatedExpense.category_id)
      .single();

    if (categoryError) {
      throw new Error(`Błąd podczas pobierania nazwy kategorii: ${categoryError.message}`);
    }

    // Zwróć zaktualizowany wydatek z nazwą kategorii
    return {
      ...updatedExpense,
      category_name: category.name,
    };
  }

  /**
   * Usuwa istniejący wydatek dla uwierzytelnionego użytkownika
   * @param expenseId ID wydatku do usunięcia
   * @param userId ID użytkownika
   * @throws Error gdy wydatek nie istnieje lub nie należy do użytkownika
   */
  async delete(expenseId: string, userId: string): Promise<void> {
    // Sprawdź czy wydatek istnieje i należy do użytkownika
    const belongsToUser = await this.belongsToUser(expenseId, userId);
    if (!belongsToUser) {
      throw new Error("Wydatek nie istnieje lub nie należy do użytkownika");
    }

    // Usuń wydatek
    const { error: deleteError } = await this.supabase
      .from("expenses")
      .delete()
      .eq("id", expenseId)
      .eq("user_id", userId);

    if (deleteError) {
      throw new Error(`Błąd podczas usuwania wydatku: ${deleteError.message}`);
    }
  }
}

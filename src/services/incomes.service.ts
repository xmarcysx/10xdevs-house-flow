import type { Database } from "../db/database.types";
import type { SupabaseClient } from "../db/supabase.client";
import type { GetIncomesQuery } from "../lib/validation/incomes.validation";
import type { CreateIncomeCommand, IncomeDTO, PaginationDTO, UpdateIncomeCommand } from "../types";

export class IncomesService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Pobiera paginowaną listę wpływów dla uwierzytelnionego użytkownika
   * @param userId ID użytkownika
   * @param query Parametry zapytania zawierające page, limit, month i sort
   * @returns Obiekt zawierający dane wpływów i informacje o paginacji
   */
  async getIncomes(userId: string, query: GetIncomesQuery): Promise<{ data: IncomeDTO[]; pagination: PaginationDTO }> {
    const { page, limit, month, sort } = query;

    // Oblicz offset dla paginacji
    const offset = (page - 1) * limit;

    // Parsowanie parametru sortowania
    const [sortField, sortDirection] = sort.split(" ");

    // Przygotowanie zapytania bazowego
    let incomesQuery = this.supabase
      .from("incomes")
      .select("id, amount, date, description, source, created_at")
      .eq("user_id", userId);

    // Dodanie filtrowania po miesiącu jeśli podano
    if (month) {
      const startDate = `${month}-01`;
      const endDate = new Date(parseInt(month.split("-")[0]), parseInt(month.split("-")[1]), 0)
        .toISOString()
        .split("T")[0]; // Ostatni dzień miesiąca

      incomesQuery = incomesQuery.gte("date", startDate).lte("date", endDate);
    }

    // Dodanie sortowania i paginacji
    const { data: incomes, error: dataError } = await incomesQuery
      .order(sortField, { ascending: sortDirection === "ASC" })
      .range(offset, offset + limit - 1);

    if (dataError) {
      throw new Error(`Błąd podczas pobierania wpływów: ${dataError.message}`);
    }

    // Przygotowanie zapytania do liczenia całkowitej liczby wyników
    let countQuery = this.supabase.from("incomes").select("*", { count: "exact", head: true }).eq("user_id", userId);

    // Dodanie tego samego filtrowania po miesiącu dla liczenia
    if (month) {
      const startDate = `${month}-01`;
      const endDate = new Date(parseInt(month.split("-")[0]), parseInt(month.split("-")[1]), 0)
        .toISOString()
        .split("T")[0];

      countQuery = countQuery.gte("date", startDate).lte("date", endDate);
    }

    // Pobieranie całkowitej liczby wyników
    const { count, error: countError } = await countQuery;

    if (countError) {
      throw new Error(`Błąd podczas liczenia wpływów: ${countError.message}`);
    }

    const total = count || 0;

    // Przygotowanie obiektu paginacji
    const pagination: PaginationDTO = {
      page,
      limit,
      total,
    };

    return {
      data: incomes || [],
      pagination,
    };
  }

  /**
   * Sprawdza czy wpływ należy do użytkownika
   * @param incomeId ID wpływu
   * @param userId ID użytkownika
   * @returns true jeśli wpływ należy do użytkownika
   */
  async belongsToUser(incomeId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("incomes")
      .select("id")
      .eq("id", incomeId)
      .eq("user_id", userId)
      .maybeSingle();

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
  async create(command: CreateIncomeCommand, userId: string): Promise<IncomeDTO> {
    // Utwórz nowy wpływ
    const { data: newIncome, error: insertError } = await this.supabase
      .from("incomes")
      .insert({
        amount: command.amount,
        date: command.date,
        description: command.description,
        source: command.source,
        user_id: userId,
      })
      .select("id, amount, date, description, source, created_at")
      .single();

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
  async update(incomeId: string, command: UpdateIncomeCommand, userId: string): Promise<IncomeDTO> {
    // Sprawdź czy wpływ istnieje i należy do użytkownika
    const belongsToUser = await this.belongsToUser(incomeId, userId);
    if (!belongsToUser) {
      throw new Error("Wpływ nie istnieje lub nie należy do użytkownika");
    }

    // Przygotuj dane do aktualizacji
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (command.amount !== undefined) {
      updateData.amount = command.amount;
    }
    if (command.date !== undefined) {
      updateData.date = command.date;
    }
    if (command.description !== undefined) {
      updateData.description = command.description;
    }
    if (command.source !== undefined) {
      updateData.source = command.source;
    }

    // Aktualizuj wpływ
    const { data: updatedIncome, error: updateError } = await this.supabase
      .from("incomes")
      .update(updateData)
      .eq("id", incomeId)
      .eq("user_id", userId)
      .select("id, amount, date, description, source, created_at")
      .single();

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
  async delete(incomeId: string, userId: string): Promise<void> {
    // Sprawdź czy wpływ istnieje i należy do użytkownika
    const belongsToUser = await this.belongsToUser(incomeId, userId);
    if (!belongsToUser) {
      throw new Error("Wpływ nie istnieje lub nie należy do użytkownika");
    }

    // Usuń wpływ
    const { error: deleteError } = await this.supabase
      .from("incomes")
      .delete()
      .eq("id", incomeId)
      .eq("user_id", userId);

    if (deleteError) {
      throw new Error(`Błąd podczas usuwania wpływu: ${deleteError.message}`);
    }
  }
}

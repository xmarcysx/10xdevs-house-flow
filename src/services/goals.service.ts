import type { Database } from "../db/database.types";
import type { SupabaseClient } from "../db/supabase.client";
import type { GetGoalsQuery } from "../lib/validation/goals.validation";
import type { CreateGoalCommand, GoalDTO, PaginationDTO, UpdateGoalCommand, UpdateGoalDTO } from "../types";

export class GoalsService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Tworzy nowy cel oszczędnościowy dla uwierzytelnionego użytkownika
   * @param command Dane celu do utworzenia
   * @param userId ID użytkownika
   * @returns Utworzony cel
   * @throws Error gdy nazwa celu już istnieje dla użytkownika lub target_amount <= 0
   */
  async create(command: CreateGoalCommand, userId: string): Promise<GoalDTO> {
    // Walidacja biznesowa: target_amount musi być większy od 0
    if (command.target_amount <= 0) {
      throw new Error("Kwota docelowa musi być większa od zera");
    }

    // Sprawdź czy cel o podanej nazwie już istnieje dla użytkownika
    const { data: existingGoal, error: checkError } = await this.supabase
      .from("goals")
      .select("id")
      .eq("user_id", userId)
      .eq("name", command.name)
      .maybeSingle();

    if (checkError) {
      throw new Error(`Błąd podczas sprawdzania unikalności celu: ${checkError.message}`);
    }

    if (existingGoal) {
      throw new Error("Cel o podanej nazwie już istnieje");
    }

    // Utwórz nowy cel
    const { data: newGoal, error: insertError } = await this.supabase
      .from("goals")
      .insert({
        name: command.name,
        target_amount: command.target_amount,
        current_amount: 0, // Nowe cele zaczynają od 0
        user_id: userId,
      })
      .select("id, name, target_amount, current_amount, created_at")
      .single();

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
  async belongsToUser(goalId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("goals")
      .select("id")
      .eq("id", goalId)
      .eq("user_id", userId)
      .maybeSingle();

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
  async getGoals(userId: string, query: GetGoalsQuery): Promise<{ data: GoalDTO[]; pagination: PaginationDTO }> {
    const { page, limit, sort } = query;

    // Oblicz offset dla paginacji
    const offset = (page - 1) * limit;

    // Parsowanie parametru sortowania
    const [sortField, sortDirection] = sort.split(" ");

    // Zapytanie pobierające cele z paginacją i sortowaniem
    const { data: goals, error: dataError } = await this.supabase
      .from("goals")
      .select("id, name, target_amount, current_amount, created_at")
      .eq("user_id", userId)
      .order(sortField, { ascending: sortDirection === "ASC" })
      .range(offset, offset + limit - 1);

    if (dataError) {
      throw new Error(`Błąd podczas pobierania celów: ${dataError.message}`);
    }

    // Zapytanie pobierające całkowitą liczbę celów dla paginacji
    const { count, error: countError } = await this.supabase
      .from("goals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      throw new Error(`Błąd podczas liczenia celów: ${countError.message}`);
    }

    const total = count || 0;

    // Przygotowanie obiektu paginacji
    const pagination: PaginationDTO = {
      page,
      limit,
      total,
    };

    return {
      data: goals || [],
      pagination,
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
  async update(goalId: string, command: UpdateGoalCommand, userId: string): Promise<UpdateGoalDTO> {
    // Sprawdź czy cel istnieje i należy do użytkownika
    const belongsToUser = await this.belongsToUser(goalId, userId);
    if (!belongsToUser) {
      throw new Error("Cel nie istnieje lub nie należy do użytkownika");
    }

    // Walidacja biznesowa: target_amount musi być większy od 0 jeśli podany
    if (command.target_amount !== undefined && command.target_amount <= 0) {
      throw new Error("Kwota docelowa musi być większa od zera");
    }

    // Sprawdź czy nowa nazwa celu już istnieje dla użytkownika (z wykluczeniem aktualnego celu)
    if (command.name !== undefined) {
      const { data: existingGoal, error: checkError } = await this.supabase
        .from("goals")
        .select("id")
        .eq("user_id", userId)
        .eq("name", command.name)
        .neq("id", goalId)
        .maybeSingle();

      if (checkError) {
        throw new Error(`Błąd podczas sprawdzania unikalności celu: ${checkError.message}`);
      }

      if (existingGoal) {
        throw new Error("Cel o podanej nazwie już istnieje");
      }
    }

    // Przygotuj dane do aktualizacji
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (command.name !== undefined) {
      updateData.name = command.name;
    }

    if (command.target_amount !== undefined) {
      updateData.target_amount = command.target_amount;
    }

    // Aktualizuj cel
    const { data: updatedGoal, error: updateError } = await this.supabase
      .from("goals")
      .update(updateData)
      .eq("id", goalId)
      .eq("user_id", userId)
      .select("id, name, target_amount, current_amount, updated_at")
      .single();

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
  async delete(goalId: string, userId: string): Promise<void> {
    // Sprawdź czy cel istnieje i należy do użytkownika
    const belongsToUser = await this.belongsToUser(goalId, userId);
    if (!belongsToUser) {
      throw new Error("Cel nie istnieje lub nie należy do użytkownika");
    }

    // Usuń powiązane wpłaty do celu (goal_contributions)
    // Zakładamy kaskadowe usunięcie lub ręczne usuwanie powiązanych danych
    const { error: contributionsDeleteError } = await this.supabase
      .from("goal_contributions")
      .delete()
      .eq("goal_id", goalId);

    if (contributionsDeleteError) {
      throw new Error(`Błąd podczas usuwania powiązanych wpłat do celu: ${contributionsDeleteError.message}`);
    }

    // Usuń cel
    const { error: deleteError } = await this.supabase.from("goals").delete().eq("id", goalId).eq("user_id", userId);

    if (deleteError) {
      throw new Error(`Błąd podczas usuwania celu: ${deleteError.message}`);
    }
  }
}

import type { Database } from "../db/database.types";
import type { SupabaseClient } from "../db/supabase.client";
import type { GetGoalContributionsQuery } from "../lib/validation/goal-contributions.validation";
import type {
  CreateGoalContributionCommand,
  GoalContributionDTO,
  PaginationDTO,
  UpdateGoalContributionCommand,
} from "../types";

export class GoalContributionsService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Tworzy nową wpłatę na cel oszczędnościowy dla uwierzytelnionego użytkownika
   * @param goalId ID celu oszczędnościowego
   * @param command Dane wpłaty do utworzenia
   * @param userId ID użytkownika
   * @returns Utworzona wpłata
   * @throws Error gdy cel nie istnieje, nie należy do użytkownika lub wystąpił błąd bazy danych
   */
  async create(goalId: string, command: CreateGoalContributionCommand, userId: string): Promise<GoalContributionDTO> {
    // Sprawdź czy cel należy do użytkownika
    const goalBelongsToUser = await this.goalBelongsToUser(goalId, userId);
    if (!goalBelongsToUser) {
      throw new Error("Cel nie istnieje lub nie należy do użytkownika");
    }

    // Utwórz nową wpłatę
    const { data: newContribution, error: insertError } = await this.supabase
      .from("goal_contributions")
      .insert({
        goal_id: goalId,
        user_id: userId,
        amount: command.amount,
        date: command.date,
        description: command.description,
      })
      .select("id, amount, date, description, created_at")
      .single();

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
  async goalBelongsToUser(goalId: string, userId: string): Promise<boolean> {
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
   * Sprawdza czy wpłata należy do użytkownika
   * @param contributionId ID wpłaty
   * @param userId ID użytkownika
   * @returns true jeśli wpłata należy do użytkownika
   */
  async belongsToUser(contributionId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("goal_contributions")
      .select("id")
      .eq("id", contributionId)
      .eq("user_id", userId)
      .maybeSingle();

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
  async contributionBelongsToGoalAndUser(contributionId: string, goalId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("goal_contributions")
      .select("id")
      .eq("id", contributionId)
      .eq("goal_id", goalId)
      .eq("user_id", userId)
      .maybeSingle();

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
  async getGoalContributions(
    goalId: string,
    userId: string,
    query: GetGoalContributionsQuery
  ): Promise<{ data: GoalContributionDTO[]; pagination: PaginationDTO }> {
    // Sprawdź czy cel należy do użytkownika
    const goalBelongsToUser = await this.goalBelongsToUser(goalId, userId);
    if (!goalBelongsToUser) {
      throw new Error("Cel nie istnieje lub nie należy do użytkownika");
    }

    const { page, limit, sort } = query;

    // Oblicz offset dla paginacji
    const offset = (page - 1) * limit;

    // Parsowanie parametru sortowania
    const [sortField, sortDirection] = sort.split(" ");

    // Zapytanie pobierające wpłaty z paginacją i sortowaniem
    const { data: contributions, error: dataError } = await this.supabase
      .from("goal_contributions")
      .select("id, amount, date, description, created_at")
      .eq("goal_id", goalId)
      .eq("user_id", userId)
      .order(sortField, { ascending: sortDirection === "ASC" })
      .range(offset, offset + limit - 1);

    if (dataError) {
      throw new Error(`Błąd podczas pobierania wpłat: ${dataError.message}`);
    }

    // Zapytanie pobierające całkowitą liczbę wpłat dla paginacji
    const { count, error: countError } = await this.supabase
      .from("goal_contributions")
      .select("*", { count: "exact", head: true })
      .eq("goal_id", goalId)
      .eq("user_id", userId);

    if (countError) {
      throw new Error(`Błąd podczas liczenia wpłat: ${countError.message}`);
    }

    const total = count || 0;

    // Przygotowanie obiektu paginacji
    const pagination: PaginationDTO = {
      page,
      limit,
      total,
    };

    return {
      data: contributions || [],
      pagination,
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
  async update(
    contributionId: string,
    goalId: string,
    command: UpdateGoalContributionCommand,
    userId: string
  ): Promise<GoalContributionDTO> {
    // Sprawdź czy wpłata należy do celu i użytkownika
    const belongsToGoalAndUser = await this.contributionBelongsToGoalAndUser(contributionId, goalId, userId);
    if (!belongsToGoalAndUser) {
      throw new Error("Wpłata nie istnieje, nie należy do użytkownika lub nie jest powiązana z wskazanym celem");
    }

    // Przygotuj dane do aktualizacji
    const updateData: {
      amount?: number;
      date?: string;
      description?: string | null;
    } = {};
    if (command.amount !== undefined) {
      updateData.amount = command.amount;
    }
    if (command.date !== undefined) {
      updateData.date = command.date;
    }
    if (command.description !== undefined) {
      updateData.description = command.description;
    }

    // Jeśli nie ma pól do aktualizacji, zwróć błąd
    if (Object.keys(updateData).length === 0) {
      throw new Error("Brak pól do aktualizacji");
    }

    // Aktualizuj wpłatę
    const { data: updatedContribution, error: updateError } = await this.supabase
      .from("goal_contributions")
      .update(updateData)
      .eq("id", contributionId)
      .eq("goal_id", goalId)
      .eq("user_id", userId)
      .select("id, amount, date, description, created_at")
      .single();

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
  async delete(contributionId: string, goalId: string, userId: string): Promise<void> {
    // Sprawdź czy wpłata należy do celu i użytkownika
    const belongsToGoalAndUser = await this.contributionBelongsToGoalAndUser(contributionId, goalId, userId);
    if (!belongsToGoalAndUser) {
      throw new Error("Wpłata nie istnieje, nie należy do użytkownika lub nie jest powiązana z wskazanym celem");
    }

    // Usuń wpłatę
    const { error: deleteError } = await this.supabase
      .from("goal_contributions")
      .delete()
      .eq("id", contributionId)
      .eq("goal_id", goalId)
      .eq("user_id", userId);

    if (deleteError) {
      throw new Error(`Błąd podczas usuwania wpłaty: ${deleteError.message}`);
    }
  }
}

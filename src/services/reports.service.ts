import type { Database } from "../db/database.types";
import type { SupabaseClient } from "../db/supabase.client";
import type {
  CategoryTotalDTO,
  ExpenseReportItemDTO,
  GoalReportItemDTO,
  GoalsReportDTO,
  MonthlyReportDTO,
} from "../types";

export class ReportsService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Pobiera raport celów oszczędnościowych dla uwierzytelnionego użytkownika
   * @param userId ID użytkownika
   * @returns Raport zawierający wszystkie cele z informacjami o postępie
   */
  async getGoalsReport(userId: string): Promise<GoalsReportDTO> {
    // Pobierz wszystkie cele użytkownika z tabeli goals
    const { data: goals, error } = await this.supabase
      .from("goals")
      .select("id, name, target_amount, current_amount")
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Błąd podczas pobierania celów: ${error.message}`);
    }

    if (!goals) {
      throw new Error("Nie udało się pobrać celów");
    }

    // Mapuj wyniki na GoalReportItemDTO z obliczeniami
    const goalsReport: GoalReportItemDTO[] = goals.map((goal) => {
      // Oblicz procentowy postęp: (current_amount / target_amount) * 100
      const progressPercentage =
        goal.target_amount > 0
          ? Math.round((goal.current_amount / goal.target_amount) * 100 * 100) / 100 // Zaokrąglij do 2 miejsc po przecinku
          : 0;

      // Oblicz pozostałą kwotę: target_amount - current_amount
      const remainingAmount = Math.max(0, goal.target_amount - goal.current_amount);

      return {
        id: goal.id,
        name: goal.name,
        progress_percentage: progressPercentage,
        remaining_amount: remainingAmount,
        predicted_completion_date: undefined, // Na razie null - rozszerzenie przyszłe
      };
    });

    return {
      goals: goalsReport,
    };
  }

  /**
   * Pobiera miesięczny raport wydatków dla uwierzytelnionego użytkownika
   * @param userId ID użytkownika
   * @param month Miesiąc w formacie YYYY-MM
   * @returns Raport zawierający wydatki i sumy według kategorii
   */
  async getMonthlyReport(userId: string, month: string): Promise<MonthlyReportDTO> {
    // Parsuj miesiąc na zakres dat
    const [year, monthNum] = month.split("-").map(Number);
    const startDate = `${month}-01`;
    const endDate = new Date(year, monthNum, 0).toISOString().split("T")[0]; // ostatni dzień miesiąca

    // Pobierz wydatki z danego miesiąca wraz z nazwami kategorii
    const { data: expensesData, error } = await this.supabase
      .from("expenses")
      .select(
        `
        date,
        amount,
        categories!inner (
          name
        )
      `
      )
      .eq("user_id", userId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (error) {
      throw new Error(`Błąd podczas pobierania wydatków: ${error.message}`);
    }

    if (!expensesData) {
      throw new Error("Nie udało się pobrać wydatków");
    }

    // Mapuj wydatki na ExpenseReportItemDTO
    const expenses: ExpenseReportItemDTO[] = expensesData.map((expense) => ({
      date: expense.date,
      amount: expense.amount,
      category: (expense.categories as any)?.name || "",
    }));

    // Oblicz sumy według kategorii
    const categoryTotalsMap = new Map<string, number>();

    expensesData.forEach((expense) => {
      const categoryName = (expense.categories as any)?.name || "Nieznana kategoria";
      const currentTotal = categoryTotalsMap.get(categoryName) || 0;
      categoryTotalsMap.set(categoryName, currentTotal + expense.amount);
    });

    // Konwertuj mapę na tablicę CategoryTotalDTO
    const categoryTotals: CategoryTotalDTO[] = Array.from(categoryTotalsMap.entries()).map(([category, total]) => ({
      category,
      total,
    }));

    return {
      expenses,
      category_totals: categoryTotals,
    };
  }
}

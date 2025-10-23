import type { Database } from "../db/database.types";
import type { SupabaseClient } from "../db/supabase.client";
import type { CategoryBreakdownDTO, MonthlyBudgetDTO } from "../types";

export class BudgetService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Pobiera miesięczne podsumowanie budżetu dla użytkownika
   * @param userId ID użytkownika
   * @param month Miesiąc w formacie YYYY-MM
   * @returns Miesięczne podsumowanie budżetu zawierające wpływy, wydatki, pozostałą kwotę i rozkład po kategoriach
   * @throws Error gdy wystąpi błąd podczas pobierania danych z bazy
   */
  async getMonthlyBudget(userId: string, month: string): Promise<MonthlyBudgetDTO> {
    // Parsowanie miesiąca na początek i koniec okresu
    const [year, monthNum] = month.split("-");
    const startDate = `${year}-${monthNum.padStart(2, "0")}-01`;
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0).toISOString().split("T")[0]; // ostatni dzień miesiąca

    // Pobieranie całkowitych wpływów dla danego miesiąca
    const { data: incomeData, error: incomeError } = await this.supabase
      .from("incomes")
      .select("amount")
      .eq("user_id", userId)
      .gte("date", startDate)
      .lte("date", endDate);

    if (incomeError) {
      throw new Error(`Błąd podczas pobierania wpływów: ${incomeError.message}`);
    }

    const totalIncome = incomeData?.reduce((sum, income) => sum + income.amount, 0) || 0;

    // Pobieranie wydatków z nazwami kategorii dla danego miesiąca
    const { data: expensesData, error: expensesError } = await this.supabase
      .from("expenses")
      .select(
        `
        amount,
        categories!inner (
          name
        )
      `
      )
      .eq("user_id", userId)
      .gte("date", startDate)
      .lte("date", endDate);

    if (expensesError) {
      throw new Error(`Błąd podczas pobierania wydatków: ${expensesError.message}`);
    }

    const totalExpenses = expensesData?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

    // Obliczenie pozostałej kwoty
    const remaining = totalIncome - totalExpenses;

    // Przygotowanie rozkładu wydatków po kategoriach
    const categoryMap = new Map<string, number>();

    // Grupowanie wydatków po nazwach kategorii
    expensesData?.forEach((expense) => {
      const categoryName = (expense.categories as { name: string }).name;
      const currentAmount = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, currentAmount + expense.amount);
    });

    // Przygotowanie category_breakdown z procentami
    let categoryBreakdown: CategoryBreakdownDTO[] = [];

    if (totalExpenses > 0) {
      categoryBreakdown = Array.from(categoryMap.entries())
        .map(([categoryName, amount]) => ({
          category_name: categoryName,
          amount,
          percentage: Math.round((amount / totalExpenses) * 100 * 100) / 100, // zaokrąglenie do 2 miejsc po przecinku
        }))
        .sort((a, b) => b.amount - a.amount); // sortowanie malejąco po kwocie
    } else {
      // Jeśli nie ma wydatków, sortuj alfabetycznie
      categoryBreakdown = Array.from(categoryMap.entries())
        .map(([categoryName, amount]) => ({
          category_name: categoryName,
          amount,
          percentage: 0,
        }))
        .sort((a, b) => a.category_name.localeCompare(b.category_name));
    }

    return {
      total_income: totalIncome,
      total_expenses: totalExpenses,
      remaining,
      category_breakdown: categoryBreakdown,
    };
  }
}

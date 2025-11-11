
            // MessageChannel polyfill for Cloudflare Workers
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = function() {
                return {
                  port1: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} },
                  port2: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} }
                };
              };
            }
          
class ReportsService {
  constructor(supabase) {
    this.supabase = supabase;
  }
  /**
   * Pobiera raport celów oszczędnościowych dla uwierzytelnionego użytkownika
   * @param userId ID użytkownika
   * @returns Raport zawierający wszystkie cele z informacjami o postępie
   */
  async getGoalsReport(userId) {
    const { data: goals, error } = await this.supabase.from("goals").select("id, name, target_amount, current_amount").eq("user_id", userId);
    if (error) {
      throw new Error(`Błąd podczas pobierania celów: ${error.message}`);
    }
    if (!goals) {
      throw new Error("Nie udało się pobrać celów");
    }
    const goalsReport = goals.map((goal) => {
      const progressPercentage = goal.target_amount > 0 ? Math.round(goal.current_amount / goal.target_amount * 100 * 100) / 100 : 0;
      const remainingAmount = Math.max(0, goal.target_amount - goal.current_amount);
      return {
        id: goal.id,
        name: goal.name,
        progress_percentage: progressPercentage,
        remaining_amount: remainingAmount,
        predicted_completion_date: void 0
        // Na razie null - rozszerzenie przyszłe
      };
    });
    return {
      goals: goalsReport
    };
  }
  /**
   * Pobiera miesięczny raport wydatków dla uwierzytelnionego użytkownika
   * @param userId ID użytkownika
   * @param month Miesiąc w formacie YYYY-MM
   * @returns Raport zawierający wydatki i sumy według kategorii
   */
  async getMonthlyReport(userId, month) {
    const [year, monthNum] = month.split("-").map(Number);
    const startDate = `${month}-01`;
    const endDate = new Date(year, monthNum, 0).toISOString().split("T")[0];
    const { data: expensesData, error } = await this.supabase.from("expenses").select(
      `
        date,
        amount,
        categories!inner (
          name
        )
      `
    ).eq("user_id", userId).gte("date", startDate).lte("date", endDate).order("date", { ascending: true });
    if (error) {
      throw new Error(`Błąd podczas pobierania wydatków: ${error.message}`);
    }
    if (!expensesData) {
      throw new Error("Nie udało się pobrać wydatków");
    }
    const expenses = expensesData.map((expense) => ({
      date: expense.date,
      amount: expense.amount,
      category: expense.categories?.name || ""
    }));
    const categoryTotalsMap = /* @__PURE__ */ new Map();
    expensesData.forEach((expense) => {
      const categoryName = expense.categories?.name || "Nieznana kategoria";
      const currentTotal = categoryTotalsMap.get(categoryName) || 0;
      categoryTotalsMap.set(categoryName, currentTotal + expense.amount);
    });
    const categoryTotals = Array.from(categoryTotalsMap.entries()).map(([category, total]) => ({
      category,
      total
    }));
    return {
      expenses,
      category_totals: categoryTotals
    };
  }
}

export { ReportsService as R };

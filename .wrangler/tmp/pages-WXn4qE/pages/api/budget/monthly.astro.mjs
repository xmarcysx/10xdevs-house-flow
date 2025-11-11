globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as requireAuth } from '../../../chunks/api-helpers_gexHC0qf.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_B70jUmW-.mjs';

const MONTH_FORMAT_REGEX = /^\d{4}-\d{2}$/;
function validateGetMonthlyBudgetQuery(query) {
  const errors = [];
  const monthParam = query.get("month");
  if (!monthParam) {
    errors.push("Parametr 'month' jest wymagany");
    return { isValid: false, errors };
  }
  const month = monthParam.trim();
  if (!MONTH_FORMAT_REGEX.test(month)) {
    errors.push("Parametr 'month' musi mieć format YYYY-MM (np. 2023-10)");
    return { isValid: false, errors };
  }
  const [yearStr, monthStr] = month.split("-");
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);
  if (year < 2e3 || year > 2100) {
    errors.push("Rok w parametrze 'month' musi być w zakresie 2000-2100");
  }
  if (monthNum < 1 || monthNum > 12) {
    errors.push("Miesiąc w parametrze 'month' musi być w zakresie 01-12");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function sanitizeGetMonthlyBudgetQuery(query) {
  const monthParam = query.get("month");
  const month = monthParam ? monthParam.trim() : "";
  return {
    month
  };
}

class BudgetService {
  constructor(supabase) {
    this.supabase = supabase;
  }
  /**
   * Pobiera miesięczne podsumowanie budżetu dla użytkownika
   * @param userId ID użytkownika
   * @param month Miesiąc w formacie YYYY-MM
   * @returns Miesięczne podsumowanie budżetu zawierające wpływy, wydatki, pozostałą kwotę i rozkład po kategoriach
   * @throws Error gdy wystąpi błąd podczas pobierania danych z bazy
   */
  async getMonthlyBudget(userId, month) {
    const [year, monthNum] = month.split("-");
    const startDate = `${year}-${monthNum.padStart(2, "0")}-01`;
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0).toISOString().split("T")[0];
    const { data: incomeData, error: incomeError } = await this.supabase.from("incomes").select("amount").eq("user_id", userId).gte("date", startDate).lte("date", endDate);
    if (incomeError) {
      throw new Error(`Błąd podczas pobierania wpływów: ${incomeError.message}`);
    }
    const totalIncome = incomeData?.reduce((sum, income) => sum + income.amount, 0) || 0;
    const { data: expensesData, error: expensesError } = await this.supabase.from("expenses").select(
      `
        amount,
        categories!inner (
          name
        )
      `
    ).eq("user_id", userId).gte("date", startDate).lte("date", endDate);
    if (expensesError) {
      throw new Error(`Błąd podczas pobierania wydatków: ${expensesError.message}`);
    }
    const totalExpenses = expensesData?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
    const remaining = totalIncome - totalExpenses;
    const categoryMap = /* @__PURE__ */ new Map();
    expensesData?.forEach((expense) => {
      const categoryName = expense.categories.name;
      const currentAmount = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, currentAmount + expense.amount);
    });
    let categoryBreakdown = [];
    if (totalExpenses > 0) {
      categoryBreakdown = Array.from(categoryMap.entries()).map(([categoryName, amount]) => ({
        category_name: categoryName,
        amount,
        percentage: Math.round(amount / totalExpenses * 100 * 100) / 100
        // zaokrąglenie do 2 miejsc po przecinku
      })).sort((a, b) => b.amount - a.amount);
    } else {
      categoryBreakdown = Array.from(categoryMap.entries()).map(([categoryName, amount]) => ({
        category_name: categoryName,
        amount,
        percentage: 0
      })).sort((a, b) => a.category_name.localeCompare(b.category_name));
    }
    return {
      total_income: totalIncome,
      total_expenses: totalExpenses,
      remaining,
      category_breakdown: categoryBreakdown
    };
  }
}

const GET = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const url = new URL(context.request.url);
    const queryParams = url.searchParams;
    const validation = validateGetMonthlyBudgetQuery(queryParams);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const query = sanitizeGetMonthlyBudgetQuery(queryParams);
    const budgetService = new BudgetService(context.locals.supabase);
    const monthlyBudget = await budgetService.getMonthlyBudget(user.id, query.month);
    return new Response(JSON.stringify(monthlyBudget), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas pobierania miesięcznego budżetu:", error);
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania miesięcznego budżetu" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
const prerender = false;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { useEffect, useState } from "react";
import type { ExpenseDTO, GoalDTO, IncomeDTO, MonthlyBudgetDTO, PaginationDTO } from "../../types";

interface TransactionVM {
  id: string;
  type: "expense" | "income";
  amount: number;
  date: string;
  description?: string;
  category_name?: string;
  source?: string;
  created_at: string;
}

interface AlertVM {
  id: string;
  type: "warning" | "info";
  message: string;
  dismissible: boolean;
}

interface TrendsVM {
  month: string;
  income: number;
  expenses: number;
  remaining: number;
}

interface UseDashboardDataReturn {
  budgetData: MonthlyBudgetDTO | null;
  goalsData: GoalDTO[];
  transactions: TransactionVM[];
  alerts: AlertVM[];
  trendsData: TrendsVM[];
  loading: boolean;
  error: string | null;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [budgetData, setBudgetData] = useState<MonthlyBudgetDTO | null>(null);
  const [goalsData, setGoalsData] = useState<GoalDTO[]>([]);
  const [transactions, setTransactions] = useState<TransactionVM[]>([]);
  const [alerts, setAlerts] = useState<AlertVM[]>([]);
  const [trendsData, setTrendsData] = useState<TrendsVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        // Fetch all data in parallel with timeout
        const fetchPromises = [
          fetch(`/api/budget/monthly?month=${currentMonth}`, {
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
          }),
          fetch("/api/goals?page=1&limit=3&sort=created_at DESC", {
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
          }),
          fetch("/api/expenses?page=1&limit=10&sort=date DESC", {
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
          }),
          fetch("/api/incomes?page=1&limit=10&sort=date DESC", {
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
          }),
        ];

        const [budgetResponse, goalsResponse, expensesResponse, incomesResponse] = await Promise.all(fetchPromises);

        clearTimeout(timeoutId);

        // Handle budget data
        if (budgetResponse.ok) {
          const budget: MonthlyBudgetDTO = await budgetResponse.json();
          setBudgetData(budget);
        } else if (budgetResponse.status === 401) {
          // Redirect to login on unauthorized
          window.location.href = "/login";
          return;
        } else {
          console.warn("Budget API returned status:", budgetResponse.status);
          // Don't throw error, just log warning and continue
          setBudgetData(null);
        }

        // Handle goals data
        if (goalsResponse.ok) {
          const goalsResult: { data: GoalDTO[]; pagination: PaginationDTO } = await goalsResponse.json();
          setGoalsData(goalsResult.data);
        } else {
          console.warn("Goals API returned status:", goalsResponse.status);
          setGoalsData([]);
        }

        // Handle expenses and incomes
        let expenses: ExpenseDTO[] = [];
        let incomes: IncomeDTO[] = [];

        if (expensesResponse.ok) {
          const expensesResult: { data: ExpenseDTO[]; pagination: PaginationDTO } = await expensesResponse.json();
          expenses = expensesResult.data;
        } else {
          console.warn("Expenses API returned status:", expensesResponse.status);
        }

        if (incomesResponse.ok) {
          const incomesResult: { data: IncomeDTO[]; pagination: PaginationDTO } = await incomesResponse.json();
          incomes = incomesResult.data;
        } else {
          console.warn("Incomes API returned status:", incomesResponse.status);
        }

        // Combine and sort transactions
        const combinedTransactions: TransactionVM[] = [
          ...expenses.map((expense) => ({
            id: expense.id,
            type: "expense" as const,
            amount: expense.amount,
            date: expense.date,
            description: expense.description,
            category_name: expense.category_name,
            created_at: expense.created_at,
          })),
          ...incomes.map((income) => ({
            id: income.id,
            type: "income" as const,
            amount: income.amount,
            date: income.date,
            description: income.description,
            source: income.source,
            created_at: income.created_at,
          })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setTransactions(combinedTransactions);

        // Generate alerts based on data
        const newAlerts: AlertVM[] = [];

        if (budgetData && budgetData.remaining < 0) {
          newAlerts.push({
            id: "negative-balance",
            type: "warning",
            message: `Twój budżet jest na minusie: ${Math.abs(budgetData.remaining).toFixed(2)} zł`,
            dismissible: false,
          });
        }

        // Check if we're approaching month end
        const now = new Date();
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const daysLeft = Math.ceil((lastDayOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysLeft <= 7 && budgetData && budgetData.remaining < 0) {
          newAlerts.push({
            id: "month-end-warning",
            type: "warning",
            message: `Zostało ${daysLeft} dni do końca miesiąca, a Twój budżet jest na minusie.`,
            dismissible: true,
          });
        }

        setAlerts(newAlerts);

        // Generate sample trends data (6 months)
        const currentDate = new Date();
        const trends: TrendsVM[] = [];

        for (let i = 5; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const monthStr = date.toISOString().slice(0, 7);

          // Generate sample data with some variation
          const baseIncome = 5000 + Math.random() * 2000;
          const baseExpenses = 3500 + Math.random() * 1500;
          const baseRemaining = baseIncome - baseExpenses;

          trends.push({
            month: monthStr,
            income: Math.round(baseIncome),
            expenses: Math.round(baseExpenses),
            remaining: Math.round(baseRemaining),
          });
        }

        setTrendsData(trends);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            setError("Przekroczono limit czasu ładowania danych");
          } else {
            setError(err.message);
          }
        } else {
          setError("Wystąpił błąd podczas ładowania danych");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    budgetData,
    goalsData,
    transactions,
    alerts,
    trendsData,
    loading,
    error,
  };
};

import { useCallback, useState } from "react";
import type {
  CreateExpenseCommand,
  ExpenseDTO,
  GetExpensesQuery,
  PaginationDTO,
  UpdateExpenseCommand,
} from "../../types";

interface UseExpensesApiReturn {
  // Data
  expenses: ExpenseDTO[];
  pagination: PaginationDTO | null;

  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;

  // Error
  error: string | null;

  // Actions
  fetchExpenses: (query: GetExpensesQuery) => Promise<void>;
  createExpense: (data: CreateExpenseCommand) => Promise<ExpenseDTO>;
  updateExpense: (id: string, data: UpdateExpenseCommand) => Promise<ExpenseDTO>;
  deleteExpense: (id: string) => Promise<void>;

  // Utils
  clearError: () => void;
}

export const useExpensesApi = (): UseExpensesApiReturn => {
  const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
  const [pagination, setPagination] = useState<PaginationDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((err: unknown, defaultMessage: string) => {
    console.error("API Error:", err);
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        setError("Przekroczono limit czasu żądania");
      } else {
        setError(err.message);
      }
    } else {
      setError(defaultMessage);
    }
  }, []);

  const fetchExpenses = useCallback(
    async (query: GetExpensesQuery) => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: query.page.toString(),
          limit: query.limit.toString(),
          sort: query.sort,
          ...(query.month && { month: query.month }),
          ...(query.category_id && { category_id: query.category_id }),
        });

        const response = await fetch(`/api/expenses?${params}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to login on unauthorized
            window.location.href = "/login";
            return;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result: { data: ExpenseDTO[]; pagination: PaginationDTO } = await response.json();
        setExpenses(result.data);
        setPagination(result.pagination);
      } catch (err) {
        handleApiError(err, "Błąd podczas pobierania wydatków");
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError]
  );

  const createExpense = useCallback(
    async (data: CreateExpenseCommand): Promise<ExpenseDTO> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            throw new Error("Brak autoryzacji");
          }
          if (response.status === 422) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Błąd walidacji danych");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const newExpense: ExpenseDTO = await response.json();
        return newExpense;
      } catch (err) {
        handleApiError(err, "Błąd podczas tworzenia wydatku");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError]
  );

  const updateExpense = useCallback(
    async (id: string, data: UpdateExpenseCommand): Promise<ExpenseDTO> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch(`/api/expenses/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            throw new Error("Brak autoryzacji");
          }
          if (response.status === 404) {
            throw new Error("Wydatek nie został znaleziony");
          }
          if (response.status === 422) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Błąd walidacji danych");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const updatedExpense: ExpenseDTO = await response.json();
        return updatedExpense;
      } catch (err) {
        handleApiError(err, "Błąd podczas aktualizacji wydatku");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError]
  );

  const deleteExpense = useCallback(
    async (id: string): Promise<void> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch(`/api/expenses/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            throw new Error("Brak autoryzacji");
          }
          if (response.status === 404) {
            throw new Error("Wydatek nie został znaleziony");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Success - optionally refresh data if we have current query
        if (expenses.length > 0) {
          // This would typically trigger a refetch, but we'll handle this in the component
        }
      } catch (err) {
        handleApiError(err, "Błąd podczas usuwania wydatku");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError, expenses]
  );

  return {
    expenses,
    pagination,
    isLoading,
    isSubmitting,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    clearError,
  };
};

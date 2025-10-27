import { useCallback, useState } from "react";
import type {
  CreateIncomeCommand,
  IncomeDTO,
  IncomeFormData,
  IncomesQuery,
  IncomesTableData,
  UpdateIncomeCommand,
} from "../../types";

interface UseIncomesApiReturn {
  // Data
  incomesData: IncomesTableData | null;

  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;

  // Error
  error: string | null;

  // Actions
  fetchIncomes: (query: IncomesQuery) => Promise<void>;
  createIncome: (data: IncomeFormData) => Promise<IncomeDTO>;
  updateIncome: (id: string, data: IncomeFormData) => Promise<IncomeDTO>;
  deleteIncome: (id: string) => Promise<void>;

  // Utils
  clearError: () => void;
}

export const useIncomesApi = (): UseIncomesApiReturn => {
  const [incomesData, setIncomesData] = useState<IncomesTableData | null>(null);
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

  const fetchIncomes = useCallback(
    async (query: IncomesQuery) => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: query.page.toString(),
          limit: query.limit.toString(),
          sort: query.sort,
          ...(query.month && { month: query.month }),
        });

        const response = await fetch(`/api/incomes?${params}`, {
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

        const result: { data: IncomeDTO[]; pagination: IncomesTableData["pagination"] } = await response.json();
        setIncomesData({
          incomes: result.data,
          pagination: result.pagination,
        });
      } catch (err) {
        handleApiError(err, "Błąd podczas pobierania wpływów");
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError]
  );

  const createIncome = useCallback(
    async (data: IncomeFormData): Promise<IncomeDTO> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const command: CreateIncomeCommand = {
          amount: data.amount,
          date: data.date,
          description: data.description,
          source: data.source,
        };

        const response = await fetch("/api/incomes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(command),
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

        const newIncome: IncomeDTO = await response.json();
        return newIncome;
      } catch (err) {
        handleApiError(err, "Błąd podczas tworzenia wpływu");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError]
  );

  const updateIncome = useCallback(
    async (id: string, data: IncomeFormData): Promise<IncomeDTO> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const command: UpdateIncomeCommand = {
          amount: data.amount,
          date: data.date,
          description: data.description,
          source: data.source,
        };

        const response = await fetch(`/api/incomes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(command),
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            throw new Error("Brak autoryzacji");
          }
          if (response.status === 404) {
            throw new Error("Wpływ nie został znaleziony");
          }
          if (response.status === 422) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Błąd walidacji danych");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const updatedIncome: IncomeDTO = await response.json();
        return updatedIncome;
      } catch (err) {
        handleApiError(err, "Błąd podczas aktualizacji wpływu");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError]
  );

  const deleteIncome = useCallback(
    async (id: string): Promise<void> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch(`/api/incomes/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            throw new Error("Brak autoryzacji");
          }
          if (response.status === 404) {
            throw new Error("Wpływ nie został znaleziony");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Success - optionally refresh data if we have current query
        if (incomesData) {
          // This would typically trigger a refetch, but we'll handle this in the component
        }
      } catch (err) {
        handleApiError(err, "Błąd podczas usuwania wpływu");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError, incomesData]
  );

  return {
    incomesData,
    isLoading,
    isSubmitting,
    error,
    fetchIncomes,
    createIncome,
    updateIncome,
    deleteIncome,
    clearError,
  };
};

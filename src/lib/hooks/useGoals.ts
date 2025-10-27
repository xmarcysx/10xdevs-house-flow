import { useCallback, useState } from "react";
import type { CreateGoalCommand, GetGoalsQuery, GoalDTO, PaginationDTO, UpdateGoalCommand } from "../../types";

interface GoalViewModel extends GoalDTO {
  progress_percentage: number;
  remaining_amount: number;
  predicted_completion_date?: string;
}

interface GoalsListViewModel {
  goals: GoalViewModel[];
  pagination: PaginationDTO;
}

interface UseGoalsReturn {
  // Data
  goals: GoalViewModel[];
  pagination: PaginationDTO | null;

  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;

  // Error
  error: string | null;

  // Actions
  fetchGoals: (query: GetGoalsQuery) => Promise<void>;
  createGoal: (data: CreateGoalCommand) => Promise<GoalDTO>;
  updateGoal: (id: string, data: UpdateGoalCommand) => Promise<GoalDTO>;
  deleteGoal: (id: string) => Promise<void>;

  // Utils
  clearError: () => void;
}

// Helper function to calculate progress percentage and remaining amount
const calculateGoalProgress = (goal: GoalDTO): GoalViewModel => {
  const progress_percentage = goal.target_amount > 0 ? Math.round((goal.current_amount / goal.target_amount) * 100) : 0;

  const remaining_amount = goal.target_amount - goal.current_amount;

  return {
    ...goal,
    progress_percentage,
    remaining_amount,
    // TODO: Implement prediction calculation when we have contribution history
    predicted_completion_date: undefined,
  };
};

export const useGoals = (): UseGoalsReturn => {
  const [goals, setGoals] = useState<GoalViewModel[]>([]);
  const [pagination, setPagination] = useState<PaginationDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((err: unknown, defaultMessage: string) => {
    console.error("Goals API Error:", err);
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

  const fetchGoals = useCallback(
    async (query: GetGoalsQuery) => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: query.page.toString(),
          limit: query.limit.toString(),
          sort: query.sort,
          ...(query.month && { month: query.month }),
        });

        const response = await fetch(`/api/goals?${params}`, {
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

        const result: { data: GoalDTO[]; pagination: PaginationDTO } = await response.json();

        // Transform goals to include progress calculations
        const goalsWithProgress = result.data.map(calculateGoalProgress);

        setGoals(goalsWithProgress);
        setPagination(result.pagination);
      } catch (err) {
        handleApiError(err, "Błąd podczas pobierania celów");
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError]
  );

  const createGoal = useCallback(
    async (data: CreateGoalCommand): Promise<GoalDTO> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch("/api/goals", {
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

        const newGoal: GoalDTO = await response.json();
        return newGoal;
      } catch (err) {
        handleApiError(err, "Błąd podczas tworzenia celu");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError]
  );

  const updateGoal = useCallback(
    async (id: string, data: UpdateGoalCommand): Promise<GoalDTO> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch(`/api/goals/${id}`, {
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
            throw new Error("Cel nie został znaleziony");
          }
          if (response.status === 422) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Błąd walidacji danych");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const updatedGoal: GoalDTO = await response.json();
        return updatedGoal;
      } catch (err) {
        handleApiError(err, "Błąd podczas aktualizacji celu");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError]
  );

  const deleteGoal = useCallback(
    async (id: string): Promise<void> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch(`/api/goals/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            throw new Error("Brak autoryzacji");
          }
          if (response.status === 404) {
            throw new Error("Cel nie został znaleziony");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Success - optionally refresh data if we have current query
        if (goals.length > 0) {
          // This would typically trigger a refetch, but we'll handle this in the component
        }
      } catch (err) {
        handleApiError(err, "Błąd podczas usuwania celu");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError, goals]
  );

  return {
    goals,
    pagination,
    isLoading,
    isSubmitting,
    error,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    clearError,
  };
};

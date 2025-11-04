import { useCallback, useState } from "react";
import type { GoalContributionDTO, GoalDTO, GoalWithContributionsDTO } from "../../types";

interface UseGoalReturn {
  // Data
  goal: GoalDTO | null;

  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;

  // Error
  error: string | null;

  // Actions
  fetchGoal: (goalId: string) => Promise<void>;

  // Utils
  clearError: () => void;
}

export const useGoal = (): UseGoalReturn => {
  const [goal, setGoal] = useState<GoalDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((err: unknown, defaultMessage: string) => {
    console.error("Goal API Error:", err);
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

  const fetchGoal = useCallback(
    async (goalId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/goals/${goalId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to login on unauthorized
            window.location.href = "/login";
            return;
          }
          if (response.status === 404) {
            throw new Error("Cel nie został znaleziony");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const goal: GoalDTO = await response.json();
        setGoal(goal);
      } catch (err) {
        handleApiError(err, "Błąd podczas pobierania celu");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError]
  );

  return {
    goal,
    isLoading,
    isSubmitting,
    error,
    fetchGoal,
    clearError,
  };
};

interface UseGoalWithContributionsReturn {
  // Data
  goal: GoalDTO | null;
  contributions: GoalContributionDTO[];

  // Loading states
  isLoading: boolean;

  // Error
  error: string | null;

  // Actions
  fetchGoalWithContributions: (goalId: string) => Promise<void>;

  // Utils
  clearError: () => void;
}

export const useGoalWithContributions = (): UseGoalWithContributionsReturn => {
  const [goal, setGoal] = useState<GoalDTO | null>(null);
  const [contributions, setContributions] = useState<GoalContributionDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((err: unknown, defaultMessage: string) => {
    console.error("Goal with contributions API Error:", err);
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

  const fetchGoalWithContributions = useCallback(
    async (goalId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/goals/${goalId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to login on unauthorized
            window.location.href = "/login";
            return;
          }
          if (response.status === 404) {
            throw new Error("Cel nie został znaleziony");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result: GoalWithContributionsDTO = await response.json();

        // Rozdziel dane celu i wpłat
        const { contributions: goalContributions, ...goalData } = result;
        setGoal(goalData);
        setContributions(goalContributions);
      } catch (err) {
        handleApiError(err, "Błąd podczas pobierania celu i wpłat");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError]
  );

  return {
    goal,
    contributions,
    isLoading,
    error,
    fetchGoalWithContributions,
    clearError,
  };
};

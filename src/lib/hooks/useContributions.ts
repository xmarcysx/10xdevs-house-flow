import { useCallback, useState } from "react";
import type {
  CreateGoalContributionCommand,
  GoalContributionDTO,
  PaginationDTO,
  UpdateGoalContributionCommand,
} from "../../types";

interface ContributionsListVM {
  data: GoalContributionDTO[];
  pagination: PaginationDTO;
}

interface UseContributionsReturn {
  // Data
  contributions: GoalContributionDTO[];
  pagination: PaginationDTO | null;

  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;

  // Error
  error: string | null;

  // Actions
  fetchContributions: (goalId: string, query: { page: number; limit: number; sort: string }) => Promise<void>;
  createContribution: (goalId: string, data: CreateGoalContributionCommand) => Promise<GoalContributionDTO>;
  updateContribution: (
    goalId: string,
    contributionId: string,
    data: UpdateGoalContributionCommand
  ) => Promise<GoalContributionDTO>;
  deleteContribution: (goalId: string, contributionId: string) => Promise<void>;

  // Utils
  clearError: () => void;
}

export const useContributions = (): UseContributionsReturn => {
  const [contributions, setContributions] = useState<GoalContributionDTO[]>([]);
  const [pagination, setPagination] = useState<PaginationDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((err: unknown, defaultMessage: string) => {
    console.error("Contributions API Error:", err);
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

  const fetchContributions = useCallback(
    async (goalId: string, query: { page: number; limit: number; sort: string }) => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: query.page.toString(),
          limit: query.limit.toString(),
          sort: query.sort,
        });

        const response = await fetch(`/api/goals/${goalId}/contributions?${params}`, {
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
            throw new Error("Cel nie istnieje lub nie masz dostępu");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result: ContributionsListVM = await response.json();

        setContributions(result.data);
        setPagination(result.pagination);
      } catch (err) {
        handleApiError(err, "Błąd podczas pobierania wpłat");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError]
  );

  const createContribution = useCallback(
    async (goalId: string, data: CreateGoalContributionCommand): Promise<GoalContributionDTO> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch(`/api/goals/${goalId}/contributions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            throw new Error("Brak autoryzacji");
          }
          if (response.status === 404) {
            throw new Error("Cel nie istnieje lub nie masz dostępu");
          }
          if (response.status === 422) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Błąd walidacji danych");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const newContribution: GoalContributionDTO = await response.json();
        return newContribution;
      } catch (err) {
        handleApiError(err, "Błąd podczas tworzenia wpłaty");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError]
  );

  const updateContribution = useCallback(
    async (
      goalId: string,
      contributionId: string,
      data: UpdateGoalContributionCommand
    ): Promise<GoalContributionDTO> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch(`/api/goals/${goalId}/contributions/${contributionId}`, {
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
            throw new Error("Wpłata nie istnieje lub nie masz dostępu");
          }
          if (response.status === 422) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Błąd walidacji danych");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const updatedContribution: GoalContributionDTO = await response.json();
        return updatedContribution;
      } catch (err) {
        handleApiError(err, "Błąd podczas aktualizacji wpłaty");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError]
  );

  const deleteContribution = useCallback(
    async (goalId: string, contributionId: string): Promise<void> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch(`/api/goals/${goalId}/contributions/${contributionId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            throw new Error("Brak autoryzacji");
          }
          if (response.status === 404) {
            throw new Error("Wpłata nie istnieje lub nie masz dostępu");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        handleApiError(err, "Błąd podczas usuwania wpłaty");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError]
  );

  return {
    contributions,
    pagination,
    isLoading,
    isSubmitting,
    error,
    fetchContributions,
    createContribution,
    updateContribution,
    deleteContribution,
    clearError,
  };
};

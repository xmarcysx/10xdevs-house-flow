import { useEffect, useState } from "react";
import type { GoalReportItemDTO, GoalsReportDTO } from "../../types";

interface GoalCardViewModel extends GoalReportItemDTO {
  formatted_percentage: string;
  formatted_remaining_amount: string;
  formatted_predicted_date?: string;
}

interface UseGoalsReportReturn {
  isLoading: boolean;
  error: string | null;
  goals: GoalCardViewModel[];
  refetch: () => void;
}

export function useGoalsReport(): UseGoalsReportReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [goals, setGoals] = useState<GoalCardViewModel[]>([]);

  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(2)} PLN`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const transformGoalData = (goal: GoalReportItemDTO): GoalCardViewModel => ({
    ...goal,
    formatted_percentage: `${Math.round(goal.progress_percentage)}%`,
    formatted_remaining_amount: formatCurrency(goal.remaining_amount),
    formatted_predicted_date: goal.predicted_completion_date ? formatDate(goal.predicted_completion_date) : undefined,
  });

  const fetchGoalsReport = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/reports/goals");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Brak autoryzacji. Zaloguj się ponownie.");
        } else {
          throw new Error("Wystąpił błąd podczas ładowania danych. Spróbuj ponownie.");
        }
      }

      const data: GoalsReportDTO = await response.json();

      if (!data.goals || !Array.isArray(data.goals)) {
        throw new Error("Nieprawidłowa struktura danych odpowiedzi");
      }

      const transformedGoals = data.goals.map(transformGoalData);
      setGoals(transformedGoals);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas ładowania danych";
      setError(errorMessage);
      console.error("Error fetching goals report:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalsReport();
  }, []);

  return {
    isLoading,
    error,
    goals,
    refetch: fetchGoalsReport,
  };
}

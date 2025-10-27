// Wykres liniowy progresu celu oszczędnościowego z lazy-loading
import React, { Suspense } from "react";
import type { GoalContributionDTO } from "../../types";

// Lazy load komponentu wykresu
const LineChartComponent = React.lazy(() => import("./ProgressChartComponent"));

interface ProgressDataPoint {
  date: string;
  amount: number;
  cumulativeAmount: number;
  targetAmount: number;
}

interface ProgressChartProps {
  contributions: GoalContributionDTO[];
  targetAmount: number;
  currentAmount: number;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ contributions, targetAmount, currentAmount }) => {
  // Funkcja do przygotowania danych dla wykresu
  const prepareChartData = (): ProgressDataPoint[] => {
    if (!contributions || contributions.length === 0) {
      return [];
    }

    // Sortuj wpłaty po dacie
    const sortedContributions = [...contributions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Przygotuj dane z kumulatywną sumą
    let cumulativeAmount = 0;
    const chartData: ProgressDataPoint[] = [];

    // Dodaj punkt początkowy (jeśli nie ma wpłat z pierwszego dnia)
    if (sortedContributions.length > 0) {
      const firstDate = new Date(sortedContributions[0].date);
      firstDate.setDate(firstDate.getDate() - 1); // Dzień przed pierwszą wpłatą
      chartData.push({
        date: firstDate.toISOString().split("T")[0],
        amount: 0,
        cumulativeAmount: 0,
        targetAmount,
      });
    }

    // Dodaj punkty dla każdej wpłaty
    sortedContributions.forEach((contribution) => {
      cumulativeAmount += contribution.amount;
      chartData.push({
        date: contribution.date,
        amount: contribution.amount,
        cumulativeAmount,
        targetAmount,
      });
    });

    // Dodaj punkt końcowy z aktualną kwotą
    if (sortedContributions.length > 0) {
      const lastDate = new Date();
      const lastContributionDate = sortedContributions[sortedContributions.length - 1].date;

      if (lastDate.toISOString().split("T")[0] !== lastContributionDate) {
        chartData.push({
          date: lastDate.toISOString().split("T")[0],
          amount: 0,
          cumulativeAmount: currentAmount,
          targetAmount,
        });
      }
    }

    return chartData;
  };

  // Funkcja do obliczenia przewidywanego czasu osiągnięcia celu
  const calculatePredictedCompletionDate = (): string | null => {
    if (currentAmount >= targetAmount) {
      return null; // Cel już osiągnięty
    }

    if (contributions.length < 2) {
      return null; // Za mało danych do predykcji
    }

    // Oblicz średnią wpłatę dzienną na podstawie ostatnich 30 dni
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentContributions = contributions.filter((c) => new Date(c.date) >= thirtyDaysAgo);

    if (recentContributions.length === 0) {
      return null;
    }

    const totalRecentAmount = recentContributions.reduce((sum, c) => sum + c.amount, 0);
    const averageDailyAmount = totalRecentAmount / 30;

    if (averageDailyAmount <= 0) {
      return null;
    }

    const remainingAmount = targetAmount - currentAmount;
    const daysNeeded = Math.ceil(remainingAmount / averageDailyAmount);

    const predictedDate = new Date();
    predictedDate.setDate(predictedDate.getDate() + daysNeeded);

    return predictedDate.toISOString().split("T")[0];
  };

  const chartData = prepareChartData();
  const predictedDate = calculatePredictedCompletionDate();

  // Jeśli brak danych, pokaż komunikat
  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Brak danych wykresu</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Dodaj wpłaty, aby zobaczyć progres celu na wykresie
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progres celu</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Historia wpłat i przewidywany termin osiągnięcia celu
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Ładowanie wykresu...</span>
          </div>
        }
      >
        <LineChartComponent data={chartData} targetAmount={targetAmount} predictedDate={predictedDate} />
      </Suspense>
    </div>
  );
};

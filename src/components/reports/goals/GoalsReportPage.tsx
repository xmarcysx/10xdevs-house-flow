import React from "react";
import { useGoalsReport } from "../../../lib/hooks/useGoalsReport";
import ErrorState from "./ErrorState";
import { GoalCard } from "./GoalCard";
import LoadingState from "./LoadingState";

const GoalsReportPage: React.FC = () => {
  const { isLoading, error, goals, refetch } = useGoalsReport();

  // Stan ładowania
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <LoadingState />
        </div>
      </div>
    );
  }

  // Stan błędu
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ErrorState error={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Nagłówek */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Raport celów</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Przegląd postępów w realizacji wszystkich celów oszczędnościowych
          </p>
        </div>

        {/* Lista celów */}
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          /* Brak celów */
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Brak celów</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Nie masz jeszcze żadnych celów oszczędnościowych.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsReportPage;

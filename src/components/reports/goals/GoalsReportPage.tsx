import React from "react";
import { useGoalsReport } from "../../../lib/hooks/useGoalsReport";
import ErrorState from "./ErrorState";
import { GoalCard } from "./GoalCard";
import GoalsReportLayout from "./GoalsReportLayout";
import LoadingComponent from "../../LoadingComponent";

const GoalsReportPage: React.FC = () => {
  const { isLoading, error, goals, refetch } = useGoalsReport();

  // Stan ładowania
  if (isLoading) {
    return (
      <GoalsReportLayout>
        <LoadingComponent message="Ładowanie raportu celów..." size="md" />
      </GoalsReportLayout>
    );
  }

  // Stan błędu
  if (error) {
    return (
      <GoalsReportLayout>
        <ErrorState error={error} onRetry={refetch} />
      </GoalsReportLayout>
    );
  }

  return (
    <GoalsReportLayout>
      <div className="space-y-6">
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
    </GoalsReportLayout>
  );
};

export default GoalsReportPage;

// Komponent listy celów z kartami i paginacją
import React from "react";
import type { GoalDTO, PaginationDTO } from "../../types";
import { Pagination } from "../incomes/Pagination";
import { Button } from "../ui/button";
import { GoalCard } from "./GoalCard";
import LoadingComponent from "../LoadingComponent";

interface GoalViewModel extends GoalDTO {
  progress_percentage: number;
  remaining_amount: number;
  predicted_completion_date?: string;
}

interface GoalsListProps {
  goals: GoalViewModel[];
  pagination: PaginationDTO | null;
  loading: boolean;
  onAdd: () => void;
  onAddContribution: (goalId: string) => void;
  onEdit: (goal: GoalDTO) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}

export const GoalsList: React.FC<GoalsListProps> = ({
  goals,
  pagination,
  loading,
  onAdd,
  onAddContribution,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  // Stan ładowania
  if (loading) {
    return <LoadingComponent message="Ładowanie celów..." size="sm" />;
  }

  // Brak danych
  if (!goals || goals.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
        <div className="p-8 text-center">
          <svg className="mx-auto h-16 w-16 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Brak celów oszczędnościowych</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            Rozpocznij swoją drogę do finansowej niezależności - dodaj pierwszy cel oszczędnościowy.
          </p>
          <Button
            onClick={onAdd}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj pierwszy cel
          </Button>
        </div>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="space-y-6">
      {/* Nagłówek z przyciskiem dodania */}
      <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Lista celów</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Zarządzaj swoimi celami oszczędnościowymi - edytuj lub usuń istniejące pozycje
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => onAdd()}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Dodaj cel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Siatka kart celów */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddContribution={onAddContribution}
          />
        ))}
      </div>

      {/* Paginacja */}
      {pagination && pagination.total > pagination.limit && (
        <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
          <div className="px-4 py-4 flex items-center justify-between sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                variant="outline"
                className="px-6 py-3 border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:border-indigo-400 font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                Poprzednia
              </Button>
              <Button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                variant="outline"
                className="px-6 py-3 border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:border-indigo-400 font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                Następna
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Wyświetlanie <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> do{" "}
                  <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>{" "}
                  z <span className="font-medium">{pagination.total}</span> wyników
                </p>
              </div>
              <div>
                <Pagination pagination={pagination} onPageChange={handlePageChange} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

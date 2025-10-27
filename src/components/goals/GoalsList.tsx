// Komponent listy celów z kartami i paginacją
import React from "react";
import type { GoalDTO, PaginationDTO } from "../../types";
import { Pagination } from "../incomes/Pagination";
import { Button } from "../ui/button";
import { GoalCard } from "./GoalCard";

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
  onEdit: (goal: GoalDTO) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}

export const GoalsList: React.FC<GoalsListProps> = ({
  goals,
  pagination,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  // Stan ładowania
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Ładowanie celów...</p>
        </div>
      </div>
    );
  }

  // Brak danych
  if (!goals || goals.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Brak celów oszczędnościowych</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Nie masz jeszcze żadnych celów oszczędnościowych. Rozpocznij od dodania pierwszego celu.
          </p>
          <div className="mt-6">
            <Button onClick={onAdd} className="inline-flex items-center px-4 py-2">
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj pierwszy cel
            </Button>
          </div>
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
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Lista celów</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Zarządzaj swoimi celami oszczędnościowymi - edytuj lub usuń istniejące pozycje
              </p>
            </div>
            <Button onClick={onAdd} className="inline-flex items-center">
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj cel
            </Button>
          </div>
        </div>
      </div>

      {/* Siatka kart celów */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>

      {/* Paginacja */}
      {pagination && pagination.total > pagination.limit && (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6">
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </div>
        </div>
      )}
    </div>
  );
};

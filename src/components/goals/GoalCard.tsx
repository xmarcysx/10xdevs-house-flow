// Komponent karty pojedynczego celu
import React from "react";
import type { GoalDTO } from "../../types";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PredictionBadge } from "./PredictionBadge";
import { ProgressBar } from "./ProgressBar";

interface GoalViewModel extends GoalDTO {
  progress_percentage: number;
  remaining_amount: number;
  predicted_completion_date?: string;
}

interface GoalCardProps {
  goal: GoalViewModel;
  onEdit: (goal: GoalDTO) => void;
  onDelete: (goalId: string) => void;
  onAddContribution: (goalId: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete, onAddContribution }) => {
  const handleEdit = () => {
    onEdit(goal);
  };

  const handleDelete = () => {
    onDelete(goal.id);
  };

  const handleAddContribution = () => {
    onAddContribution(goal.id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount);
  };

  return (
    <Card className="h-full flex flex-col group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20 touch-manipulation">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
          {goal.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Kwoty */}
        <div className="mb-4 space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Zaoszczędzone</span>
            <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
              {formatCurrency(goal.current_amount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Cel</span>
            <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
              {formatCurrency(goal.target_amount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Pozostało</span>
            <span className="text-sm sm:text-base font-medium text-green-600 dark:text-green-400">
              {formatCurrency(goal.remaining_amount)}
            </span>
          </div>
        </div>

        {/* Pasek progresu */}
        <div className="mb-4">
          <ProgressBar progress={goal.progress_percentage} />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Postęp</span>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              {goal.progress_percentage}%
            </span>
          </div>
        </div>

        {/* Badge predykcji */}
        {goal.predicted_completion_date && (
          <div className="mb-4">
            <PredictionBadge predictedDate={goal.predicted_completion_date} />
          </div>
        )}

        {/* Przyciski akcji */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mt-auto">
          <Button
            onClick={handleAddContribution}
            className="justify-center sm:justify-start bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-2 px-3 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 group min-h-[44px] touch-manipulation"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm">Dodaj wpłatę</span>
            </div>
          </Button>
          <Button
            onClick={() => (window.location.href = `/goals/${goal.id}`)}
            className="justify-center sm:justify-start bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-3 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 group min-h-[44px] touch-manipulation"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <span className="text-sm">Szczegóły</span>
            </div>
          </Button>
          <Button
            onClick={handleEdit}
            className="justify-center sm:justify-start bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-3 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 group min-h-[44px] touch-manipulation"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <span className="text-sm">Edytuj</span>
            </div>
          </Button>
          <Button
            onClick={handleDelete}
            className="justify-center sm:justify-start bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-2 px-3 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 group min-h-[44px] touch-manipulation"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <span className="text-sm">Usuń</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

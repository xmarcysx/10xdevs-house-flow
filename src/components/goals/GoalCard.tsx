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
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(goal);
  };

  const handleDelete = () => {
    onDelete(goal.id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">{goal.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Kwoty */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Zaoszczędzone</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(goal.current_amount)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Cel</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(goal.target_amount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Pozostało</span>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {formatCurrency(goal.remaining_amount)}
            </span>
          </div>
        </div>

        {/* Pasek progresu */}
        <div className="mb-4">
          <ProgressBar progress={goal.progress_percentage} />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Postęp</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{goal.progress_percentage}%</span>
          </div>
        </div>

        {/* Badge predykcji */}
        {goal.predicted_completion_date && (
          <div className="mb-4">
            <PredictionBadge predictedDate={goal.predicted_completion_date} />
          </div>
        )}

        {/* Przyciski akcji */}
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = `/goals/${goal.id}`)}
            className="flex-1"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Szczegóły
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit} className="flex-1">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edytuj
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Usuń
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

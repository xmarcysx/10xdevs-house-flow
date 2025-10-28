import React from "react";
import type { GoalCardViewModel } from "../../../lib/hooks/useGoalsReport";
import { ProgressBar } from "../../goals/ProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface GoalCardProps {
  goal: GoalCardViewModel;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{goal.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Postęp procentowy */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Postęp</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{goal.formatted_percentage}</span>
          </div>
          <ProgressBar progress={parseFloat(goal.formatted_percentage)} />
        </div>

        {/* Kwota pozostała */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Pozostało do celu</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{goal.formatted_remaining_amount}</span>
        </div>

        {/* Przewidywana data ukończenia */}
        {goal.formatted_predicted_date && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Przewidywane ukończenie</span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {goal.formatted_predicted_date}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

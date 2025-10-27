import React from "react";
import type { GoalDTO } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface GoalsSummaryProps {
  goals: GoalDTO[];
}

const GoalItem: React.FC<{ goal: GoalDTO }> = ({ goal }) => {
  const progressPercentage =
    goal.target_amount > 0 ? Math.min((goal.current_amount / goal.target_amount) * 100, 100) : 0;

  const remainingAmount = goal.target_amount - goal.current_amount;
  const isCompleted = goal.current_amount >= goal.target_amount;

  const handleClick = () => {
    // Navigate to goal details page
    window.location.href = `/goals/${goal.id}`;
  };

  return (
    <div
      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm">{goal.name}</h4>
        <span className="text-xs text-gray-500">
          {goal.current_amount.toFixed(2)} / {goal.target_amount.toFixed(2)} zł
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${isCompleted ? "bg-green-500" : "bg-blue-500"}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400">{progressPercentage.toFixed(1)}% ukończone</span>
        {remainingAmount > 0 && <span className="text-gray-500">Pozostało: {remainingAmount.toFixed(2)} zł</span>}
        {isCompleted && <span className="text-green-600 font-medium">Ukończone!</span>}
      </div>
    </div>
  );
};

const GoalsSummary: React.FC<GoalsSummaryProps> = ({ goals }) => {
  const topGoals = goals.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cele oszczędnościowe</CardTitle>
      </CardHeader>
      <CardContent>
        {topGoals.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Brak celów do wyświetlenia</div>
        ) : (
          <div className="space-y-3">
            {topGoals.map((goal) => (
              <GoalItem key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsSummary;

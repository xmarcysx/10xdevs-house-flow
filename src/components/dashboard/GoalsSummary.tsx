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
      className="p-5 bg-gradient-to-r from-white to-green-50/30 dark:from-gray-800 dark:to-green-900/10 border border-green-100 dark:border-green-800 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">{goal.name}</h4>
        <div className="text-right">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {goal.current_amount.toFixed(2)} zł
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 block">
            z {goal.target_amount.toFixed(2)} zł
          </span>
        </div>
      </div>

      <div className="relative mb-3">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isCompleted
                ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md"
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"></div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isCompleted ? "bg-green-500 animate-pulse" : "bg-blue-500"}`}></div>
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {progressPercentage.toFixed(1)}% ukończone
          </span>
        </div>
        {remainingAmount > 0 && (
          <span className="text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
            Pozostało: {remainingAmount.toFixed(2)} zł
          </span>
        )}
        {isCompleted && (
          <span className="text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-lg flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            Ukończone!
          </span>
        )}
      </div>
    </div>
  );
};

const GoalsSummary: React.FC<GoalsSummaryProps> = ({ goals }) => {
  const topGoals = goals.slice(0, 3);

  return (
    <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-orange-900/20 h-100">
      <CardHeader className="pb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Cele oszczędnościowe
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topGoals.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            Brak celów do wyświetlenia
          </div>
        ) : (
          <div className="space-y-4">
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

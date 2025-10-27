// Komponent nagłówka celu z informacją o progresie
import React from "react";
import type { GoalDTO } from "../../types";

interface GoalHeaderProps {
  goal: GoalDTO;
}

export const GoalHeader: React.FC<GoalHeaderProps> = ({ goal }) => {
  // Oblicz progres procentowy
  const progressPercentage =
    goal.target_amount > 0 ? Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100) : 0;

  // Oblicz pozostałą kwotę
  const remainingAmount = Math.max(goal.target_amount - goal.current_amount, 0);

  // Funkcja formatowania kwoty
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount);
  };

  // Funkcja formatowania daty
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Określ kolor paska progresu
  const getProgressColor = () => {
    if (progressPercentage >= 100) return "bg-green-600";
    if (progressPercentage >= 75) return "bg-blue-600";
    if (progressPercentage >= 50) return "bg-yellow-600";
    return "bg-gray-600";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{goal.name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Utworzony {formatDate(goal.created_at)}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{progressPercentage}%</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">ukończone</p>
        </div>
      </div>

      {/* Pasek progresu */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progres</span>
          <span>
            {formatAmount(goal.current_amount)} / {formatAmount(goal.target_amount)}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ease-out ${getProgressColor()}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{formatAmount(goal.current_amount)}</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Aktualna kwota</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{formatAmount(goal.target_amount)}</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Cel</p>
        </div>
        <div className="text-center">
          <div
            className={`text-lg font-semibold ${remainingAmount > 0 ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"}`}
          >
            {formatAmount(remainingAmount)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{remainingAmount > 0 ? "Pozostało" : "Nadwyżka"}</p>
        </div>
      </div>

      {/* Status ukończenia */}
      {goal.current_amount >= goal.target_amount && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-green-600 dark:text-green-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              🎉 Gratulacje! Cel został osiągnięty!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

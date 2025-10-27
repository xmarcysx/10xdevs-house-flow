// Komponent wyświetlający predykcję daty osiągnięcia celu
import React from "react";

interface PredictionBadgeProps {
  predictedDate?: string;
  className?: string;
}

export const PredictionBadge: React.FC<PredictionBadgeProps> = ({ predictedDate, className = "" }) => {
  if (!predictedDate) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 ${className}`}
      title="Przewidywana data osiągnięcia celu na podstawie dotychczasowego tempa oszczędzania"
    >
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {formatDate(predictedDate)}
    </div>
  );
};

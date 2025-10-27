// Komponent wizualnego paska progresu
import React from "react";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = "" }) => {
  // Upewnij się, że progress jest w zakresie 0-100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};

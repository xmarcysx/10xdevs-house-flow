// Wspólny komponent ładowania dla całej aplikacji
import React, { useEffect } from "react";

interface LoadingComponentProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingComponent: React.FC<LoadingComponentProps> = ({
  message = "Ładowanie danych...",
  size = "md",
  className = "",
}) => {
  // Rozmiary spinnera
  const spinnerSizes = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-20 w-20",
  };

  // Rozmiary tekstu
  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  // Dodaj style animacji przy montowaniu komponentu
  useEffect(() => {
    const existingStyle = document.getElementById("loading-animations");
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = "loading-animations";
      style.textContent = `
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
        .text-transparent {
          -webkit-text-fill-color: transparent;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Nie usuwaj stylu, ponieważ może być używany przez inne komponenty
    };
  }, []);

  return (
    <div className={`col-span-full flex items-center justify-center py-20 ${className}`}>
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div
            className={`animate-spin rounded-full ${spinnerSizes[size]} border-4 border-blue-200 dark:border-blue-800`}
          ></div>
          <div
            className={`animate-spin rounded-full ${spinnerSizes[size]} border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 absolute top-0`}
          ></div>
        </div>
        <h3
          className={`font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4 ${textSizes[size]}`}
        >
          {message}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Przygotowujemy Twoje dane finansowe</p>
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-100"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;

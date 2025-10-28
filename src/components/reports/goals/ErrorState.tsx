import React from "react";
import { Button } from "../../ui/button";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Wystąpił błąd</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">{error}</p>
        <div className="mt-6">
          <Button onClick={onRetry} variant="outline">
            Spróbuj ponownie
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;

import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Ładowanie celów...</p>
    </div>
  );
};

export default LoadingState;

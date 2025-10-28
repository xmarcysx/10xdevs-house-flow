import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface ErrorCardProps {
  errorMessage?: string;
  onRetry?: () => void;
}

const ErrorCard: React.FC<ErrorCardProps> = ({
  errorMessage = "Wystąpił krytyczny błąd aplikacji. Spróbuj ponownie lub wróć do dashboardu.",
  onRetry,
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Domyślne zachowanie - odśwież stronę
      window.location.reload();
    }
  };

  const handleGoToDashboard = () => {
    window.location.href = "/";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Błąd serwera</CardTitle>
        </CardHeader>

        <CardContent className="pb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{errorMessage}</p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-0">
          <Button onClick={handleRetry} className="w-full" size="lg">
            Spróbuj ponownie
          </Button>

          <Button onClick={handleGoToDashboard} variant="outline" className="w-full" size="lg">
            Powrót do dashboardu
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorCard;

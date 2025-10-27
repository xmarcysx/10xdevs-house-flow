import { useCallback, useState } from "react";
import type { CategoryDTO } from "../../types";

interface UseCategoriesReturn {
  // Data
  categories: CategoryDTO[];

  // Loading states
  isLoading: boolean;

  // Error
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;

  // Utils
  clearError: () => void;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((err: unknown, defaultMessage: string) => {
    console.error("API Error:", err);
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        setError("Przekroczono limit czasu żądania");
      } else {
        setError(err.message);
      }
    } else {
      setError(defaultMessage);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/categories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login on unauthorized
          window.location.href = "/login";
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: { data: CategoryDTO[]; pagination: any } = await response.json();
      setCategories(result.data);
    } catch (err) {
      handleApiError(err, "Błąd podczas pobierania kategorii");
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    clearError,
  };
};

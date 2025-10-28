import { useCallback, useState } from "react";
import type { CategoryDTO, CreateCategoryCommand, PaginationDTO, UpdateCategoryCommand } from "../../types";

interface UseCategoriesReturn {
  // Data
  categories: CategoryDTO[];
  pagination: PaginationDTO;

  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;

  // Error
  error: string | null;

  // Actions
  fetchCategories: (page?: number, limit?: number) => Promise<void>;
  createCategory: (command: CreateCategoryCommand) => Promise<CategoryDTO>;
  updateCategory: (id: string, command: UpdateCategoryCommand) => Promise<CategoryDTO>;
  deleteCategory: (id: string) => Promise<void>;

  // Utils
  clearError: () => void;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [pagination, setPagination] = useState<PaginationDTO>({ page: 1, limit: 10, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const fetchCategories = useCallback(
    async (page = 1, limit = 10) => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        const response = await fetch(`/api/categories?${params}`, {
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

        const result: { data: CategoryDTO[]; pagination: PaginationDTO } = await response.json();
        setCategories(result.data);
        setPagination(result.pagination);
      } catch (err) {
        handleApiError(err, "Błąd podczas pobierania kategorii");
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError]
  );

  const createCategory = useCallback(
    async (command: CreateCategoryCommand): Promise<CategoryDTO> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(command),
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            throw new Error("Brak autoryzacji");
          }
          const errorData = await response.json().catch(() => ({ message: "Błąd serwera" }));
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const newCategory: CategoryDTO = await response.json();
        return newCategory;
      } catch (err) {
        handleApiError(err, "Błąd podczas tworzenia kategorii");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError]
  );

  const updateCategory = useCallback(
    async (id: string, command: UpdateCategoryCommand): Promise<CategoryDTO> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch(`/api/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(command),
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            throw new Error("Brak autoryzacji");
          }
          const errorData = await response.json().catch(() => ({ message: "Błąd serwera" }));
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const updatedCategory: CategoryDTO = await response.json();
        return updatedCategory;
      } catch (err) {
        handleApiError(err, "Błąd podczas aktualizacji kategorii");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError]
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<void> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            throw new Error("Brak autoryzacji");
          }
          const errorData = await response.json().catch(() => ({ message: "Błąd serwera" }));
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        handleApiError(err, "Błąd podczas usuwania kategorii");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleApiError]
  );

  return {
    categories,
    pagination,
    isLoading,
    isSubmitting,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  };
};

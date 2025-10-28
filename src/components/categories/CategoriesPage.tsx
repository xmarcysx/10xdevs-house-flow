// Główna strona widoku kategorii
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCategories } from "../../lib/hooks/useCategories";
import type { CategoryDTO, CreateCategoryCommand, UpdateCategoryCommand } from "../../types";
import { CategoriesList } from "./CategoriesList";
import { CategoryFormModal } from "./CategoryFormModal";

export const CategoriesPage: React.FC = () => {
  // Stan komponentu
  const [currentPage, setCurrentPage] = useState(1);

  // Hooki API
  const {
    categories,
    pagination,
    isLoading: loading,
    isSubmitting: submitting,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  } = useCategories();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    category?: CategoryDTO;
    serverError?: string;
  }>({
    isOpen: false,
    mode: "create",
  });

  // Efekt do ładowania danych przy zmianie strony
  useEffect(() => {
    fetchCategories(currentPage, 10);
  }, [currentPage, fetchCategories]);

  // Obsługa zmiany strony w paginacji
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Obsługa dodania nowej kategorii
  const handleAddCategory = useCallback(() => {
    setModalState({
      isOpen: true,
      mode: "create",
      serverError: undefined,
    });
  }, []);

  // Obsługa edycji kategorii
  const handleEditCategory = useCallback((category: CategoryDTO) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      category,
      serverError: undefined,
    });
  }, []);

  // Obsługa usunięcia kategorii
  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      try {
        await deleteCategory(categoryId);

        // Sprawdź czy aktualna strona może być pusta po usunięciu
        const currentPageData = categories.filter((cat) => cat.id !== categoryId);
        const shouldResetPage = currentPageData.length === 1 && currentPage > 1;

        const query = {
          page: shouldResetPage ? 1 : currentPage,
          limit: 10,
        };
        await fetchCategories(query.page, query.limit);

        if (shouldResetPage) {
          setCurrentPage(1);
        }

        // Pokaż toast sukcesu
        toast.success("Kategoria została usunięta pomyślnie");
      } catch (err) {
        // Błędy są obsługiwane przez hook
        console.error("Delete error:", err);
      }
    },
    [deleteCategory, categories, currentPage, fetchCategories]
  );

  // Obsługa zamknięcia modala
  const handleCloseModal = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: "create",
      serverError: undefined,
    });
  }, []);

  // Obsługa zatwierdzenia formularza
  const handleSubmitForm = useCallback(
    async (data: CreateCategoryCommand | UpdateCategoryCommand) => {
      try {
        // Wyczyść poprzedni błąd
        setModalState((prev) => ({ ...prev, serverError: undefined }));

        if (modalState.mode === "create") {
          await createCategory(data as CreateCategoryCommand);
          toast.success("Kategoria została dodana pomyślnie");
        } else if (modalState.mode === "edit" && modalState.category?.id) {
          await updateCategory(modalState.category.id, data as UpdateCategoryCommand);
          toast.success("Kategoria została zaktualizowana pomyślnie");
        }

        // Zamknij modal i odśwież dane
        handleCloseModal();
        const query = {
          page: modalState.mode === "create" ? 1 : currentPage,
          limit: 10,
        };
        await fetchCategories(query.page, query.limit);

        if (modalState.mode === "create") {
          setCurrentPage(1);
        }
      } catch (err) {
        // Ustaw błąd w modalu
        let errorMessage = "Wystąpił błąd podczas zapisywania kategorii";
        if (err instanceof Error) {
          if (err.message.includes("już istnieje")) {
            errorMessage = "Kategoria o tej nazwie już istnieje";
          } else {
            errorMessage = err.message;
          }
        }
        setModalState((prev) => ({ ...prev, serverError: errorMessage }));
        console.error("Form submission error:", err);
      }
    },
    [modalState, currentPage, createCategory, updateCategory, fetchCategories, handleCloseModal]
  );

  // Obsługa czyszczenia błędu
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Kategorie</h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
          Zarządzaj swoimi kategoriami wydatków
        </p>
      </div>

      {/* Komunikaty błędów */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={handleClearError}
                className="inline-flex rounded-md bg-red-50 dark:bg-red-900/20 p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                <span className="sr-only">Zamknij</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista kategorii */}
      <CategoriesList
        categories={categories}
        pagination={pagination}
        loading={loading}
        onAdd={handleAddCategory}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        onPageChange={handlePageChange}
      />

      {/* Modal formularza */}
      <CategoryFormModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        category={modalState.category}
        onSave={handleSubmitForm}
        onCancel={handleCloseModal}
        loading={submitting}
        serverError={modalState.serverError}
      />
    </div>
  );
};

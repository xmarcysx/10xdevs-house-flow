// Główna strona widoku wydatków
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCategories } from "../../lib/hooks/useCategories";
import { useExpensesApi } from "../../lib/hooks/useExpensesApi";
import type { CreateExpenseCommand, ExpenseDTO, UpdateExpenseCommand } from "../../types";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { ExpenseForm } from "./ExpenseForm";
import { ExpensesList } from "./ExpensesList";
import { FilterControls } from "./FilterControls";

export const ExpensesPage: React.FC = () => {
  // Stan komponentu
  const [filters, setFilters] = useState<{
    month?: string;
    category_id?: string;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Hooki API
  const {
    expenses,
    pagination,
    isLoading: loading,
    isSubmitting: submitting,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    clearError,
  } = useExpensesApi();

  const { categories, fetchCategories } = useCategories();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    expense?: ExpenseDTO;
  }>({
    isOpen: false,
    mode: "add",
  });

  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean;
    expenseId?: string;
  }>({
    isOpen: false,
  });

  // Efekt do ładowania danych przy zmianie filtrów lub strony
  useEffect(() => {
    const query = {
      page: currentPage,
      limit: 10,
      month: filters.month || undefined,
      category_id: filters.category_id || undefined,
      sort: "date DESC" as const,
    };
    fetchExpenses(query);
  }, [filters, currentPage]);

  // Efekt do ładowania kategorii przy montowaniu komponentu
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Obsługa zmian filtrów
  const handleFiltersChange = useCallback((newFilters: { month?: string; category_id?: string }) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset do pierwszej strony przy zmianie filtrów
  }, []);

  // Obsługa zmiany strony w paginacji
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Obsługa dodania nowego wydatku
  const handleAddExpense = useCallback(() => {
    setModalState({
      isOpen: true,
      mode: "add",
    });
  }, []);

  // Obsługa edycji wydatku
  const handleEditExpense = useCallback((expense: ExpenseDTO) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      expense,
    });
  }, []);

  // Obsługa usunięcia wydatku
  const handleDeleteExpense = useCallback((expenseId: string) => {
    setDeleteDialogState({
      isOpen: true,
      expenseId,
    });
  }, []);

  // Obsługa zamknięcia modala formularza
  const handleCloseModal = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: "add",
    });
  }, []);

  // Obsługa zamknięcia dialogu usunięcia
  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogState({
      isOpen: false,
    });
  }, []);

  // Obsługa zatwierdzenia formularza
  const handleSubmitForm = useCallback(
    async (data: CreateExpenseCommand | UpdateExpenseCommand) => {
      try {
        if (modalState.mode === "add") {
          await createExpense(data as CreateExpenseCommand);
        } else if (modalState.mode === "edit" && modalState.expense?.id) {
          await updateExpense(modalState.expense.id, data as UpdateExpenseCommand);
        }

        // Zamknij modal i odśwież dane
        handleCloseModal();
        const query = {
          page: modalState.mode === "add" ? 1 : currentPage, // Dla nowych wydatków przejdź do pierwszej strony
          limit: 10,
          month: filters.month || undefined,
          category_id: filters.category_id || undefined,
          sort: "date DESC" as const,
        };
        await fetchExpenses(query);

        if (modalState.mode === "add") {
          setCurrentPage(1);
        }

        // Pokaż toast sukcesu
        toast.success(
          modalState.mode === "add" ? "Wydatek został dodany pomyślnie" : "Wydatek został zaktualizowany pomyślnie"
        );
      } catch (err) {
        // Błędy są obsługiwane przez hook
        console.error("Form submission error:", err);
      }
    },
    [modalState, currentPage, filters, createExpense, updateExpense, fetchExpenses]
  );

  // Obsługa potwierdzenia usunięcia
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDialogState.expenseId) return;

    try {
      await deleteExpense(deleteDialogState.expenseId);

      // Zamknij dialog i odśwież dane
      handleCloseDeleteDialog();

      // Sprawdź czy aktualna strona może być pusta po usunięciu
      const currentPageData = expenses.filter((exp) => exp.id !== deleteDialogState.expenseId);
      const shouldResetPage = currentPageData.length === 1 && currentPage > 1;

      const query = {
        page: shouldResetPage ? 1 : currentPage,
        limit: 10,
        month: filters.month || undefined,
        category_id: filters.category_id || undefined,
        sort: "date DESC" as const,
      };
      await fetchExpenses(query);

      if (shouldResetPage) {
        setCurrentPage(1);
      }

      // Pokaż toast sukcesu
      toast.success("Wydatek został usunięty pomyślnie");
    } catch (err) {
      // Błędy są obsługiwane przez hook
      console.error("Delete error:", err);
    }
  }, [deleteDialogState, deleteExpense, expenses, currentPage, filters, fetchExpenses]);

  // Obsługa czyszczenia błędu
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Wydatki</h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
          Zarządzaj swoimi wydatkami finansowymi
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

      {/* Filtry */}
      <FilterControls
        categories={categories}
        currentMonth={filters.month}
        currentCategoryId={filters.category_id}
        onFilterChange={handleFiltersChange}
      />

      {/* Lista wydatków */}
      <ExpensesList
        expenses={expenses}
        pagination={pagination}
        loading={loading}
        onAdd={handleAddExpense}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
        onPageChange={handlePageChange}
      />

      {/* Modal formularza */}
      <ExpenseForm
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        expense={modalState.expense}
        categories={categories}
        onSave={handleSubmitForm}
        onCancel={handleCloseModal}
        loading={submitting}
      />

      {/* Dialog potwierdzenia usunięcia */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
        loading={submitting}
      />
    </div>
  );
};

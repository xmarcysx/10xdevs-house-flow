// Główna strona widoku wpływów
import React, { useEffect, useState } from "react";
import { useIncomesApi } from "../../lib/hooks/useIncomesApi";
import type { IncomeFormData, IncomesFiltersData } from "../../types";
import { IncomeModal } from "./IncomeModal";
import { IncomesFilters } from "./IncomesFilters";
import { IncomesTable } from "./IncomesTable";

export const IncomesPage: React.FC = () => {
  // Stan komponentu
  const [filters, setFilters] = useState<IncomesFiltersData>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    incomeId?: string;
  }>({
    isOpen: false,
    mode: "add",
  });

  // Hook API
  const {
    incomesData,
    isLoading,
    isSubmitting,
    error,
    fetchIncomes,
    createIncome,
    updateIncome,
    deleteIncome,
    clearError,
  } = useIncomesApi();

  // Efekt do ładowania danych przy zmianie filtrów lub strony
  useEffect(() => {
    const query = {
      page: currentPage,
      limit: 10,
      month: filters.month || undefined,
      sort: "date DESC" as const,
    };
    fetchIncomes(query);
  }, [filters, currentPage, fetchIncomes]);

  // Obsługa zmian filtrów
  const handleFiltersChange = (newFilters: IncomesFiltersData) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset do pierwszej strony przy zmianie filtrów
  };

  // Obsługa zmiany strony w paginacji
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Obsługa dodania nowego wpływu
  const handleAddIncome = () => {
    setModalState({
      isOpen: true,
      mode: "add",
    });
  };

  // Obsługa edycji wpływu
  const handleEditIncome = (incomeId: string) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      incomeId,
    });
  };

  // Obsługa usunięcia wpływu
  const handleDeleteIncome = (incomeId: string) => {
    // TODO: Dodać potwierdzenie usunięcia
    deleteIncome(incomeId).then(() => {
      // Odśwież dane po usunięciu - wróć do pierwszej strony jeśli aktualna strona może być pusta
      const currentPageData = incomesData?.incomes || [];
      const shouldResetPage = currentPageData.length === 1 && currentPage > 1;

      const query = {
        page: shouldResetPage ? 1 : currentPage,
        limit: 10,
        month: filters.month || undefined,
        sort: "date DESC" as const,
      };
      fetchIncomes(query);

      if (shouldResetPage) {
        setCurrentPage(1);
      }
    });
  };

  // Obsługa zamknięcia modala
  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
    });
  };

  // Obsługa zatwierdzenia formularza
  const handleSubmitForm = async (data: IncomeFormData) => {
    try {
      if (modalState.mode === "add") {
        await createIncome(data);
      } else if (modalState.mode === "edit" && modalState.incomeId) {
        await updateIncome(modalState.incomeId, data);
      }

      // Zamknij modal i odśwież dane
      handleCloseModal();
      const query = {
        page: modalState.mode === "add" ? 1 : currentPage, // Dla nowych wpływów przejdź do pierwszej strony
        limit: 10,
        month: filters.month || undefined,
        sort: "date DESC" as const,
      };
      fetchIncomes(query);

      if (modalState.mode === "add") {
        setCurrentPage(1);
      }
    } catch (err) {
      // Błędy są obsługiwane przez hook
      console.error("Form submission error:", err);
    }
  };

  // Znajdź wpływ do edycji
  const selectedIncome =
    modalState.mode === "edit" && modalState.incomeId
      ? incomesData?.incomes.find((income) => income.id === modalState.incomeId)
      : undefined;

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Wpływy</h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">Zarządzaj swoimi źródłami dochodów</p>
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
                onClick={clearError}
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
      <IncomesFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Przycisk dodania nowego wpływu */}
      <div className="flex justify-end">
        <button
          onClick={handleAddIncome}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Dodaj wpływ
        </button>
      </div>

      {/* Tabela wpływów */}
      <IncomesTable
        data={incomesData}
        onEdit={handleEditIncome}
        onDelete={handleDeleteIncome}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />

      {/* Modal formularza */}
      <IncomeModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        income={selectedIncome}
        onSubmit={handleSubmitForm}
        onClose={handleCloseModal}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

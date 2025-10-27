// Główna strona widoku celów oszczędnościowych
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useGoals } from "../../lib/hooks/useGoals";
import type { CreateGoalCommand, GoalDTO, UpdateGoalCommand } from "../../types";
import { GoalForm } from "./GoalForm";
import { GoalsList } from "./GoalsList";

export const GoalsPage: React.FC = () => {
  // Stan komponentu
  const [currentPage, setCurrentPage] = useState(1);

  // Hook API
  const {
    goals,
    pagination,
    isLoading: loading,
    isSubmitting: submitting,
    error,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    clearError,
  } = useGoals();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    goal?: GoalDTO;
  }>({
    isOpen: false,
    mode: "add",
  });

  // Efekt do ładowania danych przy zmianie strony
  useEffect(() => {
    const query = {
      page: currentPage,
      limit: 10,
      sort: "created_at DESC" as const,
    };
    fetchGoals(query);
  }, [currentPage]);

  // Obsługa zmiany strony w paginacji
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Obsługa dodania nowego celu
  const handleAddGoal = useCallback(() => {
    setModalState({
      isOpen: true,
      mode: "add",
    });
  }, []);

  // Obsługa edycji celu
  const handleEditGoal = useCallback((goal: GoalDTO) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      goal,
    });
  }, []);

  // Obsługa usunięcia celu
  const handleDeleteGoal = useCallback(
    async (goalId: string) => {
      try {
        await deleteGoal(goalId);

        // Odśwież dane
        const query = {
          page: currentPage,
          limit: 10,
          sort: "created_at DESC" as const,
        };
        await fetchGoals(query);

        // Pokaż toast sukcesu
        toast.success("Cel został usunięty pomyślnie");
      } catch (err) {
        // Błędy są obsługiwane przez hook
        console.error("Delete error:", err);
      }
    },
    [deleteGoal, currentPage, fetchGoals]
  );

  // Obsługa zamknięcia modala formularza
  const handleCloseModal = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: "add",
    });
  }, []);

  // Obsługa zatwierdzenia formularza
  const handleSubmitForm = useCallback(
    async (data: CreateGoalCommand | UpdateGoalCommand) => {
      try {
        if (modalState.mode === "add") {
          await createGoal(data as CreateGoalCommand);
        } else if (modalState.mode === "edit" && modalState.goal?.id) {
          await updateGoal(modalState.goal.id, data as UpdateGoalCommand);
        }

        // Zamknij modal i odśwież dane
        handleCloseModal();
        const query = {
          page: modalState.mode === "add" ? 1 : currentPage, // Dla nowych celów przejdź do pierwszej strony
          limit: 10,
          sort: "created_at DESC" as const,
        };
        await fetchGoals(query);

        if (modalState.mode === "add") {
          setCurrentPage(1);
        }

        // Pokaż toast sukcesu
        toast.success(
          modalState.mode === "add" ? "Cel został dodany pomyślnie" : "Cel został zaktualizowany pomyślnie"
        );
      } catch (err) {
        // Błędy są obsługiwane przez hook
        console.error("Form submission error:", err);
      }
    },
    [modalState, currentPage, createGoal, updateGoal, fetchGoals]
  );

  // Obsługa czyszczenia błędu
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Cele oszczędnościowe</h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
          Zarządzaj swoimi celami oszczędnościowymi i śledź postęp
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

      {/* Lista celów */}
      <GoalsList
        goals={goals}
        pagination={pagination}
        loading={loading}
        onAdd={handleAddGoal}
        onEdit={handleEditGoal}
        onDelete={handleDeleteGoal}
        onPageChange={handlePageChange}
      />

      {/* Modal formularza */}
      <GoalForm
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        goal={modalState.goal}
        onSave={handleSubmitForm}
        onCancel={handleCloseModal}
        loading={submitting}
      />
    </div>
  );
};

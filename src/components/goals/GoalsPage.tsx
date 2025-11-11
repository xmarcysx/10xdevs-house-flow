// Główna strona widoku celów oszczędnościowych
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useGoals } from "../../lib/hooks/useGoals";
import { useContributions } from "../../lib/hooks/useContributions";
import type { CreateGoalCommand, GoalDTO, UpdateGoalCommand, CreateGoalContributionCommand } from "../../types";
import { GoalForm } from "./GoalForm";
import { ContributionFormModal } from "./ContributionFormModal";
import { GoalsList } from "./GoalsList";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import GoalsLayout from "./GoalsLayout";

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

  const {
    isSubmitting: contributionSubmitting,
    error: contributionError,
    createContribution,
    clearError: clearContributionError,
  } = useContributions();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    goal?: GoalDTO;
  }>({
    isOpen: false,
    mode: "add",
  });

  const [contributionModalState, setContributionModalState] = useState<{
    isOpen: boolean;
    selectedGoalId?: string;
    serverError?: string;
  }>({
    isOpen: false,
  });

  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean;
    goalId?: string;
  }>({
    isOpen: false,
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

  // Efekt do sprawdzania localStorage i otwierania modala przy przekierowaniu z dashboard
  useEffect(() => {
    const openModal = localStorage.getItem("openModal");
    if (openModal === "add") {
      setModalState({
        isOpen: true,
        mode: "add",
      });
      localStorage.removeItem("openModal");
    }
  }, []);

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

  // Obsługa dodania nowej wpłaty
  const handleAddContribution = useCallback((goalId: string) => {
    setContributionModalState({
      isOpen: true,
      selectedGoalId: goalId,
      serverError: undefined,
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
  const handleDeleteGoal = useCallback((goalId: string) => {
    setDeleteDialogState({
      isOpen: true,
      goalId,
    });
  }, []);

  // Obsługa potwierdzenia usunięcia celu
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDialogState.goalId) return;

    try {
      await deleteGoal(deleteDialogState.goalId);

      // Zamknij dialog
      setDeleteDialogState({ isOpen: false });

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
      console.error("Delete goal error:", err);
    }
  }, [deleteDialogState.goalId, deleteGoal, currentPage, fetchGoals]);

  // Obsługa anulowania usunięcia celu
  const handleCancelDelete = useCallback(() => {
    setDeleteDialogState({ isOpen: false });
  }, []);

  // Obsługa zamknięcia modala formularza
  const handleCloseModal = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: "add",
    });
  }, []);

  // Obsługa zamknięcia modala wpłat
  const handleCloseContributionModal = useCallback(() => {
    setContributionModalState({
      isOpen: false,
      serverError: undefined,
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

  // Obsługa zatwierdzenia formularza wpłaty
  const handleSubmitContributionForm = useCallback(
    async (data: CreateGoalContributionCommand, goalId?: string) => {
      try {
        // Wyczyść poprzedni błąd
        setContributionModalState((prev) => ({ ...prev, serverError: undefined }));

        if (!goalId) {
          setContributionModalState((prev) => ({ ...prev, serverError: "Nie wybrano celu oszczędnościowego" }));
          return;
        }

        await createContribution(goalId, data);

        // Zamknij modal i odśwież dane celów
        handleCloseContributionModal();

        // Odśwież listę celów, żeby pokazać zaktualizowane kwoty
        const query = {
          page: currentPage,
          limit: 10,
          sort: "created_at DESC" as const,
        };
        await fetchGoals(query);

        // Pokaż toast sukcesu
        toast.success("Wpłata została dodana pomyślnie");
      } catch (err) {
        // Ustaw błąd w modalu
        let errorMessage = "Wystąpił błąd podczas zapisywania wpłaty";
        if (err instanceof Error) {
          if (err.message.includes("już istnieje")) {
            errorMessage = "Wpłata już istnieje";
          } else {
            errorMessage = err.message;
          }
        }
        setContributionModalState((prev) => ({ ...prev, serverError: errorMessage }));
        console.error("Form submission error:", err);
      }
    },
    [createContribution, handleCloseContributionModal, currentPage, fetchGoals]
  );

  // Obsługa czyszczenia błędu
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return (
    <GoalsLayout>
      <div className="space-y-6">
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
          onAddContribution={handleAddContribution}
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

        {/* Modal formularza wpłaty */}
        <ContributionFormModal
          isOpen={contributionModalState.isOpen}
          mode="add"
          goals={goals}
          selectedGoalId={contributionModalState.selectedGoalId}
          onSave={(data) => handleSubmitContributionForm(data, contributionModalState.selectedGoalId)}
          onCancel={handleCloseContributionModal}
          loading={contributionSubmitting}
          serverError={contributionModalState.serverError}
        />

        {/* Dialog potwierdzenia usunięcia */}
        <DeleteConfirmationDialog
          isOpen={deleteDialogState.isOpen}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          loading={submitting}
        />
      </div>
    </GoalsLayout>
  );
};

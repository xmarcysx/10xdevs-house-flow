// Główny komponent widoku szczegółów celu z wpłatami
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useContributions } from "../../lib/hooks/useContributions";
import { useGoalWithContributions } from "../../lib/hooks/useGoal";
import type { CreateGoalContributionCommand, GoalContributionDTO, UpdateGoalContributionCommand } from "../../types";
import { ContributionFormModal } from "./ContributionFormModal";
import { ContributionsTable } from "./ContributionsTable";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { GoalHeader } from "./GoalHeader";
import { ProgressChart } from "./ProgressChart";

interface GoalContributionsViewProps {
  goalId: string;
}

export const GoalContributionsView: React.FC<GoalContributionsViewProps> = ({ goalId }) => {
  // Stan komponentu
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState("date DESC");
  const [contributionModalState, setContributionModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    contribution?: GoalContributionDTO;
    serverError?: string;
  }>({
    isOpen: false,
    mode: "add",
  });

  const [contributionDeleteDialogState, setContributionDeleteDialogState] = useState<{
    isOpen: boolean;
    contributionId?: string;
  }>({
    isOpen: false,
  });

  // Hooki API
  const {
    goal,
    contributions: goalContributions,
    isLoading: goalLoading,
    error: goalError,
    fetchGoalWithContributions,
    clearError: clearGoalError
  } = useGoalWithContributions();

  const {
    contributions: paginatedContributions,
    pagination,
    isLoading: contributionsLoading,
    isSubmitting: contributionsSubmitting,
    error: contributionsError,
    fetchContributions,
    createContribution,
    updateContribution,
    deleteContribution,
    clearError: clearContributionsError,
  } = useContributions();

  // Łączony stan ładowania i błędów
  const loading = goalLoading || contributionsLoading;
  const submitting = contributionsSubmitting;
  const error = goalError || contributionsError;

  // Efekt do ładowania danych przy montowaniu komponentu i zmianie goalId
  useEffect(() => {
    loadGoalAndContributions();
  }, [goalId]);

  // Efekt do ładowania wpłat przy zmianie strony lub sortowania (tylko dla paginacji)
  useEffect(() => {
    if (goalId) {
      fetchContributions(goalId, { page: currentPage, limit: 10, sort: currentSort });
    }
  }, [goalId, currentPage, currentSort, fetchContributions]);

  // Funkcja ładowania danych celu i wpłat
  const loadGoalAndContributions = async () => {
    try {
      // Ładuj dane celu wraz z wpłatami
      await fetchGoalWithContributions(goalId);

      // Dodatkowo załaduj paginowane wpłaty dla tabeli
      await fetchContributions(goalId, { page: currentPage, limit: 10, sort: currentSort });
    } catch (err) {
      console.error("Error loading data:", err);
      // Błędy są obsługiwane przez hooki
    }
  };

  // Obsługa dodania nowej wpłaty
  const handleAddContribution = async (data: CreateGoalContributionCommand) => {
    try {
      await createContribution(goalId, data);

      // Po sukcesie odśwież dane
      await loadGoalAndContributions();
      toast.success("Wpłata została dodana pomyślnie");
    } catch (err) {
      // Błędy są obsługiwane przez hook
      throw err; // Przekaż błąd dalej, żeby modal mógł go obsłużyć
    }
  };

  // Obsługa edycji wpłaty
  const handleEditContribution = async (data: UpdateGoalContributionCommand, contributionId?: string) => {
    const idToUse = contributionId || contributionModalState.contribution?.id;
    if (!idToUse) return;

    try {
      await updateContribution(goalId, idToUse, data);

      // Po sukcesie odśwież dane
      await loadGoalAndContributions();
      toast.success("Wpłata została zaktualizowana pomyślnie");
    } catch (err) {
      // Błędy są obsługiwane przez hook
      throw err; // Przekaż błąd dalej, żeby modal mógł go obsłużyć
    }
  };

  // Obsługa rozpoczęcia usunięcia wpłaty (otwiera dialog)
  const handleStartDeleteContribution = (contributionId: string) => {
    setContributionDeleteDialogState({
      isOpen: true,
      contributionId,
    });
  };

  // Obsługa potwierdzenia usunięcia wpłaty
  const handleConfirmDeleteContribution = async () => {
    if (!contributionDeleteDialogState.contributionId) return;

    try {
      await deleteContribution(goalId, contributionDeleteDialogState.contributionId);

      // Po sukcesie odśwież dane
      await loadGoalAndContributions();
      toast.success("Wpłata została usunięta pomyślnie");

      // Zamknij dialog
      setContributionDeleteDialogState({ isOpen: false });
    } catch (err) {
      // Błędy są obsługiwane przez hook
      console.error("Error deleting contribution:", err);
    }
  };

  // Obsługa anulowania usunięcia wpłaty
  const handleCancelDeleteContribution = () => {
    setContributionDeleteDialogState({ isOpen: false });
  };

  // Obsługa rozpoczęcia edycji wpłaty
  const handleStartEdit = (contribution: GoalContributionDTO) => {
    setContributionModalState({
      isOpen: true,
      mode: "edit",
      contribution,
      serverError: undefined,
    });
  };

  // Obsługa rozpoczęcia dodawania nowej wpłaty
  const handleStartAdd = () => {
    setContributionModalState({
      isOpen: true,
      mode: "add",
      serverError: undefined,
    });
  };

  // Obsługa zamknięcia modala wpłat
  const handleCloseContributionModal = () => {
    setContributionModalState({
      isOpen: false,
      mode: "add",
      serverError: undefined,
    });
  };

  // Obsługa zatwierdzenia formularza wpłaty w modalu
  const handleSubmitContributionModal = async (data: CreateGoalContributionCommand | UpdateGoalContributionCommand) => {
    try {
      // Wyczyść poprzedni błąd
      setContributionModalState((prev) => ({ ...prev, serverError: undefined }));

      if (contributionModalState.mode === "add") {
        await handleAddContribution(data as CreateGoalContributionCommand);
      } else if (contributionModalState.mode === "edit" && contributionModalState.contribution) {
        await handleEditContribution(data as UpdateGoalContributionCommand, contributionModalState.contribution.id);
      }

      // Zamknij modal
      handleCloseContributionModal();
    } catch (err) {
      // Ustaw błąd w modalu
      let errorMessage = "Wystąpił błąd podczas zapisywania wpłaty";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setContributionModalState((prev) => ({ ...prev, serverError: errorMessage }));
      console.error("Modal form submission error:", err);
    }
  };

  // Obsługa zmiany strony w paginacji
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Obsługa zmiany sortowania
  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    setCurrentPage(1); // Resetuj do pierwszej strony przy zmianie sortowania
  };

  // Stan ładowania
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50 p-8">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 absolute top-0"></div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
              Ładowanie danych celu...
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Przygotowujemy szczegóły Twojego celu oszczędnościowego
            </p>
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Stan błędu
  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50/90 via-red-50/80 to-red-50/70 dark:from-red-900/20 dark:via-red-900/15 dark:to-red-900/10 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-red-200/50 dark:border-red-800/50 p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Wystąpił błąd</h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => {
                clearGoalError();
                clearContributionsError();
                loadGoalAndContributions();
              }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Spróbuj ponownie
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Nagłówek celu */}
      {goal && <GoalHeader goal={goal} />}

      {/* Przycisk dodania nowej wpłaty */}
      <div className="flex justify-end">
        <button
          onClick={handleStartAdd}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
          disabled={submitting}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-sm">Dodaj wpłatę</span>
          </div>
        </button>
      </div>

      {/* Wykres progresu */}
      {goal && (
        <ProgressChart
          contributions={goalContributions}
          targetAmount={goal.target_amount}
          currentAmount={goal.current_amount}
        />
      )}

      {/* Modal formularza wpłaty */}
      <ContributionFormModal
        isOpen={contributionModalState.isOpen}
        mode={contributionModalState.mode}
        contribution={contributionModalState.contribution}
        goals={goal ? [goal] : []}
        selectedGoalId={goalId}
        onSave={handleSubmitContributionModal}
        onCancel={handleCloseContributionModal}
        loading={submitting}
        serverError={contributionModalState.serverError}
      />

      {/* Tabela wpłat */}
      <ContributionsTable
        contributions={paginatedContributions}
        pagination={pagination}
        onEdit={handleStartEdit}
        onDelete={handleStartDeleteContribution}
        onPageChange={handlePageChange}
        onSort={handleSortChange}
        isLoading={contributionsLoading}
      />

      {/* Dialog potwierdzenia usunięcia wpłaty */}
      <DeleteConfirmationDialog
        isOpen={contributionDeleteDialogState.isOpen}
        onConfirm={handleConfirmDeleteContribution}
        onCancel={handleCancelDeleteContribution}
        loading={submitting}
        type="contribution"
      />
    </div>
  );
};

// Główny komponent widoku szczegółów celu z wpłatami
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useContributions } from "../../lib/hooks/useContributions";
import { useGoal } from "../../lib/hooks/useGoal";
import type { CreateGoalContributionCommand, GoalContributionDTO, UpdateGoalContributionCommand } from "../../types";
import { ContributionForm } from "./ContributionForm";
import { ContributionsTable } from "./ContributionsTable";
import { GoalHeader } from "./GoalHeader";
import { ProgressChart } from "./ProgressChart";

interface GoalContributionsViewProps {
  goalId: string;
}

export const GoalContributionsView: React.FC<GoalContributionsViewProps> = ({ goalId }) => {
  // Stan komponentu
  const [editingContribution, setEditingContribution] = useState<GoalContributionDTO | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState("date DESC");

  // Hooki API
  const { goal, isLoading: goalLoading, error: goalError, fetchGoal, clearError: clearGoalError } = useGoal();

  const {
    contributions,
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

  // Efekt do ładowania wpłat przy zmianie strony lub sortowania
  useEffect(() => {
    fetchContributions(goalId, { page: currentPage, limit: 10, sort: currentSort });
  }, [goalId, currentPage, currentSort, fetchContributions]);

  // Funkcja ładowania danych celu i wpłat
  const loadGoalAndContributions = async () => {
    try {
      // Ładuj dane celu i wpłat równolegle
      await Promise.all([
        fetchGoal(goalId),
        fetchContributions(goalId, { page: currentPage, limit: 10, sort: currentSort }),
      ]);
    } catch (err) {
      console.error("Error loading data:", err);
      // Błędy są obsługiwane przez hooki
    }
  };

  // Obsługa dodania nowej wpłaty
  const handleAddContribution = async (data: CreateGoalContributionCommand) => {
    try {
      await createContribution(goalId, data);

      // Po sukcesie odśwież dane i zamknij formularz
      await loadGoalAndContributions();
      setShowForm(false);
      toast.success("Wpłata została dodana pomyślnie");
    } catch (err) {
      // Błędy są obsługiwane przez hook
      console.error("Error adding contribution:", err);
    }
  };

  // Obsługa edycji wpłaty
  const handleEditContribution = async (data: UpdateGoalContributionCommand) => {
    if (!editingContribution) return;

    try {
      await updateContribution(goalId, editingContribution.id, data);

      // Po sukcesie odśwież dane i zamknij formularz
      await loadGoalAndContributions();
      setEditingContribution(null);
      setShowForm(false);
      toast.success("Wpłata została zaktualizowana pomyślnie");
    } catch (err) {
      // Błędy są obsługiwane przez hook
      console.error("Error editing contribution:", err);
    }
  };

  // Obsługa usunięcia wpłaty
  const handleDeleteContribution = async (contributionId: string) => {
    try {
      await deleteContribution(goalId, contributionId);

      // Po sukcesie odśwież dane
      await loadGoalAndContributions();
      toast.success("Wpłata została usunięta pomyślnie");
    } catch (err) {
      // Błędy są obsługiwane przez hook
      console.error("Error deleting contribution:", err);
    }
  };

  // Obsługa rozpoczęcia edycji wpłaty
  const handleStartEdit = (contribution: GoalContributionDTO) => {
    setEditingContribution(contribution);
    setShowForm(true);
  };

  // Obsługa anulowania edycji
  const handleCancelEdit = () => {
    setEditingContribution(null);
    setShowForm(false);
  };

  // Obsługa rozpoczęcia dodawania nowej wpłaty
  const handleStartAdd = () => {
    setEditingContribution(null);
    setShowForm(true);
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Stan błędu
  if (error) {
    return (
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
              onClick={() => {
                clearGoalError();
                clearContributionsError();
                loadGoalAndContributions();
              }}
              className="inline-flex rounded-md bg-red-50 dark:bg-red-900/20 p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              <span className="sr-only">Spróbuj ponownie</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
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
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Dodaj wpłatę
        </button>
      </div>

      {/* Wykres progresu */}
      {goal && (
        <ProgressChart
          contributions={contributions}
          targetAmount={goal.target_amount}
          currentAmount={goal.current_amount}
        />
      )}

      {/* Formularz wpłaty */}
      {showForm && (
        <ContributionForm
          contribution={editingContribution || undefined}
          onSubmit={editingContribution ? handleEditContribution : handleAddContribution}
          onCancel={handleCancelEdit}
          isSubmitting={submitting}
        />
      )}

      {/* Tabela wpłat */}
      <ContributionsTable
        contributions={contributions}
        pagination={pagination}
        onEdit={handleStartEdit}
        onDelete={handleDeleteContribution}
        onPageChange={handlePageChange}
        onSort={handleSortChange}
        isLoading={contributionsLoading}
      />
    </div>
  );
};

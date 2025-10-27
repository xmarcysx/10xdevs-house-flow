// Komponent tabeli wpłat na cele oszczędnościowe
import React from "react";
import type { GoalContributionDTO, PaginationDTO } from "../../types";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";

interface ContributionsTableProps {
  contributions: GoalContributionDTO[];
  pagination: PaginationDTO | null;
  onEdit: (contribution: GoalContributionDTO) => void;
  onDelete: (id: string) => void;
  onPageChange?: (page: number) => void;
  onSort?: (sort: string) => void;
  isLoading: boolean;
}

export const ContributionsTable: React.FC<ContributionsTableProps> = ({
  contributions,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
  onSort,
  isLoading,
}) => {
  // Stan ładowania
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Ładowanie wpłat...</p>
        </div>
      </div>
    );
  }

  // Brak danych
  if (!contributions || contributions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Brak wpłat</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Nie znaleziono żadnych wpłat na ten cel oszczędnościowy.
          </p>
        </div>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleSort = (field: string, direction: "ASC" | "DESC" = "DESC") => {
    if (onSort) {
      onSort(`${field} ${direction}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      {/* Tabela */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("date")}
                  className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <span>Data</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </button>
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("amount")}
                  className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <span>Kwota</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </button>
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Opis
              </TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Akcje
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {contributions.map((contribution) => (
              <TableRow key={contribution.id} contribution={contribution} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginacja */}
      {pagination && pagination.total > pagination.limit && (
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Informacja o zakresie */}
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Wyświetlanie <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> do{" "}
              <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> z{" "}
              <span className="font-medium">{pagination.total}</span> wyników
            </div>

            {/* Przyciski nawigacji */}
            <div className="flex items-center space-x-2">
              {/* Poprzednia strona */}
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  pagination.page <= 1
                    ? "text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Poprzednia
              </button>

              {/* Aktualna strona */}
              <span className="inline-flex items-center px-3 py-2 border border-blue-300 dark:border-blue-600 text-sm font-medium rounded-md bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                {pagination.page}
              </span>

              {/* Następna strona */}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  pagination.page >= Math.ceil(pagination.total / pagination.limit)
                    ? "text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                Następna
                <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Komponent tabeli wydatków
import React from "react";
import type { ExpensesTableData } from "../../types";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { ExpenseRow } from "./ExpenseRow";
import { Pagination } from "../incomes/Pagination";
import LoadingComponent from "../LoadingComponent";

interface ExpensesTableProps {
  data: ExpensesTableData | null;
  onEdit: (expenseId: string) => void;
  onDelete: (expenseId: string) => void;
  onAdd: () => void;
  isLoading: boolean;
  onPageChange?: (page: number) => void;
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({ data, onEdit, onDelete, onAdd, isLoading, onPageChange }) => {
  // Stan ładowania
  if (isLoading) {
    return <LoadingComponent message="Ładowanie wydatków..." size="sm" className="col-span-full" />;
  }

  // Brak danych
  if (!data || !data.expenses || data.expenses.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
        <div className="p-8 text-center">
          <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Brak wydatków</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            Rozpocznij śledzenie swoich wydatków - dodaj pierwszy wydatek.
          </p>
          <Button
            onClick={onAdd}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj pierwszy wydatek
          </Button>
        </div>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
      {/* Tabela */}
      <div className="overflow-x-auto">
        <div className="mx-6">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Data
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kwota
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kategoria
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Opis
              </TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Akcje
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 divide-y divide-gray-200 dark:divide-gray-700">
            {data.expenses.map((expense) => (
              <ExpenseRow key={expense.id} expense={expense} onEdit={(expense) => onEdit(expense.id)} onDelete={onDelete} />
            ))}
          </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginacja */}
      {data.pagination && data.pagination.total > data.pagination.limit && (
        <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
          <div className="px-4 py-4 flex items-center justify-between sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(data.pagination.page - 1)}
                disabled={data.pagination.page <= 1}
                className="px-6 py-3 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600 dark:border-gray-600 dark:text-gray-300 dark:hover:text-red-400 dark:hover:border-red-400 font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Poprzednia
              </button>
              <button
                onClick={() => handlePageChange(data.pagination.page + 1)}
                disabled={data.pagination.page >= Math.ceil(data.pagination.total / data.pagination.limit)}
                className="px-6 py-3 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600 dark:border-gray-600 dark:text-gray-300 dark:hover:text-red-400 dark:hover:border-red-400 font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Następna
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Wyświetlanie <span className="font-medium">{(data.pagination.page - 1) * data.pagination.limit + 1}</span> do{" "}
                  <span className="font-medium">{Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)}</span>{" "}
                  z <span className="font-medium">{data.pagination.total}</span> wyników
                </p>
              </div>
              <div>
                <Pagination pagination={data.pagination} onPageChange={handlePageChange} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

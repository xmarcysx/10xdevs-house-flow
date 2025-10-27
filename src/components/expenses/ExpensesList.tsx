// Komponent listy wydatków z tabelą i paginacją
import React from "react";
import type { ExpenseDTO, PaginationDTO } from "../../types";
import { Pagination } from "../incomes/Pagination"; // Użyj istniejącej paginacji
import { Button } from "../ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { ExpenseRow } from "./ExpenseRow";

interface ExpensesListProps {
  expenses: ExpenseDTO[];
  pagination: PaginationDTO | null;
  loading: boolean;
  onAdd: () => void;
  onEdit: (expense: ExpenseDTO) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}

export const ExpensesList: React.FC<ExpensesListProps> = ({
  expenses,
  pagination,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  // Stan ładowania
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Ładowanie wydatków...</p>
        </div>
      </div>
    );
  }

  // Brak danych
  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Brak wydatków</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Nie znaleziono żadnych wydatków spełniających kryteria wyszukiwania.
          </p>
          <div className="mt-6">
            <Button onClick={onAdd} className="inline-flex items-center px-4 py-2">
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj pierwszy wydatek
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      {/* Nagłówek z przyciskiem dodania */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Lista wydatków</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Zarządzaj swoimi wydatkami - edytuj lub usuń istniejące pozycje
            </p>
          </div>
          <Button onClick={onAdd} className="inline-flex items-center">
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj wydatek
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
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
          <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {expenses.map((expense) => (
              <ExpenseRow key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginacja */}
      {pagination && pagination.total > pagination.limit && (
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6">
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

// Komponent tabeli wpływów
import React from "react";
import type { IncomesTableData } from "../../types";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { IncomeRow } from "./IncomeRow";
import { Pagination } from "./Pagination";

interface IncomesTableProps {
  data: IncomesTableData | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  onPageChange?: (page: number) => void;
}

export const IncomesTable: React.FC<IncomesTableProps> = ({ data, onEdit, onDelete, isLoading, onPageChange }) => {
  // Stan ładowania
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Ładowanie wpływów...</p>
        </div>
      </div>
    );
  }

  // Brak danych
  if (!data || !data.incomes || data.incomes.length === 0) {
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
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Brak wpływów</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Nie znaleziono żadnych wpływów spełniających kryteria wyszukiwania.
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

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
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
                Opis
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Źródło
              </TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Akcje
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.incomes.map((income) => (
              <IncomeRow key={income.id} income={income} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginacja */}
      {data.pagination && data.pagination.total > data.pagination.limit && (
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6">
          <Pagination pagination={data.pagination} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

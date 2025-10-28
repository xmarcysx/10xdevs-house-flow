// Komponent listy kategorii z tabelą i paginacją
import React from "react";
import type { CategoryDTO, PaginationDTO } from "../../types";
import { Pagination } from "../incomes/Pagination"; // Użyj istniejącej paginacji
import { Button } from "../ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { CategoryItem } from "./CategoryItem";

interface CategoriesListProps {
  categories: CategoryDTO[];
  pagination: PaginationDTO;
  loading: boolean;
  onAdd: () => void;
  onEdit: (category: CategoryDTO) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}

export const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
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
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Ładowanie kategorii...</p>
        </div>
      </div>
    );
  }

  // Brak danych
  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Brak kategorii</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Nie znaleziono żadnych kategorii.</p>
          <div className="mt-6">
            <Button onClick={onAdd} className="inline-flex items-center px-4 py-2">
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj pierwszą kategorię
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
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Lista kategorii</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Zarządzaj swoimi kategoriami wydatków
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button onClick={onAdd} className="inline-flex items-center px-4 py-2">
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj kategorię
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela kategorii */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">Nazwa kategorii</TableHead>
              <TableHead className="w-32">Typ</TableHead>
              <TableHead className="w-32 text-right">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <CategoryItem key={category.id} category={category} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginacja */}
      {pagination && pagination.total > pagination.limit && (
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              variant="outline"
            >
              Poprzednia
            </Button>
            <Button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              variant="outline"
            >
              Następna
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Wyświetlanie <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> do{" "}
                <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> z{" "}
                <span className="font-medium">{pagination.total}</span> wyników
              </p>
            </div>
            <div>
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

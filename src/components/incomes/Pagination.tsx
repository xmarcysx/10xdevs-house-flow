// Komponent paginacji
import React from "react";
import type { PaginationDTO } from "../../types";
import { Button } from "../ui/button";

interface PaginationProps {
  pagination: PaginationDTO;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { page, limit, total } = pagination;
  const totalPages = Math.ceil(total / limit);

  // Nie wyświetlaj paginacji jeśli jest tylko jedna strona
  if (totalPages <= 1) {
    return null;
  }

  // Generuj numery stron do wyświetlenia
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Liczba stron po obu stronach aktualnej strony

    // Zawsze pokaż pierwszą stronę
    if (1 < page - delta) {
      pages.push(1);
      if (2 < page - delta) {
        pages.push("...");
      }
    }

    // Pokaż strony wokół aktualnej strony
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      pages.push(i);
    }

    // Zawsze pokaż ostatnią stronę
    if (totalPages > page + delta) {
      if (totalPages - 1 > page + delta) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onPageChange(newPage);
    }
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between">
      {/* Informacja o zakresie */}
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Wyświetlanie <span className="font-medium">{startItem}</span> do <span className="font-medium">{endItem}</span>{" "}
        z <span className="font-medium">{total}</span> wyników
      </div>

      {/* Przyciski nawigacji */}
      <div className="flex items-center space-x-2">
        {/* Poprzednia strona */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center"
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Poprzednia
        </Button>

        {/* Numery stron */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === "..." ? (
                <span className="px-3 py-2 text-sm text-gray-500">...</span>
              ) : (
                <Button
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum as number)}
                  className={`min-w-[40px] ${
                    pageNum === page
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {pageNum}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Następna strona */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center"
        >
          Następna
          <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

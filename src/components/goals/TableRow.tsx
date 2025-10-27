// Komponent wiersza tabeli dla pojedynczej wpłaty na cel oszczędnościowy
import React from "react";
import type { GoalContributionDTO } from "../../types";

interface TableRowProps {
  contribution: GoalContributionDTO;
  onEdit: (contribution: GoalContributionDTO) => void;
  onDelete: (id: string) => void;
}

export const TableRow: React.FC<TableRowProps> = ({ contribution, onEdit, onDelete }) => {
  // Formatowanie kwoty do PLN
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount);
  };

  // Formatowanie daty
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
      {/* Data */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {formatDate(contribution.date)}
      </td>

      {/* Kwota */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
        {formatAmount(contribution.amount)}
      </td>

      {/* Opis */}
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        <div className="max-w-xs truncate" title={contribution.description || ""}>
          {contribution.description || "-"}
        </div>
      </td>

      {/* Akcje */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onEdit(contribution)}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
            title="Edytuj wpłatę"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(contribution.id)}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
            title="Usuń wpłatę"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

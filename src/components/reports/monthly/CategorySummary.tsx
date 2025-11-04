import React from "react";
import type { CategoryTotalDTO } from "../../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface CategorySummaryProps {
  categoryTotals: CategoryTotalDTO[];
}

export const CategorySummary: React.FC<CategorySummaryProps> = ({ categoryTotals }) => {
  // Brak danych
  if (!categoryTotals || categoryTotals.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
        <CardHeader className="px-6 py-6 border-b border-white/20 dark:border-gray-700/50">
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Podsumowanie kategorii</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-6">
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Brak danych kategorii do wyświetlenia</div>
        </CardContent>
      </Card>
    );
  }

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} PLN`;
  };

  const totalAmount = categoryTotals.reduce((sum, category) => sum + category.total, 0);

  return (
    <Card className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
      <CardHeader className="px-6 py-6 border-b border-white/20 dark:border-gray-700/50">
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Podsumowanie kategorii</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">Łączna suma wydatków: {formatAmount(totalAmount)}</p>
      </CardHeader>
      <CardContent className="px-6 py-6">
        <div className="space-y-4">
          {categoryTotals.map((category, index) => {
            const percentage = totalAmount > 0 ? (category.total / totalAmount) * 100 : 0;

            return (
              <div key={`${category.category}-${index}`} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{category.category}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatAmount(category.total)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

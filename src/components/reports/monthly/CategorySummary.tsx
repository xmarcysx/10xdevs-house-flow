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
      <Card>
        <CardHeader>
          <CardTitle>Podsumowanie kategorii</CardTitle>
        </CardHeader>
        <CardContent>
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
    <Card>
      <CardHeader>
        <CardTitle>Podsumowanie kategorii</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">Łączna suma wydatków: {formatAmount(totalAmount)}</p>
      </CardHeader>
      <CardContent>
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

import React from "react";
import type { MonthlyBudgetDTO } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface BudgetSummaryCardProps {
  data: MonthlyBudgetDTO | null;
}

const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({ data }) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Podsumowanie budżetu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Brak danych</div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = data.remaining >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Podsumowanie budżetu miesięcznego</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Łączne wpływy</span>
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
              +{data.total_income.toFixed(2)} zł
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Łączne wydatki</span>
            <span className="text-lg font-semibold text-red-600 dark:text-red-400">
              -{data.total_expenses.toFixed(2)} zł
            </span>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Pozostało</span>
              <span
                className={`text-xl font-bold ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {isPositive ? "+" : ""}
                {data.remaining.toFixed(2)} zł
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSummaryCard;

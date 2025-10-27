import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface TransactionVM {
  id: string;
  type: "expense" | "income";
  amount: number;
  date: string;
  description?: string;
  category_name?: string;
  source?: string;
  created_at: string;
}

interface RecentTransactionsProps {
  transactions: TransactionVM[];
}

const TransactionRow: React.FC<{ transaction: TransactionVM }> = ({ transaction }) => {
  const displayDate = new Date(transaction.date).toLocaleDateString("pl-PL");
  const isExpense = transaction.type === "expense";

  const handleClick = () => {
    // Navigate to transaction details page
    const path = isExpense ? `/expenses/${transaction.id}` : `/incomes/${transaction.id}`;
    window.location.href = path;
  };

  return (
    <div
      className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${isExpense ? "bg-red-500" : "bg-green-500"}`}></div>
        <div>
          <div className="font-medium text-sm">{transaction.description || (isExpense ? "Wydatek" : "Wpływ")}</div>
          <div className="text-xs text-gray-500">
            {displayDate} • {isExpense ? transaction.category_name : transaction.source}
          </div>
        </div>
      </div>
      <div className={`font-semibold ${isExpense ? "text-red-600" : "text-green-600"}`}>
        {isExpense ? "-" : "+"}
        {transaction.amount.toFixed(2)} zł
      </div>
    </div>
  );
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const recentTransactions = transactions.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ostatnie transakcje</CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Brak transakcji do wyświetlenia</div>
        ) : (
          <div className="space-y-0">
            {recentTransactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;

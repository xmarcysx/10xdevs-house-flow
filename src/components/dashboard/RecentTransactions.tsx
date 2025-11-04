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
      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer group ${
        isExpense
          ? "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 border-red-100 dark:border-red-800 hover:shadow-md hover:-translate-y-0.5"
          : "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-100 dark:border-green-800 hover:shadow-md hover:-translate-y-0.5"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
          isExpense
            ? "bg-gradient-to-br from-red-500 to-pink-600"
            : "bg-gradient-to-br from-green-500 to-emerald-600"
        } transition-transform duration-300`}>
          <div className={`w-2 h-2 rounded-full bg-white`}></div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
            {transaction.description || (isExpense ? "Wydatek" : "Wpływ")}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
            </svg>
            {displayDate}
            <span className="mx-1">•</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isExpense
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
            }`}>
              {isExpense ? transaction.category_name : transaction.source}
            </span>
          </div>
        </div>
      </div>
      <div className={`font-bold text-lg flex items-center gap-1 ${
        isExpense ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
      }`}>
        {isExpense ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5-5-5h3V8h4v5h3z"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5 5 5h-3v5H10v-5H7z"></path>
          </svg>
        )}
        {transaction.amount.toFixed(2)} zł
      </div>
    </div>
  );
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const recentTransactions = transactions.slice(0, 10);

  return (
    <Card className="h-100 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-indigo-50/50 dark:from-gray-800 dark:to-indigo-900/20">
      <CardHeader className="pb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Ostatnie transakcje
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            Brak transakcji do wyświetlenia
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}

        {/* View all transactions link */}
        {recentTransactions.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => window.location.href = "/transactions"}
              className="w-full text-center py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 rounded-xl border border-blue-200 dark:border-blue-800 transition-all duration-300 group"
            >
              <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300">
                Zobacz wszystkie transakcje →
              </span>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;

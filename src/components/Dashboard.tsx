import React from "react";
import { useDashboardData } from "../lib/hooks/useDashboardData";
import BudgetSummaryCard from "./dashboard/BudgetSummaryCard";
import CategoryPieChart from "./dashboard/CategoryPieChart";
import DashboardLayout from "./dashboard/DashboardLayout";
import GoalsSummary from "./dashboard/GoalsSummary";
import QuickActions from "./dashboard/QuickActions";
import RecentTransactions from "./dashboard/RecentTransactions";
import TrendsLineChart from "./dashboard/TrendsLineChart";
import LoadingComponent from "./LoadingComponent";

const Dashboard: React.FC = () => {
  const { budgetData, goalsData, transactions, alerts, trendsData, loading, error } = useDashboardData();

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingComponent message="Ładowanie panelu głównego..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="col-span-full flex items-center justify-center py-20">
          <div className="text-center max-w-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-pink-800 dark:from-white dark:via-red-200 dark:to-pink-200 bg-clip-text text-transparent mb-4">
              Błąd podczas ładowania danych
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0"
              >
                Spróbuj ponownie
              </button>
              <button
                onClick={() => window.history.back()}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0"
              >
                Wróć
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="col-span-full mb-6">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg mb-4 ${
                alert.type === "warning"
                  ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200"
                  : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <p>{alert.message}</p>
                {alert.dismissible && (
                  <button
                    onClick={() => {
                      // TODO: Implement alert dismissal
                    }}
                    className="ml-4 text-current hover:opacity-75"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="col-span-1 md:col-span-2 lg:col-span-2 h-full">
        <QuickActions />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-2 h-full">
        <BudgetSummaryCard data={budgetData} />
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-1 h-full">
        <GoalsSummary goals={goalsData} />
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-1 h-full">
        <CategoryPieChart data={budgetData?.category_breakdown || []} />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-2 h-full">
        <RecentTransactions transactions={transactions} />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-2 h-full">
        <TrendsLineChart data={trendsData} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

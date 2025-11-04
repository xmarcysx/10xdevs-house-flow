import React from "react";
import { useDashboardData } from "../lib/hooks/useDashboardData";
import BudgetSummaryCard from "./dashboard/BudgetSummaryCard";
import CategoryPieChart from "./dashboard/CategoryPieChart";
import DashboardLayout from "./dashboard/DashboardLayout";
import GoalsSummary from "./dashboard/GoalsSummary";
import QuickActions from "./dashboard/QuickActions";
import RecentTransactions from "./dashboard/RecentTransactions";
import TrendsLineChart from "./dashboard/TrendsLineChart";

const Dashboard: React.FC = () => {
  const { budgetData, goalsData, transactions, alerts, trendsData, loading, error } = useDashboardData();

  // Add styles for animations
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .animation-delay-100 {
        animation-delay: 0.1s;
      }
      .animation-delay-200 {
        animation-delay: 0.2s;
      }
      .bg-clip-text {
        -webkit-background-clip: text;
        background-clip: text;
      }
      .text-transparent {
        -webkit-text-fill-color: transparent;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="col-span-full flex items-center justify-center py-20">
          <div className="flex flex-col items-center justify-center">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 absolute top-0"></div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
              Ładowanie panelu głównego...
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Przygotowujemy Twoje dane finansowe</p>
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
            </div>
          </div>
        </div>
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

      {/* Podsumowanie budżetu - pełna szerokość */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2 h-full">
        <BudgetSummaryCard data={budgetData} />
      </div>

      {/* Pierwszy rząd - dwa komponenty */}
      <div className="col-span-1 md:col-span-1 lg:col-span-1 h-full">
        <CategoryPieChart data={budgetData?.category_breakdown || []} />
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-1 h-full">
        <QuickActions />
      </div>

      {/* Drugi rząd - dwa komponenty */}
      <div className="col-span-1 md:col-span-1 lg:col-span-1 h-full">
        <GoalsSummary goals={goalsData} />
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-1 h-full">
        <RecentTransactions transactions={transactions} />
      </div>

      {/* Trendy finansowe - pełna szerokość */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2 h-full">
        <TrendsLineChart data={trendsData} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

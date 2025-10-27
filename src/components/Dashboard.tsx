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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="col-span-full flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Ładowanie danych...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="col-span-full flex items-center justify-center py-12">
          <div className="text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Błąd podczas ładowania danych
              </h3>
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Spróbuj ponownie
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

      {/* Budget Summary - zajmuje całą szerokość na mobile, połowę na tablet, 2/3 na desktop */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2">
        <BudgetSummaryCard data={budgetData} />
      </div>

      {/* Category Pie Chart - zajmuje całą szerokość na mobile, połowę na tablet, 1/3 na desktop */}
      <div className="col-span-1 md:col-span-1 lg:col-span-1">
        <CategoryPieChart data={budgetData?.category_breakdown || []} />
      </div>

      {/* Trends Line Chart - zajmuje całą szerokość zawsze */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <TrendsLineChart data={trendsData} />
      </div>

      {/* Goals Summary - zajmuje całą szerokość na mobile, połowę na tablet, 2/3 na desktop */}
      <div className="col-span-1 md:col-span-1 lg:col-span-2">
        <GoalsSummary goals={goalsData} />
      </div>

      {/* Recent Transactions - zajmuje całą szerokość na mobile, połowę na tablet, 2/3 na desktop */}
      <div className="col-span-1 md:col-span-1 lg:col-span-2">
        <RecentTransactions transactions={transactions} />
      </div>

      {/* Quick Actions - zajmuje całą szerokość zawsze (kompaktowy komponent) */}
      <div className="col-span-1 md:col-span-2 lg:col-span-1">
        <QuickActions />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

import React, { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface TrendsVM {
  month: string;
  income: number;
  expenses: number;
  remaining: number;
}

interface TrendsLineChartProps {
  data: TrendsVM[];
}

const LineChartComponent = React.lazy(() => import("./charts/LineChart"));

const TrendsLineChart: React.FC<TrendsLineChartProps> = ({ data }) => {
  if (
    !data ||
    data.length === 0 ||
    data.every((item) => item.income === 0 && item.expenses === 0 && item.remaining === 0)
  ) {
    return (
      <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-cyan-50/50 dark:from-gray-800 dark:to-cyan-900/20">
        <CardHeader className="pb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                ></path>
              </svg>
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Trendy finansowe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            Brak danych do wyświetlenia
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-cyan-50/50 dark:from-gray-800 dark:to-cyan-900/20">
      <CardHeader className="pb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              ></path>
            </svg>
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Trendy finansowe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-200 dark:border-cyan-800"></div>
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-transparent border-t-cyan-600 dark:border-t-cyan-400 absolute top-0"></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Ładowanie wykresu trendów...</p>
            </div>
          }
        >
          <div className="rounded-lg overflow-hidden">
            <LineChartComponent data={data} />
          </div>
        </Suspense>

        {/* Chart summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-100 dark:border-green-800">
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Średnie wpływy</div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {(data.reduce((sum, item) => sum + item.income, 0) / data.length).toFixed(0)} zł
            </div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border border-red-100 dark:border-red-800">
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Średnie wydatki</div>
            <div className="text-lg font-bold text-red-600 dark:text-red-400">
              {(data.reduce((sum, item) => sum + item.expenses, 0) / data.length).toFixed(0)} zł
            </div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Średnie saldo</div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {(data.reduce((sum, item) => sum + item.remaining, 0) / data.length).toFixed(0)} zł
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendsLineChart;

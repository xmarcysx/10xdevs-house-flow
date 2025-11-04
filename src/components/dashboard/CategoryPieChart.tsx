import React, { Suspense } from "react";
import type { CategoryBreakdownDTO } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Lazy-loaded chart component
const PieChartComponent = React.lazy(() => import("./charts/PieChart"));

interface CategoryPieChartProps {
  data: CategoryBreakdownDTO[];
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-orange-900/20 h-full">
        <CardHeader className="pb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                ></path>
              </svg>
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Podział wydatków
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
    <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-orange-900/20">
      <CardHeader className="pb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              ></path>
            </svg>
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Podział wydatków
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 dark:border-purple-800"></div>
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 absolute top-0"></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Ładowanie wykresu...</p>
            </div>
          }
        >
          <div className="">
            <PieChartComponent data={data} />
          </div>
        </Suspense>

        {/* Category Legend */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          {data.slice(0, 6).map((category, index) => (
            <div key={category.category_name} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{
                  backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                }}
              ></div>
              <span className="text-gray-600 dark:text-gray-400 truncate">{category.category_name}</span>
              <span className="text-gray-900 dark:text-white font-medium ml-auto">{category.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;

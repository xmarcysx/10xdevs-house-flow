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
      <Card>
        <CardHeader>
          <CardTitle>Podział wydatków</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Brak danych do wyświetlenia</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Podział wydatków</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          }
        >
          <PieChartComponent data={data} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;

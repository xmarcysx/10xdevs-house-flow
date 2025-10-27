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
  if (!data || data.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trendy finansowe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Za mało danych dla trendów (wymagane minimum 2 miesiące)
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trendy finansowe</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          }
        >
          <LineChartComponent data={data} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default TrendsLineChart;

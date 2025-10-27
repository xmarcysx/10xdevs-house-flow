import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TrendsVM {
  month: string;
  income: number;
  expenses: number;
  remaining: number;
}

interface LineChartProps {
  data: TrendsVM[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  // If no data, show placeholder
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
        Brak danych do wyświetlenia trendów
      </div>
    );
  }

  // Transform data for Recharts - format month names
  const chartData = data.map((item) => ({
    ...item,
    month: new Date(item.month + "-01").toLocaleDateString("pl-PL", {
      month: "short",
      year: "2-digit",
    }),
  }));

  const renderTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium mb-2">{data.month}</p>
          <div className="space-y-1 text-sm">
            <p className="text-green-600">Wpływy: {data.income.toFixed(2)} zł</p>
            <p className="text-red-600">Wydatki: {data.expenses.toFixed(2)} zł</p>
            <p className={data.remaining >= 0 ? "text-green-600" : "text-red-600"}>
              Pozostało: {data.remaining >= 0 ? "+" : ""}
              {data.remaining.toFixed(2)} zł
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="month" className="text-gray-600 dark:text-gray-400" fontSize={12} />
          <YAxis className="text-gray-600 dark:text-gray-400" fontSize={12} tickFormatter={(value) => `${value} zł`} />
          <Tooltip content={renderTooltip} />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10B981"
            strokeWidth={2}
            name="Wpływy"
            dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#EF4444"
            strokeWidth={2}
            name="Wydatki"
            dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="remaining"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Pozostało"
            dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;

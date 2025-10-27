// Komponent wykresu liniowego progresu celu (lazy-loaded)
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ProgressDataPoint {
  date: string;
  amount: number;
  cumulativeAmount: number;
  targetAmount: number;
}

interface ProgressChartComponentProps {
  data: ProgressDataPoint[];
  targetAmount: number;
  predictedDate: string | null;
}

const ProgressChartComponent: React.FC<ProgressChartComponentProps> = ({ data, targetAmount, predictedDate }) => {
  // Funkcja formatowania daty dla etykiet osi X
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "short",
    });
  };

  // Funkcja formatowania kwoty dla etykiet osi Y
  const formatAmount = (amount: number) => {
    return `${(amount / 1000).toFixed(0)}k zł`;
  };

  // Custom tooltip
  const renderTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium mb-2">{formatDate(data.date)}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">Skumulowana kwota: {data.cumulativeAmount.toFixed(2)} zł</p>
            {data.amount > 0 && <p className="text-green-600">Wpłata tego dnia: {data.amount.toFixed(2)} zł</p>}
            <p className="text-gray-600">Cel: {data.targetAmount.toFixed(2)} zł</p>
            <p
              className={`font-medium ${data.cumulativeAmount >= data.targetAmount ? "text-green-600" : "text-orange-600"}`}
            >
              Progres: {((data.cumulativeAmount / data.targetAmount) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Przygotuj dane z linią celu
  const chartData = data.map((point) => ({
    ...point,
    formattedDate: formatDate(point.date),
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="formattedDate"
            className="text-gray-600 dark:text-gray-400"
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis className="text-gray-600 dark:text-gray-400" fontSize={12} tickFormatter={formatAmount} />
          <Tooltip content={renderTooltip} />
          <Legend />

          {/* Linia celu (pozioma) */}
          <ReferenceLine
            y={targetAmount}
            stroke="#EF4444"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: "Cel",
              position: "topRight",
              className: "text-red-600 dark:text-red-400 font-medium",
            }}
          />

          {/* Linia progresu */}
          <Line
            type="monotone"
            dataKey="cumulativeAmount"
            stroke="#10B981"
            strokeWidth={3}
            name="Skumulowana kwota"
            dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2, fill: "#ffffff" }}
          />

          {/* Linia wpłat dziennych (jeśli potrzebne) */}
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Wpłaty dzienne"
            dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: "#3B82F6", strokeWidth: 2, fill: "#ffffff" }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>

      {/* Informacja o przewidywanym terminie */}
      {predictedDate && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm">
              <span className="font-medium text-blue-800 dark:text-blue-200">
                Przewidywany termin osiągnięcia celu:{" "}
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {new Date(predictedDate).toLocaleDateString("pl-PL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressChartComponent;

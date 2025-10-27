import React from "react";
import { Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryBreakdownDTO } from "../../../types";

interface PieChartProps {
  data: CategoryBreakdownDTO[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
  "#8DD1E1",
  "#D084D0",
];

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  // Transform data for Recharts
  const chartData = data.map((item, index) => ({
    name: item.category_name,
    value: item.amount,
    percentage: item.percentage,
    fill: COLORS[index % COLORS.length],
  }));

  const renderCustomizedLabel = (entry: any) => {
    if (entry.percentage < 5) return null; // Hide labels for small slices
    return `${entry.percentage.toFixed(1)}%`;
  };

  const renderTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium">{data.payload.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.value.toFixed(2)} zł ({data.payload.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => <span style={{ color: entry.color }}>{value}</span>}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;

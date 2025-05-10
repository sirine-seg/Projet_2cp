import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/card.jsx";

import { ChartContainer } from "../components/chart.jsx";

import CustomTooltip from "../components/CustomTooltip";

export default function LineChartCard({
  title,
  description,
  data,
  colorMap,
  xAxisKey,
}) {
  const generateLineChartConfig = (data, colorMap, xAxisKey) => {
    const config = {};
    const allKeys = new Set();
    data.forEach((item) =>
      Object.keys(item).forEach((key) => allKeys.add(key))
    );

    allKeys.forEach((key) => {
      if (key !== xAxisKey) {
        config[key] = {
          label: key,
          color: colorMap[key] || "var(--color-default)",
        };
      }
    });

    return config;
  };

  // Trouver la valeur maximale pour définir les ticks de l'axe Y
  const getMaxValue = (data, xAxisKey) => {
    let max = 0;
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== xAxisKey && item[key] > max) {
          max = item[key];
        }
      });
    });
    return max;
  };

  const maxValue = getMaxValue(data, xAxisKey);
  const yAxisTicks = [];
  for (let i = 0; i <= maxValue; i += 3) {
    yAxisTicks.push(i);
  }

  const chartConfig = generateLineChartConfig(data, colorMap, xAxisKey);

  return (
    <Card className="w-full max-w-full">
      <CardHeader className="px-6 pb-4">
        <div className="flex justify-between items-center gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg md:text-xl">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(chartConfig).map(([dataKey, { color, label }]) => (
              <div key={dataKey} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="w-full">
          <div className="w-full aspect-[5/6] sm:aspect-[3/2] md:aspect-[30/9] overflow-visible">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  right: 12,
                  top: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  horizontal={true}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey={xAxisKey}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  ticks={yAxisTicks}
                  tick={{ fontSize: 12 }}
                  interval={0}
                  width={30} // Réduire cette valeur pour rapprocher les labels
                />

                {Object.entries(chartConfig).map(([dataKey, { color }]) => (
                  <Line
                    key={dataKey}
                    dataKey={dataKey}
                    type="linear"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}

                <Tooltip
                  content={
                    <CustomTooltip
                      valueFormatter={(value) => `${value}`}
                      labelFormatter={(label) => `${label}`}
                    />
                  }
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

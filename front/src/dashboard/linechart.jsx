import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card.jsx";

import {
  ChartContainer,
} from "@/components/chart.jsx";

import CustomTooltip from "@/components/CustomTooltip";

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
    data.forEach(item => Object.keys(item).forEach(key => allKeys.add(key)));

    allKeys.forEach(key => {
      if (key !== xAxisKey) {
        config[key] = {
          label: key,
          color: colorMap[key] || "var(--color-default)",
        };
      }
    });

    return config;
  };

  const chartConfig = generateLineChartConfig(data, colorMap, xAxisKey);

  return (
    <Card className="w-full max-w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="w-full">
          {/* Adjust the aspect ratio for responsiveness */}
          <div className="w-full aspect-[5/6] sm:aspect-[3/2] md:aspect-[30/9] overflow-visible">

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey={xAxisKey}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  
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

"use client";

import React from "react";
import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/card";
import CustomTooltip from "../components/CustomTooltip";

export default function PieChartBase({
  title,
  description,
  data,
  valueKey = "value",
  nameKey = "name",
  colorMap = {},
  donut = false, // toggle donut style
  showCenterText = false, // toggle inner label text
}) {
  const total = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr[valueKey], 0),
    [data, valueKey]
  );
  const getPercentage = (value) => ((value / total) * 100).toFixed(1) + "%";

  return (
    <Card className="w-full max-w-full flex flex-col">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">
          {/* Pie Chart */}
          <div className="w-full max-w-[220px] aspect-square min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey={valueKey}
                  nameKey={nameKey}
                  outerRadius={100}
                  innerRadius={donut ? 50 : 0} // Adjust if donut
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colorMap[entry[nameKey]] || entry.fill || "#cccccc"}
                    />
                  ))}

                  {donut && showCenterText && (
                    <Label
                      content={({ viewBox }) => {
                        if (
                          !viewBox ||
                          !("cx" in viewBox) ||
                          !("cy" in viewBox)
                        )
                          return null;
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-base font-bold"
                            >
                              {total}
                            </tspan>
                          </text>
                        );
                      }}
                    />
                  )}
                </Pie>

                <Tooltip
                  content={
                    <CustomTooltip
                      valueFormatter={(value) => getPercentage(value)}
                      labelFormatter={(label) => `${label}`}
                    />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 justify-center max-w-[320px]">
            <ul className="flex flex-col gap-3 text-base">
              {data.map((entry, index) => {
                const value = entry[valueKey] || 0;
                const percentage = total
                  ? `${((value / total) * 100).toFixed(1)}%`
                  : "0%";

                return (
                  <li
                    key={`legend-item-${index}`}
                    className="flex items-center justify-between gap-6 font-medium text-black"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor:
                            colorMap[entry[nameKey]] || entry.fill || "#ccc",
                        }}
                      />
                      <span>{entry[nameKey]}</span>
                    </div>
                    <span>{percentage}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

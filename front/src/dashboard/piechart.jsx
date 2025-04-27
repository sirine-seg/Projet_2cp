"use client"

import React from "react"
import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/card"
import CustomTooltip from "@/components/CustomTooltip"

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
  )

  return (
    <Card className="w-full max-w-full flex flex-col">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="w-full max-w-sm aspect-square mx-auto min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey={valueKey}
                  nameKey={nameKey}
                  outerRadius="80%"
                  innerRadius={donut ? 60 : 0}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        colorMap[entry[nameKey]] || entry.fill || "#cccccc"
                      }
                    />
                  ))}

                  {donut && showCenterText && (
                    <Label
                      content={({ viewBox }) => {
                        if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox))
                          return null

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
                              className="fill-foreground text-xl font-bold"
                            >
                              {total}
                            </tspan>
                          </text>
                        )
                      }}
                    />
                  )}
                </Pie>

                <Tooltip
                  content={
                    <CustomTooltip
                      formatter={(value) => `${value}`}
                      labelFormatter={(label) => `${label}`}
                    />
                  }
                />

                <Legend
                  content={({ payload }) => (
                    <ul className="flex flex-wrap justify-center gap-4 mt-4">
                      {payload?.map((entry, index) => (
                        <li
                          key={`item-${index}`}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-xs sm:text-sm">{entry.value}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


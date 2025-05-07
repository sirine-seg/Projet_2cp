"use client"

import React from "react"
import barIcon from '../assets/barIcon.svg';
import agrandir from '../assets/agrandir.svg';
import { motion } from "framer-motion";

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
} from "./card"
import CustomTooltip from "./CustomTooltip"

export default function PieChartBase({
  title,
  description,
  data,
  valueKey = "value",
  nameKey = "name",
  colorMap = {},
  donut = false,
  showCenterText = false,
  onClick,
}) {
  const total = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr[valueKey], 0),
    [data, valueKey]
  )

  return (
    <Card className="flex flex-col gap-1 bg-[#f39200]  md:shadow-[5px_10px_10px_-10px_rgba(32,33,36,0.7)] border-none">
      <CardHeader className="items-center pb-0">
        <div className="flex flex-row items-center gap-4">
          <img 
            src={barIcon} 
            alt="barIcon"
            className="w-12 h-12"
          />
          <CardTitle className="text-lg sm:text-xl text-white font-bold">{title}</CardTitle>
        </div>
        {description && (
          <CardDescription className="text-lg text-white mt-2 font-semibold">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="w-full max-w-sm aspect-square mx-auto min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey={valueKey}
                  nameKey={nameKey}
                  outerRadius="85%"
                  innerRadius={donut ? 50 : 0} // épaisseur du donut
                  paddingAngle={2}
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
                  layout="vertical"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  content={({ payload }) => (
                    <ul className="flex flex-col gap-2 justify-center">
                      {payload?.map((entry, index) => {
                        const item = data.find((d) => d[nameKey] === entry.value)
                        const percentage = item ? `${item[valueKey]}` : ""
                        return (
                          <li
                            key={`item-${index}`}
                            className="flex items-center justify-between gap-10 max-w-[200px] text-sm text-white"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span>{entry.value}</span>
                            </div>
                            <span className="font-semibold">{percentage}</span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
      <div className="flex justify-end px-8 mt-auto">
  <motion.img 
    src={agrandir} 
    alt="Agrandir"
    className="w-8 h-8 cursor-pointer"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.99 }}
    transition={{ type: "spring", stiffness: 300 }}
    onClick={onClick}
  />
</div>
    </Card>
  )
}

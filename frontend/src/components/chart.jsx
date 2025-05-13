// src/components/ui/chart.jsx
import React from "react"

export function ChartContainer({ children, config }) {
  // You can add layout or config logic here later
  return <div style={{ width: "100%", height: "500" }}>{children}</div>
}

export function ChartTooltip({ content, ...props }) {
  return <RechartsTooltip {...props} content={content} />
}

// Default tooltip content
export function ChartTooltipContent({ payload, hideLabel }) {
  if (!payload || payload.length === 0) return null

  return (
    <div className="bg-white p-2 rounded shadow text-sm">
      {!hideLabel && <div className="font-bold">{payload[0].name}</div>}
      <div>{payload[0].value}</div>
    </div>
  )
}

export function ChartLegend({ content, className = "" }) {
  return (
    <div className={`flex flex-wrap items-center justify-center mt-4 ${className}`}>
      {typeof content === "function" ? content() : content}
    </div>
  )
}
// components/chart.jsx or ChartLegendContent.jsx
export const ChartLegendContent = ({ payload, nameKey = "name", valueKey = "value" }) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 basis-1/4 justify-center">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color || "#ccc" }}
          />
          <span className="font-medium">{entry.payload?.[nameKey]}</span>
          <span className="text-muted-foreground">{entry.payload?.[valueKey]}</span>
        </div>
      ))}
    </div>
  );
};

const chartConfig = {
  value: {
    label: "Value",
    color: "#F09C0A", // or any CSS variable like "hsl(var(--chart-1))"
  },
};




// Import this from Recharts if using ChartTooltip
import { Tooltip as RechartsTooltip } from "recharts"

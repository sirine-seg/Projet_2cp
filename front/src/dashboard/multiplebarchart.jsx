"use client";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
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

export default function TechnicianInterventionChart({
  data = [],
  labelKey = "technician",
  title = "Répartition des interventions par technicien",
  description = "",
  colors = {
    Terminee: "#0B53C1",
    EnCours: "#5E8FDB",
    Annulee: "#D8E6FB",
  },
}) {
  const statuses = Object.keys(colors);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="flex-1 overflow-visible">
        <ChartContainer config={{}} className="w-full ">
        <div className="w-full aspect-[2/1] md:aspect-[3/1] lg:aspect-[4/1] xl:aspect-[5/1] sm:aspect-auto">
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      layout="vertical"
      data={data}
      barCategoryGap={8} // Slightly reduce bar category gap for mobile
      margin={{ top: 10, right: 0, left: 60, bottom: 5 }} // Adjust margins for mobile
    >
      <YAxis
        type="category"
        dataKey={labelKey}
        axisLine={false}
        tickLine={false}
        style={{ fontSize: "0.7rem" }} // Smaller font size for mobile labels
      />
      <XAxis type="number" hide />

      {statuses.map((status, index, array) => (
        <Bar
          key={status}
          dataKey={status}
          stackId="interventions"
          fill={colors[status]}
          barSize={16} // Smaller bar size for mobile
          radius={
            index === 0
              ? [8, 0, 0, 8]
              : index === array.length - 1
              ? [0, 8, 8, 0]
              : [0, 0, 0, 0]
          }
        />
      ))}

      <Tooltip
        cursor={{ fill: "transparent" }}
        content={
          <CustomTooltip
            valueFormatter={(value) => `${value}`}
            labelFormatter={(label) => `${label}`}
          />
        }
      />
      <Legend
        layout="horizontal"
        align="right"
        verticalAlign="top"
        wrapperStyle={{ paddingBottom: 10 }} // Adjust legend padding for mobile
        formatter={(value, entry, index) => (
          <span className="text-xs">{value}</span> // Smaller legend text for mobile
        )}
      />
    </BarChart>
  </ResponsiveContainer>
</div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
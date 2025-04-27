"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card.jsx"
import {
  ChartContainer,
} from "@/components/chart.jsx"
import CustomTooltip from "@/components/CustomTooltip"

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
  const statuses = Object.keys(colors)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="flex-1 overflow-visible">
        <ChartContainer config={{}} className="w-full ">
        <div className="w-full aspect-[2/3] md:aspect-[30/9] ">

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={data}
                barCategoryGap={12}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <YAxis
                  type="category"
                  dataKey={labelKey}
                  axisLine={false}
                  tickLine={false}
                />
                <XAxis type="number" hide />
                
                {statuses.map((status) => (
                  <Bar
                    key={status}
                    dataKey={status}
                    
                    stackId="interventions"
                    fill={colors[status]}
                    radius={[0, 8, 8, 0]}
                    barSize={20}
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
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

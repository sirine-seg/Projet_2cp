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
} from "../components/card.jsx";
import { ChartContainer } from "../components/chart.jsx";
import CustomTooltip from "../components/CustomTooltip";

export default function TechnicianInterventionChart({
  data = [],
  labelKey = "technician",
  title = "Répartition des interventions par technicien",
  description = "",
  colors = {
    Terminee: "#20599E",
    EnCours: "#5883B6",
    Annulee: "#C7D5E7",
  },
  showLegend = true,
}) {
  const statuses = Object.keys(colors);

  // Ajout d'une légende personnalisée dans le header
  const renderLegend = () => (
    <div className="flex flex-wrap gap-4 mt-2 h-full">
      {statuses.map((status) => (
        <div key={status} className="flex items-center">
          <div
            className="w-3 h-3 rounded-sm mr-2"
            style={{ backgroundColor: colors[status] }}
          />
          <span className="text-xs text-muted-foreground capitalize">
            {status.toLowerCase().replace(/([a-z])([A-Z])/g, "$1 $2")}
          </span>
        </div>
      ))}
    </div>
  );

  const visibleStatuses = statuses.filter((status) => {
    // Vérifie s’il y a au moins une valeur non nulle pour ce status dans le dataset
    return data.some((entry) => entry[status] > 0);
  });

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-base sm:text-lg md:text-xl">
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {showLegend && <div className="flex-shrink-0">{renderLegend()}</div>}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-visible">
        <ChartContainer config={{}} className="w-full ">
          <div className="w-full aspect-[2/1] md:aspect-[3/1] lg:aspect-[4/1] xl:aspect-[5/1] sm:aspect-auto">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="vertical"
                data={data}
                barCategoryGap={8} // Slightly reduce bar category gap for mobile
                margin={{ top: 10, right: 0, left: 80, bottom: 5 }} // Adjust margins for mobile
              >
                <YAxis
                  type="category"
                  dataKey={labelKey}
                  axisLine={false}
                  tickLine={false}
                  style={{ fontSize: "0.7rem" }} // Smaller font size for mobile labels
                />
                <XAxis type="number" hide />

                {visibleStatuses.map((status, index) => (
                  <Bar
                    key={status}
                    dataKey={status}
                    stackId="interventions"
                    fill={colors[status]}
                    barSize={16}
                    radius={
                      index === 0
                        ? [8, 0, 0, 8] // arrondi à gauche
                        : index === visibleStatuses.length - 1
                        ? [0, 8, 8, 0] // arrondi à droite
                        : [0, 0, 0, 0] // pas d’arrondi
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
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

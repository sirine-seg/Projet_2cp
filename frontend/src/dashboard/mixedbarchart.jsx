"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card.jsx";

import { ChartContainer } from "@/components/chart.jsx";
import CustomTooltip from "@/components/CustomTooltip";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useRef, useState } from "react";

export default function BarChartCard({
  data = [],
  dataKey = "value",
  labelKey = "label",
  barColor = "hsl(var(--chart-1))",
  title = "Bar Chart",
  description = "Chart description",
}) {
  const containerRef = useRef(null);
  const [barSize, setBarSize] = useState(24);
  const [barGap, setBarGap] = useState("10%");

  useEffect(() => {
    const updateBarSizes = () => {
      const width = containerRef.current?.offsetWidth || 400;
      const isSmall = width < 400;
      const isMedium = width >= 400 && width < 768;
      const isLarge = width >= 768;
  
      // Set dynamic bar size and gap based on screen width
      if (isSmall) {
        setBarSize(8);
        setBarGap(4); // in px
      } else if (isMedium) {
        setBarSize(20);
        setBarGap(8); // in px
      } else if (isLarge) {
        setBarSize(28);
        setBarGap(12); // in px
      }
    };
  
    updateBarSizes();
    window.addEventListener("resize", updateBarSizes);
    return () => window.removeEventListener("resize", updateBarSizes);
  }, []);
  
  return (
    <Card className="w-full max-w-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <ChartContainer
          ref={containerRef}
          config={{}}
          accessibilityLayer
          className="w-full h-[300px] md:h-[400px] z-50 "
        >
           <div className="w-full max-w-sm aspect-square">
          <ResponsiveContainer width="100%" height="100%">
          

            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 20 }}
              barCategoryGap={barGap}
            >
              <YAxis
                dataKey={labelKey}
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <XAxis dataKey={dataKey} type="number" hide />
              <Bar
                dataKey={dataKey}
                radius={5}
                fill={barColor}
                layout="vertical"
                barSize={barSize}
              />
              <Tooltip
               cursor={{ fill: "transparent" }}
                content={
                  <CustomTooltip
                    formatter={(value) => `${value}`}
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

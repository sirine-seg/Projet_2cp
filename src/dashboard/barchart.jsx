"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import CustomTooltip from "../components/CustomTooltip";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/card";

const ChartCard = ({ data, title, description }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  // Effect to track container width
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Calculating chart width
  const barWidth = 60;
  const chartWidth = data.length * barWidth;
  const isScrollable = chartWidth > containerWidth;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 600;
  const maxAvg = Math.max(...data.map((d) => d.avgTime));
  const ticks = Array.from({ length: maxAvg + 1 }, (_, i) => i); // [0, 1, ..., max]

  return (
    <Card className="w-full max-w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div ref={containerRef} className="overflow-x-auto scrollbar-hide">
          <div
            style={{
              width: isScrollable ? `${chartWidth}px` : "100%",
              minWidth: "100%",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 25 }}>
                <CartesianGrid vertical={false} />

                <YAxis
                  width={30}
                  domain={[0, maxAvg]}
                  ticks={ticks}
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{
                    fontSize: isMobile ? 10 : 12,
                    fontWeight: 500,
                  }}
                  tickFormatter={(value) => `${value} j`}
                />

                <XAxis
                  dataKey="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    value.length > 10 ? `${value.substring(0, 10)}...` : value
                  }
                  tick={{
                    fontSize: isMobile ? "10px" : "14px",
                    fontWeight: 600,
                  }}
                />
                <Tooltip
                  content={
                    <CustomTooltip
                      valueFormatter={(value) => `${value} jours`}
                      labelFormatter={(label) => `Categorie: ${label}`}
                    />
                  }
                />
                <Bar dataKey="avgTime" fill="#20599E" radius={8} barSize={40}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;

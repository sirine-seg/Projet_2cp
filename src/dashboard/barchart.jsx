"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import CustomTooltip from "@/components/CustomTooltip"; // ✅ Ensure this path is correct

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/card";

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
              <BarChart data={data} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} />
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
                      valueFormatter={(value) => `${value} day`}
                      labelFormatter={(label) => `Category: ${label}`}
                    />
                  }
                />
                <Bar
                  dataKey="avgTime"
                  fill="#20599E"
                  radius={8}
                  barSize={40}
                >
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


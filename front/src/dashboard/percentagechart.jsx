"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card.jsx";

export default function InterventionProgressCard({
  title = "Progression des interventions",
  description = "",
  data,
  barColor = "bg-blue-700",
  backgroundColor = "bg-blue-200",
}) {
  return (
    <Card className="w-full max-w-md flex flex-col">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {data.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between gap-2 w-full"
          >
            <div className="w-24 text-sm truncate">{label}</div>
            <div className="flex-1 mx-2 h-3 rounded-full overflow-hidden relative">
              <div className={`absolute inset-0 ${backgroundColor}`} />
              <div
                className={`absolute h-full ${barColor} rounded-full`}
                style={{ width: `${value}%` }}
              />
            </div>
            <div className="w-12 text-sm text-right font-medium">
              {value.toString().padStart(2, "0")}% 
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}



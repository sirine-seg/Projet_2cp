"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/card.jsx";

export default function InterventionProgressCard({
  title = "Progression des interventions",
  description = "",
  data,
  barColor = "bg-[#20599E]",
  backgroundColor = "bg-[#C3D4E9]",
}) {
  return (
    <Card className="w-full lg:max-w-md flex flex-col p-3 sm:p-4">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg md:text-xl">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {data.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between gap-2 w-full min-w-0"
          >
            <div className="w-16 sm:w-24 text-xs sm:text-base truncate">
              {label}
            </div>
            <div className="flex-1 mx-1 sm:mx-2 h-2 sm:h-3 rounded-full overflow-hidden relative">
              <div className={`absolute inset-0 ${backgroundColor}`} />
              <div
                className={`absolute h-full ${barColor} rounded-full`}
                style={{ width: `${value}%` }}
              />
            </div>
            <div className="w-10 sm:w-12 text-xs sm:text-base text-right font-medium">
              {value.toString().padStart(2, "0")}%
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
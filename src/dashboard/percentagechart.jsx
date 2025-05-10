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
  allCategories = ["En attente", "En cours", "Terminées"], // Toutes les catégories possibles
  barColor = "bg-[#20599E]",
  backgroundColor = "bg-[#C3D4E9]",
}) {
  // Crée un jeu de données complet avec toutes les catégories
  const completeData = allCategories.map(category => {
    const existingItem = data.find(item => item.label === category);
    return existingItem || { label: category, value: 0 };
  });

  return (
    <Card className="w-full max-w-md flex flex-col p-3 sm:p-4">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {completeData.map(({ label, value }) => (
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
                style={{ 
                  width: `${value}%`,
                  minWidth: "2px" // Toujours visible même à 0%
                }}
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
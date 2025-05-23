import React, { memo } from "react";

const CustomTooltip = ({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
}) => {
  if (!active || !payload || !payload.length) return null;

  const fallbackLabel = payload[0]?.name || "";
  const finalLabel = label || fallbackLabel;
  const formattedLabel = labelFormatter ? labelFormatter(finalLabel) : finalLabel;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        color: "#1f2937",
        padding: "1rem",
        fontSize: "0.875rem",
        maxWidth: "260px",
        width: "100%",
        boxSizing: "border-box",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          fontWeight: "600",
          marginBottom: "0.75rem",
          fontSize: "1rem",
          color: "#0f172a",
          borderBottom: "1px solid #e5e7eb", // Ligne de séparation
          paddingBottom: "0.5rem",
        }}
      >
        {formattedLabel}
      </div>

      {payload.map((entry, index) => {
        const displayName = entry.name || "Valeur";
        const displayValue = valueFormatter
          ? valueFormatter(Math.round(entry.value)) // Valeur arrondie
          : Math.round(entry.value); // Conversion en entier

        return (
          <div
            key={`tooltip-item-${index}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
              color: entry.color || "#1d4ed8",
              fontWeight: 500,
            }}
          >
            <span style={{ marginRight: "16px" }}>{displayName}:</span>
            <span style={{ fontWeight: "bold" }}>{displayValue}</span>
          </div>
        );
      })}
    </div>
  );
};

export default memo(CustomTooltip);
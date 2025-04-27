import React, { memo } from "react";

const CustomTooltip = ({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
}) => {
  if (!active || !payload || !payload.length) return null;

  // Format label
  const fallbackLabel = payload[0]?.name || "";
  const finalLabel = label || fallbackLabel;
  const formattedLabel = labelFormatter ? labelFormatter(finalLabel) : finalLabel;

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        color: "#000",
        padding: "0.75rem",
        fontSize: "0.875rem",
        maxWidth: "300px",
        width: "100%",
        boxSizing: "border-box",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          color: "#facc15",
          fontWeight: "600",
          marginBottom: "0.5rem",
          fontSize: "1rem",
        }}
      >
        {formattedLabel}
      </div>

      {payload.map((entry, index) => (
        <div
          key={`item-${index}`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
            color: entry.color,
          }}
        >
          <span style={{ fontWeight: 500 }}>{entry.name}</span>
          <span>
            {valueFormatter ? valueFormatter(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default memo(CustomTooltip);


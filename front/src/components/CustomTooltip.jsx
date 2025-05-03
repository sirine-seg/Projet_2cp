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
        borderRadius: "6px", // Even smaller border radius
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.15)", // Subtler shadow
        color: "#000",
        padding: "0.4rem", // Further reduced padding
        fontSize: "0.7rem", // Even smaller font size
        maxWidth: "180px", // Further reduced maximum width
        width: "100%",
        boxSizing: "border-box",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          color: "#facc15",
          fontWeight: "500", // Slightly lighter title weight
          marginBottom: "0.2rem", // Further reduced margin
          fontSize: "0.8rem", // Even smaller title
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
            marginBottom: "1px", // Further reduced margin
            color: entry.color,
            fontSize: "0.65rem", // Even smaller value font size
          }}
        >
          <span style={{ fontWeight: 400 }}>{entry.name}</span> {/* Lighter name weight */}
          <span>
            {valueFormatter ? valueFormatter(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default memo(CustomTooltip);


import React from "react";

export function Card({ className = "", children }) {
  return (
    <div className={`rounded-[16px] w-[980px]${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ className = "", children }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

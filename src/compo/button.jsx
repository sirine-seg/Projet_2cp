import React from "react";

export function Button({ className = "", children, ...props }) {
  return (
    <button
      className={`bg-[#20599E] text-white px-6 py-2 rounded font-poppins font-semibold flex items-center justify-center gap-1.5 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

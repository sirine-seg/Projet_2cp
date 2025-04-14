import React from "react";

export function Avatar({ initials = "AR" }) {
  return (
    <div className="w-14 h-14 rounded-full bg-[#E8EAED] flex items-center justify-center text-sm font-medium text-[#80868B] mr-3">
      {initials}
    </div>
  );
}

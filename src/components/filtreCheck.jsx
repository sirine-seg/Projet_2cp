import { useState } from "react";

const FiltreCheck = ({ 
    label,
    }) => {
  const [checked, setChecked] = useState(false);

  return (
    <label className="flex items-center space-x-3 max-w-[220px] cursor-pointer" onClick={() => setChecked(!checked)}>
      <div
        className={`w-5 h-5 flex items-center justify-center rounded-md transition-colors duration-200 ${
          checked
            ? "bg-[#F09C0A]"
            : "bg-white border-1 border-gray-400"
        }`}
      >
        {checked && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-[#5F6368]">{label}</span>
    </label>
  );
}

export default FiltreCheck;

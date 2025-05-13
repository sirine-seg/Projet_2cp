import React from "react";

export default function HorizontalDropdown({
  options = [],
  handleSelect = () => {},
  className = "",
}) {
  return (
    <div
      className={`absolute w-full z-10 bg-white border border-gray-200 rounded-[0.5rem] shadow-xl py-1 overflow-x-auto max-h-32 text-[0.8125rem] font-poppins font-regular ${className}`}
    >
      <div
        className="flex gap-2 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {options.map((option) => (
          <div
            key={option.value || option}
            className="h-10 px-4 py-2 cursor-pointer transition-colors duration-200 flex items-center justify-center rounded-md"
            onClick={() => handleSelect(option.value || option)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E1E3E4";
              e.currentTarget.style.color = "#202124";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#202124";
            }}
          >
            {option.label || option}
          </div>
        ))}
      </div>
    </div>
  );
}
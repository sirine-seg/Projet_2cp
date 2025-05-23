import { useState } from "react";
import Options from "./options";
import HorizontalDropdown from "./horizontalDropdown";

export default function ChoiceContainer({
  title,
  options = [],
  selectedOption = "",
  onSelect = () => {},
  placeholder = "--",
  bgColor = "bg-white",
  maxWidth = "max-w-xs",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  const shouldShowAsterisk = ["Localisation"].includes(title);

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="flex items-start text-sm font-poppins font-medium text-[#202124] text-[1rem] mb-1 ml-0.25rem">
          {title}
          {shouldShowAsterisk && <span className="text-red-500 ml-1 text-md">*</span>}
        </label>
        <details
          className="relative w-full cursor-pointer"
          open={isOpen}
          onToggle={(e) => setIsOpen(e.target.open)}
        >
          <summary
            className={`flex w-full py-3 px-4 border border-white rounded-[0.5rem] text-[#80868B] text-[1rem] font-regular font-poppins justify-between ${bgColor} transition-colors duration-200 focus:outline-0 focus:ring-0 shadow-md`}
          >
            <span>{selectedOption || placeholder}</span>
            <svg
              className="h-5 w-5 text-gray-400 transition-transform duration-200"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </summary>
          {title === "Localisation" || title === "Type" ? (
            <HorizontalDropdown options={options} handleSelect={handleSelect} />
          ) : (
            <Options options={options} handleSelect={handleSelect} />
          )}
        </details>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import chevronFiltre from "../assets/chevronFiltre.svg";
import FiltrePopUp from "./FiltrePopUp"; // Import the dropdown component

const Filtre = ({
  label,
  bgColor = "#F4F4F4",
  textColor = "#202124",
  options = [], // Add options prop for the dropdown content
  onSelectFilter = () => {}, // Callback for when an option is selected
  className = "",
  titre = "Filtrer par", // Default title for the dropdown
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOptionSelect = (option) => {
    onSelectFilter(option); // Call the provided callback
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="relative flex-shrink-0"> {/* Added flex-shrink-0 */}
      <button
        onClick={handleClick}
        className={`
          flex items-center justify-between gap-1 sm:gap-2
          px-2 py-1 sm:px-4 sm:py-2
          rounded-md
          shadow-sm
          cursor-pointer
          border
          transition-all duration-300
          ${isOpen ? "border-[#F09C0A] bg-[#F3E2C5]" : "border-transparent"}
          hover:shadow-md
          ${className}
          text-xs sm:text-sm
          h-6 sm:h-8
        `}
        style={{
          backgroundColor: isOpen ? "#F3E2C5" : bgColor,
          color: textColor,
        }}
      >
        <span className="font-semibold truncate text-xxs sm:text-xs">{label}</span> {/* Even smaller label text on mobile */}
        <img
          src={chevronFiltre}
          alt="Chevron"
          className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Conditionally render the dropdown */}
      {isOpen && (
        <FiltrePopUp
          titre={titre}
          options={options}
          onSelect={handleOptionSelect}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default Filtre;
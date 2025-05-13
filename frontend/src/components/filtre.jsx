import React, { useEffect, useRef, useState } from "react";
import chevronFiltre from "../assets/chevronFiltre.svg";
import FiltrePopUp from "./FiltrePopUp";

const Filtre = ({
  id,
  label,
  bgColor = "#F4F4F4",
  textColor = "#202124",
  options = [],
  onSelectFilter = () => {},
  className = "",
  titre = "Filtrer par",
  isOpen,
  setOpenFilterId,
}) => {
  const [alignRight, setAlignRight] = useState(false);
  const buttonRef = useRef(null);

  const handleToggle = () => {
    setOpenFilterId(isOpen ? null : id); // Ferme si déjà ouvert, sinon ouvre
  };

  const handleClick = () => {
    if (isOpen) {
      setOpenFilterId(null);
    } else {
      setOpenFilterId(id);
    }
  };

  const handleOptionSelect = (option) => {
    onSelectFilter(option);
    setOpenFilterId(null);
  };

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const screenMidpoint = window.innerWidth / 2;
      setAlignRight(rect.right > screenMidpoint);
    }
  }, [isOpen]);

  return (
    <div className="relative flex-shrink-0">
      <button
        ref={buttonRef}
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
        <span className="font-semibold truncate text-xxs sm:text-xs">
          {label}
        </span>
        <img
          src={chevronFiltre}
          alt="Chevron"
          className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <FiltrePopUp
          titre={titre}
          options={options}
          onSelect={handleOptionSelect}
          onClose={() => setOpenFilterId(null)}
          alignRight={alignRight}
        />
      )}
    </div>
  );
};

export default Filtre;

import { useState } from "react";
import chevronFiltre from "../assets/chevronFiltre.svg";

const Filtre = ({
  label,
  bgColor = "#F4F4F4",
  textColor = "#202124",
  onClick,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e) => {
    setIsOpen(!isOpen);
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center justify-between gap-2
        px-4 py-2 
        rounded-md
        shadow-sm 
        cursor-pointer
        border
        transition-all duration-300
        ${isOpen ? "border-[#F09C0A] bg-[#F3E2C5]" : "border-transparent"}
        hover:shadow-md
        ${className}
      `}
      style={{
        backgroundColor: isOpen ? "#F3E2C5" : bgColor,
        color: textColor,
      }}
    >
      <span className="font-semibold">{label}</span>
      <img
        src={chevronFiltre}
        alt="Chevron"
        className={`h-4 w-4 transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};

export default Filtre;

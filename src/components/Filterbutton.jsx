// src/components/FilterButton.js
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const Filterbutton = ({
  text,
  selected = false,
  hasDropdown = false,
  isDropdownOpen = false,
  onClick,
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
    flex items-center justify-center
    px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6
    py-1.5 xs:py-2 sm:py-2.5 md:py-3
    text-[10px] xs:text-xs sm:text-sm md:text-base
    rounded-md font-semibold
    whitespace-nowrap
    transition duration-200 ease-in-out
        ${selected ? "bg-[#F09C0A] text-white" : "bg-white text-black"}
      `}
    >
      {text}
      {hasDropdown && (
        <FaChevronDown
          className={`
            ml-2 transition-transform duration-200
            ${isDropdownOpen ? "rotate-180" : ""}
          `}
        />
      )}
    </motion.button>
  );
};

export default Filterbutton;

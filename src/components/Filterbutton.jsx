import { motion } from "framer-motion";



const Filterbutton = ({
  text,
  selected = false,
  onClick,
  bgColor = "#F09C0A", // Default selected color
  defaultBgColor = "bg-white", // Default unselected color
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}

      onClick={onClick}
      className={`
        flex items-center justify-center
        px-2.5 xs:px-3.5 sm:px-4 md:px-4 lg:px-6
        py-2 xs:py-2 sm:py-2.5 md:py-2

        text-[10px] xs:text-xs sm:text-sm md:text-base
        rounded-md font-semibold
        whitespace-nowrap
        transition duration-200 ease-in-out
        cursor-pointer
        ${selected ? `bg-${bgColor} text-white` : `${defaultBgColor} text-black`}
      `}
      style={{ backgroundColor: selected ? bgColor : undefined }} // Optional: For more specific control
    >
      {text}

    </motion.button>
  );
};

export default Filterbutton;
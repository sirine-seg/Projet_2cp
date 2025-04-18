import { motion } from "framer-motion";

const Button = ({
  text,
  bgColor = "#20599E",
  textColor = "white",
  onClick,
  className = "",
}) => {
  return (
    <div className="flex justify-center items-center mt-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`
          flex items-center justify-center rounded-lg shadow-md font-bold transition duration-200
          px-2 py-1 text-sm
          sm:px-3 sm:py-2 sm:text-base
          md:px-4 md:py-2 md:text-lg
          ${className}
        `}
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {text}
      </motion.button>
    </div>
  );
};

export default Button;

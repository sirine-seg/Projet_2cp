import { motion } from "framer-motion";

const Buttonrec = ({
  text,
  bgColor = "#20599E",
  textColor = "white",
  onClick,
  className = "",
}) => {
  return (
    <div className="flex justify-center items-center">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`
         flex items-center space-x-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200
          px-4 py-2 text-base
          md:px-4 md:py-2 md:text-md
          cursor-pointer
${className}
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

export default Buttonrec;
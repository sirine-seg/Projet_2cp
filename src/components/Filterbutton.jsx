import { motion } from "framer-motion";

const Filterbutton = ({
  text,
  selected = false,
  onClick,
  bgColor = "#F09C0A",
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex items-center justify-center
        px-2 py-1 sm:px-4 sm:py-2
        text-xs sm:text-sm
        rounded-md font-semibold
        whitespace-nowrap
        transition-all duration-300
        cursor-pointer
        h-6 sm:h-8
        ${selected ? 'text-white' : 'text-black'}
      `}
      style={{ 
        backgroundColor: selected ? bgColor : '#F4F4F4',
        border: selected ? '1px solid transparent' : '1px solid transparent'
      }}
    >
      {text}
    </motion.button>
  );
};

export default Filterbutton;
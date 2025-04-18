import { motion } from "framer-motion";
import add from '../assets/add.svg';

const AjouterButton = ({
  text = "Ajouter",
  bgColor = "#20599E",
  textColor = "white",
  onClick,
}) => {
  return (
    <div className="flex justify-center items-center mt-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`
          flex items-center space-x-2 rounded-lg shadow-md transition duration-200
          px-2 py-1 text-sm
          sm:px-3 sm:py-2 sm:text-base
          md:px-4 md:py-2 md:text-lg
          cursor-pointer
        `}
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {/* Icône "+" avec même taille que le texte */}
        <img src={add} alt="AddIcon" className="h-5 w-5" />
        <span>{text}</span>
      </motion.button>
    </div>
  );
};

export default AjouterButton;

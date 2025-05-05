import { motion } from "framer-motion";

const Button = ({
  text = "Enregistrer", // Valeur par défaut
  bgColor = "#20599E",  // Valeur par défaut
  textColor = "white",  // Valeur par défaut
  onClick,
  }) => {
  return (
    <div className="flex justify-center items-center mt-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="px-4 py-2 rounded-md font-bold transition duration-200 cursor-pointer"
        style={{ 
            backgroundColor: bgColor,
            color: textColor
         }}
      >
        {text}
      </motion.button>
    </div>
  );
};

export default Button;
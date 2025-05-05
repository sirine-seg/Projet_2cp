import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import check from "../assets/check.svg"; 
import quitter from "../assets/quitter.svg"; 

const PopupMessage = ({
  title,
  message,
  iconSrc = check,
  iconBgColor = "#E0ECF8",
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  return (
    <AnimatePresence>
      {isPopupVisible && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-opacity-40 px-2 sm:px-4">
          {/* Animation du fond seulement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-opacity-40"
          />
          
          {/* Popup content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-3xl w-full max-w-[90%] sm:max-w-[500px] mx-auto p-6 shadow-2xl relative text-center"
          >
            {/* icône */}
            <img
              src={iconSrc}
              alt="Icon"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 mx-auto mb-4"
            />

            {/* Titre */}
            <p className="text-xl font-semibold text-gray-900 mb-2">
              {title}
            </p>

            {/* Message */}
            {message && (
              <p className="mt-1 text-xs sm:text-sm md:text-base lg:text-lg text-gray-600">
                {message}
              </p>
            )}

            {/* Bouton de fermeture */}
            <motion.img 
              src={quitter} 
              alt="quitter"
              onClick={() => setIsPopupVisible(false)}
              className="absolute top-4 right-4 h-8 w-8 transition-all duration-200 hover:shadow-sm hover:rounded-lg cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupMessage;
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import attention from "../assets/attention.svg";
import Button from "./Button";
import quitter from "../assets/quitter.svg"; 

const Popupdelete = ({
  isVisible = true,
  onClose,
  onConfirm,
  title = "Êtes-vous sûr ?",
  message = "",
  userId = null,
  confirmText = "Supprimer",
  iconSrc = attention,
  iconBgColor = "#FFF0F0",
  confirmColor = "#F09C0A",
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-opacity-50 px-2">
          {/* Animation du fond */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-opacity-50"
          />
          
          {/* Contenu de la popup */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white w-full max-w-[90%] sm:max-w-[500px] p-6 rounded-3xl shadow-2xl relative text-center"
          >
            {/* Bouton de fermeture (X) */}
            <motion.img 
              src={quitter} 
              alt="quitter"
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 transition-all duration-200 hover:shadow-sm hover:rounded-lg cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />

            {/* Icône */}
            <img
              src={iconSrc}
              alt="Icon"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 mx-auto mb-4"
            />

            {/* Titre */}
            <p className="text-xl font-semibold text-gray-900 mb-2">
              {title} {userId && <span className="text-black">#{userId}</span>}
            </p>

            {/* Message */}
            {message && (
              <p className="text-sm text-gray-600 mb-6">{message}</p>
            )}

            {/* Bouton unique de confirmation */}
            <div className="flex justify-center">
              <Button
                text={confirmText}
                bgColor={confirmColor}
                onClick={() => {
                  if (onConfirm) onConfirm(userId);
                  onClose();
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Popupdelete;

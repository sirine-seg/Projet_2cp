import React from "react";
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
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center  bg-opacity-50 px-2">
      <div className="bg-white w-full max-w-[90%] sm:max-w-[500px] p-6 rounded-3xl shadow-2xl relative text-center">
        
        {/* Bouton de fermeture (X) */}
        <img 
          src={quitter} alt="quitter"
          onClick={() => setIsPopupVisible(false)}
          className="
            absolute top-4 right-4 
            h-8 w-8 
            transition-all duration-200
            hover:shadow-sm 
            hover:rounded-lg
            cursor-pointer
          "
        />

        {/* Icône */}
        <img
          src={iconSrc}
          alt="Icon"
          className="
           w-12 h-12        /* 64px par défaut (mobile) */
    sm:w-16 sm:h-16     /* 80px sur petit écran */
    md:w-20 md:h-20    /* 96px sur tablette */
    lg:w-22 lg:h-22    /* 112px sur ordinateur */
    xl:w-28 xl:h-28     /* 128px sur grand écran */
    mx-auto mb-6   
        "
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
      </div>
    </div>
  );
};

export default Popupdelete;

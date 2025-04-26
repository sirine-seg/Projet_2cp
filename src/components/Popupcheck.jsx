import React, { useState } from "react";
import check from "../assets/check.svg"; 
import quitter from "../assets/quitter.svg"; 

const PopupMessage = ({
  title,
  message,
  iconSrc = check,
  iconBgColor = "#E0ECF8",
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(true); // Popup visible par défaut

  if (!isPopupVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40 px-2 sm:px-4">
  <div className="bg-white w-full max-w-[75%] sm:max-w-[90%] md:max-w-[70%] lg:max-w-[500px] lg:max-h-[500px] p-3 sm:p-6 rounded-3xl shadow-2xl relative text-center overflow-hidden break-words min-w-0">
        {/*  icône */}
        <img
          src={iconSrc}
          alt="Icon"
          className="
          w-12 h-12        /* 64px par défaut (mobile) */
    sm:w-16 sm:h-16     /* 80px sur petit écran */
    md:w-20 md:h-20    /* 96px sur tablette */
    lg:w-24 lg:h-24    /* 112px sur ordinateur */
    xl:w-28 xl:h-28     /* 128px sur grand écran */
    mx-auto mb-6   
        "
        />

        {/* Titre */}
        <p className="  text-lg          
    sm:text-xl         
    md:text-2xl        
    lg:text-3xl        
    font-semibold text-gray-900
    mb-2
">{title}</p>

        {/* Message */}
        {message && (
          <p className="  mt-1
      text-xs            
      sm:text-sm         
      md:text-base       
      lg:text-lg       
      text-gray-600
  ">{message}</p>
        )}

        {/* Bouton de fermeture */}
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
      </div>
    </div>
  );


};

export default PopupMessage;

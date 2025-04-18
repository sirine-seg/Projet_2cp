import React, { useState } from "react";
import check from "../assets/check.svg"; 

const PopupMessage = ({
  title,
  message,
  iconSrc = check,
  iconBgColor = "#E0ECF8",
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(true); // Popup visible par défaut

  if (!isPopupVisible) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center  bg-opacity-40 px-2 sm:px-4">
  <div className="bg-white w-full max-w-[75%] sm:max-w-[90%] md:max-w-[70%] lg:max-w-[500px] lg:max-h-[500px] p-3 sm:p-6 rounded-3xl shadow-2xl relative text-center overflow-hidden break-words min-w-0">
        {/*  icône */}
        <img
          src={iconSrc}
          alt="Icon"
          className="
          w-6 h-6            
          sm:w-8 sm:h-8      
          md:w-10 md:h-10    
          lg:w-12 lg:h-12     
          xl:w-14 xl:h-14    
          mx-auto mb-4
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
        <button
          onClick={() => setIsPopupVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-lg"
        >
          X
        </button>
      </div>
    </div>
  );


};

export default PopupMessage;

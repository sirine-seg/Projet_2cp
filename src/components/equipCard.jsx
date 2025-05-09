import React from "react";
import { motion } from "framer-motion";
import Badge from "./badge";
import { MoreVertical } from "lucide-react";
import localisationIcon from '../assets/localisationIcon.svg';

const EquipCard = ({ nom, etat, code, localisation, onClick, moreClick }) => {
  const etatColors = {
    "En service": "#49A146",
    "En maintenance": "#F09C0A",
    "En panne": "#FF4423"
  };

  const badgeColor = etatColors[etat] || "#9AA0A6";

  const handleMoreClick = (e) => {
    e.stopPropagation();
    moreClick?.();
  };

  return (
    <motion.div 
      className="
        bg-white rounded-xl shadow-md
        pr-4 pl-5 pt-4 pb-5
        w-full 
        relative cursor-pointer
      "
      onClick={onClick}
      whileHover={{ 
        y: -4,
        scale: 1.02,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        transition: { 
          duration: 0.2,
          ease: "easeOut"
        }
      }}
      whileTap={{ 
        y: 0,
        scale: 1,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
    >
      {/* Header avec badge et ID */}
      <div className="flex items-center justify-between mb-2 sm:mb-2">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <Badge 
            text={`#${code}`} 
            bgColor="#9AA0A6" 
            className="text-[0.7rem] sm:text-[12px]" 
          />
          <Badge 
            text={etat} 
            bgColor={badgeColor} 
            className="text-[0.7rem] sm:text-[12px] max-w-[120px] sm:max-w-[140px] truncate" 
          />
        </div>

        {/* Trois points */}
        <motion.div
          className="p-1 rounded-full hover:bg-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMoreClick}
        >
          <MoreVertical 
            className="text-[#202124] w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" 
          />
        </motion.div>
      </div>

      <div className="flex flex-col gap-1 sm:gap-2">
        {/* Nom de l'équipement */}
        <h2 className="
          text-lg sm:text-xl md:text-2xl
          font-bold text-[#202124]
          truncate
        ">
          {nom}
        </h2>

        {/* Localisation */}
        <div className="flex items-center text-gray-800 gap-1 sm:gap-2">
          <img
            src={localisationIcon}
            alt="Localisation"
            className="h-4 w-4 sm:h-5 sm:w-5"
          />
          <span className="font-bold text-xs sm:text-sm truncate">
            {localisation}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default EquipCard;
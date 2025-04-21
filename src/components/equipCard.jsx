import React from "react";
import Badge from "./badge";
import { MoreVertical } from "lucide-react";
import localisationIcon from '../assets/localisationIcon.svg';

const EquipCard = ({ nom, etat, id, localisation, onClick, moreClick }) => {
  const etatColors = {
      "en service": "#49A146",
      "en maintenance": "#F09C0A",
      "en panne": "#FF4423"
  };

  const badgeColor = etatColors[etat] || "#9AA0A6";

  const handleMoreClick = (e) => {
    e.stopPropagation();
    moreClick?.();
  };

  return (
    <div 
      className="
        bg-white rounded-xl shadow-md 
        pr-5 pl-7 pt-4 pb-6
        w-full 
        relative cursor-pointer
        transition-all hover:shadow-lg
      " 
      onClick={onClick}
    >
      {/* Header avec badge et ID */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <Badge text={etat} bgColor={badgeColor} className="text-xs sm:text-sm max-w-[120px] sm:max-w-[140px] truncate" />
          <Badge text={`#${id}`} bgColor="#9AA0A6" className="text-xs sm:text-sm" />
        </div>

        {/* Trois points */}
        <div className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <MoreVertical 
            className="text-[#202124] w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" 
            onClick={handleMoreClick} 
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 sm:gap-2">
        {/* Nom de l'équipement */}
        <h2 className="
          text-xl sm:text-2xl md:text-[28px] 
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
          <span className="font-bold text-sm sm:text-base truncate">
            {localisation}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EquipCard;

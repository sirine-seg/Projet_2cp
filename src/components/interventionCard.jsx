import React from "react";
import Badge from "./badge";
import { MoreVertical } from "lucide-react";
import interventionIcon from '../assets/interventionIcon.svg';
import equipementIcon from '../assets/equipementIcon.svg';
import calendar from '../assets/calendar.svg';

const InterventionCard = ({ nom, urgence, statut, id, equipement, date, onClick, moreClick }) => {
  const urgenceColors = {
    "Vitale": "#F09C0A",
    "Elevée": "#20599E",
    "Modérée": "#FF4423",
    "Faible": "#49A146",
  };
    
  const statusColors = {
    "Affecte": "#F09C0A",
    "En cours": "#20599E",
    "En attente": "#FF4423",
    "Terminé": "#49A146",
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    moreClick?.();
  };

  return (
    <div 
      className="
        bg-white rounded-xl shadow-md 
        pr-4 pl-5 pt-4 pb-6
        w-full
        relative cursor-pointer
        transition-all hover:shadow-lg
      " 
      onClick={onClick}
    >
      {/* Header avec badge et ID */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <Badge text={`#${id}`} bgColor="#9AA0A6" className="text-xs sm:text-sm" />
          <Badge text={urgence} bgColor={urgenceColors[urgence]} className="text-xs sm:text-sm max-w-[100px] sm:max-w-[100px] truncate" />
          <Badge text={statut} bgColor={statusColors[statut] || "#9AA0A6"} className="text-xs sm:text-sm max-w-[100px] sm:max-w-[100px] truncate" />
        </div>
                
        {/* Trois points */}
        <div className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <MoreVertical 
            className="text-[#202124] w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" 
            onClick={handleMoreClick} 
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:gap-3">
        {/* Nom de l'intervention */}
        <div className="flex items-center text-gray-800 gap-2 sm:gap-3">
          <img 
            src={interventionIcon} 
            alt="Intervention" 
            className="h-5 w-5 sm:h-6 sm:w-6" 
          />
          <h2 className="
            text-xl sm:text-2xl md:text-[28px] 
            font-bold text-[#202124] 
            truncate
          ">
            {nom}
          </h2>
        </div>

        {/* Equipement et date */}
        <div className="flex flex-row gap-2 sm:gap-4 md:gap-6">
          {/* Equipement */}
          <div className="flex items-center text-gray-800 gap-1 sm:gap-2">
            <img 
              src={equipementIcon} 
              alt="Equipement" 
              className="h-4 w-4 sm:h-5 sm:w-5" 
            />
            <span className="font-semibold text-xs sm:text-sm truncate">
              {equipement}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center text-gray-800 gap-1 sm:gap-2">
            <img 
              src={calendar} 
              alt="Date" 
              className="h-4 w-4 sm:h-5 sm:w-5" 
            />
            <span className="font-semibold text-xs sm:text-sm">
              {date}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterventionCard;

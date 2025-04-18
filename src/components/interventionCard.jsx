import React from "react";
import Badge from "./badge";
import { MoreVertical } from "lucide-react";
import interventionIcon from '../assets/interventionIcon.svg';
import equipementIcon from '../assets/equipementIcon.svg';
import calendar from '../assets/calendar.svg';

const interventionCard = ({ nom, urgence, statut, id, equipement, date, onClick, moreClick }) => {
    const urgenceColors = {
      "Urgence vitale": "#F09C0A",
      "Urgence élevée": "#20599E ",
      "Urgence modérée": "#FF4423",
      "Faible urgence": "#49A146",
    };
    
    const statusColors = {
      "Affecte": "#F09C0A",
      "En cours": "#20599E",
      "En attente": "#FF4423",
      "Terminé": "#49A146",
    };

    const badgeColor = statusColors[statut] || "#9AA0A6";

    const handleMoreClick = (e) => {
      e.stopPropagation(); // Empêche le déclenchement de onClick de la carte
      if (moreClick) {
        moreClick();
      }
    };

  return (
    <div className="bg-white rounded-xl shadow-md pr-5 pl-7 pt-4 pb-6 max-w-[380px] relative" onClick={onClick}>
    
      {/* Header avec badge et ID */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge text={`#${id}`} bgColor="#9AA0A6" />
          <Badge text={urgence} bgColor={urgenceColors[urgence]} />
          <Badge text={statut} bgColor={badgeColor} />
          
        </div>
        {/* Trois points */}
        <div className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <MoreVertical 
            className="text-[#202124] w-5 h-5 cursor-pointer" 
            onClick={handleMoreClick} 
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Nom de l'équipement */}
        <div className="flex items-center text-gray-800 gap-3">
          <img src={interventionIcon} alt="InterventionIcon" className="h-6 w-6" />
          <h2 className="text-[28px] font-bold text-[#202124]">{nom}</h2>
        </div>

        {/* Equipement et date */}
        <div className="flex gap-6">
          {/* Equipement */}
          <div className="flex items-center text-gray-800 gap-1">
            <img src={equipementIcon} alt="EquipementIcon" className="h-5 w-5" />
            <span className="font-semibold text-sm">{equipement}</span>
          </div>

          {/* Date */}
          <div className="flex items-center text-gray-800 gap-1">
            <img src={calendar} alt="CaledarIcon" className="h-5 w-5" />
            <span className="font-semibold text-sm">{date}</span>
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default interventionCard;

import React from "react";
import Badge from "./badge";
import { MoreVertical } from "lucide-react";
import localisationIcon from '../assets/localisationIcon.svg';

const equipCard = ({ nom, etat, id, localisation, onClick, moreClick }) => {
    const etatColors = {
        "en service": "#49A146",
        "en maintenance": "#F09C0A",
        "en panne": "#FF4423"
    };

    const badgeColor = etatColors[etat] || "#9AA0A6";

    const handleMoreClick = (e) => {
        e.stopPropagation(); // Empêche le déclenchement de onClick de la carte
        if (moreClick) {
            moreClick();
        }
    };

  return (
    <div className="bg-white rounded-xl shadow-md pr-5 pl-7 pt-4 pb-6 w-[353px] relative" onClick={onClick}>
    
      {/* Header avec badge et ID */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge text={etat} bgColor={badgeColor} />
          <Badge text={`#${id}`} bgColor="#9AA0A6" />
        </div>
        <MoreVertical 
          className="text-[#202124] w-5 h-5 cursor-pointer" 
          onClick={handleMoreClick} 
        />
      </div>

      <div className="flex flex-col gap-2">
        {/* Nom de l'équipement */}
        <h2 className="text-[28px] font-bold text-[#202124]">{nom}</h2>

        {/* Localisation */}
        <div className="flex items-center text-gray-800 gap-2">
          <img src={localisationIcon} alt="LocalisationIcon" className="h-5 w-5" />
          <span className="font-bold text-base">{localisation}</span>
        </div>
      </div>
      
    </div>
  );
};

export default equipCard;

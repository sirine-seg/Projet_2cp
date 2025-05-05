import React from "react";
import { MoreVertical } from "lucide-react";
import CustomCheckbox from "./customCheckbox";

const InterventionList = ({ 
  nom, 
  equipement, 
  urgence, 
  statut,
  moreClick,
  checked = false,
  onToggle = () => {}
}) => {
    const urgenceColors = {
        "Urgence vitale": "bg-[#F09C0A]",
        "Urgence élevée": "bg-[#20599E]",
        "Urgence modérée": "bg-[#FF4423]",
        "Faible urgence": "bg-[#49A146]",
    };

    const handleMoreClick = (e) => {
        e.stopPropagation();
        moreClick?.();
    };

    return (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm pl-3 pr-2 sm:px-4 py-2 w-full">
            {/* Checkbox à gauche */}
            <div 
              className="mr-3 sm:mr-4"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
                <CustomCheckbox checked={checked} color="#20599E" />
            </div>

            <div className="flex items-center gap-4 flex-grow overflow-hidden text-sm sm:text-base">
                {/* Rond (urgence) visible seulement sur mobile */}
                <span className={`sm:hidden flex-shrink-0 w-3 h-3 rounded-full ${urgenceColors[urgence]}`}></span>

                <span className={`w-[30%] sm:w-[25%] text-[#202124] overflow-hidden whitespace-nowrap`}>{nom}</span>
                <span className={`w-[30%] sm:w-[25%] text-[#202124] overflow-hidden whitespace-nowrap`}>{equipement}</span>
                
                {/* Rond et urgence (caché sur mobile) */}
                <div className="w-[20%] hidden sm:flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                        <span className={`flex-shrink-0 w-3 h-3 rounded-full ${urgenceColors[urgence]}`}></span>
                        <span className={`hidden sm:block text-[#202124] overflow-hidden whitespace-nowrap`}>{urgence}</span>
                    </div>
                </div>
                
                <span className={`w-[25%] sm:w-[15%] text-[#202124] overflow-hidden whitespace-nowrap ml-auto`}>{statut}</span>
            </div>
            
            <button 
              className="flex-shrink-0 text-gray-500 hover:text-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
                <MoreVertical 
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    onClick={handleMoreClick} 
                />
            </button>
        </div>
    );
};

export default InterventionList;
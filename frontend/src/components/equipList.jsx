import React from "react";
import { MoreVertical } from "lucide-react";
import CustomCheckbox from "./customCheckbox";

const EquipList = ({ 
  id, 
  nom, 
  localisation, 
  etat,
  moreClick,
  checked = false,
  onToggle = () => {}
}) => {
    const etatColors = {
        "En service": "bg-[#49A146]",
        "En maintenance": "bg-[#F09C0A]",
        "En panne": "bg-[#FF4423]",
    };

    const handleMoreClick = (e) => {
        e.stopPropagation();
        moreClick?.();
    };

    return (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm pl-3 pr-2 sm:px-4 py-2 w-full">
            {/* Checkbox à gauche */}
            <div 
                className="mr-4 sm:mr-5" 
                onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }}>
                <CustomCheckbox checked={checked} color="#20599E" />
            </div>

            <div className="flex items-center gap-4 flex-grow overflow-hidden text-sm sm:text-base">
                {/* Rond visible seulement sur mobile */}
                <span className={`sm:hidden flex-shrink-0 w-3 h-3 rounded-full ${etatColors[etat]}`}></span>

                <span className="hidden sm:block w-[15%] text-[#202124] overflow-hidden whitespace-nowrap">{id}</span>
                <span className="w-[40%] sm:w-[30%] text-[#202124] overflow-hidden whitespace-nowrap">{nom}</span>
                <span className="w-[40%] sm:w-[30%] text-[#202124] overflow-hidden whitespace-nowrap">{localisation}</span>
                
                <div className="sm:w-[30%] md:w-[20%] hidden sm:flex items-center space-x-2 ml-auto">
                    <div className="flex items-center space-x-2">
                        <span className={`flex-shrink-0 w-3 h-3 rounded-full ${etatColors[etat]}`}></span>
                        <span className="hidden sm:block text-[#202124] overflow-hidden whitespace-nowrap">{etat}</span>
                    </div>
                </div>
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

export default EquipList;
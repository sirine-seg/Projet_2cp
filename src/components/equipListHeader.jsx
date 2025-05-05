import React from "react";

const EquipListHeader = () => {
    return (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm px-3 sm:px-4 py-2 w-full">
            {/* Espace réservé pour la checkbox */}
            <div className="mr-4 sm:mr-5 w-5 flex-shrink-0"></div>

            <div className="flex items-center gap-4 flex-grow overflow-hidden text-sm sm:text-base font-semibold text-[#202124]">
                {/* Rond (invisible mais occupe l'espace sur mobile) */}
                <span className="sm:hidden flex-shrink-0 w-3 h-3 rounded-full opacity-0"></span>

                {/* ID visible seulement sur desktop */}
                <span className="hidden sm:block w-[15%] overflow-hidden whitespace-nowrap">ID</span>
                <span className="w-[40%] sm:w-[30%] overflow-hidden whitespace-nowrap">Nom</span>
                <span className="w-[40%] sm:w-[30%] overflow-hidden whitespace-nowrap">Localisation</span>

                {/* État visible seulement en desktop */}
                <div className="sm:w-[25%] md:w-[18%] hidden sm:flex items-center space-x-2 ml-auto">
                    <span className="overflow-hidden whitespace-nowrap">État</span>
                </div>
            </div>

            {/* Espace réservé pour le bouton MoreVertical */}
            <div className="w-4 sm:w-5 flex-shrink-0"></div>
        </div>
    );
};

export default EquipListHeader;

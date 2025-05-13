import React from "react";

const InterventionListHeader = () => {
    return (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm px-3 sm:px-4 py-2 w-full">
            {/* Espace réservé pour la checkbox */}
            <div className="mr-3 sm:mr-4 w-5 flex-shrink-0"></div>

            <div className="flex items-center gap-4 flex-grow overflow-hidden text-sm sm:text-base font-semibold text-[#202124]">
                {/* Rond (invisible mais occupe l'espace sur mobile) */}
                <span className="sm:hidden flex-shrink-0 w-3 h-3 rounded-full opacity-0"></span>

                <span className="w-[15%] sm:w-[10%] overflow-hidden whitespace-nowrap">Id</span>
                <span className="w-[30%] sm:w-[35%] overflow-hidden whitespace-nowrap">Nom</span>

                {/* Urgence desktop */}
                <div className="w-[20%] hidden sm:flex items-center space-x-2">
                    <span className="overflow-hidden whitespace-nowrap">Urgence</span>
                </div>

                <span className="w-[25%] sm:w-[15%] overflow-hidden whitespace-nowrap ml-auto">Statut</span>
            </div>

            {/* Espace réservé pour l’icône MoreVertical */}
            <div className="w-4 sm:w-5 flex-shrink-0"></div>
        </div>
    );
};

export default InterventionListHeader;
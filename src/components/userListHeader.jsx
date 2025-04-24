import React from "react";

const UserListHeader = () => {
    return (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm px-3 sm:px-4 py-2 w-full">
            <div className="flex items-center gap-4 flex-grow overflow-hidden text-sm sm:text-base font-semibold text-[#202124]">
                {/* Checkbox (invisible mais prend la place) */}
                <div className="w-5 sm:w-5 flex-shrink-0"></div>

                {/* Image placeholder */}
                <div className="w-8 flex-shrink-0"></div>

                <span className="w-[80%] sm:w-[30%] overflow-hidden whitespace-nowrap">Nom</span>
                <span className="hidden sm:block w-[40%] overflow-hidden whitespace-nowrap">Email</span>
                <span className="hidden sm:block w-[25%] overflow-hidden whitespace-nowrap">Rôle</span>
            </div>

            {/* Espace réservé pour le bouton MoreVertical */}
            <div className="w-4 sm:w-5 flex-shrink-0"></div>
        </div>
    );
};

export default UserListHeader;

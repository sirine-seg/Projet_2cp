import React from "react";
import { useNavigate } from "react-router-dom";

const Logs = ({ 
  id, 
  title,
}) => {
    const navigate = useNavigate();
   
    return (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm pl-3 pr-2 sm:px-4 py-2 w-full">
            <div className="flex items-center gap-4 flex-grow overflow-hidden text-sm sm:text-base">
                <span className="w-[15%] text-[#202124] overflow-hidden whitespace-nowrap">{id}</span>
                <span className="w-[40%] sm:w-[30%] text-[#202124] overflow-hidden whitespace-nowrap">{title}</span>
            </div>
            <button 
              className="flex-shrink-0 text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                // Check if id exists before navigating
                if (id) {
                  navigate(`DetailIntervention/${id}`);
                } else {
                  console.error("Intervention ID is undefined");
                }
              }}
            >
                Voir Details
            </button>
        </div>
    );
};

export default Logs;
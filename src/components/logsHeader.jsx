import React from "react";

const LogsHeader = () => {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm pl-3 pr-2 sm:px-4 py-2 w-full">
      
      <div className="flex items-center gap-4 flex-grow overflow-hidden text-sm sm:text-base font-semibold text-[#202124]">
        <span className=" w-[15%] overflow-hidden whitespace-nowrap">ID</span>
        <span className="w-[40%] sm:w-[30%] overflow-hidden whitespace-nowrap">Title</span>
       
      </div>

      <div className="flex-shrink-0 text-[#202124] font-semibold text-sm sm:text-base">
        Action
      </div>
    </div>
  );
};

export default LogsHeader;
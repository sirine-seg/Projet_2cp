import React, { useState } from "react";
import viewList from '../assets/viewList.svg';
import viewCard from '../assets/viewCard.svg';

const ViewToggle = ({ onChange }) => {
  const [view, setView] = useState("list");

  const handleClick = (newView) => {
    setView(newView);
    if (onChange) onChange(newView);
  };

  return (
    <div className="flex border-2 border-[#20599E] rounded-xl overflow-hidden w-fit shadow-sm">
      {/* Vue Liste */}
      <button
        onClick={() => handleClick("list")}
        className={`flex items-center justify-center transition-colors duration-200 
          focus:outline-none focus:ring-2 focus:ring-[#20599E]
          px-2 py-1
          ${view === "list" ? "bg-blue-100" : "bg-white"}`}
      >
        <img 
          src={viewList} 
          alt="List view" 
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" 
        />
      </button>

      {/* Vue Cartes */}
      <button
        onClick={() => handleClick("grid")}
        className={`flex items-center justify-center transition-colors duration-200 
          focus:outline-none focus:ring-2 focus:ring-[#20599E]
          px-2 py-1
          ${view === "grid" ? "bg-blue-100" : "bg-white"}`}
      >
        <img 
          src={viewCard} 
          alt="Card view" 
          className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8" 
        />
      </button>
    </div>
  );
};

export default ViewToggle;

import React, { useState } from "react";
import viewList from '../assets/viewList.svg';
import viewCard from '../assets/viewCard.svg';

const ViewToggle = ({ onChange }) => {
  const [view, setView] = useState("grid");

  const handleClick = (newView) => {
    setView(newView);
    if (onChange) onChange(newView);
  };

  return (
    <div className="flex border-2 border-[#20599E] rounded-xl overflow-hidden w-fit shadow-sm h-10">
      {/* Vue Liste */}
      <button
        onClick={() => handleClick("list")}
        className={`flex items-center justify-center transition-colors duration-200 
          focus:outline-none focus:ring-1 focus:ring-[#20599E]
          px-1 py-0.5
          ${view === "list" ? "bg-blue-100" : "bg-white"}`}
      >
        <img 
          src={viewList} 
          alt="List view" 
          className="w-6 h-6 sm:w-7 sm:h-7" 
        />
      </button>

      {/* Vue Cartes */}
      <button
        onClick={() => handleClick("grid")}
        className={`flex items-center justify-center transition-colors duration-200 
          focus:outline-none focus:ring-1 focus:ring-[#20599E]
          px-1 py-0.5
          ${view === "grid" ? "bg-blue-100" : "bg-white"}`}
      >
        <img 
          src={viewCard} 
          alt="Card view" 
          className="w-6 h-6 sm:w-7 sm:h-7" 
        />
      </button>
    </div>
  );
};

export default ViewToggle;

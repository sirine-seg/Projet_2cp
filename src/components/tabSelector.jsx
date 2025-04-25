import React from 'react';

const TabSelector = ({
  options = [],
  activeOption,
  setActiveOption,
  activeColor = '#FFFFFF',
  notActiveColor = '#5F6368',
  textSize = 'md:text-md', //it was originally text-lg but changed to md for notifsCard
}) => {
  return (
    <div className="flex justify-center gap-3 sm:gap-6 md:gap-8 overflow-x-auto">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => setActiveOption(option)}
          className={`relative text-sm sm:text-base ${textSize} font-medium pb-1 transition-all duration-200 whitespace-nowrap`}
          style={{
            color: activeOption === option ? activeColor : 'rgba(255,255,255,0.7)',
            borderBottom: activeOption === option ? `2px solid ${activeColor}` : '2px solid transparent',
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default TabSelector;

import React from 'react';

const TabSelector = ({
  options = [],
  activeOption,
  setActiveOption,
  activeColor = '#FFFFFF',
  inactiveColor = '#FFFFFF',
  underlineColor = '#FFFFFF',
  textSize = 'md:text-md',
}) => {
  return (
    <div className="flex justify-center gap-3 sm:gap-6 md:gap-8 overflow-x-auto">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => setActiveOption(option.label)}
          className={`relative text-sm sm:text-base ${textSize} font-medium pb-1 transition-all duration-200 whitespace-nowrap flex items-center gap-1`}
          style={{
            color: activeOption === option.label ? activeColor : inactiveColor,
            borderBottom: activeOption === option.label
              ? `2px solid ${underlineColor}`
              : '2px solid transparent',
          }}
        >
          <div className="flex items-center justify-center gap-x-2">
            <span>{option.label}</span>
            {option.count > 0 && (
              <span className="w-5 h-5 bg-[#DFDFDF] text-[#5F6368] text-xs flex items-center justify-center rounded-full">
                {option.count > 9 ? "9+" : option.count}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default TabSelector;

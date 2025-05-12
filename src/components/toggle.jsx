import React, { useState, useEffect } from 'react';

const Toggle = ({ label, isOn = true, onToggle }) => {
  const [isChecked, setIsChecked] = useState(isOn);

  useEffect(() => {
    setIsChecked(isOn);
  }, [isOn]);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onToggle) onToggle(newValue);
  };

  return (
    <div className="px-2 max-w-2xl flex justify-between items-center">
      {label && (
        <span className="flex-1 text-base sm:text-lg font-medium leading-none">
          {label}
        </span>
      )}

      <label className="relative inline-flex items-center cursor-pointer w-12 h-6">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
          className="sr-only"
        />
        <div
          className={`w-full h-full rounded-full transition-colors duration-300 ${
            isChecked ? 'bg-[#202124]' : 'bg-[#80868B]'
          }`}
        />
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
            isChecked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </label>
    </div>
  );
};

export default Toggle;
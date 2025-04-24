import React from "react";
import CustomCheckbox from "./customCheckbox";
import upload from '../assets/upload.svg';
import quitter from '../assets/quitter.svg';

const SelectionToolbar = ({
  selectedCount,
  allSelected,
  onSelectAll,
  onDeselectAll,
  onActionClick,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between px-4 sm:px-8 py-2 bg-[#DDDEDF] rounded-full shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onDeselectAll}
            className="text-gray-600 hover:text-black focus:outline-none cursor-pointer"
            title="Tout désélectionner"
          >
            <img
              src={quitter}
              alt="quitter"
              className="h-[22px] w-[22px] shrink-0"
            />
          </button>

          <span className="text-sm font-medium">{selectedCount} Sélectionné{selectedCount > 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center space-x-2">
          <CustomCheckbox
            checked={allSelected}
            id="selectAll"
            onChange={(e) => {
              if (!allSelected) {
              onSelectAll();
              } else {
              onDeselectAll();
              }
            }}
          />
          <label htmlFor="selectAll" className="text-sm font-medium">
          <span className="hidden sm:inline">Sélectionner </span>Tout
          </label>
        </div>
      </div>

      <div onClick={onActionClick}>
        <img 
            src={upload} 
            alt="upload" 
            className="h-[20px] w-[20px] shrink-0 cursor-pointer" 
          />
      </div>
    </div>
  );
};

export default SelectionToolbar;

import { useState } from 'react';
import Cube from "../assets/cube.svg";
import ModifyPen from "../assets/modifyPen.svg";
import EquipModifierPopUp from "./equipModifierPopUp";

export default function DisModContainerEquip({ title,
    initialName,
    initialId,
    equipements = [],
    onAssignEquip = () => {}, }) {

        const [name, setName] = useState(initialName);
        const [id, setId] = useState(initialId);
        const [isHovered, setIsHovered] = useState(false);
        const [isPopupOpen, setIsPopupOpen] = useState(false);
      
        const handleAssign = (selectedEquip) => {
          setName(selectedEquip.name);
          setId(selectedEquip.id);
          onAssignEquip(selectedEquip);
        };

  return (
    <div className="w-full mx-auto">
      <label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[0.8125rem] mb-1 ml-0.25rem">
        {title}
      </label>

      <div className="bg-white flex items-start w-full py-2 px-4 border border-white rounded-[0.5rem] font-regular font-poppins justify-between shadow-md transition-shadow duration-300 cursor-default">
        <div className="flex items-center space-x-3">
          <img src={Cube} alt="Cube" className="h-5 w-5" />
          <span className="font-medium text-[#202124]">{name} #{id}</span>
        </div>

        <button
          onClick={() => setIsPopupOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="text-[#202124] transition-transform duration-200"
          style={{
            cursor: 'pointer',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <img
            src={ModifyPen}
            alt="ModifyPen"
            className="h-5 w-5"
            style={{
              opacity: isHovered ? 0.8 : 1,
              transition: 'opacity 200ms ease'
            }}
          />
        </button>
      </div>

      {isPopupOpen && (
        <EquipModifierPopUp
          equipements={equipements}
          onAssign={handleAssign}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>

  );
}
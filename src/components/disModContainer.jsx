import { useState } from 'react';
import Cube from "../assets/cube.svg";
import ModifyPen from "../assets/modifyPen.svg";

export default function DisModContainer({ title, initialName, initialId, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [id, setId] = useState(initialId);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    onSave({ name, id });
    setIsEditing(false);
  };

  return (
    <div className="max-w-xs mx-auto">
      <label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[0.8125rem] mb-1 ml-0.25rem">
        {title}
      </label>
      
      <div className="bg-white flex items-start w-full py-2 px-4 border border-white rounded-[0.5rem] font-regular font-poppins justify-between shadow-md transition-shadow duration-300 cursor-default">
        <div className="flex items-center space-x-3">
          <span className="text-[#202124]">
            <img src={Cube} alt="Cube" className="h-5 w-5" />
          </span>
          
          {isEditing ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-24 border-b border-gray-300 focus:outline-none"
              />
              <span className="font-medium text-[#202124]">#</span>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-16 border-b border-gray-300 focus:outline-none"
              />
            </div>
          ) : (
            <span className="font-medium text-[#202124]">{name}  #{id}</span>
          )}
        </div>

        {isEditing ? (
          <button 
            onClick={handleSave}
            className="text-[#20599E] font-medium text-sm"
          >
            Save
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
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
        )}
      </div>
    </div>
  );
}
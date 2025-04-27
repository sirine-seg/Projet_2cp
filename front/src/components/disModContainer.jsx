import { useState } from 'react';
import ModifyPen from "../assets/modifyPen.svg";

export default function DisModContainer({ title, initialContent, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [Content, setContent] = useState(initialContent);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    onSave({ setContent });
    setIsEditing(false);
  };

  return (
    <div className="w-full mx-auto">
      <label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[1rem] mb-1.5 ml-0.25rem">
        {title}
      </label>
      
      <div className="bg-white flex items-start w-full py-2 px-4 border border-white rounded-[0.5rem] font-regular font-poppins justify-between shadow-md transition-shadow duration-300 cursor-default">
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={Content}
                onChange={(e) => setName(e.target.value)}
                className="w-24 border-b border-gray-300 focus:outline-none"
              />
            </div>
          ) : (
            <span className="font-medium text-[#202124]">{initialContent}</span>
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

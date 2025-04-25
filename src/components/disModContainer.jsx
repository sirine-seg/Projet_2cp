import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Assurez-vous d'inclure les styles de React DatePicker
import ModifyPen from "../assets/modifyPen.svg";

export default function DisModContainer({
  title,
  initialContent,
  onSave,
  type = "text", // Définit un type générique (texte par défaut)
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [isHovered, setIsHovered] = useState(false);
  const [startDate, setStartDate] = useState(initialContent ? new Date(initialContent) : new Date());

  const handleSave = () => {
    if (type === "date") {
      onSave(startDate.toISOString().slice(0, 10)); // Envoie la date formatée au format YYYY-MM-DD
    } else {
      onSave(content); // Sinon, envoie la valeur du texte ou autre
    }
    setIsEditing(false);
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    setContent(date.toISOString().slice(0, 10)); // Mets à jour la date au format YYYY-MM-DD
  };

  return (
    <div className="w-full mx-auto">
      <label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[1rem] mb-1.5 ml-0.25rem">
        {title}
      </label>
      
      <div className="bg-white flex items-start w-full py-2 px-4 border border-white rounded-[0.5rem] font-regular font-poppins justify-between shadow-md transition-shadow duration-300 cursor-default">
        <div className="flex items-center space-x-3">
          {isEditing ? (
            // Affichage selon le type
            type === "date" ? (
              <ReactDatePicker
                selected={startDate}
                onChange={handleDateChange}
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm"
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Heure"
                calendarClassName="custom-calendar"
                inline
              />
            ) : type === "number" ? (
              <input
                type="number"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-24 border-b border-gray-300 focus:outline-none"
              />
            ) : (
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-24 border-b border-gray-300 focus:outline-none"
              />
            )
          ) : (
            <span className="font-poppins text-[#202124]">{content}</span>
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
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <img 
              src={ModifyPen} 
              alt="ModifyPen" 
              className="h-5 w-5" 
              style={{
                opacity: isHovered ? 0.8 : 1,
                transition: 'opacity 200ms ease',
              }}
            />
          </button>
        )}
      </div>
    </div>
  );
}

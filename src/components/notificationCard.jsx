import { ChevronLeft, MoreHorizontal } from "lucide-react";
import Profil from "../assets/Profil.svg";
import { useState, useRef, useEffect } from "react";
import Options from "../components/options";
import { useNavigate } from "react-router-dom";

export default function NotificationCard({
  title,
  description,
  time,
  imageUrl,
  type,
  buttonTitle,
  unread,
  onMarkAsRead,
  id,
  intervention
}) {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const navigate = useNavigate();

  const optionsList = [
    { label: "Marquer comme lu", value: "mark_as_read" },
  ];

  const handleOptionSelect = (value) => {
    if (value === "mark_as_read" && onMarkAsRead) {
      onMarkAsRead(id);
    }
    setShowOptions(false);
  };

  // Fermer les options quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`px-1 flex justify-center rounded-xl overflow-hidden ${unread ? "bg-[#E3ECF5]" : "bg-transparent"} `}>
      <div className="rounded-lg w-full max-w-[900px] flex justify-between items-start border-b border-[#E0E0E0]">
        <div className="px-6 py-4 flex gap-3 w-full min-w-0">
          <div className="relative flex-shrink-0 w-9 h-9 md:w-10 md:h-10 mr-2 mt-4 flex items-center justify-center">
            {unread && (
              <span className="absolute left-[-16px] lg:left-[-18px] w-2.5 h-2.5 bg-[#20599E] rounded-full"></span>
            )}
            <div className="w-full h-full rounded-full bg-[#E8EAED] flex items-center justify-center text-xs font-medium text-[#80868B] overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={imageUrl}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <img
                  src={Profil}
                  alt="Profil"
                  className="w-full h-full"
                />
              )}
            </div>
          </div>

          <div className="flex-grow min-w-0 space-y-1.5">
            {type && (
              <div className="text-xs md:text-sm font-poppins font-semibold text-[#5F6368] mb-1">
                {type}
              </div>
            )}

            <div className="text-sm md:text-base font-poppins font-bold text-[#202124]">
              {title}
            </div>

            <div className="text-xs md:text-sm font-poppins text-[#202124] leading-snug">
              {description}
            </div>

            <div className="pt-2">
              {buttonTitle && (
                <button
                  onClick={() => navigate(`/DetailsIntervention/${intervention}`)}
                  className="bg-[#20599E] text-white px-2.5 py-1 md:px-3 md:py-1.5 pr-3 rounded font-poppins font-semibold flex items-center justify-center gap-1 transition cursor-pointer text-xs md:text-sm">
                  <ChevronLeft size={12} className="md:w-3 md:h-3" />
                  {buttonTitle}
                </button>
              )}
            </div>

            <div className="font-poppins text-xs text-[#5F6368] pt-1.5">
              il y a {time}
            </div>
          </div>

          <div className="flex-shrink-0 text-[#202124] ml-1.5 relative" ref={optionsRef}>
            <button
              className="cursor-pointer"
              onClick={() => setShowOptions(!showOptions)}
            >
              <MoreHorizontal size={16} className="md:w-5 md:h-5" />
            </button>

            {showOptions && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right">
                <Options
                  options={optionsList}
                  handleSelect={handleOptionSelect}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
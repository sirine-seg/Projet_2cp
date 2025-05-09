import { motion } from "framer-motion";
import Badge from "./badge";
import { MoreVertical } from "lucide-react";
import interventionIcon from '../assets/interventionIcon.svg';
import equipementIcon from '../assets/equipementIcon.svg';
import calendar from '../assets/calendar.svg';

const InterventionCard = ({ nom, urgence, statut, id, equipement, date, onClick, moreClick }) => {
  const urgenceColors = {
    "Urgence vitale": "#FF4423",
    "Urgence élevée": "#F09C0A",
    "Urgence modérée": "#20599E",
    "Faible urgence": "#49A146",
  };
    
  const statusColors = {
    "affectée": "#F09C0A",
    "en cours": "#20599E",
    "en attente": "#FF4423",
    "terminée": "#49A146",
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    moreClick?.();
  };

  return (
    <motion.div 
      className="
        bg-white rounded-xl shadow-md 
        pr-4 pl-5 py-4
        w-full
        relative cursor-pointer
      " 
      onClick={onClick}
      whileHover={{ 
        y: -4,
        scale: 1.02,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        transition: { 
          duration: 0.2,
          ease: "easeOut"
        }
      }}
      whileTap={{ 
        y: 0,
        scale: 1,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
    >
      {/* Header avec badge et ID */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Badge
            text={`#${id}`}
            bgColor="#9AA0A6"
            className="
              text-[8px] sm:text-[9px] md:text-[10px]
              px-1.5 sm:px-2 md:px-2.5
              py-[4px]
              rounded-full
              max-w-[60px] sm:max-w-[80px] md:max-w-[100px]
              whitespace-nowrap truncate
            "
          />
          <Badge
            text={urgence}
            bgColor={urgenceColors[urgence]}
            className="
              text-[8px] sm:text-[9px] md:text-[10px]
              px-1.5 sm:px-2 md:px-2.5
              py-[4px]
              rounded-full
              max-w-[80px] sm:max-w-[100px] md:max-w-[120px]
              whitespace-nowrap truncate
            "
          />
          <Badge
            text={statut}
            bgColor={statusColors[statut] || "#9AA0A6"}
            className="
              text-[8px] sm:text-[9px] md:text-[10px]
              px-1.5 sm:px-2 md:px-2.5
              py-[4px]
              rounded-full
              max-w-[80px] sm:max-w-[100px] md:max-w-[120px]
              whitespace-nowrap truncate
            "
          />
        </div>
                
        {/* Trois points */}
        <motion.div
          className="p-1 rounded-full hover:bg-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMoreClick}
        >
          <MoreVertical className="text-[#202124] w-4 h-4 cursor-pointer" />
        </motion.div>
      </div>

      <div className="flex flex-col gap-1.5 sm:gap-2.5">
        {/* Nom de l'intervention */}
        <div className="flex items-center text-gray-800 gap-1.5 sm:gap-2.5">
          <img 
            src={interventionIcon} 
            alt="Intervention" 
            className="h-4 w-4 sm:h-5 sm:w-5" 
          />
          <h2 className="
            text-lg sm:text-xl md:text-[22.4px] 
            font-bold text-[#202124] 
            truncate
          ">
            {nom}
          </h2>
        </div>

        {/* Equipement et date */}
        <div className="flex flex-row gap-1.5 sm:gap-3 md:gap-5">
          {/* Equipement */}
          <div className="flex items-center text-gray-800 gap-1 sm:gap-1.5">
            <img 
              src={equipementIcon} 
              alt="Equipement" 
              className="h-3.5 w-3.5 sm:h-4 sm:w-4" 
            />
            <span className="font-semibold text-[10px] sm:text-xs truncate">
              {equipement}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 max-w-full overflow-hidden">
            <img 
              src={calendar} 
              alt="Date" 
              className="h-[11px] w-[11px] sm:h-[13px] sm:w-[13px] md:h-[15px] md:w-[15px] lg:h-[16px] lg:w-[16px] shrink-0" 
            />
            <span className="font-semibold text-[clamp(0.5rem, 2vw, 0.7rem)] truncate">
              {date}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterventionCard;
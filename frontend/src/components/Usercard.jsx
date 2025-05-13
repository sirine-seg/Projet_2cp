import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";
import Profil from "../assets/Profil.svg";
import { MoreVertical } from "lucide-react";
import Badge from "./Badge";
import Options from "./Options"; // Importez le composant Options

const UserCard = ({
  firstName,
  lastName,
  email,
  photo,
  onClick,
  onMenuClick,
  isMenuOpen,
  onEditClick,
  is_blocked,
  onBlockClick,
  onUnblockClick,
  role,
  technicien,
  filter,
  options = [] // Ajoutez cette prop pour les options du menu
}) => {
  const roleColors = {
    "Technicien": "#F09C0A",
    "Administrateur": "#20599E",
    "Personnel": "#6B7280",
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    onMenuClick?.();
  };

  const renderBadge = () => {
    if (filter === "Technicien" && technicien) {
      return (
        <Badge
          text={technicien.disponibilite ? "Disponible" : "Non disponible"}
          bgColor={technicien.disponibilite ? "#49A146" : "#FF4423"}
          className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
        />
      );
    }

    if (filter === "Tout") {
      return (
        <Badge
          text={role}
          bgColor={roleColors[role]}
          className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
        />
      );
    }

    if (filter !== "Tout" && filter !== "disponibleFilter") {
      return (
        <Badge
          text={is_blocked ? "Bloqué" : "Débloqué"}
          bgColor={is_blocked ? "#FF4423" : "#9CA3AF"}
          className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
        />
      );
    }

    return null;
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md px-4 pt-4 pb-7 w-full relative cursor-pointer flex items-start gap-4"
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
      {/* Avatar */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
        {photo ? (
          <img src={photo} alt="Utilisateur" className="w-full h-full object-cover" />
        ) : (
          <img src={Profil} alt="Profil" className="w-full h-full" />
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <h2 className="font-bold text-[#20599E] truncate text-base sm:text-lg md:text-xl">
          {firstName} {lastName}
        </h2>
        <p className="flex items-center mt-1 truncate text-sm sm:text-base">
          <MdEmail className="h-4 w-4 sm:h-5 sm:w-5 text-[#20599E] mr-2 flex-shrink-0" />
          {email}
        </p>
      </div>

      {/* Bouton menu */}
      <motion.div
        className="p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleMenuClick}
      >
        <MoreVertical className="text-[#202124] w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
      </motion.div>

      {/* Badge */}
      <div className="absolute bottom-3 right-3">
        {renderBadge()}
      </div>
    </motion.div>
  );
};

export default UserCard;
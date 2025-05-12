import React from "react";
import { MoreVertical } from "lucide-react";
import Profil from "../assets/Profil.svg";
import CustomCheckbox from "./customCheckbox";
import Options from "./Options"; // Importez le composant Options

const UserList = ({
  nom,
  prenom,
  email,
  role,
  imageUrl,
  checked = false,
  onToggle = () => {},
  onMoreClick = () => {},
  isMenuOpen = false,
  user, // L'objet utilisateur complet
}) => {
  return (
    <div
      className={`flex items-center justify-between rounded-lg shadow-sm pl-3 pr-2 sm:px-4 py-2 w-full bg-white`}
    >
      {/* Checkbox */}
      <div
        className="mr-3"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <CustomCheckbox checked={checked} color="#20599E" />
      </div>

      <div className="flex items-center gap-4 flex-grow overflow-hidden">
        {/* Avatar */}
        <div>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageUrl}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <img src={Profil} alt="Profil" className="w-8 h-8 flex-shrink-0" />
          )}
        </div>

        {/* Infos utilisateur */}
        <span className="w-[80%] sm:w-[30%] text-[#202124] overflow-hidden whitespace-nowrap">
          {nom} {prenom}
        </span>

        <span className="hidden sm:block w-[40%] text-[#202124] overflow-hidden whitespace-nowrap">
          {email}
        </span>

        <span className="hidden sm:block w-[25%] text-[#202124] overflow-hidden whitespace-nowrap">
          {role}
        </span>
      </div>

      {/* Bouton options */}
      <button
        className="flex-shrink-0 text-gray-500 hover:text-gray-700"
        onClick={(e) => {
          e.stopPropagation();
          onMoreClick();
        }}
      >
        <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </div>
  );
};

export default UserList;

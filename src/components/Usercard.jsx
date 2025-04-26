import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import Profil from "../assets/Profil.svg";
import { MoreVertical } from "lucide-react";

const UserCard = ({
  firstName,
  lastName,
  email,
  photo,
  previewUrl,
  onClick,
  onMenuClick,
  isMenuOpen,
  onEditClick,
  onDeleteClick,
  is_blocked,
  onBlockClick,
onUnblockClick,
}) => {
  return (
    <div
    className="w-[95vw] sm:w-[90vw] md:w-[45vw] lg:w-[50vw] xl:w-[60vw] 2xl:w-[60vw] max-w-full p-5 bg-white rounded-2xl shadow-2xl flex items-start relative"

      onClick={onClick}
    >
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : photo ? (
          <img
            src={photo.startsWith("http") ? photo : `http://127.0.0.1:8000${photo}`}
            alt="Utilisateur"
            className="w-full h-full object-cover"
          />
        ) : (
          <img src={Profil} alt="Profil" className="w-16 h-16 flex-shrink-0" />
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 pl-4 -mt-3 min-w-0">
  <h2
    className="
      font-bold text-[#20599E]
      whitespace-nowrap overflow-hidden
      text-[clamp(0.75rem,4vw,1.25rem)]
    "
  >
    {firstName} {lastName}
  </h2>
  <p
    className="
      flex items-center mt-1
      whitespace-nowrap overflow-hidden
      text-[clamp(0.625rem,3vw,1rem)]
    "
  >
    <MdEmail className="h-5 w-5 text-[#20599E] mr-2 flex-shrink-0" />
    {email}
  </p>
</div>


      {/* Bouton menu */}
      <div className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <MoreVertical 
            className="text-[#202124] w-5 h-5 cursor-pointer" 
            onClick={(event) => {
              event.stopPropagation();
              onMenuClick();
            }}
          />
        </div>
      {/* Menu déroulant */}
      {isMenuOpen && (
  <div
    className="absolute top-12 right-3 bg-white shadow-xl rounded-lg text-black w-48 sm:w-64 z-50 border"
    onClick={(e) => e.stopPropagation()}
  >
    <button
      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      onClick={(e) => {
        e.stopPropagation();
        onEditClick();
      }}
    >
      Modifier
    </button>

    {/* Bouton Bloquer ou Débloquer selon isBlocked */}
    <button
      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      onClick={(e) => {
        e.stopPropagation();
        if (is_blocked) {
          onUnblockClick(); // ici tu appelles débloquer
        } else {
          onBlockClick(); // ici tu appelles bloquer
        }
      }}
    >
      {is_blocked ? "Débloquer" : "Bloquer"}
    </button>
  </div>
)}

    </div>
  );
};

export default UserCard;


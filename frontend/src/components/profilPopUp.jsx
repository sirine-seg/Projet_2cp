import { useNavigate } from "react-router-dom";
import Profil from "../assets/Profil.svg";
import EmailIcon from "../assets/EmailIconsvg.svg";
import PhoneIcon from "../assets/PhoneIcon.svg";

export default function ProfilePopUp({
  nom,
  prenom,
  role,
  imageUrl,
  email,
  numero,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Profil");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg w-60 overflow-hidden">
      {/* Zone bleue en haut */}
      <div className="bg-[#BCCDE2] h-16 relative">
        {/* Conteneur de l'image parfaitement centré */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center items-center">
          <div className="w-16 h-16 rounded-full bg-white shadow-md overflow-hidden border-2 border-white">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${prenom} ${nom}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={Profil}
                alt="Default profile"
                className="w-full h-full object-contain p-2"
              />
            )}
          </div>
        </div>
      </div>

      {/* Contenu texte */}
      <div className="pt-10 pb-2">
        <h2 className="text-lg font-bold text-[#202124] text-center p-1">
          {prenom} {nom}
        </h2>
        <p className="text-gray-600 text-sm text-center font-semibold">{role}</p>
      </div>

      {/* Coordonnées */}
      <div className="p-4 space-y-3">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <img src={EmailIcon} alt="Email" className="w-5 h-5" />
            <span className="text-md text-[#202124] font-medium">{email}</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <img src={PhoneIcon} alt="Phone" className="w-5 h-5" />
            <span className="text-md text-[#202124] font-medium">{numero}</span>
          </div>
        </div>
      </div>

      {/* Bouton */}
      <button 
        onClick={handleClick}
        className="w-full text-center text-[#20599E] text-sm font-medium py-3 cursor-pointer hover:underline border-t border-[#E8EAED]"
      >
        Voir le profil
      </button>
    </div>
  );
}
import { useNavigate } from 'react-router-dom';
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import handle from '../assets/Handle.svg';
import pen from '../assets/modifyPen.svg';

const HeaderBar = ({ 
  title, 
  showPen = false, 
  onClickPen,
  profilOrNotif = false,
  className = '', 
  classNameTitle = '' 
}) => {

  const navigate = useNavigate();
  const isSmall = useIsSmallScreen();

  return (
    <div className={`w-full flex items-center justify-between px-4 py-3 mb-4 md:mb-8 relative ${className}`}>
      
      {/* Flèche gauche */}
      {/* Mobile only */}
      {isSmall && profilOrNotif ? null : ( // Si c'est la page de profil ou celle de notifications, on n'affiche pas ChevronLeft
        <div className="block md:hidden z-10 relative">
          <ChevronLeft
            className="w-6 h-6 text-dark cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </div>
      )}

      {/* Tablet & Desktop only */}
      <div className="hidden md:block">
        <ArrowLeft
          className="w-8 h-8 text-dark cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>

      {/* Titre centré */}
      <div
        className={`absolute left-1/2 -translate-x-1/2
          font-semibold text-dark text-center
          text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl
          px-2 whitespace-pre-wrap break-words w-full max-w-[90%] ${classNameTitle}`}
      >
        {title}
      </div>

      {/* Handle (profil / notif mobile uniquement) */}
      {isSmall && profilOrNotif && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-[-80%]">
          <img
            src={handle}
            alt="Handle"
            className="w-8 h-8 sm:w-6 sm:h-6 cursor-pointer"
          />
        </div>
      )}

      {/* Crayon (édition) */}
      <div className="flex-1 flex justify-end">
        {showPen && (
          <img
            src={pen}
            alt="Edit"
            className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
            onClick={onClickPen}
          />
        )}
      </div>
    </div>
  );
};

export default HeaderBar;

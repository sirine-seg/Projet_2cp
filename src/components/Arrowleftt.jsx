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
  className = '' , 
  classNameTitle = '' 
  }) => {
  
  const navigate = useNavigate();
  const isSmall = useIsSmallScreen();

  return (
    <div className="w-full flex items-center justify-between px-4 py-1 mb-4 md:mb-10 relative">

      {/* Flèche à gauche (responsive) */}

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

      {/* Titre */}

      <div
        className={`absolute left-1/2 -translate-x-1/2
          font-semibold text-dark text-center
          text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl
          px-2 whitespace-pre-wrap break-words w-full max-w-[90%] ${classNameTitle}`}
      >
        {title}
      </div>

      {/* Si c'est sur mobile et c'est la page de profil ou de notifications */}
      {isSmall && profilOrNotif && (
        <div className="relative -top-3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
          <img
          src={handle}
          alt="Handle"
          className="w-10 h-10 sm:w-7 sm:h-7 cursor-pointer"
          />
        </div>
      )}
  
      <div className="flex-1 flex justify-end">
        {showPen && (
          <img
            src={pen}
            alt="Edit"
            className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer"
            onClick={onClickPen}
          />
        )}
      </div>
  </div>
  
  );
};

export default HeaderBar;

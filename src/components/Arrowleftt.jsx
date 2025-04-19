import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import pen from '../assets/modifyPen.svg';
import useIsSmallScreen from "../hooks/useIsSmallScreen"; 
import { ChevronLeft } from 'lucide-react';


const HeaderBar = ({ title, showPen = false, className = '' , classNameTitle = '' }) => {
  const navigate = useNavigate();
 const isSmall = useIsSmallScreen();
  return (
    <div className="w-full flex items-center justify-between px-4 py-3 mb-4 relative">
  {/* Version grand écran */}


      {/* Flèche à gauche (responsive) */}
      <div className="block md:hidden">
        {/* Mobile only */}
        <ChevronLeft
          className="w-6 h-6 text-dark cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>

      <div className="hidden md:block">
        {/* Tablet & Desktop only */}
        <ArrowLeft
          className="w-8 h-8 text-dark cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>




    <div
      className={`absolute left-1/2 -translate-x-1/2
        font-semibold text-dark text-center
        text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl
        px-2 whitespace-pre-wrap break-words w-full max-w-[90%] ${classNameTitle}`}
    >
      {title}
    </div>
  
    <div className="flex-1 flex justify-end">
      {showPen && (
        <img
          src={pen}
          alt="Edit"
          className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer"
        />
      )}
    </div>
  </div>
  
  );
};


export default HeaderBar;

// src/components/Header.js
import { MdAccountCircle } from "react-icons/md";
import logo from '../assets/logo.png'; 

const Header = () => {
  return (
    <>
      {/* Logo en haut à gauche */}
      <img 
        src={logo} 
        alt="Logo"
        className="absolute top-4 left-4 w-16 sm:w-16 md:w-20 lg:w-32 h-auto"
      />

      {/* Utilisateur en haut à droite */}
      <div className="absolute top-4 right-6 sm:right-10 md:right-16 flex items-center space-x-2 sm:space-x-3">
        <MdAccountCircle className="text-white w-8 sm:w-10 h-8 sm:h-10" />
        <span className="text-white text-sm sm:text-base font-semibold">
          User Name
        </span>
      </div>
    </>
  );
};

export default Header;

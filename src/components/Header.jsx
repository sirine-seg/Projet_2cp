import { useState, useEffect, useRef } from "react";
import { MdAccountCircle } from "react-icons/md";
import logo from '../assets/logo.svg';
import logoBlue from '../assets/logo_bleu.svg';
import notif from '../assets/notif.svg';
import menu from '../assets/menu.svg';
import menuBlue from '../assets/menu_bleu.svg';
import ProfilPopUp from "./profilPopUp";
import NotificationPopUp from "./notificationPopUp";
import SideBar from "./sideBar";

const Header = ({ bleu = false }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const textColor = bleu ? "text-[#20599E]" : "text-white";

  const toggleProfilePopup = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotifOpen(false);
  };

  const toggleNotifPopup = () => {
    setIsNotifOpen(!isNotifOpen);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current && !profileRef.current.contains(event.target) &&
        notifRef.current && !notifRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="flex items-center justify-between pl-4 pr-4 sm:pr-10 py-3 h-12 sm:h-16 w-full">
        {/* Partie gauche : Menu + Logo */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <img 
              src={bleu ? menuBlue : menu} 
              alt="Menu"
              className="w-12 sm:w-16 h-12 sm:h-16"
            />
          </button>
          <img 
            src={bleu ? logoBlue : logo} 
            alt="Logo"
            className="w-18 sm:w-20 md:w-22 lg:w-24 h-auto"
          />
        </div>
        
        {/* Partie droite : Notifications + User */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <div ref={notifRef} className="relative flex items-center h-full">
            <button 
              onClick={toggleNotifPopup}
              className="flex items-center justify-center w-9 h-9"
            >
              <img src={notif} alt="Notifications" className="w-full h-full" />
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-2 z-50">
                <NotificationPopUp />
              </div>
            )}
          </div>

          {/* Profil */}
          <div ref={profileRef} className="relative flex items-center h-full">
            <button 
              onClick={toggleProfilePopup} 
              className="flex items-center space-x-2 h-full"
            >
              <MdAccountCircle 
                className={`w-10 h-10 ${textColor}`}
              />
              <span className={`hidden sm:inline ${textColor} sm:text-lg font-semibold`}>
                User Name
              </span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 z-50">
                <ProfilPopUp />
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Overlay et SideBar avec transitions */}
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsSidebarOpen(false)}
          style={{ opacity: isSidebarOpen ? 0.25 : 0 }}
        />
      </div>
    </>
  );
};

export default Header;

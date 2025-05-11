import React, { useState, useEffect, useRef } from "react";
import { MdAccountCircle } from "react-icons/md";
import logo from '../assets/logo.svg';
import logoBlue from '../assets/logo_bleu.svg';
import notif from '../assets/notif.svg';
import menu from '../assets/menu.svg';
import menuBlue from '../assets/menu_bleu.svg';
import ProfilPopUp from "./profilPopUp";
import NotificationPopUp from "./notificationPopUp";
import SideBar from "./sideBar";
import Profil from "../assets/Profil.svg";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const Header = ({ bleu = false }) => {


  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Tout");
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');

        const response = await fetch("http://localhost:8000/api/notifications/notifications/", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error("Fetching notifications failed");
        }

        const data = await response.json();
        const transformedData = data.map(notification => {
          // Format the time as "il y a X heures/minutes/jours"
          const timeAgo = notification.created_at
            ? formatDistanceToNow(new Date(notification.created_at), {
              locale: fr,
              addSuffix: false  // We don't need "il y a" since it's already in your component
            })
            : "";

          return {
            ...notification,
            unread: !notification.is_read,
            description: notification.message,
            time: timeAgo  // Now time is already formatted
          };
        });

        setNotifications(transformedData);
      } catch (err) {
        setNotificationsError(err.message);
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchNotifications();
  }, []);



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



  /** integration -- */
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');

        const response = await fetch("http://localhost:8000/api/accounts/me/", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#20599E]">
        <div className="text-white text-lg">Error loading profile: {error}</div>
      </div>
    );
  }
  // Determine if user is technician based on their role


  return (
    <>
      <header className="flex items-center justify-between pl-4 pr-4 sm:pr-10 py-[0.6rem] h-10 sm:h-13 w-full">
        {/* Partie gauche : Menu + Logo */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <img
              src={bleu ? menuBlue : menu}
              alt="Menu"
              className="w-10 sm:w-13 h-10 sm:h-13 cursor-pointer"
            />
          </button>
          <img
            src={bleu ? logoBlue : logo}
            alt="Logo"
            className="w-[3.6rem] sm:w-[4rem] md:w-[4.4rem] lg:w-[4.8rem] h-auto"
          />
        </div>

        {/* Partie droite : Notifications + User */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <div ref={notifRef} className="relative flex items-center h-full">
            <button
              onClick={toggleNotifPopup}
              className="flex items-center justify-center w-7 h-7"
            >
              <img src={notif} alt="Notifications" className="w-full h-full" />
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-2 z-50">
                <NotificationPopUp
                  notifications={notifications}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            )}

          </div>

          {/* Profil */}
          <div ref={profileRef} className="relative flex items-center h-full">
            <button
              onClick={toggleProfilePopup}
              className="flex items-center space-x-2 h-full"
            >
              {/*<MdAccountCircle
              className={`w-10 h-10 ${textColor}`}
            />*/}

              <img
                src={userData?.user?.photo || Profil}
                alt="Profil"
                className="w-7 h-7 flex-shrink-0 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = Profil;
                  e.target.onerror = null;
                }}
              />

              <span className={`hidden sm:inline ${textColor} sm:text-base font-semibold`}>
                {userData?.user?.last_name || "anonyme"}
              </span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 z-50">
                <ProfilPopUp
                  nom={userData?.user?.last_name || ""}
                  prenom={userData?.user?.first_name || ""}
                  role={userData?.user?.role || ""}
                  imageUrl={userData?.user?.photo || null}
                  email={userData?.user?.email || ""}
                  numero={userData?.user?.phone_number || ""}
                />
              </div>
            )}

          </div>
        </div>
      </header>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40">
          <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

          <div
            className="fixed inset-0 bg-black opacity-25"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Header;
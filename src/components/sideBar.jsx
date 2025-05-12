import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LogOut,
  Home,
  FileText,
  BarChart2,
  Settings,
  HelpCircle,
  HardHat,
  ChevronRight,
  ClipboardList
} from "lucide-react";
import logo_bleu from "../assets/logo_bleu.svg";

export default function SideBar({ isOpen, setIsOpen }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  //const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur depuis le localStorage ou une API
    const fetchUserRole = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await fetch("https://esi-track-deployement.onrender.com/api/accounts/me/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Adaptez cette ligne selon la structure de votre réponse API
          setUserRole(data?.role || data?.user?.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        //setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const isAdmin = ["ADMIN", "ADMINISTRATEUR"].includes(userRole?.toUpperCase());
  const isTechnician = ["TECHNICIAN", "TECHNICIEN"].includes(userRole?.toUpperCase());

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-68 bg-white shadow-lg p-6 z-50 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        relative flex flex-col justify-between`}
      style={{ height: "100vh" }}
    >
      {/* Top content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex mb-6 justify-center">
          <img src={logo_bleu} alt="ESITRACK Logo" className="w-30 h-auto" />
        </div>

        {/* Main Menu */}
        <div className="text-[#5F6368] font-semibold text-sm mb-4">
          Main Menu
        </div>
        <nav className="flex flex-col gap-3">
          <NavItem
            to="/home"
            icon={<Home size={20} />}
            label="Accueil"
            activeColor="#20599E"
          />
          <NavItem
            to="/Equipements"
            icon={<HardHat size={20} />}
            label="Equipements"
            activeColor="#20599E"
          />
          <NavItem
            to="/Interventions"
            icon={<FileText size={20} />}
            label="Interventions"
            activeColor="#20599E"
          />
          {isTechnician && (
            <NavItem
              to="/MesTaches"
              icon={<ClipboardList size={20} />}
              label="Mes Tâches"
              activeColor="#20599E"
            />
          )}
          <NavItem
            to="/dashboard"
            icon={<BarChart2 size={20} />}
            label="Tableau de board"
            activeColor="#20599E"
          />
        </nav>

        {/* Preferences */}
        <div className="text-[#5F6368] font-semibold text-sm mt-8 mb-4">
          Preferences
        </div>
        <nav className="flex flex-col gap-2">
          {isAdmin && (
            <div>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="flex items-center cursor-pointer justify-between w-full p-3 rounded-xl text-black hover:bg-gray-100"
              >
                <div className="flex items-center gap-2 font-medium text-sm text-[#202124]">
                  <Settings size={20} />
                  <span>Administration</span>
                </div>
              </button>

              {/* Sub-pages */}
              {settingsOpen && (
                <div className="ml-5 flex flex-col gap-1">
                  <NavItem
                    to="/Generale"
                    icon={<ChevronRight size={20} />}
                    label="General"
                    activeColor="#20599E"
                  />
                  <NavItem
                    to="/ChampsDynamiques"
                    icon={<ChevronRight size={20} />}
                    label="Champs Dynamiques"
                    activeColor="#20599E"
                  />
                  <NavItem
                    to="/Utilisateurs"
                    icon={<ChevronRight size={20} />}
                    label="Utilisateurs"
                    activeColor="#20599E"
                  />
                </div>
              )}
            </div>
          )}

          <NavItem
            to="/aide"
            icon={<HelpCircle size={20} />}
            label="Aide et support"
            activeColor="#20599E"
          />
        </nav>
      </div>

      {/* Log Out */}
      <div className="sticky bottom-0 bg-white pt-2">
        <div
          className="flex items-center gap-3 text-[#FF4423] cursor-pointer p-2 rounded-xl"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span className="font-semibold text-md">Déconnexion</span>
        </div>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, activeColor = "#20599E" }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 p-3 rounded-xl transition font-medium text-sm ${isActive
          ? activeColor === "#20599E"
            ? "bg-[#20599E] text-white"
            : "bg-[#F09C0A] text-white"
          : "text-[#202124] hover:bg-gray-100"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
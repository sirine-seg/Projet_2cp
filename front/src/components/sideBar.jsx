import { useState } from "react";
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
} from "lucide-react";
import logo_bleu from "../assets/logo_bleu.png";

export default function SideBar({ isOpen, setIsOpen }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen w-68 bg-white shadow-lg p-6 z-50 transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          relative flex flex-col justify-between
          `}
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
              to="/equip"
              icon={<HardHat size={20} />}
              label="Equipements"
              activeColor="#20599E"
            />
            <NavItem
              to="/Intervention"
              icon={<FileText size={20} />}
              label="Interventions"
              activeColor="#20599E"
            />
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
                    to="/general"
                    icon={<ChevronRight size={20} />}
                    label="General"
                    activeColor="#F09C0A"
                  />
                  <NavItem
                    to="/ChampsDynamiques"
                    icon={<ChevronRight size={20} />}
                    label="Champs Dynamiques"
                    activeColor="#F09C0A"
                  />
                  <NavItem
                    to="/Users"
                    icon={<ChevronRight size={20} />}
                    label="Utilisateurs"
                    activeColor="#F09C0A"
                  />
                </div>
              )}
            </div>

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
          <div className="flex items-center gap-3 text-[#FF4423] cursor-pointer p-2 rounded-xl">
            <LogOut size={20} />
            <span className="font-semibold text-md">Log Out</span>
          </div>
        </div>
      </div>
    </>
  );
}

// Updated NavItem component using NavLink
function NavItem({ to, icon, label, activeColor = "#20599E" }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 p-3 rounded-xl transition font-medium text-sm ${
          isActive
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
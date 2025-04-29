import { useState } from "react";
import {
  LogOut,
  Home,
  FileText,
  BarChart2,
  Settings,
  HelpCircle,
  Menu,
  HardHat,
  Users,
  ChevronRight,
} from "lucide-react";
import logo_bleu from "../assets/logo_bleu.svg";

export default function SideBar({ isOpen, setIsOpen }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activePage, setActivePage] = useState("Accueil"); // <<< HERE

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen w-68 bg-white shadow-lg p-6 z-50 transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:relative md:flex md:flex-col md:justify-between
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
            <MenuItem
              icon={<Home size={20} />}
              label="Accueil"
              active={activePage === "Accueil"}
              onClick={() => setActivePage("Accueil")}
            />
            <MenuItem
              icon={<HardHat size={20} />}
              label="Equipements"
              active={activePage === "Equipements"}
              onClick={() => setActivePage("Equipements")}
            />
            <MenuItem
              icon={<FileText size={20} />}
              label="Interventions"
              active={activePage === "Interventions"}
              onClick={() => setActivePage("Interventions")}
            />
            <MenuItem
              icon={<BarChart2 size={20} />}
              label="Tableau de board"
              active={activePage === "Tableau de board"}
              onClick={() => setActivePage("Tableau de board")}
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
                  <MenuItem
                    icon={<ChevronRight size={20} />}
                    label="General"
                    active={activePage === "General"}
                    activeColor="orange"
                    onClick={() => setActivePage("General")}
                  />
                  <MenuItem
                    icon={<ChevronRight size={20} />}
                    label="Champs Dynamiques"
                    active={activePage === "Champs Dynamiques"}
                    activeColor="orange"
                    onClick={() => setActivePage("Champs Dynamiques")}
                  />
                  <MenuItem
                    icon={<ChevronRight size={20} />}
                    label="Utilisateurs"
                    active={activePage === "Utilisateurs"}
                    activeColor="orange"
                    onClick={() => setActivePage("Utilisateurs")}
                  />
                </div>
              )}
            </div>

            <MenuItem
              icon={<HelpCircle size={20} />}
              label="Aide et support"
              active={activePage === "Aide et support"}
              onClick={() => setActivePage("Aide et support")}
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

// Updated MenuItem component
function MenuItem({ icon, label, active = false, activeColor = "#20599E", onClick }) {
  const activeStyles = active
    ? activeColor === "#20599E"
      ? "bg-[#20599E] text-white"
      : "bg-[#F09C0A] text-white"
    : "text-[#202124]";

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex items-center gap-2 p-3 rounded-xl transition font-medium text-sm ${activeStyles}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

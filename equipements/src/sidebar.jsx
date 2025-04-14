import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LogOut, Home, FileText, BarChart2,
  Settings, HelpCircle, Menu
} from "lucide-react";
import logo_bleu from"./assets/logo_bleu.png"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Menu (Mobile) */}
      <div className="md:hidden p-4 bg-white shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#20599E]">ESITRACK</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white shadow-lg p-6 z-50 transition-transform duration-300 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:flex md:flex-col md:justify-between`}>

        {/* Top content */}
        <div>
          {/* Logo (Desktop) */}
          <div className="hidden md:block mb-10 ">
            <img
                         src={logo_bleu}
                         alt="Logo"
                         className="absolute top-4 left-4 w-12 sm:w-16 md:w-20 lg:w-24 h-auto"
                       />
          </div>

          {/* Main Menu */}
          <div className="text-gray-500 font-semibold text-sm mb-4">Main Menu</div>
          <nav className="flex flex-col gap-2">
            <NavItem to="/home" icon={<Home size={20} />} label="Accueil" />
            <NavItem to="/" icon={<FileText size={20} />} label="Equipements" />
            <NavItem to="/Intervention" icon={<FileText size={20} />} label="Interventions" />
            <NavItem to="/Users" icon={<FileText size={20} />} label="Users" />
            <NavItem to="/dashboard" icon={<BarChart2 size={20} />} label="Tableau de board" />
          </nav>

          {/* Preferences */}
          <div className="text-gray-400 font-semibold text-sm mt-8 mb-4">Preferences</div>
          <nav className="flex flex-col gap-2">
            <NavItem to="/parametres" icon={<Settings size={20} />} label="Parametres" />
            <NavItem to="/aide" icon={<HelpCircle size={20} />} label="Aide et support" />
          </nav>
        </div>

        {/* Log Out */}
        <div className="flex items-center gap-3 text-[#F09C0A] cursor-pointer mt-8">
          <LogOut size={20} />
          <span className="font-semibold text-md">Log Out</span>
        </div>
      </div>
    </>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-xl transition font-medium text-md ${
          isActive
            ? "bg-[#20599E] text-white"
            : "text-black hover:bg-gray-100"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

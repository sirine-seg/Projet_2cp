import logo from "./assets/logo.png";
import notif from "./assets/Notif.png";
import profil from "./assets/Group.png";
import menu from "./assets/jam_menu.png";

import NotificationCard from "./notificationCard";
import { useState } from "react";
  
const Notifications = () => {
  const [activeTab, setActiveTab] = useState("Tout");

  const notifications = [
    {
      title: "Rappel d'Intervention",
      description: "Intervention prévue aujourd’hui pour ----",
      time: "Il y a 2 sem",
      unread: false,
      senderInitials: "AR",
      selected: false
    },
    {
      title: "Nouvelle Intervention Assignée",
      description: "Vous avez été assigné à une nouvelle intervention par Ait Amrane Rachid.",
      time: "Il y a 3h",
      unread: true,
      senderInitials: "AR",
      selected: true
    },
    {
      title: "Nouvelle Intervention Assignée",
      description: "Vous avez été assigné à une nouvelle intervention par Ait Amrane Rachid.",
      time: "Il y a 3h",
      unread: false,
      senderInitials: "AR",
      selected: false
    }
  ];

  const filtered = activeTab === "Tout" ? notifications : notifications.filter(n => n.unread);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E]">
       
      {/* Header (logo à gauche, infos user à droite) */}
      <div className="h-15 w-full flex items-center justify-between px-6">
         
        {/* Groupe Menu + Logo */}
        <div className="flex items-center gap-2">
          <img src={menu} alt="Menu" className="w-8 sm:w-10 md:w-12 lg:w-14 h-auto" />
          <img src={logo} alt="Logo" className="w-12 sm:w-16 md:w-20 lg:w-24 h-auto" />
        </div>

        {/* Partie de droite : notif + profil + nom */}
        <div className="flex items-center gap-6 text-white ml-auto mr-16">
          <img src={notif} alt="Notif" className="w-10 h-10 rounded-full" />
          <div className="flex items-center gap-3">
            <img src={profil} alt="Profil" className="w-10 h-10 rounded-full" />
            <span className="font-semibold text-xl">User name</span>
          </div>
        </div>
      </div>
  
      {/* BLOC GRIS */}
      <div className="flex-1 w-full bg-[#F4F4F4] rounded-t-[60px] shadow-lg p-10 mt-10 overflow-y-auto">
        <h1 className="text-center text-4xl font-bold text-gray-800 mb-4">Notifications</h1>
        <div className="mx-auto px-6 py-6 rounded-b-2xl mt-2">
          
      {/* Tabs */}
      <div className="flex justify-center gap-8 mb-6">
      <button
        onClick={() => setActiveTab('Tout')}
        className={`text-lg font-medium pb-2 transition-colors duration-200 ${
            activeTab === 'Tout' 
        ? 'text-[#20599E] border-b-2 border-[#20599E]' 
        : 'text-gray-400 hover:text-white'
            }`
        }
      >
      Tout
      </button>
      <button
        onClick={() => setActiveTab('Non lu')}
        className={`text-lg font-medium pb-2 transition-colors duration-200 ${
            activeTab === 'Non lu' 
        ? 'text-[#20599E] border-b-2 border-[#20599E]' 
        : 'text-gray-400 hover:text-white'
            }`
        }
      >
      Non lu
      </button>
      </div>

      {/* in case there are no notifications (this should be displayed fi placet the cards) */}
      {/* <div className="text-center py-12 font-poppins">
      <h2 className="text-[20px] font-bold leading-[28px] tracking-normal text-[#202124] mb-3">
        Aucune notification
        </h2>
        <p className="text-[#9AA0A6] leading-[28px]">
          Vous n'avez reçu aucune notification pour le moment.
        </p>
      </div> */}


          {filtered.map((n, i) => (
            <NotificationCard key={i} {...n} />
          ))}
        </div>
      </div>
  
    </div>
  );
};
  
export default Notifications;
  
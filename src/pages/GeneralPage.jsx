import SideBar from "../components/sideBar";
import Header from "../components/Header";
import Breadcrumb from "../components/breadCrumbs";
import Toggle from "../components/toggle";
import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { data } from "react-router-dom";
import EstablishmentInfoSection from "../components/etabInfo";
import ESI_Logo from "../assets/ESI_Logo.svg";

export default function GeneralPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [allNotifications, setAllNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  //   hna i fetch the current settings mel back
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
  
    fetch("http://localhost:8000/api/accounts/me/", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((userData) => {
        const userID = userData.user.id;
        console.log("User data:", userData);
  
        // Fetch general notification status
        fetch(`http://localhost:8000/api/accounts/toggle-notification/${userID}/`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setAllNotifications(data.active_notif);
          })
          .catch((err) =>
            console.error("Failed to load general notification settings:", err)
          );
  
        // Fetch email notification status
        fetch(`http://localhost:8000/api/accounts/toggle-notification-email/${userID}/`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setEmailNotifications(data.active_notif_email);
          })
          .catch((err) =>
            console.error("Failed to load email notification settings:", err)
          );
      })
      .catch((err) => console.error("Failed to fetch user ID:", err));
  }, []);
  
  // Handle toggles
  const handleToggleAllNotifications = () => {
    const accessToken = localStorage.getItem("access_token");
  
    fetch("http://localhost:8000/api/accounts/me/", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((userData) => {
        const userID = userData.user.id;
        console.log("User ID for toggle:", userID);
  
        fetch(`http://localhost:8000/api/accounts/toggle-notification/${userID}/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to toggle general notifications");
            return res.json();
          })
          .then((data) => {
            setAllNotifications(data.active_notif);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error("Failed to fetch user ID:", err));
  };
  
  const handleToggleEmailNotifications = () => {
    const accessToken = localStorage.getItem("access_token");
  
    fetch("http://localhost:8000/api/accounts/me/", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((userData) => {
        const userID = userData.user.id;
        console.log("User ID for toggle email:", userID);
  
        fetch(`http://localhost:8000/api/accounts/toggle-notification-email/${userID}/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to toggle email notifications");
            return res.json();
          })
          .then((data) => {
            setEmailNotifications(data.active_notif_email);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error("Failed to fetch user ID:", err));
  };
  

  const currentEstablishment = {
    name: "Ecole Nationale Superieure d'Informatique",
    address: "BPM68 16270, Oued Smar, Alger.",
    phone: "023939132",
    email: "contact@esi.dz",
    website: "http://www.esi.dz ",
    logoUrl: ESI_Logo,
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F4F4] font-poppins">
      <div className="fixed top-0 left-0 h-screen w-64 z-30">
        {/* Mobile - always closed or controlled differently */}
        <div className="lg:hidden">
          <SideBar isOpen={false} />
        </div>

        {/* Desktop - always open */}
        <div className="hidden lg:block">
          <SideBar isOpen={true} />
        </div>
      </div>

      <div className="top-0 left-0 right-0 z-20">
        <Header bleu />
      </div>

      <div className="pt-10 p-4 mr-4 ml-4 sm:ml-80 sm:mr-24">
        <div className="mb-6 sm:mb-12">
          <Breadcrumb path={["Administration", "General"]} />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 pb-2 sm:pb-4">
          <ChevronRight size={18} className="flex-shrink-0" />
          <h1 className="text-xl sm:text-2xl font-semibold">
            Etablissement information
          </h1>
        </div>

        <EstablishmentInfoSection
          initialData={currentEstablishment}
        />

        <div className="flex items-center gap-2 flex-1 min-w-0 pb-6 sm:pb-10">
          <ChevronRight size={18} className="flex-shrink-0" />
          <h1 className="text-xl sm:text-2xl font-semibold">Notifications</h1>
        </div>

        <Toggle
          label="Desactiver les notifications"
          isOn={allNotifications}
          onToggle={handleToggleAllNotifications}
        />
        <div className="mb-4 sm:mb-8"></div>
        <Toggle
          label="Desactiver les notifications par email"
          isOn={emailNotifications}
          onToggle={handleToggleEmailNotifications}
        />

        <div className="border-t border-gray-200 my-24"></div>
      </div>
    </div>
  );
}

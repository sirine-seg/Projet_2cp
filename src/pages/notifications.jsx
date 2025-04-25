import { React, useState } from "react";
import Header from "../components/Header";
import Headerbar from "../components/Arrowleftt";
import TabSelector from "../components/tabSelector";
import NotificationCard from "../components/notificationCard";

export default function NotificationPage() {
    const [activeTab, setActiveTab] = useState("Tout");
    const [notifications, setNotifications] = useState([ // Just for testing the front
        {
            id: 1,
            title: "Rappel d'Intervention",
            description: "Intervention prévue aujourd'hui pour ----",
            time: "2 sem",
            type: "Planifier",
            unread: false,
          },
          {
            id: 2,
            title: "Nouvelle Intervention Assignée",
            description: "Vous avez été assigné à une nouvelle intervention par Ait Amrane Rachid.",
            time: "3h",
            type: "",
            unread: true,
          },
          {
            id: 3,
            title: "Nouvelle Intervention Assignée",
            description: "Vous avez été assigné à une nouvelle intervention par Ait Amrane Rachid.",
            time: "3h",
            type: "",
            unread: false,
          },
    ]);

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(notif => 
            notif.id === id ? {...notif, unread: false} : notif
        ));
    };

    const filteredNotifications = activeTab === "Non lus"
      ? notifications.filter((notif) => notif.unread)
      : notifications;

    const unreadCount = notifications.filter(notif => notif.unread).length;

    const options = [
      { label: "Tout" },
      { label: "Non lus", count: unreadCount },
    ];
    

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E]">
      <Header />

      <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] mt-20 md:mt-28">
        <Headerbar title="Notifications" profilOrNotif="true" />

        {/* Tabs */}
        <div className="pb-2 sm:py-4">
        <TabSelector
          options={options}
          activeOption={activeTab}
          setActiveOption={setActiveTab}
          activeColor="#202124"
          inactiveColor="#5F6368"
          underlineColor="#20599E"
        />
        </div>

        {/* Notifications */}
        <div className="flex flex-col sm:mx-6 lg:mx-10 sm:px-4 md:px-6 lg:px-10">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                id={notif.id}
                title={notif.title}
                description={notif.description}
                time={notif.time}
                type={notif.type}
                unread={notif.unread}
                buttonTitle="Voir"
                onMarkAsRead={handleMarkAsRead}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="flex flex-col gap-2 sm:gap-4 w-full max-w-md text-center">
                <h2 className="text-lg sm:text-2xl font-bold text-[#202124]">Aucune notification</h2>
                <p className="text-sm sm:text-base text-[#5F6368]">
                  Vous n'avez reçu aucune notification pour le moment.
                </p>
              </div>
            </div>
          )}
        </div>
    
      </div>
    </div>
  );
}

import React from "react";
import TabSelector from "./tabSelector";
import NotificationCard from "./notificationCard";

export default function NotificationPopUp({
  notifications = [],
  activeTab = "Tout",
  setActiveTab,
}) {

  const filteredNotifications = activeTab === "Non lus"
  ? notifications.filter((notif) => notif.unread)
  : notifications;

  const unreadCount = notifications.filter(notif => notif.unread).length;

  const options = [
    { label: "Tout" },
    { label: "Non lus", count: unreadCount },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md w-full max-w-sm min-w-xs max-h-[450px] overflow-hidden flex flex-col">
      <div className="text-center font-bold text-lg pt-5 pb-4">
        Notifications
      </div>

      <div className="px-4 ml-2 flex justify-start">
        <TabSelector
          options={options}
          activeOption={activeTab}
          setActiveOption={setActiveTab}
          activeColor="#202124"
          inactiveColor="#5F6368"
          underlineColor="#20599E"
        />
      </div>

      <div className="flex flex-col gap-0 h-100 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif, index) => (
            <NotificationCard key={index} {...notif} buttonTitle="Voir" />
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            {activeTab === "Tout"
              ? "Aucune notification pour le moment"
              : "Aucune notification non lue"}
          </div>
        )}
      </div>

      {/* Footer */}
      <button>
        <div className="text-center text-[#20599E] text-sm font-medium py-3 cursor-pointer hover:underline">
          Afficher tout
        </div>
      </button>
    </div>
  );
}

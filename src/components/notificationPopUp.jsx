import React from "react";
import TabSelector from "./tabSelector";
import NotificationCard from "./notificationCard";

export default function NotificationPopUp({
  notifications = [],
  activeTab = "Tout",
  setActiveTab,
}) {
  const filteredNotifications = notifications.filter(
    (n) => activeTab === "Tout" || n.unread
  );

  return (
    <div className="bg-white rounded-xl shadow-md w-full max-w-sm mx-auto overflow-hidden flex flex-col">
      <div className="text-center font-bold text-lg pt-5 pb-4">
        Notifications
      </div>

      <div className="px-4 ml-2 flex justify-start">
        <TabSelector
          options={["Tout", "Non lu"]}
          activeOption={activeTab}
          setActiveOption={setActiveTab}
          activeColor="#20599E"
          compact
        />
      </div>

      <div className="flex flex-col gap-0 h-100 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif, index) => (
            <NotificationCard key={index} {...notif} />
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
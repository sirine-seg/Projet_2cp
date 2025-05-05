import {React, useEffect, useState} from "react";
import Header from "../components/Header";
import Headerbar from "../components/Arrowleftt";
import TabSelector from "../components/tabSelector";
import NotificationCard from "../components/notificationCard";

export default function NotificationPage() {

  // integration :
    const [activeTab, setActiveTab] = useState("Tout");
    const [notifications, setNotifications] = useState([]) // Just for testing the front
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    /* integration de la notfication */
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');  // get token from localStorage
                console.log (accessToken) ; 
                const response = await fetch("http://127.0.0.1:8000/api/notifications/notifications/", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
                    },
                    // Remove credentials: "include" because you are not using cookies
                });

                if (!response.ok) {
                    throw new Error("Fetching notifications failed");
                }

                const data = await response.json();
                const transformedData = data.map(notification => ({
                    ...notification,
                    unread: !notification.is_read  // Convert is_read to unread
                }));

                setNotifications(transformedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);



    const handleMarkAsRead = async (id) => {
        try {
            const accessToken = localStorage.getItem('access_token');

            // First make the API call to update the status
            const response = await fetch(`http://127.0.0.1:8000/api/notifications/notifications/${id}/mark-as-read/`, {
                method: "PATCH", // or "PATCH" depending on your API
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to mark notification as read");
            }

            // If the API call was successful, update the local state
            setNotifications(notifications.map(notif =>
                notif.id === id ? {...notif, is_read: true, unread: false} : notif
            ));
        } catch (error) {
            console.error("Error marking notification as read:", error);
            // Optionally show an error message to the user
        }
    };


    const filteredNotifications = activeTab === "Non lus"
      ? notifications.filter((notif) => notif.unread)
      : notifications;

    const unreadCount = notifications.filter(notif => notif.unread).length;

    const options = [
      { label: "Tout" },
      { label: "Non lus", count: unreadCount },
    ];

    if (loading) {
        return <div>Loading Notification ...</div>
    }
    if (error) {
        return <div>Error loading notification</div>
    }

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
                  Vous n'avez reÃ§u aucune notification pour le moment.
                </p>
              </div>
            </div>
          )}
        </div>
    
      </div>
    </div>
  );
}
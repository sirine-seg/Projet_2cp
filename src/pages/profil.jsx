import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Headerbar from "../components/Arrowleftt";
import Profil from "../assets/Profil.svg";
import DisModContainer from "../components/disModContainer";
import DisplayContainer from "../components/displayContainer";
import Button from "../components/Button";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');

                const response = await fetch("http://localhost:8000/api/accounts/me/", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user profile");
                }

                const data = await response.json();
                setUserData(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching user profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    };

    if (error) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[#20599E]">
                <div className="text-white text-lg">Error loading profile: {error}</div>
            </div>
        );
    }

    // Debug: Afficher le rôle dans la console
    console.log("Rôle détecté:", userData?.role || userData?.user?.role);

    // Vérification du rôle de l'utilisateur
    const role = userData?.role || userData?.user?.role || "";
    const isTechnician = ["TECHNICIEN"].includes(role?.toUpperCase());

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] font-poppins">
            <Header />
            <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] mt-8 md:mt-10">
                <Headerbar title="Mon profil" profilOrNotif="true" />

                {/* Profil */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-24 mb-6 px-4 mb:px-10">
                    {/* Photo et boutons */}
                    <div className={`flex flex-row md:flex-col items-center ${isTechnician ? "gap-10 sm:gap-24 md:gap-6" : "gap-10"}`}>
                        <img
                            src={userData?.user?.photo || Profil}
                            alt="Profil"
                            className="w-30 h-30 flex-shrink-0 rounded-full object-cover"
                            onError={(e) => {
                                e.target.src = Profil;
                                e.target.onerror = null;
                            }}
                        />

                        <div className="flex flex-col items-center gap-4">
                            <Button text="Modifier photo" />
                            {isTechnician && <Button text="Voir mes tâches" bgColor="#F09C0A" />}
                        </div>
                    </div>

                    {/* Containers */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 w-full">
                        <DisModContainer title="Nom" initialContent={userData?.user?.last_name || ""} />
                        <DisModContainer title="Prenom" initialContent={userData?.user?.first_name || ""} />
                        <DisplayContainer title="Identifiant" content={userData?.user?.id?.toString() || ""} />
                        <DisplayContainer title="Role" content={userData?.user?.role || userData?.role || ""} />
                        {isTechnician && (
                            <DisModContainer title="Poste" initialContent={userData?.position || userData?.user?.position || ""} />
                        )}
                        {isTechnician && (
                            <DisModContainer title="Disponibilite" initialContent={userData?.disponibilite || userData?.user?.disponibilite || ""} />
                        )}
                    </div>
                </div>

                {/* Containers - Numero de telephone et email */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 md:gap-20 md:my-10 px-4 mb:px-10">
                    <DisModContainer title="Numero de telephone" initialContent={userData?.user?.numero_tel || userData?.numero_tel || ""} />
                    <DisplayContainer title="E-Mail" content={userData?.user?.email || userData?.email || ""} />
                </div>

                {/* Se deconnecter */}
                <div 
                    className="flex items-center text-red-500 gap-2 ml-5"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5 cursor-pointer" />
                    <span className="font-medium cursor-pointer">Se déconnecter</span>
                </div>
            </div>
        </div>
    );
}
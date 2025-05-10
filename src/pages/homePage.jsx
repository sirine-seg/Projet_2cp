"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SignalRaccourci from "../components/SignalRaccourci";
import DashboardRaccourci from "../components/DashboardRaccourci";
import InterventionCard from "../components/InterventionCard";

export default function HomePage() {
  const [interventions, setInterventions] = useState([]);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Interventions");
  };

  // integration des cards :
  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        let apiUrl = "http://127.0.0.1:8000/api/interventions/interventions";

        const accessToken = localStorage.getItem("access_token"); // Assuming token is stored in localStorage

        const response = await fetch(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la récupération des interventions depuis ${apiUrl}`
          );
        }

        const data = await response.json();
        console.log("data", data);
        // Apply search filter (if needed)
        setInterventions(data);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    fetchInterventions();
  }, []);

  return (
    <div className="w-full min-h-screen">
      {/* Header */}
      <Header bleu="true" />

      {/* Conteneur principal */}
      <div className="w-full flex flex-col md:flex-row justify-center items-center gap-10 lg:gap-14 xl:gap-18 py-8 px-6 sm:px-16 md:px-10 xl:px-20">
        {/* Bloc gauche */}
        <div className="flex flex-col gap-8 basis-3/5 flex-grow">
          <h1 className="text-2xl font-bold text-[#292D32]">
            Bienvenue sur EsiTrack!
          </h1>

          {/* Bloc bleu */}
          <SignalRaccourci />

          {/* Interventions récentes */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#292D32]">
                Interventions récentes
              </h2>
              <button
                onClick={handleClick}
                className="text-[#5F6368] text-sm hover:underline hover:text-[#292D32] cursor-pointer"
              >
                Afficher tout
              </button>
            </div>
            <div className="flex flex-col items-center gap-4">
              {/* Exemple de cartes */}
              <div className="w-full max-w-md">
                {interventions.length === 0 ? (
                  <div className="flex flex-col items-center gap-10">
                    <InterventionCard />
                    <InterventionCard />
                  </div>
                ) : (
                  interventions.slice(0, 2).map((intervention, index) => (
                    <div key={index} className="w-full max-w-md">
                      <InterventionCard
                        id={intervention.id}
                        nom={intervention.title}
                        urgence={intervention.urgence_display}
                        statut={intervention.statut_display}
                        equipement={intervention.equipement}
                        date={new Date(
                          intervention.date_debut
                        ).toLocaleDateString("fr-FR")}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bloc droit */}
        <div className="w-full h-full basis-2/5 flex-grow flex items-center justify-center overflow-hidden">
          <DashboardRaccourci />
        </div>
      </div>
    </div>
  );
}

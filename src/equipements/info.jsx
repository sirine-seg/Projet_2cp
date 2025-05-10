import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PicView from "../components/viewPic";
import Header from "../components/Header";
import Headerbar from "../components/Arrowleftt";
import DisplayContainer from "../components/displayContainer";
import Logs from "../components/logs";
import LogsHeader from "../components/logsHeader";

/**
 * Info component - Displays detailed information about a specific equipment
 * Fetches equipment data by ID and presents it in a structured layout
 */

const fetchInterventionsByEquipement = async (equipementId) => {
  try {
    const token = localStorage.getItem("access_token"); // Get token from localStorage

    const response = await fetch(
      `http://127.0.0.1:8000/api/interventions/equipements/${equipementId}/interventions/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching interventions:", error);
    throw error;
  }
};

const Info = () => {
  // Get equipment ID from URL parameters
  const { id_equipement } = useParams();

  // State for equipment data and loading states
  const [equipement, setEquipement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interventions, setInterventions] = useState([]);

  // Fetch equipment data when component mounts
  useEffect(() => {
    const fetchEquipement = async () => {
      const token = localStorage.getItem("access_token"); // Vérifie bien que le nom du token est correct

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/equipements/equipement/${id_equipement}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        console.log("Réponse brute de l'API :", response);

        if (!response.ok) {
          console.error("Erreur HTTP - Statut :", response.status);
          throw new Error(`Équipement introuvable ! (code ${response.status})`);
        }

        const data = await response.json();
        console.log("Données récupérées :", data);
        setEquipement(data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'équipement:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id_equipement) {
      fetchEquipement();
    } else {
      console.warn("Aucun ID d'équipement fourni !");
      setError("Aucun ID d'équipement fourni !");
      setLoading(false);
    }
  }, [id_equipement]);

  useEffect(() => {
    const loadInterventions = async () => {
      if (!id_equipement) return;
      try {
        setLoading(true);
        const data = await fetchInterventionsByEquipement(id_equipement); // Changed from 'id' to 'id_equipement'

        setInterventions(data.interventions || data); // Added fallback to data directly in case the response doesn't have an interventions property
        setError(null);
      } catch (err) {
        setError(err.message);
        setInterventions([]);
      } finally {
        setLoading(false);
      }
    };

    loadInterventions();
  }, [id_equipement]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E]">
      <Header />

      {/* Page title */}
      <div className="w-full bg-[#20599E] text-white pb-16 text-center">
        <h1 className="text-3xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Equipements
        </h1>
      </div>

      {/* Main content area */}
      <div className="w-full min-h-screen rounded-t-[35px] sm:rounded-t-[45px] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        {/* Loading state */}
        {loading && <p className="text-center py-4">Chargement...</p>}

        {/* Error state */}
        {error && <p className="text-red-500 text-center py-4">{error}</p>}

        {/* Equipment details when data is loaded */}
        {equipement && (
          <div className="w-full">
            {/* Navigation header with equipment name and ID */}
            <Headerbar
              title={`${equipement.nom} # ${equipement.id_equipement}`}
            />

            <h1 className="text-lg font-semibold mb-4">
              Détails de l'équipement
            </h1>

            {/* Two-column layout for main information */}
            <div className="flex flex-col-reverse sm:flex-row w-full mx-auto px-3.5 mt-12 gap-4">
              {/* Left Column - Text information */}
              <div className="w-full sm:w-1/2 px-1">
                <DisplayContainer
                  title="Code Inventaire"
                  content={equipement.code}
                />
                <DisplayContainer title="Nom" content={equipement.nom} />
                <DisplayContainer
                  title="Code-barres"
                  content={equipement.codebar}
                />

                {/* Manual download link if available */}
                {equipement.manual && (
                  <p className="mt-2">
                    <strong>Manuel :</strong>{" "}
                    <a
                      href={equipement.manual}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Voir le manuel
                    </a>
                  </p>
                )}
              </div>

              {/* Right Column - Image display */}
              <div className="flex justify-center items-center w-full sm:w-1/2 py-4">
                <PicView equipement={equipement} />
              </div>
            </div>

            {/* Status and Location information */}
            <div className="flex flex-col sm:flex-row w-full mx-auto px-3.5 gap-1">
              <div className="w-full sm:w-1/2 px-1">
                <DisplayContainer title="Etat" content={equipement.etat_nom} />
              </div>
              <div className="w-full sm:w-1/2 px-1">
                <DisplayContainer
                  title="Localisation"
                  content={equipement.localisation_nom}
                />
              </div>
            </div>

            {/* Category and Type information */}
            <div className="flex flex-col sm:flex-row w-full mx-auto px-3.5">
              <div className="w-full sm:w-1/2 px-1">
                <DisplayContainer
                  title="Catégorie"
                  content={equipement.categorie_nom}
                />
              </div>
              <div className="w-full sm:w-1/2 px-1">
                <DisplayContainer title="Type" content={equipement.typee_nom} />
              </div>
            </div>
            {/* Manuel display if available and valid */}
            {typeof equipement.manuel === "string" &&
              equipement.manuel.trim() !== "" && (
                <p className="text-gray-700 mb-2">
                  <strong>Manuel :</strong>{" "}
                  <a
                    href={equipement.manuel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Voir le manuel
                  </a>
                </p>
              )}
          </div>
        )}

        <h2 className="text-xl font-semibold mt-8 mb-4 px-4 text-[#202124]">
          Historique des interventions
        </h2>

        <div className="w-full space-y-2">
          <LogsHeader />
          {interventions.length === 0 ? (
            <p>No interventions found.</p>
          ) : (
            interventions.map((interv) => (
              <Logs key={interv.id} id={interv.id} title={interv.title} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Info;

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
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] font-poppins">
      <Header />

      {/* Page title */}
      <div className="w-full bg-[#20599E] text-white pb-16 text-center">
        <h1 className="text-3xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Equipements
        </h1>
      </div>

      {/* Main content area */}
      <div className="w-full min-h-screen rounded-t-[35px] sm:rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-10 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        {/* Loading State */}
        {loading && <p className="text-center py-4">Chargement...</p>}

        {/* Error State */}
        {error && <p className="text-red-500 text-center py-4">{error}</p>}

        {/* Equipment Details */}
        {equipement && (
          <div className="w-full space-y-4">
            {/* Header */}
            <Headerbar
              title={`${equipement.nom} #${equipement.id_equipement}`}
            />

            <h1 className="text-lg sm:text-xl lg:text-2xl text-[#202124] mt-6 mb-4 px-4">
              Détails de l'équipement
            </h1>

            {/* Main Info Section */}
            <section className="flex flex-col-reverse sm:flex-row w-full gap-6 mt-4 px-4">
              {/* Left: Text Info */}
              <div className="flex flex-col gap-3 w-full sm:w-1/2">
                <DisplayContainer
                  title="Code Inventaire"
                  content={equipement.code}
                />
                <DisplayContainer title="Nom" content={equipement.nom} />
                <DisplayContainer
                  title="Code-barres"
                  content={equipement.codebar}
                />
              </div>

              {/* Right: Image */}
              <div className="flex justify-center items-center w-full sm:w-1/2">
                <PicView equipement={equipement} />
              </div>
            </section>

            {/* Etat & Localisation */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
              <DisplayContainer title="État" content={equipement.etat_nom} />
              <DisplayContainer
                title="Localisation"
                content={equipement.localisation_nom}
              />
            </section>

            {/* Catégorie & Type */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
              <DisplayContainer
                title="Catégorie"
                content={equipement.categorie_nom}
              />
              <DisplayContainer title="Type" content={equipement.typee_nom} />
            </section>

            {/* Manuel */}
            {typeof equipement.manuel === "string" &&
              equipement.manuel.trim() !== "" && (
                <p className="text-gray-700">
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

        {/* Historique des interventions */}
        <section className="mt-8 space-y-3 px-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl text-[#202124] mt-6 mb-4">
            Historique des interventions
          </h2>

          <LogsHeader />

          <div className="w-full space-y-2">
            {interventions.length === 0 ? (
              <p className="text-gray-600 px-2">Aucune intervention trouvée.</p>
            ) : (
              interventions.map((interv) => (
                <Logs key={interv.id} id={interv.id} title={interv.title} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Info;

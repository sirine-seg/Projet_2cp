import { useParams } from "react-router-dom"; 
import { useState, useEffect } from "react";
import PicView from "../components/viewPic";
import Header from "../components/Header";
import Headerbar from "../components/Arrowleftt";  
import DisplayContainer from "../components/displayContainer";

/**
 * Info component - Displays detailed information about a specific equipment
 * Fetches equipment data by ID and presents it in a structured layout
 */
const Info = () => {
  // Get equipment ID from URL parameters
  const { id } = useParams();
  
  // State for equipment data and loading states
  const [equipement, setEquipement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch equipment data when component mounts
  useEffect(() => {
    const fetchEquipement = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/equipements/equipement/${id}/`);
        if (!response.ok) throw new Error("Équipement introuvable !");
        
        const data = await response.json();
        setEquipement(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipement();
  }, [id]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md overflow-hidden">
      {/* Header component */}
      <Header />
      
      {/* Page title */}
      <div className="w-full bg-[#20599E] text-white py-16 text-center">
        <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Equipements
        </h1>
      </div>
      
      {/* Main content area */}
      <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        {/* Loading state */}
        {loading && <p className="text-center py-4">Chargement...</p>}
        
        {/* Error state */}
        {error && <p className="text-red-500 text-center py-4">{error}</p>}
        
        {/* Equipment details when data is loaded */}
        {equipement && (
          <div className="w-full">
            {/* Navigation header with equipment name and ID */}
            <Headerbar title={`${equipement.nom} # ${equipement.id_equipement}`} />

            <h1 className="text-lg font-semibold mb-4">Détails de l'équipement</h1>

            {/* Two-column layout for main information */}
            <div className="flex flex-col-reverse sm:flex-row w-full mx-auto px-3.5 mt-12 gap-4">
              {/* Left Column - Text information */}
              <div className="w-full sm:w-1/2 px-1">
                <DisplayContainer title="Code Inventaire" content={equipement.code} />
                <DisplayContainer title="Nom" content={equipement.nom} />
                <DisplayContainer title="Code-barres" content={equipement.codebar} />

                {/* Manual download link if available */}
                {equipement.manual && (
                  <p className="mt-2">
                    <strong>Manuel :</strong>{' '}
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
                <DisplayContainer title="Localisation" content={equipement.localisation_nom} />
              </div>
            </div>

            {/* Category and Type information */}
            <div className="flex flex-col sm:flex-row w-full mx-auto px-3.5">
              <div className="w-full sm:w-1/2 px-1">
                <DisplayContainer title="Catégorie" content={equipement.categorie_nom} />
              </div>
              <div className="w-full sm:w-1/2 px-1">
                <DisplayContainer title="Type" content={equipement.typee_nom} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
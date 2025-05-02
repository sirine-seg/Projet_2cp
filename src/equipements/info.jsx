import { useParams, useLocation, useNavigate } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import PicView from "../components/viewPic";

import PopupMessage from "../components/Popupcheck";
import SearchBar from "../components/Searchbar"; 
import Filterbutton from "../components/Filterbutton"; 
import Header from "../components/Header";
import AjouterButton from "../components/Ajouterbutton";
import Buttonrec from "../components/buttonrectangle";
import Usercard from "../components/Usercard";
import Badge from "../components/badge";
import ChoiceContainer from "../components/choiceContainer"; 
import WriteContainer from "../components/writeContainer";   
import Headerbar from "../components/Arrowleftt";  
import Filtre from "../components/filtre";
import DisplayContainer from "../components/displayContainer";


const Info = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [equipement, setEquipement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [equipements, setEquipements] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    etats: [],
    localisations: [],
    types: [],
  });

  const [filters, setFilters] = useState({
    categorie: "",
    type: "",
    localisation: "",
    etat: "",
  });

  useEffect(() => {
    const fetchEquipement = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/equipements/equipement/${id}/`);
        if (!response.ok) throw new Error("Équipement introuvable !");
        const data = await response.json();
        console.log("data",data);
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
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md  overflow-hidden">
                    
    {/* Logo en haut à gauche */}
    <Header />
   
   
   
   
   
                       {/* En-tête */}
                       <div className="w-full bg-[#20599E] text-white py-16 text-center">
                      
                       <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
                           Utilisateurs
                       </h1>
                       {/* bare de recherhce  */}    
             <SearchBar
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               placeholder="Rechercher (nom, email, rôle...)"
             />
<div className="mx-auto w-full max-w-4xl px-4 mt-4 flex justify-center">
        <div className="flex flex-nowrap space-x-2 overflow-x-auto no-scrollbar pb-2">
        <Filtre
    label={`Catégorie: ${filters.categorie }`}
    onClick={() => {
      // handle filter click (e.g. open a modal or dropdown to select value)
      console.log("Clicked Catégorie");
    }}
  />
  <Filtre
    label={`Type: ${filters.type }`}
    onClick={() => {
      console.log("Clicked Type");
    }}
  />
  <Filtre
    label={`Localisation: ${filters.localisation }`}
    onClick={() => {
      console.log("Clicked Localisation");
    }}
  />
  <Filtre
    label={`État: ${filters.etat }`}
    onClick={() => {
      console.log("Clicked État");
    }}
  />

          </div>
          </div>
          </div>
       
          

          <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
          {equipement && (
  <div className="w-full">
    <Headerbar title={`${equipement.nom} # ${equipement.id_equipement}`} />

    <h1 className="text-lg font-semibold mb-4">Détails de l'équipement</h1>

    <div className="flex flex-col-reverse sm:flex-row w-full mx-auto px-3.5 mt-12 gap-4">
      {/* Left Column */}
      <div className="w-full sm:w-1/2 px-1">
        <DisplayContainer title="Code Inventaire" content={equipement.code} />
        <DisplayContainer title="Nom" content={equipement.nom} />
        <DisplayContainer title="Code-barres" content={equipement.codebar} />

        {equipement.manual && (
          <p className="mt-2">
            <strong>Manuel :</strong>{' '}
            <a href={equipement.manual} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Voir le manuel
            </a>
          </p>
        )}
      </div>

      {/* Right Column (Image Display) */}
      <div className="flex justify-center items-center w-full sm:w-1/2 py-4">
        <PicView equipement={equipement} />
      </div>
    </div>

    <div className="flex flex-col sm:flex-row w-full mx-auto px-3.5 gap-1">
      <div className="w-full sm:w-1/2 px-1">
        <DisplayContainer title="Etat" content={equipement.etat_nom} />
      </div>
      <div className="w-full sm:w-1/2 px-1">
        <DisplayContainer title="Localisation" content={equipement.localisation_nom} />
      </div>
    </div>

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
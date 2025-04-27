import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import logo from "../assets/logo.png";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate} from "react-router-dom";

import PicField from "../components/picfield";

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

const EditPage = () => {
    const { id } = useParams(); 
    const [displayedEquipements, setDisplayedEquipements] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [filter, setFilter] = useState("Tout");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedEquipement, setSelectedEquipement] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [equipements, setEquipements] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    etats: [],
    localisations: [],
    types: [],
  });

  // New state for multiple filters
  const [filters, setFilters] = useState({
    categorie: "",
    type: "",
    localisation: "",
    etat: "",
  });

  const categories = ["Ordinateur", "Imprimante", "Projecteur"];
  const { state } = useLocation();
  
  const navigate = useNavigate();

  const [equipement, setEquipement] = useState(state?.equipement || {
    nom: "",
    type: "",
    categorie: "",
    localisation: "",
    codebar: "",
  });
  useEffect(() => {
    if (!state?.equipement) {
      fetch(`http://127.0.0.1:8000/equipements/${id}/`)
        .then((response) => response.json())
        .then((data) => setEquipement(data))
        .catch((error) => console.error("Erreur lors de la récupération :", error));
    }
  }, [id, state]);
  

  const handleChange = (e) => {
    setEquipement({ ...equipement, [e.target.name]: e.target.value });
  };
  

  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Generate a preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      setEquipement({ ...equipement, manual: file });
  
      // Create a preview link
      const fileURL = URL.createObjectURL(file);
      setPreviewUrl(fileURL);
    }
  };
  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("nom", equipement.nom);
    formData.append("type", equipement.type);
    formData.append("categorie", equipement.categorie);
    formData.append("localisation", equipement.localisation);
    formData.append("codebar", equipement.codebar);
  
    if (equipement.manual instanceof File) {
      formData.append("manuel", equipement.manuel);
    } 
  
    fetch(`http://127.0.0.1:8000/equipements/update/${id}/`, {
      method: "PATCH",
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        alert("Équipement mis à jour !");
       
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour :", error);
        alert("Échec de la mise à jour !");
      });
  };
  
  useEffect(() => {
    const filteredEquipements = equipements.filter((equipement) => {
      const matchesFilter = filter === "Tout" || equipement.categorie === filter;
      const name = equipement.nom ? equipement.nom.toLowerCase() : "";
      const searchNormalized = searchTerm.toLowerCase().trim();
      const matchesSearch =
        searchNormalized === "" || name.includes(searchNormalized);
      return matchesFilter && matchesSearch;
    });
    setDisplayedEquipements(filteredEquipements.slice(0, visibleCount));
  }, [filter, visibleCount, equipements, searchTerm]);

  // ✅ FilterSelect Component (Reusable Dropdown)
  const FilterSelect = ({ label, options, value, onChange }) => (
    <select
      className="w-auto sm:w-1/4 px-4 py-2 rounded-md border border-gray-300 bg-[#F4F4F5]  text-xs sm:text-sm"
      value={value}
      onChange={onChange}
    >
      <option value="">{label}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/filters/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Filter Options:", data);
        setFilterOptions(data);
      })
      .catch((error) => console.error("Error fetching filter options:", error));
  }, []);

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md overflow-hidden">
                    
        {/* Logo en haut à gauche */}
        <Header />
       
      
            {/* ✅ Header */}
            <div className="w-full bg-[#20599E] text-white py-16 text-center">
                          
                          <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
                           Equipements
                          </h1>
      
                          <SearchBar
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   placeholder="Rechercher (nom, email, rôle...)"
                 />

                 
        {/* ✅ Filter Dropdowns */}
        <div className="mx-auto w-full max-w-4xl px-4 mt-4 -mt-8  flex justify-center">
        <div className="flex flex-nowrap space-x-2 overflow-x-auto no-scrollbar pb-2">
        <Filtre
    label={`Catégorie: ${filters.categorie || "Tous"}`}
    onClick={() => {
      // handle filter click (e.g. open a modal or dropdown to select value)
      console.log("Clicked Catégorie");
    }}
  />
  <Filtre
    label={`Type: ${filters.type || "Tous"}`}
    onClick={() => {
      console.log("Clicked Type");
    }}
  />
  <Filtre
    label={`Localisation: ${filters.localisation || "Toutes"}`}
    onClick={() => {
      console.log("Clicked Localisation");
    }}
  />
  <Filtre
    label={`État: ${filters.etat || "Tous"}`}
    onClick={() => {
      console.log("Clicked État");
    }}
  />

          </div>
          </div>
          </div>
      
          <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col  bg-[#F4F4F4] -mt-12">
                    <div className="w-full ">
  <Headerbar title="Modifier Un Equipement" />
</div>

      
      <div className="flex flex-row w-full mx-auto px-3.5 mt-12 gap-4">
  {/* Left Column */}
  <div className="flex flex-col w-full sm:w-1/2 pr-0 sm:pr-2">
    <div className="my-2">
    <WriteContainer
  title="Nom"
  value={equipement.nom}

  onChange={(val) => setNewUser({ ...equipement, nom: val })}
/>
    </div>

    <div className="my-2">
     
      <WriteContainer
  title="Code Bar"
  value={equipement.codebar}

  onChange={(val) => setNewUser({ ...equipement, codebar: val })}
/>
    </div>

    <div className="my-2">
     
     <WriteContainer
 title="Code Inventaire"
 value={equipement.codeInventaire}

 onChange={(val) => setNewUser({ ...equipement, codeInventaire: val })}
/>
   </div>
  </div>

  {/* Right Column */}
  <div className="flex justify-center items-center w-full sm:w-1/2 py-4">
<PicField />
</div>


</div>

<div className="flex flex-col sm:flex-row w-full mx-auto px-3.5 mt-2">
  <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
  <ChoiceContainer
      title="Catégorie"
      options={categories.map((cat) => ({ label: cat, value: cat }))}
      selectedOption={equipement.categorie}
      onSelect={(value) =>
        setEquipement({ ...equipement, category: value })
      }
    />
  </div>
  <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
  <label className="block text-black font-bold">Manuel</label>
  
  {/* Show previous file if exists */}
  {equipement.manual && typeof equipement.manual === "string" && (
    <p className="text-gray-700 mb-2">
      Fichier actuel :{" "}
      <a
        href={equipement.manual} // If it's a URL
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        Voir le manuel
      </a>
    </p>
  )}

  {/* File upload input */}
  
  <input
    type="file"
    name="manuel"
    accept=".pdf,.doc,.docx"
    onChange={handleFileChange}
   
    className="flex w-full py-3 px-4 border border-white rounded-[0.5rem] text-[#80868B] text-[0.8125rem] font-regular font-poppins justify-between bg-white transition-colors duration-200 focus:outline-0 focus:ring-0"
  />
</div>


</div>

{/* Bottom Row */}
<div className="flex flex-col sm:flex-row w-full mx-auto px-3.5 mt-2">

<div className="w-full sm:w-1/2 pl-0 sm:pl-2">
  <ChoiceContainer
  title="Type"
  options={filterOptions.types.map((type) => ({ label: type, value: type }))}
  selectedOption={
    filterOptions.types
      .map((type) => ({ label: type, value: type }))
      .find((opt) => opt.value === equipement.type)
  }
  onSelect={(option) =>
    setEquipement({ ...equipement, type: option.value })
  }
/>

  </div>
  <div className="w-full sm:w-1/2 pl-0 sm:pl-2">
  <ChoiceContainer
  title="Localisation"
  options={filterOptions.localisations.map((loc) => ({ label: loc, value: loc }))}
  selectedOption={
    filterOptions.localisations
      .map((loc) => ({ label: loc, value: loc }))
      .find((opt) => opt.value === equipement.localisation)
  }
  onSelect={(option) =>
    setEquipement({ ...equipement, localisation: option.value })
  }
/>

  </div>

</div>
<div className="flex justify-center mt-4">
  <Buttonrec text="Enregistrer" onClick={handleUpdate} />
</div>
 {/* Affichage du message d'erreur */}
 {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

{/* Flèche de retour */}
 
            {isPopupVisible && (
  <PopupMessage
    title="L'utilisateur a été Modifier avec succès !"
    onClose={() => setIsPopupVisible(false)}
  />
)}
      
      
          
            </div>
          </div>
    );
};

export default EditPage;

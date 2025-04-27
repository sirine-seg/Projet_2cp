import { useState, useRef, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import logo from "../assets/logo.png";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AutoGrowTextarea from "@/components/description";
import { FaCalendarAlt } from "react-icons/fa";
import SelectableInput from "@/components/SelectableInput";
import Assigner from "@/components/assign";


import Header from "../components/Header";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { MdAccountCircle } from "react-icons/md";
import Filtre from "../components/filtre";
import PopupMessage from "../components/Popupcheck";
import SearchBar from "../components/Searchbar"; 
import Filterbutton from "../components/Filterbutton";
import AjouterButton from "../components/Ajouterbutton";
import Buttonrec from "../components/buttonrectangle";
import Usercard from "../components/Usercard";
import Badge from "../components/badge";
import ChoiceContainer from "../components/choiceContainer"; 
import WriteContainer from "../components/writeContainer";   
import Headerbar from "../components/Arrowleftt";  
import ImageUploader from "@/components/imageUploader";


const SignalerAdmin = () => {
  const { id } = useParams(); 
  const [selectedTechnicienId, setSelectedTechnicienId] = useState("");
const [techniciensAjoutes, setTechniciensAjoutes] = useState([]);

  const [displayedEquipements, setDisplayedEquipements] = useState([]);
  const [filter, setFilter] = useState("Tout");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedEquipement, setSelectedEquipement] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [selectedDatedebut, setSelectedDatedebut] = useState(null);
  const [selectedDatefin, setSelectedDatefin] = useState(null);
  const [selectedUrgence, setSelectedUrgence] = useState("");
  //
  // const [urgenceOptions, setUrgenceOptions] = useState([]);
  const [equipements, setEquipements] = useState([]);

  const [urgence, setUrgence] = useState("");
  const [newIntervention, setNewIntervention] = useState({
    
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    etats: [],
    localisations: [],
    types: [],
  });
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    description: "",
    
  });

  // New state for the technician popup and users list
  const [showPopup, setShowPopup] = useState(false);
  const [assignedTechniciens, setAssignedTechniciens] = useState([]);
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);

   
const urgenceOptions = [
  { id: 0, label: 'Urgence vitale' },
  { id: 1, label: 'Urgence élevée' },
  { id: 2, label: 'Urgence modérée' },
  { id: 3, label: 'Faible urgence' },
];

  const handleChange = (e) => {
    setNewIntervention({ ...newIntervention, [e.target.name]: e.target.value });
  };

  // Fetch urgence options from backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/urgences/")
      .then((response) => response.json())
      .then((data) => setUrgenceOptions(data))
      .catch((error) => console.error("Error fetching urgences:", error));
  }, []);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newIntervention.description]);

  

  
  

  useEffect(() => {
    const filteredEquipements = equipements.filter((equipement) => {
      const matchesFilter =
        filter === "Tout" || equipement.categorie === filter;
      const name = equipement.nom ? equipement.nom.toLowerCase() : "";
      const searchNormalized = searchTerm.toLowerCase().trim();
      const matchesSearch =
        searchNormalized === "" || name.includes(searchNormalized);
      return matchesFilter && matchesSearch;
    });
    setDisplayedEquipements(filteredEquipements.slice(0, visibleCount));
  }, [filter, visibleCount, equipements, searchTerm]);

  // ✅ Reusable FilterSelect Component
  const FilterSelect = ({ label, options, value, onChange }) => (
    <select
      className="w-full sm:w-1/4 px-4 py-2 rounded-md border border-gray-300 bg-[#F4F4F5]"
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
      .catch((error) =>
        console.error("Error fetching filter options:", error)
      );
  }, []);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch users for technician popup
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/users/");
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des utilisateurs");
        const data = await response.json();
        console.log("Tous les utilisateurs récupérés :", data);
        setUsers(data);
        setDisplayedUsers(data.slice(0, visibleCount));
      } catch (error) {
        console.error("Erreur :", error);
      }
    };
    fetchUsers();
  }, [visibleCount]);

  const techniciensDispo = users.filter(user => 
    user.role === "Technicien" && user.technicien && user.technicien.disponibilite === true
);
  

  const addTechnicien = (technicien) => {
    setAssignedTechniciens([...assignedTechniciens, technicien]);
    if (technicien && !techniciensAjoutes.some(t => t.id === technicien.id)) {
      setTechniciensAjoutes([...techniciensAjoutes, technicien]);
    }
    setShowPopup(false); // Close the popup after adding
  };

  const removeTechnicien = (indexToRemove) => {
    setAssignedTechniciens((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };
  const handleAddIntervention = (values) => {
    const formatDate = (dateStr) => {
      if (!dateStr) return null;
      return new Date(dateStr).toISOString();
    };
    const formData = new FormData();
  
    if (selectedDatedebut) {
      formData.append("date_debut", formatDate(selectedDatedebut)); // ⚠️ ici tu avais aussi une inversion date_debut/date_fin
    }
  
    if (selectedDatefin) {
      formData.append("date_fin", formatDate(selectedDatefin));
    }
  
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
  
    if (techniciensAjoutes.length > 0) {
      techniciensAjoutes.forEach(t => {
        formData.append("technicien", t.id);
      });
    }
    
  
    formData.append("description", values.description || "");
    formData.append("equipement", id); // OK si `id` est bien défini dans le composant
    console.log("urgence:",selectedUrgence);
  
    if (selectedUrgence) {
      formData.append("urgence", selectedUrgence.id);
    }
  
    fetch("http://127.0.0.1:8000/intervention/Admincreate/", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        let data;
        try {
          data = await response.json();
        } catch (error) {
          console.warn("Non-JSON response received:", error);
          data = null;
        }
  
        console.log("Server response:", data);
  
        if (!response.ok) {
          throw new Error(data?.message || "Échec de l'ajout !");
        }
  
        alert("Équipement ajouté !");
        setInterventions([...interventions, data]);
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout:", error);
        alert("Erreur lors de l'ajout !");
      });
  };
  
 
console.log("Techniciens disponibles :", techniciensDispo); // 👀

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md overflow-hidden">

                    
    {/* Logo en haut à gauche */}
    <Header />
  {/* ✅ Header */}
 
  <div className="w-full bg-[#20599E] text-white py-16 text-center">
                      
                      <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
                       Equipements
                      </h1>
                      {/* bare de recherhce  */}    
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

      <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
                <div className="w-full ">
<Headerbar title="Signaler Un Problème" />
</div>
        <div className="w-full sm:w-80 h-6 justify-start text-neutral-800 text-lg sm:text-xl md:text-2xl font-normal font-['Poppins'] leading-snug tracking-wide mt-8 ml-8">
  Détails de l'intervention
</div>

<div className="flex flex-col space-y-4 mt-4">
  {/* Date Range Row 
  <div className="flex flex-row space-x-4 w-full">
    {/* Date Debut 
    <div className="flex-1">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Date debut</h2>
      <div className="relative w-full">
        <DatePicker
          selected={selectedDatedebut}
          onChange={(date) => setSelectedDatedebut(date)}
          dateFormat="dd/MM/yyyy"
          className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-black bg-white"
          placeholderText="Choisissez une date"
        />
      </div>
    </div>

    {/* Date Fin 
    <div className="flex-1">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Date fin</h2>
      <div className="relative w-full">
        <DatePicker
          selected={selectedDatefin}
          onChange={(date) => setSelectedDatefin(date)}
          dateFormat="dd/MM/yyyy"
          className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-black bg-white"
          placeholderText="Choisissez une date"
        />
      </div>
    </div>
  </div>

  {/* Urgence Row 
  <div className="w-full">
    <label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[0.8125rem] mb-1 ml-0.25rem">Urgence</label>
    <Select
      options={urgenceOptions}
      isClearable
      isSearchable
      placeholder="Sélectionnez ou écrivez une urgence"
      value={selectedUrgence}
      onChange={(selectedOption) => setSelectedUrgence(selectedOption)}
     
      components={makeAnimated()}
      getOptionValue={(option) => option.id}
      getOptionLabel={(option) => option.label}
      classNames={"flex w-full py-3 px-4 border border-white rounded-[0.5rem] text-[#80868B] text-[0.8125rem] font-regular font-poppins justify-between bg-white transition-colors duration-200 focus:outline-0 focus:ring-0"}
    />
  </div>*/}

<div className="w-full">
   <SelectableInput
          title="Urgence"
          options={urgenceOptions}
          selectedOption={selectedUrgence}
          onSelect={(selectedOption) => setSelectedUrgence(selectedOption)}
        />  
</div>

  {/* Description Row */}
  <div className="w-full">
  <AutoGrowTextarea onChange={handleChange} />
  </div>

  {/* Buttons Row (after Description) */}
  <div className=" w-full">
  <div className="flex items-center">
 <ImageUploader />
</div>

   
<div className=" w-full">   

  <Assigner />
</div>
  </div>

  
</div>

<div className="flex justify-center mt-4">
  <Buttonrec text="Enregistrer" onClick={handleAddIntervention}   className="w-full sm:w-auto px-4"/>
</div>

        {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-md w-96 shadow-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-700 text-xl"
              onClick={() => setShowPopup(false)}
            >
              X
            </button>

            <h2 className="text-black font-bold mb-2">Techniciens</h2>
            <p className="text-black mb-2">
              Les techniciens disponibles en ce moment.
            </p>

            <div className="max-h-60 overflow-y-auto">
              {techniciensDispo.map((tech) => (
                <div
                  key={tech.id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <div className="flex items-center space-x-3">
                    <MdAccountCircle className="text-gray-600 w-10 h-10" />
                    <div>
                      <p className="font-bold">
                        {tech.first_name} {tech.last_name}
                      </p>
                      <p className="text-sm text-black">{tech.email}</p>
                      <p className="text-sm text-black">
                        {tech.technicien?.poste || "Aucun poste spécifié"}
                      </p>
                    </div>
                  </div>
                  <button
                    className="px-3 py-1 bg-gray-400 text-black rounded-md"
                    onClick={() => addTechnicien(tech)}
                  >
                    Ajouter
                  </button>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      )}
     
        
      </div>

      

      
    </div>
    
  );
};

export default SignalerAdmin;


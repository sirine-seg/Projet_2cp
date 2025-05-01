import { useState, useRef, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import logo from "../assets/logo.png";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SelectableInput from "../components/SelectableInput";
import { FaCalendarAlt } from "react-icons/fa";
import AutoGrowTextarea from "../components/description"
import Header from "../components/Header";
import PicField from "../components/picfield";
import ImageUploader from "@/components/imageUploader";

import { MdAccountCircle } from "react-icons/md";
import Filtre from "../components/filtre";
import PopupMessage from "../components/Popupcheck";
import SearchBar from "../components/Searchbar"; 

import AjouterButton from "../components/Ajouterbutton";
import Buttonrec from "../components/buttonrectangle";
import Usercard from "../components/Usercard";
import Badge from "../components/badge";
import ChoiceContainer from "../components/choiceContainer"; 
import WriteContainer from "../components/writeContainer";   
import Headerbar from "../components/Arrowleftt";  


const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="flex flex-col items-center space-y-4">
      <label className="text-lg font-semibold">Select a Date:</label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy-MM-dd"
        className="px-4 py-2 border rounded-md shadow-sm"
        placeholderText="Click to select a date"
      />
    </div>
  );
};

const Signaler = () => {
  const { id } = useParams(); 
  const [selectedTechnicienId, setSelectedTechnicienId] = useState("");
const [techniciensAjoutes, setTechniciensAjoutes] = useState([]);
const [selectedUrgence, setSelectedUrgence] = useState(null);
const [isPopupVisible, setIsPopupVisible] = useState(false);
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

  const [selected, setSelected] = useState("");
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

 /* // Fetch urgence options from backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/urgences/")
      .then((response) => response.json())
      .then((data) => setUrgenceOptions(data))
      .catch((error) => console.error("Error fetching urgences:", error));
  }, []);*/

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
/*
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
*/
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
  const handleAddIntervention = () => {
    const formData = new FormData();
  
    // Vérifie et ajoute l'image si sélectionnée
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    
    if (selectedUrgence) {
      formData.append("urgence", selectedUrgence.id);
    }
    formData.append("title", newIntervention.title);
    // Description
    formData.append("description", newIntervention.description);
  
    // ID équipement
    formData.append("equipement", id);
  
    // Facultatif : log des valeurs envoyées
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  
    // Envoi de la requête
    fetch("http://127.0.0.1:8000/api/interventions/personnel/intervention-curratives/create/", {
      method: "POST",
      
      credentials: "include",
      body: formData,
    })
      .then(async (response) => {
        const text = await response.text();
  
        let data;
        console.log("Raw response:", text); 
        try {
          data = JSON.parse(text);
        } catch (error) {
          console.warn("Réponse non JSON :", error);
          console.warn("Texte brut reçu :", text);
          alert("Erreur du serveur. Voir la console pour plus de détails.");
          return;
        }
  
        console.log("Réponse du serveur :", data);
  
        if (!response.ok) {
          throw new Error(data?.message || "Échec de l'ajout !");
        }
  
     
        setIsPopupVisible(true);
        setInterventions([...interventions, data]);
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout :", error);
        alert("Erreur lors de l'ajout !");
      });
  };
  
  
 
console.log("Techniciens disponibles :", techniciensDispo); // 👀

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md  overflow-hidden">

                    
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
<Headerbar title=" Signaler Un Problème" />
</div>





        <div className="w-full sm:w-80 h-6 justify-start text-neutral-800 text-lg sm:text-xl md:text-2xl font-normal font-['Poppins'] leading-snug tracking-wide mt-8 ml-8">
          Détails de l'intervention
        </div>

        <div className="flex flex-col w-full mx-auto px-3.5 mt-2">
         
        <WriteContainer
        title="Problem"
    value={newIntervention.title}
    onChange={(val) =>setNewIntervention({ ...newIntervention, title: val })}
      />
<div className="w-full">
   <SelectableInput
          title="Urgence"
          options={urgenceOptions}
          selectedOption={selectedUrgence}
          onSelect={(selectedOption) => setSelectedUrgence(selectedOption)}
        />
</div>

      

          <div className="w-full mt-4">
          <AutoGrowTextarea onChange={handleChange} />
          </div>
        </div>

        <div className="flex items-center w-full sm:w-1/2 py-4 px-7">
        <ImageUploader />
        </div>

      
        <div className="flex justify-center mt-4">
  <Buttonrec text="Enregistrer" onClick={handleAddIntervention}   className="w-full sm:w-auto px-4"/>
</div>
 {/* Affichage du message d'erreur */}
 {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

 {isPopupVisible && (
  <PopupMessage
    title="problème signalé avec succès !"
    onClose={() => setIsPopupVisible(false)}
  />)}  
        
      </div>

      

      
    </div>
    
  );
};

export default Signaler;
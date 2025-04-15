import { useState, useRef, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import logo from "../assets/logo.png";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "./custom-datepicker.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { MdAccountCircle } from "react-icons/md";


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
  const handleAddIntervention = () => {
    const formData = new FormData();
  
    // Vérifie et ajoute l'image si sélectionnée
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
  
    // Description
    formData.append("description", interventions.description || "");
  
    // ID équipement
    formData.append("equipement", id);
  
    // Facultatif : log des valeurs envoyées
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  
    // Envoi de la requête
    fetch("http://127.0.0.1:8000/intervention/Admincreate/", {
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
  
        alert("Équipement ajouté !");
        setInterventions([...interventions, data]);
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout :", error);
        alert("Erreur lors de l'ajout !");
      });
  };
  
  
 
console.log("Techniciens disponibles :", techniciensDispo); // 👀

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md">
      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className="absolute top-4 left-4 w-12 sm:w-16 md:w-20 lg:w-24 h-auto"
      />

      {/* Header */}
      <div className="w-full bg-[#20599E] text-white py-20 sm:py-24 text-center">
        <h1 className="text-4xl font-bold text-[#F4F4F5] mb-10">Equipements</h1>
      </div>

      <div className="w-full max-w-7xl bg-[#F4F4F5] min-h-screen rounded-t-[80px] px-6 py-8 shadow-md flex flex-col">
        {/* Search Bar */}
        <div className="relative w-full max-w-md my-3 -mt-35 mx-auto">
          <div className="relative">
            <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#20599E]" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full text-black px-4 py-2 pl-10 rounded-full border border-[#20599E] bg-[#F4F4F5] shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-xl w-full px-4 py-1 text-sm sm:text-base h-8 sm:h-10 mx-auto items-center justify-center">
          <FilterSelect
            label="Catégorie"
            options={filterOptions.categories}
            value={filters.categorie}
            onChange={(e) =>
              setFilters({ ...filters, categorie: e.target.value })
            }
          />
          <FilterSelect
            label="Type"
            options={filterOptions.types}
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          />
          <FilterSelect
            label="Localisation"
            options={filterOptions.localisations}
            value={filters.localisation}
            onChange={(e) =>
              setFilters({ ...filters, localisation: e.target.value })
            }
          />
          <FilterSelect
            label="État"
            options={filterOptions.etats}
            value={filters.etat}
            onChange={(e) =>
              setFilters({ ...filters, etat: e.target.value })
            }
          />
        </div>

        {/* Header Row */}
        <div className="flex flex-row items-center justify-between mt-8 sm:mt-8 px-4">
          {/* Back Button */}
          <div className="flex items-center">
            <ArrowLeft
              className="w-8 h-8 text-dark cursor-pointer sm:w-6 sm:h-6"
              onClick={() => navigate(-1)}
            />
          </div>
          {/* Title */}
          <div className="text-neutral-800 text-4xl font-semibold font-['Poppins'] mx-auto text-center sm:text-2xl md:text-3xl">
            Signaler un Problème
          </div>
        </div>

        <div className="w-full sm:w-80 h-6 justify-start text-neutral-800 text-lg sm:text-xl md:text-2xl font-normal font-['Poppins'] leading-snug tracking-wide mt-8 ml-8">
          Détails de l'intervention
        </div>

        <div className="flex flex-col sm:flex-row w-full mx-auto px-3.5 mt-2">
         
          

          <div className="w-full">
            <label className="block text-black font-bold">Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              rows="1"
              className="w-full my-2 px-4 py-3 border rounded-md bg-white text-black resize-none overflow-hidden"
              style={{ minHeight: "48px" }}
              ref={textareaRef}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            />
          </div>
        </div>

        <div className="flex items-center w-full sm:w-1/2 py-4 px-7">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#20599E] text-white rounded-md shadow hover:bg-[#1a4c85] transition px-4 py-2 w-fit"
          >
            Attacher une image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="ml-4 w-12 h-12 object-cover rounded shadow-md"
            />
          )}
        </div>

       
       

<div className="flex justify-center items-center mt-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddIntervention}
            className="px-4 bg-[#20599E] text-white py-2 rounded-md font-bold transition duration-200"
          >
            Ajouter
          </motion.button>
        </div>
        
        
      </div>

      

      
    </div>
    
  );
};

export default Signaler;
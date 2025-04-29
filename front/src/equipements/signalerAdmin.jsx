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
import TechnicienAssign from "../components/technicienAssign";
import Button from "../components/Button";
import WriteContainer from "@/components/writeContainer";






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
    
const [techniciensDispo, setTechniciensDispo] = useState([]);



const [assignedTechniciens, setAssignedTechniciens] = useState([]);
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
  const fetchAvailableTechnicians = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/techniciens/?disponibilite=true');
      if (response.ok) {
        const data = await response.json();
        setTechniciensDispo(data);
        console.log("Techniciens disponibles:", data);
      } else {
        console.error('Erreur lors de la récupération des techniciens disponibles');
      }
    } catch (error) {
      console.error('Erreur réseau lors de la récupération des techniciens :', error);
    }
  };

  fetchAvailableTechnicians();
}, []);



const addTechnicien = (technicien) => {
  setAssignedTechniciens([...assignedTechniciens, technicien]);
  setIsPopupVisible(false); // Fermer le popup après l'ajout
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
    

    formData.append("description", newIntervention.description);
    formData.append("title", newIntervention.title);
    formData.append("equipement", id); // OK si `id` est bien défini dans le composant
    console.log("urgence:",selectedUrgence);
  
    if (selectedUrgence) {
      formData.append("urgence", selectedUrgence.id);
    }
  
    fetch("http://127.0.0.1:8000/api/interventions/admin/intervention-curratives/create/", {
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

<div className="flex flex-col space-y-4 mt-4">
  {/* Date Range Row */}
  <div className="flex flex-row space-x-4 w-full">
    {/* Date Debut */}
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

    {/* Date Fin */}
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

  {/* Urgence Row */}
  <div className="w-full">
    <label className="block text-black font-bold mb-2">Urgence</label>
    <Select
      options={urgenceOptions}
      isClearable
      isSearchable
      placeholder="Sélectionnez ou écrivez une urgence"
      value={selectedUrgence}
      onChange={(selectedOption) => setSelectedUrgence(selectedOption)}
      className="w-full text-black"
      components={makeAnimated()}
      getOptionValue={(option) => option.id}
      getOptionLabel={(option) => option.label}
      styles={{
        control: (base) => ({
          ...base,
          padding: "6px",
          borderRadius: "8px",
          borderColor: "#ccc",
          backgroundColor: "white",
        }),
      }}
    />
  </div>
   <WriteContainer
          title="Problem"
      value={newIntervention.title}
      onChange={(val) =>setNewIntervention({ ...newIntervention, title: val })}
        />

  {/* Description Row */}
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

  {/* Buttons Row (after Description) */}
  <div className=" w-full">
  <div className="flex items-center">
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

    
 <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-4">
        {assignedTechniciens.map((tech, index) => (
          <div key={index} className="flex items-center justify-between">
            <TechnicienAssign
              nom={tech.name}
              prenom={tech.prenom}
              email={tech.email}
              imageUrl={tech.photo}
              poste={tech.poste}
              buttonTitle="Retirer"
              onAssign={() => removeTechnicien(index)}
            />
          </div>
        ))}
        {/* Bouton Ajouter */}
        <div className="flex justify-center">
          <Button
            text="Ajouter"
            bgColor="#F09C0A"
            textColor="#ffffff"
            onClick={() => setShowPopup(true)}
          />
        </div>
      </div>
  </div>

  
</div>

<div className="flex items-center mt-16 justify-end">
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={handleAddIntervention}
    className="px-4 bg-[#20599E] text-white py-2 rounded-md font-bold transition duration-200"
  >
    Ajouter
  </motion.button>
</div>

{showPopup && (
        <AssignPopUp
          titre="Technicien(s) disponibles"
          description="Les techniciens disponibles en ce moment."
          buttonTitle="Ajouter"
          technicians={techniciensDispo.map((tech) => ({
            id: tech.user.id,
            nom: tech.user.last_name,
            prenom: tech.user.first_name,
            poste: tech.poste_nom|| "Non spécifié",
            email:tech.user.email,
            imageUrl:tech.user.photo
            
          }))}
          onClose={() => setShowPopup(false)}
          onAssign={(user) => {
            addTechnicien({
              id: user.id,
              name: `${user.prenom} ${user.nom}`,
              email: user.email,
              imageUrl: user.photo,
              poste: user.poste,
            });
          }}
        />
      )}
     
        
      </div>

      

      
    </div>
    
  );
};

export default SignalerAdmin;


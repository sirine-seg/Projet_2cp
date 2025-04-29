import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import logo from "../assets/logo.png";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate} from "react-router-dom";
import Header from "../components/Header.jsx";
import Filtre from "../components/filtre.jsx";



import PopupMessage from "../components/Popupcheck";
import SearchBar from "../components/Searchbar"; 
import Filterbutton from "../components/Filterbutton";
import AjouterButton from "../components/Ajouterbutton";
import Buttonrec from "../components/buttonrectangle";


import ChoiceContainer from "../components/choiceContainer"; 
import WriteContainer from "../components/writeContainer";   
import Headerbar from "../components/Arrowleftt";  
import PicField from "../components/picfield.jsx";


const AjoutPage = () => {
  
  const [displayedEquipements, setDisplayedEquipements] = useState([]);
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("access_token");
  const [filter, setFilter] = useState("Tout");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedEquipement, setSelectedEquipement] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [equipements, setEquipements] = useState([]);
  const [selectedManual, setSelectedManual] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [types, setTypes] = useState([]);
const [localisations, setLocalisations] = useState([]);

  const [newEquipement, setNewEquipement] = useState({
    nom: "",
    type: "",
    categorie: "",
    localisation: "",
    codebar: "",
    code: "", // Add this line
    etat: "1",
  });
  
  const [errorMessage, setErrorMessage] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    etats: [],
    localisations: [],
    types: [],
  });
  const navigate = useNavigate();
  // New state for multiple filters
  const [filters, setFilters] = useState({
    categorie: "",
    type: "",
    localisation: "",
    etat: "",
  });

  

  const handleChange = (e) => {
    setNewEquipement({ ...newEquipement, [e.target.name]: e.target.value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    setSelectedManual(file);
  };
  const handleAddEquipement = () => {
    const formData = new FormData();
    formData.append("nom", newEquipement.nom);
 
    formData.append("typee", newEquipement.type);
    formData.append("code", newEquipement.code);
    console.log("code:", newEquipement.codeInventaire);
    formData.append("categorie", newEquipement.categorie);
    formData.append("localisation", newEquipement.localisation);
    formData.append("codebar", newEquipement.codebar);
    formData.append("etat", newEquipement.etat);
    formData.append("codeInventaire", newEquipement.codeInventaire);
  
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
  
    if (selectedManual) {
      formData.append("manuel", selectedManual);
    }
  
    fetch("http://127.0.0.1:8000/api/equipements/equipement/create/", {
      method: "POST",
      body: formData,
      headers: {
        'Authorization': `Token ${token}`,
        // NE PAS mettre 'Content-Type': 'application/json'
        // Le navigateur ajoute automatiquement multipart/form-data avec les bonnes frontières
      },
    })
      .then(async (response) => {
        let data;
        try {
          data = await response.json(); // Essayez d'analyser en JSON
        } catch (error) {
          console.warn("Non-JSON response received:", error);
          data = null;
        }
  
        console.log("Server response:", data);
  
        if (!response.ok) {
          throw new Error(data?.message || "Échec de l'ajout !");
        }
  
        alert("Équipement ajouté !");
        setEquipements([...equipements, data]);
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout:", error);
        alert("Erreur lors de l'ajout !");
      });
  };
  
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/equipements/type/",
      {
      
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }

      })
      .then((res) => res.json())
      .then((data) => {
        const types = data.map((etat) => ({
          value: etat.id,
          label: etat.nom
        }));
        setTypes(types);
        console.log("types:",types);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des états:", error);
      });
  }, []);

  const typeOptions = Object.entries(types).map(([value, label]) => ({
    value,
    label,
  }));



 

useEffect(() => {
  fetch("http://127.0.0.1:8000/api/equipements/categorie/", {
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const categories = data.map((cat) => ({
        value: cat.id,
        label: cat.nom,
      }));
      setCategories(categories);
      console.log("categories:", categories);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des catégories:", error);
    });
}, []);


const categoryOptions = Object.entries(categories).map(([value, label]) => ({
  value,
  label,
}));


useEffect(() => {
  fetch("http://127.0.0.1:8000/api/equipements/localisation/", {
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const localisations = data.map((loc) => ({
        value: loc.id,
        label: loc.nom,
      }));
      setLocalisations(localisations);
      console.log("localisations:", localisations);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des localisations:", error);
    });
}, []);


const localisationOptions = Object.entries(localisations).map(([value, label]) => ({
  value,
  label,
}));


  /*useEffect(() => {
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
  }, []);*/

  

  return (
<div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md overflow-x-hidden">

                    
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
  <Headerbar title=" Ajouter Un Equipement" />
</div>



    
 



        {/* ✅ Form Section */}
        <div className="flex flex-col-reverse sm:flex-row w-full mx-auto px-3.5 mt-12 gap-4">

          {/* Left Column */}
          <div className="w-full sm:w-1/2 px-1">


          <WriteContainer
  name="nom"
  title="Nom"
  value={newEquipement.nom || ""}
  onChange={(val) =>
    setNewEquipement((prev) => ({
      ...prev,
      nom: val,    // Directly updating the field!
    }))
  }
/>

<WriteContainer

    title="code Bar"
    value={newEquipement.codebar}
    onChange={handleChange}
  />
<WriteContainer
  name="code"
  title="Code d'inventaire"
  value={newEquipement.code || ""}
  onChange={(val) =>
    setNewEquipement((prev) => ({
      ...prev,
      code: val, // Directly updating the field
    }))
  }
/>



            

            
          </div>

          {/* Right Column */}
          <div className="flex justify-center items-center w-full sm:w-1/2 py-4">
          <PicField selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
          
          </div>
        </div>


          <div className="flex flex-col sm:flex-row w-full mx-auto px-3.5 mt-2 gap-1">
          <div className="w-full sm:w-1/2 px-1">
          <ChoiceContainer
  title="Catégorie"
  options={categories}
  selectedOption={newEquipement.categorie}
  onSelect={(value) =>
    setNewEquipement({ ...newEquipement, categorie: value }) // careful spelling: 'categorie'
  }
/>


              

              
            </div>
            <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
  <label  className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[0.8125rem] mb-1 ml-0.25rem" >Manual</label>
  <input
    type="file"
    name="manuel"
    accept=".pdf,.doc,.docx"
    onChange={handleFileChange}
   
    className="flex w-full py-3 px-4 border border-white rounded-[0.5rem] text-[#80868B] text-[0.8125rem] font-regular font-poppins justify-between bg-white transition-colors duration-200 focus:outline-0 focus:ring-0"
  />
</div>

          
          </div>
        {/* ✅ Bottom Row */}
        <div className="flex flex-col sm:flex-row w-full mx-auto px-3.5 mt-2">
          <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
          <ChoiceContainer
  title="Localisation"
  options={localisations}
  selectedOption={newEquipement.localisation}
  onSelect={(value) => {
    const selected = localisations.find((loc) => loc.id === value);
    setNewEquipement({
      ...newEquipement,
      localisation: value,
      localisation_nom: selected?.nom || "",
    });
  }}
/>

          </div>
          <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
          <ChoiceContainer
  title="Type"
  options={types}
  selectedOption={newEquipement.type}
  onSelect={(value) =>
    setNewEquipement({ ...newEquipement, type: value })
  }
/>
            </div>
        </div>

        {/* ✅ Error Message */}
       
       

        <div className="flex justify-center mt-4">
  <Buttonrec text="Enregistrer" onClick={handleAddEquipement}   className="w-full sm:w-auto px-4"/>
</div>
 {/* Affichage du message d'erreur */}
 {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

{/* Flèche de retour */}

            {isPopupVisible && (
  <PopupMessage
    title="L'équipement a été ajouté avec succès !"
    onClose={() => setIsPopupVisible(false)}
  />
)}

      </div>
    </div>
  );
};

export default AjoutPage;

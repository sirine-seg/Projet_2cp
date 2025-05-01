import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import logo from "../assets/logo.png";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate} from "react-router-dom";
import PicView from "@/components/viewPic";
import PicField from "../components/picfield";
import ImportManual from "../components/importManual"
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
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("access_token");
  const [types, setTypes] = useState([]);
  const [localisations, setLocalisations] = useState([]);
  

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


  useEffect(() => {
    const fetchEquipementData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/equipements/equipement/${id}/`);
        const data = await response.json();
        if (response.ok) {
          setEquipement({
            nom: data.nom,
            code: data.code,
            categorie: data.categorie,
            type: data.typee,
            localisation: data.localisation,
            manuel: data.manuel, 
            image:data.image,
          });
        } else {
          setErrorMessage("Erreur lors de la récupération des données.");
        }
      } catch (error) {
        setErrorMessage("Erreur réseau. Vérifiez votre connexion.");
      }
    };
    fetchEquipementData();
  }, [id]);
  


  const { state } = useLocation();
  
  const navigate = useNavigate();

  const [equipement, setEquipement] = useState(state?.equipement || {
    nom: "",
    type: "",
    categorie: "",
    localisation: "",
    codebar: "",
    code:""
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
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
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
    formData.append("code", equipement.code);
    if (equipement.image && equipement.image instanceof File) {
      formData.append("image", equipement.image);
    }
  
    if (equipement.manuel instanceof File) {
      formData.append("manuel", equipement.manuel);
    } 
  
    fetch(`http://127.0.0.1:8000/api/equipements/equipement/${id}/update/`, {
      method: "PATCH",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          // Server returned an error, let's read it as text
        
          return response.text().then(text => {
            throw new Error(`Server Error: ${response.status} - ${text}`);
          });
        }
        return response.json(); // only try to parse JSON if OK
      })
      .then(() => {
     
        setIsPopupVisible(true); 
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour :", error);
        alert("Échec de la mise à jour !");
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
    label={`Catégorie: ${filters.categorie}`}
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
      
          <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col  bg-[#F4F4F4] -mt-12">
                    <div className="w-full ">
  <Headerbar title="Modifier Un Equipement" />
</div>

      
      <div className="flex flex-col-reverse sm:flex-row px-3.5 mt-12 gap-4">
  {/* Left Column */}
  <div className="flex flex-col w-full sm:w-1/2 pr-0 sm:pr-2">
    <div className="my-2">
    <WriteContainer
  title="Nom"
  value={equipement.nom || ""}
  onChange={(val) => setEquipement(prev => ({ ...prev, nom: String(val) }))}
  //                force val to be string 👆
/>

    </div>

    <div className="my-2">
     
      <WriteContainer
  title="Code Bar"
  value={equipement.codebar}

  onChange={(val) =>setEquipement({ ...equipement, codebar: val })}
/>
    </div>

    <div className="my-2">
     
     <WriteContainer
 title="Code Inventaire"
 value={equipement.code|| ""}

 onChange={(val) => setEquipement(prev => ({ ...prev, code: String(val) }))}
/>
   </div>
  </div>

  {/* Right Column */}
  <div className="flex justify-center items-center w-full sm:w-1/2 py-4">
   <PicView equipement={equipement} />
  

</div>


</div>

<div className="flex flex-col sm:flex-row w-full mx-auto px-3.5 mt-2">
  <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
  <ChoiceContainer
      title="Catégorie"
      options={categories}
      selectedOption={
        categories.find((cat) => cat.value === equipement.categorie)?.label || ""
      }
      onSelect={(value) =>
        setEquipement({ ...equipement, categorie: value })
      }
    />
  </div>
  <div className="w-full sm:w-1/2 pl-0 sm:pl-2">
<ChoiceContainer
  title="Type"
  options={types}
  selectedOption={
    types.find((t) => t.value === equipement.type)?.label || ""
  }
  onSelect={(value) => setEquipement({ ...equipement, type: value })}
/>





  </div>



</div>

{/* Bottom Row */}
<div className="flex flex-col sm:flex-row w-full mx-auto px-3.5 mt-2">


  <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
  <label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[0.8125rem] mb-1 ml-0.25rem">Manuel</label>
  
 

  {/* File upload input */}

    <ImportManual  onChange={handleFileChange}/>

   {/* Show previous file if exists */}
   {equipement.manuel&& typeof equipement.manuel === "string" && (
    <p className="text-gray-700 mb-2">
      Fichier actuel :{" "}
      <a
        href={equipement.manuel} // If it's a URL
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        Voir le manuel
      </a>
    </p>
  )}

</div>
  <div className="w-full sm:w-1/2 pl-0 sm:pl-2">

<ChoiceContainer
  title="Localisation"
  options={localisations}
  selectedOption={
    localisations.find((loc) => loc.value === equipement.localisation)?.label || ""
  }
  
  onSelect={(value) =>
    setEquipement({ ...equipement, localisation: value })
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
    title="Équipement mis à jour avec succès !"
    onClose={() => setIsPopupVisible(false)}
  />
)}
      
      
          
            </div>
          </div>
    );
};

export default EditPage;

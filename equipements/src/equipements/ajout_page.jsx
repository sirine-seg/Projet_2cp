import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import logo from "../assets/logo.png";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate} from "react-router-dom";

const AjoutPage = () => {
  const [displayedEquipements, setDisplayedEquipements] = useState([]);
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
  const [newEquipement, setNewEquipement] = useState({
    nom: "",
    type: "",
    categorie: "",
    localisation: "",
    codebar: "",
    etat:"1",
    
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

  const categories = ["ELEC",
"MECA",
"MED", 
"LABO",
"INDUS" , 
"SECUR" , 
"COMM",
"OUTILS" , 
"AUTRE"];
const types  = ["ORDI_PORT" , "ORDI_BUR" , "IMPRIMANTE" , "SERVEUR" , "SWITCH" , "ROUTEUR" , "ONDULEUR"]
const localisations = ['A1' , 'AP1'  , 'MC2']


  const handleChange = (e) => {
    setNewEquipement({ ...newEquipement, [e.target.name]: e.target.value });
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

  
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    setSelectedManual(file);
  };

  const handleAddEquipement = () => {
    const formData = new FormData();
    formData.append("nom", newEquipement.nom);
    formData.append("type", newEquipement.type);
    formData.append("categorie", newEquipement.categorie);
    formData.append("localisation", newEquipement.localisation);
    formData.append("codebar", newEquipement.codebar);
    formData.append("etat", newEquipement.etat);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    if (selectedManual) {
      formData.append("manuel", selectedManual);
    }

    // Get the access token from localStorage
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      alert("Vous devez être connecté!");
      navigate('/login');
      return;
    }


    console.log("Token:", token);
  console.log("Token length:", token?.length);
  console.log("Token valid format:", token?.split('.').length === 3);
  
  // Debug: Log FormData contents
  console.log("FormData entries:");
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
  }


    fetch("http://127.0.0.1:8000/equipements/create/", {
        method: "POST",
        headers: {
            // Add Authorization header with JWT token
            'Authorization': `Bearer ${token}` ,  
            // Note: Don't add Content-Type for FormData - browser handles this
            'Accept': 'application/json'
        },
        body: formData,
    })
    .then(async (response) => {
        // Rest of your code remains the same
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
        setEquipements([...equipements, data]);
    })
    .catch((error) => {
        console.error("Erreur lors de l'ajout:", error);
        alert("Erreur lors de l'ajout !");
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
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md">
      {/* ✅ Logo */}
      <img
        src={logo}
        alt="Logo"
        className="absolute top-4 left-4 w-12 sm:w-16 md:w-20 lg:w-24 h-auto"
      />

      {/* ✅ Header */}
      <div className="w-full bg-[#20599E] text-white py-20 sm:py-24 text-center">
        <h1 className="text-4xl font-bold text-[#F4F4F5] mb-10">Equipements</h1>
      </div>

      <div className="w-full max-w-7xl bg-[#F4F4F5] min-h-screen rounded-t-[80px] px-6 py-8 shadow-md flex flex-col">
        {/* ✅ Search Bar */}
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

        {/* ✅ Filter Dropdowns */}
        <div className="flex flex-row items-center justify-center gap-2  max-w-xl w-full px-4 py-2 transform origin-left scale-90 sm:scale-100 mx-auto sm:max-w-xl ">
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
            onChange={(e) =>
              setFilters({ ...filters, type: e.target.value })
            }
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
            onChange={(e) => setFilters({ ...filters, etat: e.target.value })}
          />
        </div>

        

        <div className="flex flex-row items-center justify-between mt-8 sm:mt-8 px-4">
  {/* Back Button */}
  <div className="flex items-center">
    <ArrowLeft 
      className="w-8 h-8 text-dark cursor-pointer sm:w-6 sm:h-6" 
      onClick={() => navigate(-1)} 
    />
  </div>

  {/* Title - Centers on small screens */}
  <div className="text-neutral-800 text-4xl font-semibold font-['Poppins'] mx-auto text-center sm:text-2xl md:text-3xl">
   Ajouter Un Equipement
  </div>
</div>
    
 



        {/* ✅ Form Section */}
        <div className="flex flex-row  w-full mx-auto px-3.5 mt-12  gap-4">
          {/* Left Column */}
          <div className="flex flex-col w-full sm:w-1/2 pr-0 sm:pr-2">
            <div className="my-2">
              <label className="block text-black font-bold">Nom</label>
              <input
                type="text"
                name="nom"
                value={newEquipement.nom}
                onChange={handleChange}
                className="w-full my-2 px-4 py-3 border rounded-md bg-white text-black"
              />
            </div>

            <div className="my-2">
  <label className="block text-black font-bold">Type</label>
  <select
    name="type"
    value={newEquipement.type}
    onChange={handleChange}
    className="w-full my-2 px-4 py-3 border rounded-md bg-white text-black"
  >
    <option value="">__</option>
    {types.map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>
</div>

            
          </div>

          {/* Right Column */}
          <div className="flex justify-center items-center w-full sm:w-1/2 py-4">
          <label
              htmlFor="imageUpload"
              className="w-48 h-48 bg-gray-300 flex items-center justify-center rounded border cursor-pointer"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <p className="text-gray-700">Image</p>
              )}
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
             
              className="hidden"
            />
          
          </div>
        </div>


          <div className="flex flex-col sm:flex-row w-full mx-auto px-3.5 mt-2">
          <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
              <label className="block text-black font-bold">Catégorie</label>
              <select
                name="categorie"
                value={newEquipement.category}
                onChange={handleChange}
                className="w-full my-2 px-4 py-3 border rounded-md bg-white text-black"
              >
                <option value="">__</option>
                {categories.map((categorie) => (
                  <option key={categorie} value={categorie}>
                    {categorie}
                  </option>
                ))}
              </select>

              
            </div>
            <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
  <label className="block text-black font-bold">Manual</label>
  <input
    type="file"
    name="manuel"
    accept=".pdf,.doc,.docx"
    onChange={handleFileChange}
   
    className="w-full my-2 py-3 px-4 border rounded-md bg-white text-black"
  />
</div>

          
          </div>
        {/* ✅ Bottom Row */}
        <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
  <label className="block text-black font-bold">Localisation</label>
  <select
    name="localisation"
    value={newEquipement.localisation}
    onChange={handleChange}
    className="w-full my-2 py-3 px-4 border rounded-md bg-white text-black"
  >
    <option value="">__</option>
    {localisations.map((localisation) => (
      <option key={localisation} value={localisation}>
        {localisation}
      </option>
    ))}
  </select>
</div>

        {/* ✅ Error Message */}
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {/* ✅ Submit Button */}
        <div className="flex justify-center items-center mt-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddEquipement}
            className="px-4 bg-[#20599E] text-white py-2 rounded-md font-bold transition duration-200"
          >
            Ajouter
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AjoutPage;

import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import logo from "./assets/logo.png";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";

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
  const [newEquipement, setNewEquipement] = useState({
    nom: "__",
    type: "__",
    categorie: "__",
    localisation: "",
    codebar: "__"
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    etats: [],
    localisations: [],
    types: []
  });

  // New state for multiple filters
  const [filters, setFilters] = useState({
    categorie: "",
    type: "",
    localisation: "",
    etat: ""
  });

  const categories = ["Ordinateur", "Imprimante", "Projecteur"];

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

  const handleAddEquipement = () => {
    // Here you can handle form submission or any logic you want
    console.log("New equipment data:", newEquipement);
    console.log("Selected image file:", selectedImage);
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

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md">
      {/* ✅ Logo */}
      <img src={logo} alt="Logo" className="absolute top-4 left-4 w-12 sm:w-16 md:w-20 lg:w-24 h-auto" />

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
            onChange={(e) =>
              setFilters({ ...filters, etat: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AjoutPage;

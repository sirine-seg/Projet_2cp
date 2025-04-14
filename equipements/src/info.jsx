import { useParams, useLocation, useNavigate } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import logo from "./assets/logo.png";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const Info = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

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
        const response = await fetch(`http://127.0.0.1:8000/equipements/${id}/`);
        if (!response.ok) throw new Error("Équipement introuvable !");
        const data = await response.json();
        setEquipement(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipement();
  }, [id]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/filters/");
        const data = await response.json();
        setFilterOptions(data);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilters();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

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
        <h1 className="text-4xl font-bold text-[#F4F4F5] mb-10">Équipements</h1>
      </div>

      <div className="w-full max-w-7xl bg-[#F4F4F5] min-h-screen rounded-t-[80px] px-6 py-8 shadow-md flex flex-col">
        {/* ✅ Search Bar */}
        <div className="relative w-full max-w-md my-3 -mt-35 mx-auto">
          <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#20599E]" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full text-black px-4 py-2 pl-10 rounded-full border border-[#20599E] bg-[#F4F4F5] shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ✅ Filter Dropdowns */}
        <div className="flex flex-row items-center justify-center gap-2 max-w-xl w-full px-4 py-2 transform origin-left scale-90 sm:scale-100 mx-auto sm:max-w-xl">
          {Object.keys(filters).map((key) => (
            <select
              key={key}
              className="w-auto sm:w-1/4 px-4 py-2 rounded-md border border-gray-300 bg-[#F4F4F5] text-xs sm:text-sm"
              value={filters[key]}
              onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
            >
              <option value="">{key.charAt(0).toUpperCase() + key.slice(1)}</option>
              {filterOptions[key]?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ))}
        </div>

        {/* ✅ Back Button & Title */}
        <div className="flex flex-row items-center justify-between mt-8 sm:mt-8 px-4">
          <ArrowLeft
            className="w-8 h-8 text-dark cursor-pointer sm:w-6 sm:h-6"
            onClick={() => navigate(-1)}
          />
          <div className="text-neutral-800 text-4xl font-semibold font-['Poppins'] mx-auto text-center sm:text-2xl md:text-3xl">
          {equipement.nom} #{equipement.id_equipement}
          </div>
        </div>

        {/* ✅ Equipment Details */}
        <div>
          <h1 className="flex flex-row  judtify between text-lg font-semibold mt-6 ">Détails de l'équipement</h1>
          <div className=" ">
          <p><strong>Nom :</strong> {equipement.nom}</p>
          <p><strong>Type :</strong> {equipement.type_}</p>
          <p><strong>Catégorie :</strong> {equipement.category}</p>
          </div>
          <div className=" ">
          <p><strong>Localisation :</strong> {equipement.localisation}</p>
          <p><strong>Code-barres :</strong> {equipement.codebar}</p>
          <p><strong>Etat :</strong> {equipement.etat}</p>
          </div>
          {equipement.manual && (
            <p>
              <strong>Manuel :</strong> <a href={equipement.manual} target="_blank" rel="noopener noreferrer">Voir le manuel</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Info;

import { useState, useEffect } from "react";
import { FaUser, FaCube } from "react-icons/fa";
import { MdEmail, MdCalendarToday } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs"
import { MdSearch } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import logo from '../assets/logo.png';
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { MdPerson, MdBuild } from "react-icons/md";
import { FaTools } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { Pen } from 'lucide-react';



const Userspageee= () => {
    const [interventions, setInterventions] = useState([]);  // Stocke toutes les interventions
    const [displayedInterventions, setDisplayedInterventions] = useState([]); // Stocke les interventions affichées
    const [filter, setFilter] = useState("Tout");
  
    const [visibleCount, setVisibleCount] = useState(9);// Nombre d'utilisateurs affichés
    const [selectedUser, setSelectedUser] = useState(null);// Utilisateur sélectionné pour modification
    const [showEditPopup, setShowEditPopup] = useState(false); // Affichage du pop-up
    const [menuOpen, setMenuOpen] = useState(null);   
    const [searchTerm, setSearchTerm] = useState("");
    const [popupOpen, setPopupOpen] = useState(false);
    const navigate = useNavigate();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isDisponibleActive, setIsDisponibleActive] = useState(false);
    const [selectedInterventionid, setSelectedInterventionid] = useState(null);

   
    const [selectedStatus, setSelectedStatus] = useState("En attente");

    const handleChange = (event) => {
    setSelectedStatus(event.target.value);
};

const { id } = useParams(); // Récupère l'ID depuis l'URL
const [intervention, setIntervention] = useState(null);
// Appel des hooks TOUJOURS EN HAUT
useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  
  // L'autre useEffect aussi
  useEffect(() => {
    const fetchIntervention = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/intervention/intervention/${id}/`);
        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();
        setIntervention(data);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };
  
    fetchIntervention();
  }, [id]);
  
        
    
       
   
    
    
     
    
      
        
    
  const urgenceColors = {
    "tres urgent": "bg-[#F09C0A] ",
    "urgence moyenne": "bg-[#20599E] ",
    "Urgence critique": "bg-[#FF4423] ",
    "Faible Urgence ": "bg-[#49A146] ",

};

const statusColors = {
    "Affecte": "bg-[#F09C0A] ",
    "En cours ": "bg-[#20599E] ",
    "En attente": "bg-[#FF4423] ",
    "Terminee": "bg-[#49A146] ",

};



      
            return (
                <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md">
                    {/* Logo en haut à gauche */}
 <img 
        src={logo} 
        alt="Logo"
        className="absolute top-6 left-6 w-32 h-auto"
    />


    
<div className="absolute top-6 right-16 flex items-center space-x-3">
        <MdAccountCircle className="text-white w-10 h-10" />
        <span className="text-white text-lg font-semibold">User Name</span>
    </div>

       
                    {/* En-tête */}
                    <div className="w-full bg-[#20599E] text-white py-16 text-center">
                        <h1 className="text-4xl font-bold text-dark mb-20">Intervention</h1>
                    </div>
                <div className="w-full max-w-7xl bg-[#F4F4F4] min-h-screen rounded-t-[80px] px-6 py-8 shadow-md flex flex-col">
            
                    {/* Barre de recherche */}
                

         <div className="relative w-full max-w-md my-8 -mt-40 mx-auto">
            <div className="relative">
                <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <input
                    type="text"
                    placeholder="Rechercher"
                    className="w-full text-balck  px-4 py-2 pl-10 rounded-full border border-gray-300 bg-[#F4F4F4] shadow-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
                
        <div className="flex justify-center space-x-6 my-4">
    {["Tout", "Curative", "Préventive"].map((category) => (
        <button
            key={category}
            className={`text-lg font-semibold pb-1 transition duration-300 ${
                filter === category ? "text-white underline" : "text-white"
            }`}
            onClick={() => setFilter(category)}
        >
            {category}
        </button>
    ))}
</div>
<div className="w-full max-w-4xl flex items-center mb-4">
                <ArrowLeft 
                    className="w-8 ml-2 mt-2 h-8 text-dark cursor-pointer" 
                    onClick={() => navigate(-1)} 
                />
            </div>
<div className="p-20">
  {intervention && (
    <>
    <h1 className="text-6xl font-bold text-black mt-[-80px] mb-10 text-center">
  Intervention #{intervention.id}
</h1>

      {/* Première ligne : Equipement + Urgence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-black font-medium">Équipement</label>
          <div className="flex items-center bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
          <FaCube className="text-gray-700 w-5 h-5 mr-2" />
            <span>{intervention.nom_equipement}</span>
          </div>
        </div>

        <div>
          <label className="text-black font-medium">Urgence</label>
          <input
            type="text"
            value={intervention.urgence_label || "---"}
            disabled
            className="w-full bg-white p-3 rounded-lg border border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {/* Deuxième ligne : Technicien(s) + Statut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-black font-medium">Technicien(s)</label>
          <div className="flex items-center bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
            <MdPerson className="text-primary text-2xl mr-3" />
            <div>
              <p className="text-black font-medium">{intervention.nom_technicien}</p>
              {/* <p className="text-sm text-gray-500">{intervention.poste}</p> */}
            </div>
          </div>
        </div>

        <div>
          <label className="text-black font-medium">Statut</label>
          <input
            type="text"
            value={intervention.statut_label || "---"}
            disabled
            className="w-full bg-white p-3 rounded-lg border border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {/* Troisième ligne : Date Début + Date Fin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">


      <div>
          <label className="text-black font-medium">Déclarée par</label>
          <div className="flex items-center bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
            <MdPerson className="text-[#20599E] text-2xl mr-3" />
            <div>
              <p className="font-medium text-black">{intervention.nom_declarant}</p>
              <p className="text-sm text-gray-900">{intervention.email_declarant}</p>
            </div>
          </div>
        </div>



        <div>
  <label className="text-black font-medium">Date début</label>
  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
    <input
      type="date"
      value={intervention.date_debut ? intervention.date_debut.slice(0, 10) : ""}
      disabled
      className="bg-white text-black outline-none w-full"
    />
  
  </div>
</div>


     
      
      </div>

      {/* Quatrième ligne : Déclarée par + Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
       

      <div>
          <label className="text-black font-medium">Admin</label>
          <div className="flex items-center bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
            <MdPerson className="text-[#20599E] text-2xl mr-3" />
            <div>
              <p className="font-medium text-black">{intervention.admin.first_name}</p>
              <p className="text-sm text-gray-900">{intervention.email_admin}</p>
           
            </div>
           
          </div>
        </div>



        <div>
  <label className="text-black font-medium">Date fin</label>
  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
    <input
      type="date"
      value={intervention.date_fin ? intervention.date_fin.slice(0, 10) : ""}
      disabled
      className="bg-white text-black outline-none w-full"
    />
   
  </div>
</div>

      
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div></div>
      {/* Description */}
      <div className="mb-6">
        <label className="text-black font-medium">Description</label>
        <textarea
          value={intervention.description}
          disabled
          className="w-full bg-white p-3 rounded-lg border border-gray-300 shadow-sm"
          rows={4}
        />
      </div>
      </div>

      {/* Plus d'infos : Actions & Pièces */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-black mb-4">Plus d'Infos :</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-black font-medium">Actions Effectuées</label>
            <input
              type="text"
              value={intervention.notes || "---"}
              disabled
              className="w-full bg-white p-3 rounded-lg border border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="text-black font-medium">Pièces remplacées</label>
            <input
              type="text"
              value={intervention.pieces || "---"}
              disabled
              className="w-full bg-white p-3 rounded-lg border border-gray-300 shadow-sm"
            />
          </div>
        </div>
      </div>
    </>
  )}
</div>
  
       
                 </div>
                </div>
            );
        };
        
        export default Userspageee;
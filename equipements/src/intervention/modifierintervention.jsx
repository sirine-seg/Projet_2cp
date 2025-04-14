import { useState, useEffect } from "react";
import { FaUser, FaCube } from "react-icons/fa";

import { MdSearch } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import logo from '../assets/logo.png';
import { Pen } from 'lucide-react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { MdPerson, MdBuild } from "react-icons/md";
import { FaTools } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";



const Userspageee= () => {
    const [interventions, setInterventions] = useState([]);  // Stocke toutes les interventions
    const [displayedInterventions, setDisplayedInterventions] = useState([]); // Stocke les interventions affichées
    const [filter, setFilter] = useState("Tout");
    const [users, setUsers] = useState([]);  // Stocke tous les utilisateurs
    const [displayedUsers, setDisplayedUsers] = useState([]); // Stocke les utilisateurs affichés
    const [visibleCount, setVisibleCount] = useState(9);// Nombre d'utilisateurs affichés
   
    const [menuOpen, setMenuOpen] = useState(null);   
    const [searchTerm, setSearchTerm] = useState("");
  
    const navigate = useNavigate();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isDisponibleActive, setIsDisponibleActive] = useState(false);
    const [selectedInterventionid, setSelectedInterventionid] = useState(null);
    const [selectedStatutName, setSelectedStatutName] = useState("");
    const [statusList, setStatusList] = useState([]);
   
    const [selectedStatutId, setSelectedStatutId] = useState("");

     // États de sélection
     const [selectedUrgence, setSelectedUrgence] = useState("");
     const [selectedDate, setSelectedDate] = useState("");
     const [assignedTechniciens, setAssignedTechniciens] = useState([]);
    
     const [showPopup, setShowPopup] = useState(false);

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
  
    
  

  useEffect(() => {
  const fetchStatusList = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/intervention/status/'); // Make sure the URL matches your backend
      if (!response.ok) throw new Error("Failed to fetch statuses");
      const data = await response.json();
      setStatusList(data);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  fetchStatusList();
}, []);

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await fetch(" http://127.0.0.1:8000/users/");
            if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs");

            const data = await response.json();
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
setIsPopupVisible(false); // Fermer le popup après l'ajout
};
       
   
const removeTechnicien = (indexToRemove) => {
    setAssignedTechniciens((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
    );
};

    
const urgenceOptions = [
  { value: 0, label: 'Urgence vitale' },
  { value: 1, label: 'Urgence élevée' },
  { value: 2, label: 'Urgence modérée' },
  { value: 3, label: 'Faible urgence' },
];

const statutOptions = [
  { id: 1, label: "En attente" },
  { id: 2, label: "En cours" },
  { id: 3, label: "Terminé" },
  { id: 4, label: "Affecté" }
];


useEffect(() => {
  if (selectedInterventionid && selectedStatutName) {
    setInterventions((prev) =>
      prev.map((intervention) =>
        intervention.id === selectedInterventionid
          ? { ...intervention, statut_label: selectedStatutName }
          : intervention
      )
    );
  }
}, [selectedStatutName]);

    


        const handleUpdate = async () => {
          try {
            const payload = {
              urgence: selectedUrgence,
              technicien: assignedTechniciens.length > 0 ? assignedTechniciens[0].id : null,
              statut: selectedStatus,
              date_fin: selectedDate, 
            };
        
            const response = await fetch(`http://127.0.0.1:8000/intervention/update/${id}/`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });
            
        
            if (!response.ok) throw new Error("Erreur lors de la mise à jour");
        
            const updatedData = await response.json();
            setIntervention(updatedData); // Mets à jour l’état avec les nouvelles données
            alert("Intervention mise à jour avec succès !");
          } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            alert("Échec de la mise à jour !");
          }
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
                        <h1 className="text-4xl font-bold text-[#F4F4F4] mb-20">Intervention</h1>
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
  Modifier Intervention #{intervention.id}
</h1>

      {/* Première ligne : Equipement + Urgence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-black font-medium">Équipement</label>
          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
  <div className="flex items-center">
    <FaCube className="text-gray-700 w-5 h-5 mr-2" />
    <span>{intervention.nom_equipement} #{intervention.equipement}</span>
  </div>
  <Pen className="text-gray-600 w-4 h-4 cursor-pointer" />
</div>

        </div>

        <div>
        <label className="text-black block mb-1">Urgence</label>
        <select 
  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-300"
  value={selectedUrgence}
  onChange={(e) => setSelectedUrgence(Number(e.target.value))}
>
  <option value="">__</option>
  {urgenceOptions.map((option, index) => (
    <option key={index} value={option.value}>{option.label}</option>
  ))}
</select>

    </div>



      </div>

      {/* Deuxième ligne : Technicien(s) + Statut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
   
  <div>
    <label className="text-black font-medium mb-2 block">Technicien(s)</label>

    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-4">
      {assignedTechniciens.length === 0 ? (
        // Affichage par défaut avec intervention.nom_technicien si aucun technicien encore ajouté
        <div className="bg-white rounded-md shadow-sm border p-4">
          <MdAccountCircle className="text-[#20599E] text-4xl mr-3" />
          <div >
        
          <p className="font-bold text-black">{intervention.nom_technicien}</p>
          </div>
        </div>
      ) : (
        assignedTechniciens.map((tech, index) => (
          <div key={index} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center space-x-4">
              <MdAccountCircle className="text-[#20599E] w-10 h-10" />
              <div>
                <p className="font-bold text-black">{tech.name}</p>
                <p className="text-sm text-black">{tech.email}</p>
                <p className="text-sm text-black">{tech.poste}</p>
              </div>
            </div>
            <button
              className="px-3 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              onClick={() => removeTechnicien(index)}
            >
              Retirer
            </button>
          </div>
        ))
      )}

      {/* Bouton Ajouter */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="mt-2 block mx-auto px-4 py-2 bg-[#F09C0A] text-white rounded-md"
        onClick={() => setShowPopup(true)}
      >
        Ajouter
      </motion.button>
    </div>
  </div>

  {/* Popup des techniciens disponibles */}
  {showPopup && (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
        {/* Bouton X */}
        <button
          className="absolute top-2 right-2 text-gray-700 text-xl"
          onClick={() => setShowPopup(false)}
        >
          ✕
        </button>

        <h2 className="text-black font-bold text-lg mb-2">Techniciens</h2>
        <p className="text-black mb-4">Les techniciens disponibles en ce moment.</p>

        <div className="max-h-60 overflow-y-auto space-y-3">
          {techniciensDispo.map((tech) => (
            <div
              key={tech.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div className="flex items-center space-x-3">
                <MdAccountCircle className="text-[#20599E] w-10 h-10" />
                <div>
                  <p className="font-bold text-black">{tech.first_name} {tech.last_name}</p>
                  <p className="text-sm text-black">{tech.email}</p>
                  <p className="text-sm text-black">{tech.technicien?.poste || "Aucun poste spécifié"}</p>
                </div>
              </div>
              <button
                className="px-3 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400"
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
     <div>
     <label className="text-black block mb-1">Status</label>
      <select
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md"
        value={selectedStatus}
        onChange={handleChange}
      >
        <option value="">___</option>
        {statusList.map(status => (
          <option key={status.id} value={status.id}>{status.name}</option>
        ))}
      </select>
      {/* Add other form fields for urgence, techniciens, etc. */}
     
    </div>
</div>


      
      
      {/* Troisième ligne : Date Début + Date Fin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">


      <div>
  <label className="text-black font-medium">Déclarée par</label>
  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
    <div className="flex items-center">
      <MdAccountCircle className="text-[#20599E] text-4xl mr-3" />
      <div>
        <p className="font-medium text-black">{intervention.nom_declarant}</p>
        <p className="text-sm text-gray-900">{intervention.email_declarant}</p>
      </div>
    </div>
    <Pen className="text-gray-600 w-4 h-4 ml-3 cursor-pointer" />
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
    <Pen className="text-gray-600 w-4 h-4 ml-3 cursor-pointer" />
  </div>
</div>

 


     
      
      </div>

      {/* Quatrième ligne : Déclarée par + Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
       

      <div>
  <label className="text-black font-medium">Admin</label>
  <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
    <div className="flex items-center">
      <MdAccountCircle className="text-[#20599E] text-4xl mr-3" />
      <div>
        <p className="font-medium text-black">{intervention.admin.first_name}</p>
        <p className="text-sm text-gray-900">{intervention.email_admin}</p>
      </div>
    </div>
    <Pen className="text-gray-600 w-4 h-4 cursor-pointer" />
  </div>
</div>


<div className="w-1/3">
  <label className="text-black block mb-1">Date fin</label>
  <div className="flex items-center bg-white px-4 py-2 rounded-md border border-gray-300">
    <input 
      type="date" 
      className="flex-1 bg-transparent text-black focus:outline-none"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
    />
    <Pen className="text-gray-600 w-4 h-4 ml-3 cursor-pointer" />
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








<div className="mt-10 flex justify-center">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-[#20599E] text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition"
    onClick={() => {
      handleUpdate();

    }}
  >
    Modifier
  </motion.button>
</div>

  
       
                 </div>
                </div>
            );
        };
        
        export default Userspageee;
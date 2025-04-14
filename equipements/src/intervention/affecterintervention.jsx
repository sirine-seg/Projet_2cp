import { useState, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import logo from '../assets/logo.png';
import { FaChevronDown } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useParams } from "react-router-dom";




const Userspageee= () => {
    const [users, setUsers] = useState([]);  // Stocke tous les utilisateurs
    const [displayedUsers, setDisplayedUsers] = useState([]); // Stocke les utilisateurs affichés
    const [filter, setFilter] = useState("Tout");
    const [visibleCount, setVisibleCount] = useState(9);// Nombre d'utilisateurs affichés
    const [selectedUser, setSelectedUser] = useState(null);// Utilisateur sélectionné pour modification
    const [showEditPopup, setShowEditPopup] = useState(false); // Affichage du pop-up
    const [menuOpen, setMenuOpen] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [popupOpen, setPopupOpen] = useState(false);
    const navigate = useNavigate();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isDisponibleActive, setIsDisponibleActive] = useState(false);
    const [interventions, setInterventions] = useState([]);
    const [displayedInterventions, setDisplayedInterventions] = useState([]);
    const [intervention, setIntervention] = useState(null);
    const { id } = useParams(); // récupère l'ID de l'URL
     // États pour les données simulées
     const urgenceOptions = [
        { value: 0, label: 'Urgence vitale' },
        { value: 1, label: 'Urgence élevée' },
        { value: 2, label: 'Urgence modérée' },
        { value: 3, label: 'Faible urgence' },
      ];
      
     
     // États de sélection
     const [selectedUrgence, setSelectedUrgence] = useState("");
     const [selectedDate, setSelectedDate] = useState("");
     const [assignedTechniciens, setAssignedTechniciens] = useState([]);
   

        

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
       
    //quand je tape sur l'ecran le pop up disparaitre 
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (menuOpen && !event.target.closest(".popup-menu")) {
                    setMenuOpen(null);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [menuOpen]);
    
    
        const handleUpdate = async () => {
            try {
              const payload = {
                urgence: selectedUrgence,
                technicien: assignedTechniciens.length > 0 ? assignedTechniciens[0].id : null,
              
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
          
    
 
        const removeTechnicien = (indexToRemove) => {
            setAssignedTechniciens((prev) =>
                prev.filter((_, index) => index !== indexToRemove)
            );
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

           {/* Titre */}
           <div className="w-full text-black py-16 text-center">
                <h1 className="text-4xl font-bold text-dark mb-20">Affecter l’intervention</h1>
            </div>
            <div className="flex flex-col items-end mt-[-120px] mr-20">
    {/* Champ Urgence */}
    <div className="w-1/3 mb-2">
        <label className="text-black block mb-1">Urgence</label>
        <select 
            className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-300"
            value={selectedUrgence}
            onChange={(e) => setSelectedUrgence(e.target.value)}
        >
            <option value="">__</option>
           {urgenceOptions.map((option, index) => (
    <option key={index} value={option.value}>{option.label}</option>
))}


        </select>
    </div>

    {/* Champ Date Fin */}
    <div className="w-1/3">
        <label className="text-black block mb-1">Date fin</label>
        <input 
            type="date" 
            className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-300"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
        />
    </div>
</div>

<div className="w-1/3 p-4 bg-white rounded-md relative top-[-120px] shadow-xl ml-40">
    <label className="text-black block mb-1">Technicien(s)</label>
    
    {assignedTechniciens.length === 0 ? (
        <p className="text-black">Aucun technicien affecté pour l’instant</p>
    ) : (
        <ul className="text-black">
            {assignedTechniciens.map((tech, index) => (
                <li key={index} className="border-b py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <MdAccountCircle className="text-[#20599E] w-10 h-10" />
                        <div>
                            <p className="font-bold">{tech.name}</p>
                            <p className="text-sm text-black">{tech.email}</p>
                            <p className="text-sm text-black">{tech.poste}</p>
                        </div>
                    </div>
                    <button 
                        className="px-3 py-1 bg-gray-400 text-black rounded-md"
                        onClick={() => removeTechnicien(index)}  
                    >
                        Retirer
                    </button>
                </li>
            ))}
        </ul>
    )}

    {/* Bouton Ajouter */}
    <motion.button
            whileTap={{ scale: 0.9 }} // Effet de clic (réduction de taille)
            whileHover={{ scale: 1.1 }} // Effet de survol (agrandissement)
            transition={{ type: "spring", stiffness: 300 }} // Animation fluide
        className="mt-2 block mx-auto px-4 py-2 bg-[#F09C0A] text-white rounded-md"
        onClick={() => setShowPopup(true)}
    >
        Ajouter
        </motion.button>

    {/* Popup des techniciens disponibles */}
    {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-md w-96 shadow-lg relative">
                {/* Bouton X en haut à droite */}
                <button 
                    className="absolute top-2 right-2 text-gray-700 text-xl"
                    onClick={() => setShowPopup(false)}
                >
                    X
                </button>

                <h2 className="text-black font-bold mb-2">Techniciens</h2>
                <p className="text-black mb-2">Les techniciens disponibles en ce moment.</p>

                {/* Liste des techniciens */}
                <div className="max-h-60 overflow-y-auto">
                    {techniciensDispo.map((tech) => (
                        <div key={tech.id} className="flex justify-between items-center border-b py-2">
                            <div className="flex items-center space-x-3">
                                <MdAccountCircle className="text-gray-600 w-10 h-10" />
                                <div>
                                    <p className="font-bold">{tech.first_name} {tech.last_name}</p>
                                    <p className="text-sm text-black">{tech.email}</p>
                                    <p className="text-sm text-black">{tech.technicien?.poste || "Aucun poste spécifié"}</p>
                                </div>
                            </div>
                            <button 
                                className="px-3 py-1 bg-gray-400 text-black rounded-md"
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
</div>

                 {/* Bouton terminer */}
                 <motion.button
            whileTap={{ scale: 0.9 }} // Effet de clic (réduction de taille)
            whileHover={{ scale: 1.1 }} // Effet de survol (agrandissement)
            transition={{ type: "spring", stiffness: 300 }} // Animation fluide
            className="w-1/6 mt-6 px-4 py-2 bg-[#20599E] text-white rounded-lg mx-auto"
            onClick={() => {
                handleUpdate();
          
              }}
        >
            Terminer
        </motion.button>
        <div className="w-full max-w-4xl flex items-center mb-4 relative top-[-400px] ">
                <ArrowLeft 
                    className="w-8 ml-2 mt-2 h-8 text-dark cursor-pointer" 
                    onClick={() => navigate(-1)} 
                />
            </div>
            
       
                 </div>
                </div>
            );
        };
        
        export default Userspageee;
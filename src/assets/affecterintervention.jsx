import { useState, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";

import { FaChevronDown } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import SearchBar from "../components/Searchbar"; 
import Filterbutton from "../components/Filterbutton"; 
import Header from "../components/Header";
import AjouterButton from "../components/Ajouterbutton";
import Buttonrec from "../components/buttonrectangle";
import Popupdelete from "../components/Popupdelet";
import Options from "../components/options";
import InterventionCard from "../components/InterventionCard"; 
import PopupMessage from "../components/Popupcheck";
import PopupChange from "../components/popchange"; // casse correcte
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import AddMobile  from "../components/addMobile";
import WriteContainer from "../components/writeContainer";   
import Headerbar from "../components/Arrowleftt";
import InfoIntervUser from "../components/infoIntervUserContainer";
import DisModContainer from "../components/disModContainer";
import UserProfilMail from "../components/userProfilMail";
import ChoiceContainer from "../components/choiceContainer"; 
import Button from  "../components/button"; 
import TechnicienAssign from "../components/technicienAssign";
import AssignPopUp from "../components/assignPopUp";
import Profil from "../assets/Profil.svg";

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
    const [previewUrl, setPreviewUrl] = useState(null);
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
     const [selectedDatedebut, setSelectedDatedebut] = useState("");

        

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
                               <Header />
                              
                              
                              
                              
                              
                                                  {/* En-tête */}
                                                  <div className="w-full bg-[#20599E] text-white py-16 text-center">
                                                 
                                                  <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
                                                 Intervention
                                                  </h1>
                                                  {/* bare de recherhce  
                                      <SearchBar
                                          value={searchTerm}
                                          onChange={e => setSearchTerm(e.target.value)}
                                          placeholder="Rechercher..."
                                        />   
                              
                              
                              
                               
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
               
               
               </div>  */} 
               
               </div>  
               
                  <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
                
                  <div className="w-full ">
  <Headerbar title="Affecte une Intervention" />
</div>

<div className="w-full max-w-5xl mx-auto mt-14 p-0 grid grid-cols-1 md:grid-cols-2  gap-x-16 gap-6">
  
  {/* ───────── Colonne de gauche : Technicien(s) ───────── */}
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-4">
    
    {assignedTechniciens.length === 0 ? (
      <div className="flex-1 flex items-center  justify-center">
        <p className="text-[#202124] text-md text-center">
          Aucun technicien affecté pour l’instant
        </p>
      </div>
    ) : (
      assignedTechniciens.map((tech, idx) => (
        <div key={idx} className="flex items-center justify-between">
           <TechnicienAssign
                  nom={tech.name}
                  prenom={tech.prenom}
                  email={tech.email}
                  imageUrl={tech.imageUrl}
                  poste={tech.poste}
                  buttonTitle="Retirer"
                  onAssign={() => removeTechnicien(idx)}
                />
        </div>
      ))
    )}
    <div className="flex justify-center">
      <Button
        text="Ajouter"
        bgColor="#F09C0A"
        textColor="#ffffff"
        onClick={() => setShowPopup(true)}
        className="px-3 py-1 text-sm"
      />
    </div>
  </div>






  <div className="space-y-6">

  <ChoiceContainer
      title="Urgence"
      options={[
        { value: "Urgence vitale",  label: "Urgence vitale"  },
        { value: "Urgence élevée",  label: "Urgence élevée"  },
        { value: "Urgence modérée", label: "Urgence modérée" },
        { value: "Faible urgence",  label: "Faible urgence"  },
      ]}
      selectedOption={selectedUrgence}
      onSelect={setSelectedUrgence}
      className="text-sm py-1 px-2 max-w-xs w-full"
    />



<WriteContainer
      title="Date de début"
      value={selectedDatedebut}
      onChange={(value) => setSelectedDatedebut(value)}
      type="date"
    className="text-sm py-1 px-2  max-w-full md:max-w-[400px]  md:max-w-[480px] "
    />







<WriteContainer
      title="Date de fin"
      value={selectedDate}
      onChange={(value) => setSelectedDate(value)}
      type="date"
      className="py-2 px-3 text-sm"
    />
  </div>

  {/* ───────── Colonne de droite : Urgence + Dates ───────── */}
 
</div>

{/* ───────── Bouton Terminer en dessous ───────── */}
<div className="flex justify-center mt-4">
  <Buttonrec text="Terminer" onClick={handleUpdate} />
</div>

{/* ───────── Popup d’assignation ───────── */}
{showPopup && (
  <AssignPopUp
    titre="Technicien(s) disponibles"
    description="Les techniciens disponibles en ce moment."
    buttonTitle="Ajouter"
    technicians={techniciensDispo.map((t) => ({
      id: t.id,
      nom: t.last_name,
      prenom: t.first_name,
      poste: t.technicien?.poste || "Non spécifié",
      imageUrl: t.technicien?.photo?.startsWith("http")
        ? t.technicien.photo
        : `http://127.0.0.1:8000${t.technicien?.photo}`,
    }))}
    onClose={() => setShowPopup(false)}
    onAssign={(user) =>
      addTechnicien({
        id: user.id,
        name: `${user.prenom} ${user.nom}`,
        email: user.email,
        imageUrl: user.imageUrl,
        poste: user.poste,
      })
    }
  />
)}

       </div>
                </div>
            );
        };
        
        export default Userspageee;
        
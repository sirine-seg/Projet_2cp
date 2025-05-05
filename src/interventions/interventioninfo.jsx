import { useState, useEffect } from "react";
import { FaUser, FaCube } from "react-icons/fa";
import { MdEmail, MdCalendarToday } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs"
import { MdSearch } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";

import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { MdPerson, MdBuild } from "react-icons/md";
import { FaTools } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { Pen } from 'lucide-react';
import SearchBar from "../components/Searchbar"; 
import Filterbutton from "../components/Filterbutton"; 
import Header from "../components/Header";
import AjouterButton from "../components/Ajouterbutton";
import Buttonrec from "../components/buttonrectangle";
import Popupdelete from "../components/Popupdelet";
import Options from "../components/options";
import InterventionCard from "../components/InterventionCard"; 
import PopupMessage from "../components/Popupcheck";
import PopupChange from "../components/PopupChange";
import Headerbar from "../components/Arrowleftt";
import DisplayContainer from "../components/displayContainer";
import InfoIntervUser from "../components/infoIntervUser";
import cube from "../assets/cube.svg"




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
        const response = await fetch(`http://127.0.0.1:8000/api/interventions/interventions/${id}/`);
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
              <Header />


  
       
                    {/* En-tête */}
                  
                                  {/* bare de recherhce  */}    
                      
                                  <div className="w-full bg-[#20599E] text-white py-16 text-center">
                                  <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
                                 Intervention
                                  </h1>
                    {/* Barre de recherche */}
                

                
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

</div>  

  <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
 

  {intervention && (
    <>
    <div className="w-full">
        <Headerbar
          title={`Intervention #${intervention.id}`}
          showPen={false} // If you want to show an edit button
        />
        {/* The rest of your content */}
      </div>

      {/* Première ligne : Equipement + Urgence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-2 mb-2">
      


      <DisplayContainer
  title="Type de l'intervention"
  content={intervention.type_intervention || "---"}
   className=" px-8"
/>




      <DisplayContainer
  title="Équipement"
  content={
    <div className="flex items-center text-black">
      {/* Image du Cube */}
      <img src={cube} alt="Cube" className="w-5 h-5 flex-shrink-0 mr-2" />
      
      {/* Nom de l'équipement */}
      <span className="mr-2">{intervention.equipement_name}</span>
      
      {/* Numéro d'équipement */}
      <span className="font-semibold">{`#${intervention.equipement}`}</span>
    </div>

   
  }
   className=" px-8"
/>




        <DisplayContainer
  title="Urgence"
  content={intervention?.urgence_display || "---"}
   className=" px-8"
/>
      </div>

      {/* Deuxième ligne : Technicien(s) + Statut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4  mb-2">
      <DisplayContainer
                title="Technicien(s)"
                content={
                  Array.isArray(intervention?.technicien_name) && intervention.technicien_name.length > 0 ? (
                    intervention.technicien_name.map((name, index) => (
                      <InfoIntervUser
                        key={index}
                        nom={name}
                        prenom="" // Le prénom n'est pas directement disponible dans ce serializer
                        email={intervention?.technicien_email?.[index] || "---"}
                        // imageUrl={/* Gérer l'image si disponible */}
                     //   poste=""
                      />
                    ))
                  ) : (
                    <InfoIntervUser
                      nom={intervention?.technicien_name?.[0] || intervention?.technicien_name || "---"}
                      prenom=""
                      email={intervention?.technicien_email?.[0] || intervention?.technicien_email || "---"}
                    //  poste="Technicien"
                    />
                  )
                }
                className=" px-8"
              />


        <DisplayContainer
  title="Statut"
  content={intervention?.statut_display || "---"}
   className=" px-8"
/>


      </div>

      {/* Troisième ligne : Date Début + Date Fin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-2 mb-2">
      {intervention.type_intervention === 'currative' && (
  <>
    <DisplayContainer
      title="Déclarée par"
      content={
        <InfoIntervUser
          nom={intervention.user_name|| "---"}
          prenom="" // pas de prénom dispo pour le moment
          email={intervention.user_email || "---"}
          imageUrl={intervention.image_declarant}
        />
      }
      className="px-8"
    />

    <DisplayContainer
      title="Date fin"
      content={
        <input
          type="date"
          value={intervention.date_fin?.slice(0, 10) || ""}
          disabled
          className="bg-white outline-none w-full"
        />
      }
      className="px-8"
    />
  </>
)}


        <DisplayContainer
  title="Date début"
  content={
    <input
      type="date"
      value={intervention?.date_debut?.slice(0, 10) || ""}
      disabled
      className="bg-white outline-none w-full"
    />
  }
   className=" px-8"
/>



     
      
      </div>

      {/* Quatrième ligne : Déclarée par + Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 mb-2">
       

      <DisplayContainer
  title="Admin"
  content={
    <InfoIntervUser
      nom={intervention?.admin_name}
     // prenom={intervention?.admin?.first_name}
      email={intervention?.admin_email}
      imageUrl={intervention?.admin?.photo}
   
    />
  }
   className=" px-8"
/>


{intervention.type_intervention === 'preventive' && (
  <DisplayContainer
    title="Période (durée)"
    content={intervention.period || "---"}
    className="px-8"
  />
)}


      
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-2 mb-2">
      <div></div>
      <DisplayContainer
  title="Description"
  content={intervention?.description || "---"}
   className=" px-8"
/>
</div>

      {/* Plus d'infos : Actions & Pièces */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-black mb-4">Plus d'Infos :</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-2 mb-2">
        <DisplayContainer
  title="Actions Effectuées"
  content={intervention?.notes || "---"}
   className=" px-8"
/>

<DisplayContainer
  title="Pièces remplacées"
  content={intervention?.pieces || "---"}
   className=" px-8"
/>

        </div>
      </div>
    </>
  )}

  
       
                 </div>
                </div>
            );
        };
        
        export default Userspageee;
        
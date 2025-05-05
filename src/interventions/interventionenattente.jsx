import { useState, useEffect } from "react";
import { FaUser, FaCube } from "react-icons/fa";
import { MdEmail, MdCalendarToday } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs"
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
import PopupChange from "../components/PopupChange"; // casse correcte
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import AddMobile  from "../components/addMobile";
import TabSelector from "../components/tabSelector";

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
    const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
    const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
    const bgColor = isDisponibleActive ? "#F09C0A" : "#D1D5DB"; // jaune sinon gris clair
    const hoverStyle = isDisponibleActive ? "" : "hover:bg-gray-400"; // hover si non actif
    const [interventionsCuratives, setInterventionsCuratives] = useState([]);
    const isSmall = useIsSmallScreen();
    const [interventionsPreventives, setInterventionsPreventives] = useState([]);
   
    const [selectedStatus, setSelectedStatus] = useState("En attente");
    const safeTrim = (val) => typeof val === "string" ? val.trim() : "";

    const handleChange = (event) => {
    setSelectedStatus(event.target.value);
};

const etatOptions = [
  { label: "En attente", value: "En attente" },
  { label: "En cours", value: "En cours" },
  { label: "Terminé", value: "Terminé" }
];

        

useEffect(() => {
  const fetchInterventions = async () => {
      try { 

          let apiUrl = "http://127.0.0.1:8000/api/interventions/interventions";

          if (filter === "Curative") {
              apiUrl = "http://127.0.0.1:8000/api/interventions/interventions/currative/";
          } else if (filter === "Préventive") {
              apiUrl = "http://127.0.0.1:8000/api/interventions/interventions/preventive/";
          }

          const response = await fetch(apiUrl);

          if (!response.ok) {
              throw new Error(`Erreur lors de la récupération des interventions depuis ${apiUrl}`);
          }

          const data = await response.json();
          const filtered = data.filter((item) => {
              const searchTermLower = searchTerm.toLowerCase();
              const titleMatch = safeTrim(item.title).toLowerCase().includes(searchTermLower);
              const equipementMatch = safeTrim(item.equipement_nom).toLowerCase().includes(searchTermLower);
              const statutMatch = safeTrim(item.statut_display).toLowerCase().includes(searchTermLower);
              const urgenceMatch = safeTrim(item.urgence_display).toLowerCase().includes(searchTermLower);

           //   const categoryMatch = filter === "Tout" || item.type_intervention === filter;
           const notEnAttente = safeTrim(item.statut_display).toLowerCase() == "en attente";

           return notEnAttente && (titleMatch || equipementMatch || statutMatch || urgenceMatch);
            //  return  (titleMatch || equipementMatch || statutMatch || urgenceMatch);
          });

          setInterventions(filtered);
          setDisplayedInterventions(filtered.slice(0, visibleCount));
      } catch (error) {
          console.error("Erreur :", error);
      }
  };

  fetchInterventions();
}, [visibleCount, searchTerm, filter]);


        // Références pour détecter les clics en dehors

        useEffect(() => {
          const handleClickOutside = (event) => {
            if (!event.target.closest(".menu-container")) {
              setMenuOpenId(null); // Assurez-vous que c'est setMenuOpenId
            }
          };
          document.addEventListener("click", handleClickOutside);
          return () => document.removeEventListener("click", handleClickOutside);
        }, []);
        
        
    
    
        const handleEdit = (user) => { //un  user en parametre 
            setSelectedUser(user);// Cela permet d'afficher ses informations dans le pop-up.
            setShowEditPopup(true);//  affiche le pop-up.
            setMenuOpen(null);
        };
    
        const handleDisponibleClick = () => {
            setIsDisponibleActive(true); // Active la couleur jaune
            // Rediriger vers la page des interventions en attente
            navigate("/Interventionenattente");
        };
    
        const [menuOpenId, setMenuOpenId] = useState(null);
        const statusOptions = [
            { label: "Modifier", value: "modifier" },
            { label: "Changer le statut", value: "changer le statut" },
            { label: "Cancel", value: "Cancel" },
          ];
          const handleTabSelect = (category) => {
            setFilter(category);
        };
    
          const tabOptions = [
            { label: "Tout" },
            { label: "Curative" },
            { label: "Préventive" },
        ];

   


          const handleOptionSelect = (value, id) => {
            setMenuOpenId(null); // close menu
        
            if (value === "modifier") {
              navigate(`/Modifierintervention/${id}`);
            } else if (value === "changer le statut") {
              setSelectedInterventionid(id);
              setIsPopupVisible(true); // Assurez-vous que isPopupVisible est remis à true ici
            } else if (value === "supprimer") {
              // Quand "Supprimer" est sélectionné
              setSelectedInterventionid(id); // Stocke l'ID de l'intervention à supprimer
              setIsDeletePopupVisible(true); // Affiche le popup de suppression
            }else if(value === "Affecte"){
              navigate(`/Affecterintervention/${id}`);
            }
          };

 

    
        const urgenceColors = {
            "Urgence vitale": "bg-[#F09C0A] ",
            "Urgence élevée": "bg-[#20599E] ",
            "Urgence modérée": "bg-[#FF4423] ",
            "Faible urgence": "bg-[#49A146] ",
        };
        
        const statusColors = {
            "Affecte": "bg-[#F09C0A]",
            "En cours": "bg-[#20599E]",
            "En attente": "bg-[#FF4423]",
            "Terminé": "bg-[#49A146]",

        };





        const handleClosePopup = () => {
          setIsPopupVisible(false);
          setSelectedInterventionid(null);
          setSelectedStatus("En attente"); // ou reset à la valeur de départ
        };

    // const handleDelete = (userId) => {
       //     console.log(" handleDelete appelé avec userId:", userId);
            
       //     if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
        //        console.log(" L'utilisateur a confirmé la suppression");
        
        //        fetch(`http://127.0.0.1:8000//api/user/${userId}/`, {
        //            method: "DELETE",
         //       })
          //      .then((response) => {
            //        console.log("Réponse serveur:", response.status);
        
            //        if (response.ok) {
             //           console.log(" Suppression réussie pour l'utilisateur ID:", userId);
             //           setUsers(prev => prev.filter(user => user.id !== userId));
             //           setDisplayedUsers(displayedUsers.filter(user => user.id !== userId));
              //      } else {
                  //      console.error(" Échec de la suppression");
                   //     alert("Échec de la suppression !");
                 //   }
             //   })
           //     .catch(error => console.error(" Erreur lors de la requête DELETE:", error));
          //  } else {
         //       console.log(" L'utilisateur a annulé la suppression");
          //  }
        
         //   setMenuOpen(null);
      //  };





        const handleDeleteIntervention = async (interventionid) => {
         
                try {
                    const response = await fetch(`http://127.0.0.1:8000/intervention/delete/${interventionid}/`, {
                        method: "DELETE",
                    });
        
                    if (!response.ok) throw new Error("Erreur lors de la suppression");
        
                    // Mise à jour de l'état après suppression
                    setInterventions((prev) => prev.filter((intervention) => intervention.id !== interventionid));
                    setDisplayedInterventions((prev) => prev.filter((intervention) => intervention.id !== interventionid));
        
                    setIsSuccessPopupVisible(true);
                } catch (error) {
                    console.error("Erreur :", error);
                    alert("Une erreur est survenue !");
                }
            
        };
        
        const updateStatus = async (currentStatus) => { // MODIFICATION ICI : ajout de l'argument currentStatus
          if (!selectedInterventionid) {
            console.error("Aucune intervention sélectionnée !");
            return;
          }
        
          try {
            const response = await fetch(`http://127.0.0.1:8000/intervention/update/${selectedInterventionid}/`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ statut: currentStatus }), // MODIFICATION ICI : utilisation de l'argument
            });
        
            if (response.ok) {
              setIsSuccessPopupVisible(true);
              setIsPopupVisible(false);
        
              setInterventions((prev) =>
                prev.map((intervention) =>
                  intervention.id === selectedInterventionid
                    ? { ...intervention, statut: currentStatus } // MODIFICATION ICI : utilisation de l'argument
                    : intervention
                )
              );
            } else {
              console.error("Erreur lors de la mise à jour du statut");
            }
          } catch (error) {
            console.error("Erreur de requête :", error);
          }
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
                                   {/* bare de recherhce  */}    
                         <SearchBar
                           value={searchTerm}
                           onChange={e => setSearchTerm(e.target.value)}
                           placeholder="Rechercher..."
                         />
               
               
               
               <TabSelector
                    options={tabOptions}
                    activeOption={filter}
                    setActiveOption={handleTabSelect}
                />

</div>  

   <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
 
   
        
                    {/* Résultats et bouton Ajouter */}
                    


<div className="relative w-full px-4 my-0">
  {/* Conteneur principal avec flex pour aligner les éléments */}
  <div className="flex justify-between items-center flex-wrap">
    {/* Message des résultats */}
    <div className="text-gray-600 font-semibold text-sm sm:text-base md:text-lg">
      {Math.min(visibleCount, interventions.length)} Résultats affichés sur {interventions.length}
    </div>

    {/* Conteneur des boutons */}
    <div className="flex space-x-2 mt-2 sm:mt-0">
      {/* Bouton Disponible (s'affiche seulement si "Technicien" est sélectionné) */}
      <Buttonrec
      text="en attente"
      bgColor="#F09C0A"
      textColor="black"
      //onClick={handleDisponibleClick}
     className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg shadow-md hover:bg-gray-400"
    />
 {/* Bouton Ajouter */}
 {!isSmall && (
        <div >
        <AjouterButton onClick={() => navigate("/Ajoutintervention")} />
        </div>
      )}

   
    </div>
  </div>
</div>
                {/* Liste des utilisateurs    ::: gap pour espace entre les cartes et grid pour si la carte prend un colone .. ect     ;;;;.map((user) => ( ... )) permet de générer une carte pour chaque utilisateur. */}
                  
                    {visibleCount < interventions.length && (
                        <h3
                            className="mt-6 text-black font-semibold text-lg cursor-pointer hover:underline text-center"
                            onClick={() => setVisibleCount(visibleCount + 3)}
                        >
                            Afficher plus
                        </h3>
                    )}
                       
                       <div className="grid grid-cols-1  relative overflow-visible sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-4">
                        
        {displayedInterventions.map((intervention) => (

        <div key={intervention.id} className="relative">
          <InterventionCard
            id={intervention.id}
            nom={intervention.title}
            urgence={intervention.urgence_display}
            statut={intervention.statut_display}
            equipement={intervention.equipement}
            date={new Date(intervention.date_debut).toLocaleDateString("fr-FR")}
            onClick={() => navigate(`/Interventioninfo/${intervention.id}`)}
            moreClick={() =>
              setMenuOpenId(
                menuOpenId === intervention.id ? null : intervention.id
              )
            }
          />
         {menuOpenId === intervention.id && (
  <div className="menu-container  ">
    <Options
      options={statusOptions}
      handleSelect={(value) => handleOptionSelect(value, intervention.id)}
      className="absolute top-12 right-3 bg-white shadow-xl rounded-lg text-black w-48 sm:w-56 z-50 border"
      setMenuOpen={setMenuOpenId}
      isActive={!isPopupVisible} // Le menu est actif seulement si le PopupChange n'est pas visible
    />
  </div>
)}
        </div>
      ))}
    </div>
            
    {isPopupVisible && (
  <PopupChange
    title="Changer le statut"
    etatOptions={etatOptions}
    selectedStatus={selectedStatus}
    setSelectedStatus={setSelectedStatus}
    update={updateStatus}
    onClose={() => setIsPopupVisible(false)}
  />
)}


<Popupdelete
        isVisible={isDeletePopupVisible}
        onClose={() => setIsDeletePopupVisible(false)}
        onConfirm={handleDeleteIntervention}
        userId={selectedInterventionid}
        title="Êtes-vous sûr de vouloir supprimer cette intervention ?"
        confirmText="Cancel"
        confirmColor="#F09C0A"
      />


{isSuccessPopupVisible && (
  <PopupMessage
    title="Succès"
    message="L'intervention a ete Cancel avec succes  !"
    onClose={() => setIsSuccessPopupVisible(false)}
  />
)}

    
  
       
                 </div>
                </div>
            );
        };
        
        export default Userspageee;
        
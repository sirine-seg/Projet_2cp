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

   
    const [selectedStatus, setSelectedStatus] = useState("En attente");
    const safeTrim = (val) => typeof val === "string" ? val.trim() : "";

    const handleChange = (event) => {
    setSelectedStatus(event.target.value);
};

const { id } = useParams(); // récupère l'id du technicien depuis l'URL
useEffect(() => {
    const fetchintervention = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/intervention/list/");
            if (!response.ok) throw new Error("Erreur lors de la récupération des interventions");

            const data = await response.json();

            const filteredByTechnicien = data.filter((item) => {
                const idTechnicien = item.technicien; // ou item.technicien.id selon ton backend
                return String(idTechnicien) === id; // comparaison stricte en string
            });

            const filteredByStatut = filteredByTechnicien.filter((item) => item.statut_label?.trim() !== "En attente");

            setInterventions(filteredByStatut);
            setDisplayedInterventions(filteredByStatut.slice(0, visibleCount));
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    fetchintervention();
}, [visibleCount, id]);


        // Références pour détecter les clics en dehors

 
        
    
       
    //quand je tape sur l'ecran le pop up disparaitre 
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".menu-container")) {
                setMenuOpen(null);
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
    
      
        
    
        const urgenceColors = {
            "Urgence vitale": "bg-[#F09C0A] ",
            "Urgence élevée": "bg-[#20599E] ",
            "Urgence modérée": "bg-[#FF4423] ",
            "Faible urgence": "bg-[#49A14] ",
        };
        
        const statusColors = {
            "Affecte": "bg-[#F09C0A] ",
            "En cours": "bg-[#20599E] ",
            "En attente": "bg-[#FF4423] ",
            "Termine": "bg-[#49A146] ",

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
        
        const updateStatus = async () => {
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
                    body: JSON.stringify({ statut: selectedStatus }),
                });
        
                if (response.ok) {
                    setIsSuccessPopupVisible(true);
                    setIsPopupVisible(false);
        
                    // Mettre à jour la liste des interventions après modification
                    setInterventions((prev) =>
                        prev.map((intervention) =>
                            intervention.id === selectedInterventionid
                                ? { ...intervention, statut: selectedStatus }
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
 
   
        
                    {/* Résultats et bouton Ajouter */}
                    <div className="w-full px-4 mt-10 flex justify-between items-center">
                    <div className="text-gray-600 ml-10 font-semibold">
    {Math.min(visibleCount, interventions.length)} Résultat affiché sur {interventions.length}
</div>



    {/* Conteneur des boutons */}
    <div className="flex items-center space-x-4"> 
        {/* Bouton Disponible */}
      

        {/* Bouton Ajouter */}
        <motion.button
            className="bg-[#20599E] text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 flex items-center space-x-2"
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}   
            onClick={() => navigate("/Ajout")}
        >
            <span className="text-lg">+</span> {/* Icône ajouter */}
            <span>Ajouter</span>
        </motion.button>
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
                       
                       <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-7 w-full max-w-6xl px-4 mt-6 ml-4">
    {displayedInterventions.map((intervention) => (
        <div 
            key={intervention.id}
            className="p-4 bg-white rounded-2xl shadow-2xl flex flex-col relative w-[350px] mx-auto border border-gray-300"
            onClick={() => navigate(`/Interventioninfo/${intervention.id}`)}
        >
            {/* En-tête avec ID, Urgence et Statut */}
            <div className="flex items-center gap-1 justify-start mb-2">
                <span className="px-2 py-1 bg-gray-300 text-gray-700 text-xs font-bold rounded-full">
                    #{intervention.equipement}
                </span>
                <div className="flex items-center gap-1">
                    {/* Couleur urgence dynamique */}
                    <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${urgenceColors[intervention.urgence_label] || "bg-gray-400"}`}>
                        {intervention.urgence_label}
                    </span>

                    <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${statusColors[intervention.statut_label]}`}>
                        {intervention.statut_label}
                    </span>
                </div>
            </div>
            
            {/* Nom de l'équipement */}
            <div className="flex items-center mb-3">
                <FaCube className="text-gray-700 w-5 h-5 mr-2" />
                <h2 className="text-lg font-bold text-gray-800">{intervention.nom_equipement}</h2>
            </div>

            {/* Technicien & Date sur la même ligne */}
            <div className="flex items-center text-black text-sm">
                <FaUser className="text-black w-4 h-4 mr-2" />
                <span className="mr-4">{intervention.nom_technicien}</span>
                <MdCalendarToday className="text-black w-4 h-4 mr-2" />
                <span>{new Date(intervention.date_fin).toLocaleDateString("fr-FR")}</span>
            </div>

            {/* Bouton menu (⋮) en haut à droite */}
            <button 
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={(event) => {
                    event.stopPropagation(); // Empêche la propagation de l'événement de clic au parent
                    setMenuOpen(menuOpen === intervention.id ? null : intervention.id);
                }}
            >
                ⋮
            </button>

            {menuOpen === intervention.id && (
                <div className="absolute top-10 right-2 bg-white shadow-lg rounded-md text-black w-64 z-50">
                    <button 
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        onClick={(event) => {
                            event.stopPropagation(); // Empêche la propagation du clic
                            navigate(`/Modifierintervention/${intervention.id}`);
                        }}
                    >
                        Modifier
                    </button>
                    <button 
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        onClick={(event) => {
                            event.stopPropagation(); // Empêche la propagation du clic
                            navigate("/Affecterintervention");
                        }}
                    >
                        Affecter
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        onClick={(event) => {
                            event.stopPropagation(); // Empêche la propagation du clic
                            setSelectedInterventionid(intervention.id); // Stocker l'ID de l'intervention
                            setIsPopupVisible(true);
                        }}
                    >
                        Changer le statut
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        onClick={(event) => {
                            event.stopPropagation(); // Empêche la propagation ici aussi
                            setSelectedInterventionid(intervention.id);
                            setIsDeletePopupVisible(true);
                        }}
                    >
                        Supprimer
                    </button>
                </div>
            )}

        </div>
    ))}
</div>

            

{isPopupVisible && (
    <div className="fixed inset-0 flex justify-center items-center z-50">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
        >
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Statut</h2>

            <select
    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md"
    value={selectedStatus}
    onChange={handleChange}
>
    <option value="En attente">En attente</option>
    <option value="En cours">En cours</option>
    <option value="Terminé">Terminé</option>
</select>

            {/* Boutons */}
            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    onClick={() => {
                        console.log("Fermeture du popup !");
                        setIsPopupVisible(false);
                    }} 
                >
                    Annuler
                </button>
                <button className="bg-[#20599E] text-white px-4 py-2 rounded-md"
                 onClick={() => updateStatus()}
           
                >
                    Terminer
                </button>
            </div>
        </motion.div>
    </div>

)}

{isDeletePopupVisible && (
  <div className="fixed inset-0 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-xl text-center w-96 relative">

      {/* Bouton X en haut à droite */}
      <button
        onClick={() => setIsDeletePopupVisible(false)}
        className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
      >
        ×
      </button>

      <p className="text-lg font-bold mt-4 text-black">
        Êtes-vous sûr de vouloir supprimer cette intervention ?
      </p>

      {/* Bouton Supprimer centré */}
      <div className="mt-6">
        <button
          onClick={() => {
            handleDeleteIntervention(selectedInterventionid);
            setIsDeletePopupVisible(false);
          }}
          className="px-6 py-2 bg-[#F09C0A] text-white rounded-md "
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
)}


{isSuccessPopupVisible && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
    <div className="bg-white p-8 rounded-3xl shadow-2xl w-[90%] max-w-md relative text-center">
      
      {/* Icône cercle avec check */}
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#E0ECF8] flex items-center justify-center">
        <svg className="w-8 h-8 text-[#20599E] " fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Texte principal */}
      <p className="text-xl font-semibold text-gray-900">Le status a ete modifier avec succes  !</p>

      {/* Bouton fermer */}
      <button
        onClick={() => setIsSuccessPopupVisible(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-black text-lg"
      >
        ✖
      </button>
    </div>
  </div>
)}

    
  
       
                 </div>
                </div>
            );
        };
        
        export default Userspageee;
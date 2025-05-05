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
import InterventionCard from "../components/interventionCard";
import PopupMessage from "../components/Popupcheck";
import PopupChange from "../components/popupChange.jsx"; // casse correcte
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import AddMobile  from "../components/addMobile";
import TabSelector from "../components/tabSelector";
import Filtre from "../components/filtre.jsx";

import ViewToggle from "../components/viewToggle";
import InterventionList from "../components/interventionList";
import InterventionListHeader from "../components/interventionListHeader";
import SelectionToolbar from "../components/selectionToolBar";

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
    const [isCancelPopupVisible, setIsCancelPopupVisible] = useState(false);
    const [selectedTechniciens, setSelectedTechniciens] = useState([]);
    const [technicienOptions, setTechnicienOptions] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [equipementsList, setEquipementsList] = useState([]);
    const [selectedEquipements, setSelectedEquipements] = useState([]);
    

    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const etatOptions = [
        { label: "En attente", value: "En attente" },
        { label: "En cours", value: "En cours" },
        { label: "Terminé", value: "Terminé" }
    ];

    const urgenceOptions= [
        { value: 0, label: 'Urgence vitale' },
        { value: 1, label: 'Urgence élevée' },
        { value: 2, label: 'Urgence modérée' },
        { value: 3, label: 'Faible urgence' },
      ];
    const [selectedUrgence, setSelectedUrgence] = useState([]);


    const handleCancelClick = () => {
        setIsCancelPopupVisible(true);
        console.log("Bouton Annuler cliqué, isCancelPopupVisible:", isCancelPopupVisible); // Ajout de console.log pour le débogage
    };

    // State et handlers pour la sélection des interventions
    const [currentView, setCurrentView] = useState("grid"); // "list" ou "grid"
    const [selectedInterventions, setSelectedInterventions] = useState([]);
    
    // Toggle sélection d'une intervention
    const handleInterventionToggle = (id) => {
      setInterventions(interventions.map(intervention =>
        intervention.id === id 
          ? { ...intervention, checked: !intervention.checked } 
          : intervention
      ));
    };
    
    // Sélectionner toutes les interventions
    const handleSelectAllInterventions = () => {
      setInterventions(interventions.map(intervention => ({
        ...intervention,
        checked: true
      })));
    };
    
    // Désélectionner toutes les interventions
    const handleDeselectAllInterventions = () => {
      setInterventions(interventions.map(intervention => ({
        ...intervention,
        checked: false
      })));
    };
    
    // Action groupée sur les interventions sélectionnées
    const handleInterventionActionClick = () => {
      const selected = interventions.filter(i => i.checked);
      alert(`Action sur ${selected.length} interventions(s)`);
    };

    const selectedInterventionCount = interventions.filter(i => i.checked).length;
    const allInterventionsSelected = selectedInterventionCount === interventions.length && interventions.length > 0;



    useEffect(() => {
  const fetchUserRole = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch("http://localhost:8000/api/accounts/me/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data?.role || data?.user?.role);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du rôle :", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUserRole();
}, []);

const isAdmin = ["ADMIN", "ADMINISTRATEUR"].includes(userRole?.toUpperCase());

    // integration de fetch intervention .
/*
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
                    const equipementMatch = safeTrim(item.equipement_name).toLowerCase().includes(searchTermLower);
                    const statutMatch = safeTrim(item.statut_display).toLowerCase().includes(searchTermLower);
                    const urgenceMatch = safeTrim(item.urgence_display).toLowerCase().includes(searchTermLower);

                    //   const categoryMatch = filter === "Tout" || item.type_intervention === filter;
                    const notEnAttente = safeTrim(item.statut_display).toLowerCase() !== "en attente";

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
*/



    // integration de la list des interventions
    // travaille de marouane
    /*a state for different intervention types*/
    // defined erlier  , filter  n interventions  , displayIntervention


    useEffect(() => {
        const fetchInterventions = async () => {
            try {
                let apiUrl = "http://127.0.0.1:8000/api/interventions/interventions";
    
                if (filter === "Curative") {
                    apiUrl = "http://127.0.0.1:8000/api/interventions/interventions/currative/";
                } else if (filter === "Préventive") {
                    apiUrl = "http://127.0.0.1:8000/api/interventions/interventions/preventive/";
                }
    
                const accessToken = localStorage.getItem("access_token");
    
                const response = await fetch(apiUrl, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`Erreur lors de la récupération des interventions depuis ${apiUrl}`);
                }
    
                const data = await response.json();
    
                // Apply all filters
                const filtered = data.filter((item) => {
                    // Search term filtering
                    const searchTermLower = searchTerm.toLowerCase();
                    const titleMatch = safeTrim(item.title).toLowerCase().includes(searchTermLower);
                    const equipementMatch = safeTrim(item.equipement_name).toLowerCase().includes(searchTermLower);
                    const statutMatch = safeTrim(item.statut_display).toLowerCase().includes(searchTermLower);
                    const urgenceMatch = safeTrim(item.urgence_display).toLowerCase().includes(searchTermLower);
                    const technicienMatch = safeTrim(item.technicien_name).toLowerCase().includes(searchTermLower);
    
                    // Filter by type (Curative/Préventive)
                    let typeFilterMatch = true;
                    if (filter === "Curative") {
                        typeFilterMatch = item.type_intervention === "currative";
                    } else if (filter === "Préventive") {
                        typeFilterMatch = item.type_intervention === "preventive";
                    } else if (filter === "en attente") {
                        typeFilterMatch = item.statut_display?.trim() === "en attente";
                    }
    
                    let statusFilterMatch = true;
                    if (Array.isArray(selectedStatus) && selectedStatus.length > 0) {
                      statusFilterMatch = selectedStatus.some(status => 
                        safeTrim(item.statut_display).toLowerCase() === status.label.toLowerCase()
                      );
                    }

                    let urgenceFilterMatch = true;
                    if (Array.isArray(selectedUrgence) && selectedUrgence.length > 0) {
                      urgenceFilterMatch = selectedUrgence.some(urgence => 
                        safeTrim(item.urgence_display).toLowerCase() === urgence.label.toLowerCase()
                      );
                    }

                    let technicienFilterMatch = true;
                    if (Array.isArray(selectedTechniciens) && selectedTechniciens.length > 0) {
                      technicienFilterMatch = selectedTechniciens.some(tech => 
                        item.technicien === tech.value || 
                        (item.technicien && item.technicien.id === tech.value) ||
                        (item.technicien_id === tech.value)
                      );
                    }

                    let equipementFilterMatch = true;
                    if (Array.isArray(selectedEquipements) && selectedEquipements.length > 0) {
                      equipementFilterMatch = selectedEquipements.some(equip =>
                        item.equipement === equip.value || 
                        (item.equipement && item.equipement.id === equip.value) ||
                        (item.equipement_id === equip.value)
                      );
                    }
    
                    // Combine all filters
                    return typeFilterMatch &&
                           (titleMatch || equipementMatch || statutMatch || urgenceMatch || technicienMatch) &&
                           urgenceFilterMatch &&
                           technicienFilterMatch &&
                           equipementFilterMatch &&
                           statusFilterMatch;
                });
    
                setInterventions(filtered);
                setDisplayedInterventions(filtered.slice(0, visibleCount));
            } catch (error) {
                console.error("Erreur :", error);
            }
        };
    
        fetchInterventions();
    }, [filter, searchTerm, visibleCount, selectedUrgence, selectedTechniciens, selectedEquipements, selectedStatus]);


    useEffect(() => {
        const fetchStatusList = async () => {
          try {
            const token = localStorage.getItem('access_token'); // or wherever you store your token
            const response = await fetch('http://127.0.0.1:8000/api/interventions/interventions/status/', {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            });
            
            if (!response.ok) throw new Error("Failed to fetch statuses");
            const data = await response.json();
            // Format status list for filter dropdown
            const statusOptions = data.map(status => ({
              value: status.id || status.value,
              label: status.name || status.label
            }));
            setStatusList(statusOptions);
          } catch (error) {
            console.error("Error fetching statuses:", error);
          }
        };
      
        fetchStatusList();
      }, []);
      
      useEffect(() => {
        const fetchEquipements = async () => {
          try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/equipements/equipement/', {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Format équipements for dropdown, comme pour les techniciens
            const options = data.map(equip => ({
              value: equip.id_equipement || equip.value,
              label: equip.nom  || equip.label,
            }));
            setEquipementsList(options);
            console.log("Liste des équipements récupérée :", options);
          } catch (error) {
            console.error("Erreur lors de la récupération des équipements :", error);
          }
        };
      
        fetchEquipements();
      }, []);
    
      useEffect(() => {
        const fetchTechniciens = async () => {
          try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/accounts/techniciens/', {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Format techniciens for dropdown, similaire aux équipements
            const options = data.map(tech => ({
              value: tech.id || tech.value,
              label: (tech.user ? `${tech.user.first_name} ${tech.user.last_name}` : "Sans nom")
            }));
            setTechnicienOptions(options);
            console.log("Liste des techniciens récupérée :", options);
          } catch (error) {
            console.error("Erreur lors de la récupération des techniciens :", error);
          }
        };
      
        fetchTechniciens();
      }, []);



      const handleTechnicienFilter = (selectedOptions) => {
        setSelectedTechniciens(Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]);
      };
      
      const handleStatusFilter = (selectedOptions) => {
        setSelectedStatus(Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]);
      };
      
      const handleEquipementFilter = (selectedOptions) => {
        setSelectedEquipements(Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]);
      };
      
      const handleUrgenceFilter = (selectedOptions) => {
        setSelectedUrgence(Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]);
      };




    // integration de cancel
/*    const handleConfirmCancel = async (intervention) => {
        setIsCancelPopupVisible(false); // Fermer la popup de confirmation

        const interventionId = intervention.id;
        const interventionType = intervention.type; // Assurez-vous que votre objet 'intervention' a une propriété 'type'

        const apiUrl = `/api/interventions/interventions/cancel/${interventionType}/${interventionId}/`;

        try {
            const accessToken = localStorage.getItem('access_token');  // get token from localStorage
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Intervention annulée avec succès:', data);
                // Mettez à jour l'état de votre composant parent ou effectuez d'autres actions nécessaires
                // Par exemple, re-fetch la liste des interventions pour refléter le changement
            } else {
                const errorData = await response.json();
                console.error('Erreur lors de l\'annulation de l\'intervention:', errorData);
                // Affichez un message d'erreur à l'utilisateur
            }
        } catch (error) {
            console.error('Erreur réseau lors de l\'annulation:', error);
            // Gérez les erreurs réseau
        }
    }; */



    const handleCancelPopupClose = () => {
        setIsCancelPopupVisible(false);
    };

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


    // considered not working
     const handleDisponibleClick = () => {
        setIsDisponibleActive(true); // Active la couleur jaune
        // Rediriger vers la page des interventions en attente
        //navigate("/Interventionenattente");
    };

    const handleEnAttenteClick = () => {
        if (filter === "en attente") {
            setFilter("tout"); // or any default filter that means "no specific filter"
        } else {
            setFilter("en attente");
        }
    };





    const [menuOpenId, setMenuOpenId] = useState(null);
    const statusOptions = [
        { label: "Modifier", value: "modifier" },
        { label: "Changer le statut", value: "changer le statut" },
        { label: "Cancel", value: "Cancel" },
    ];

    // a function to get the menu options based on the status
    const getStatusOption  = (status) =>{
        const statusOptions = [
            { label: "Modifier", value: "modifier" },
            { label: "Changer le statut", value: "changer le statut" },
            { label: "Cancel", value: "Cancel" },
        ];
        if (status === "en attente") {
            statusOptions.push ({label: "Affecter", value: "Affecter" });
        }
        return statusOptions ;
    }



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
            navigate(`/ModifierIntervention/${id}`);
        } else if (value === "changer le statut") {
            setSelectedInterventionid(id);
            setIsPopupVisible(true); // Assurez-vous que isPopupVisible est remis à true ici
        } else if (value === "cancel") {
            // Quand "Supprimer" est sélectionné
            setSelectedInterventionid(id); // Stocke l'ID de l'intervention à supprimer
            setIsCancelPopupVisible(true); // Affiche le popup de suppression
        }
        else if (value === "Affecter") {
            navigate(`/AffecterIntervention/${id}`);
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




    // integration de la suppression
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


    // integration de la mise a jour du status
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

        <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E]">

            {/* Logo en haut à gauche */}
            <Header />









            {/* En-tête */}
            <div className="w-full bg-[#20599E] text-white pb-16 text-center">

                <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
                    Intervention
                </h1>





                {/* bare de recherhce  */}
                <SearchBar
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Rechercher..."
                />

                <div className="mx-auto w-full max-w-4xl px-4 mt-4 flex justify-center">
                <div className="flex flex-nowrap space-x-2 overflow-x-auto no-scrollbar pb-2">
                  <Filtre
                    label={`Équipement${selectedEquipements ? `: ${selectedEquipements}` : ''}`}
                    options={equipementsList}
                    onSelectFilter={handleEquipementFilter}
                    titre="Filtrer par Équipement"
                    isActive={!!selectedEquipements}
                  />

                  <Filtre
                    label={`Technicien${selectedTechniciens ? `: ${selectedTechniciens}` : ''}`}
                    options={technicienOptions}
                    onSelectFilter={handleTechnicienFilter}
                    titre="Filtrer par Technicien"
                    isActive={!!selectedTechniciens}
                  />

                  <Filtre
                    label={`Urgence${selectedUrgence ? `: ${selectedUrgence}` : ''}`}
                    options={urgenceOptions}
                    onSelectFilter={handleUrgenceFilter}
                    titre="Filtrer par Urgence"
                    isActive={!!selectedUrgence}
                  />

                  <Filtre
                    label={`Status${selectedStatus ? `: ${selectedStatus}` : ''}`}
                    options={statusList}
                    onSelectFilter={handleStatusFilter}
                    titre="Filtrer par Status"
                    isActive={!!selectedStatus}
                  />
                </div>
                </div>


                {/*tout  , currative  , preventive*/}
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
                            <div className="flex items-center">
                              <ViewToggle onChange={(view) => setCurrentView(view)} />
                            </div>

                            {/* Bouton Disponible (s'affiche seulement si "Technicien" est sélectionné) */}
                            <Buttonrec
                                text="en attente"
                                bgColor={filter === "en attente" ? "#F09C0A" : "#D1D5DB"}  // yellow if selected, grey otherwise
                                textColor={filter === "en attente" ? "white" : "black"} // blacktext if selected, white otherwise
                                onClick={handleEnAttenteClick}
                                className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg shadow-md hover:bg-gray-400"
                            />

                            

                            {/* Bouton Ajouter */}
                            {!isSmall && (
                                <div >
                                    <AjouterButton onClick={() => navigate("/AjouterIntervention")} />
                                </div>
                            )}


                        </div>
                    </div>
                </div>
                {/* Liste des utilisateurs    ::: gap pour espace entre les cartes et grid pour si la carte prend un colone .. ect     ;;;;.map((user) => ( ... )) permet de générer une carte pour chaque utilisateur. */}

                <div className="flex flex-wrap space-y-4 p-4">

                <div className="flex justify-between items-center w-full">
                            {currentView === "list" && (
                              <div className="sm:py-2 w-full">
                                <SelectionToolbar
                                  selectedCount={selectedInterventionCount}
                                  allSelected={allInterventionsSelected}
                                  onSelectAll={handleSelectAllInterventions}
                                  onDeselectAll={handleDeselectAllInterventions}
                                  onActionClick={handleInterventionActionClick}
                                  selectedEquipments={selectedInterventions}
                                />
                              </div>
                            )}
                          </div>

                {currentView === 'list' ? (
                  /* Vue liste */
                  <div className="space-y-2 w-full">
                    <InterventionListHeader /> 

                    {displayedInterventions.map((intervention) => (
                      <div key={intervention.id} className="relative">
                        <InterventionList
                          nom={intervention.title}
                          equipement={intervention.equipement}
                          urgence={intervention.urgence_display}
                          statut={intervention.statut_display}
                          moreClick={() => setMenuOpenId(menuOpenId === intervention.id ? null : intervention.id)}
                          checked={intervention.checked || false}
                          onToggle={() => handleInterventionToggle(intervention.id)}
                        />

                        {!loading && isAdmin && menuOpenId === intervention.id && (
                          <div className="absolute right-6 top-6 z-50">
                            <Options
                              options={getStatusOption(intervention.statut_display)}
                              handleSelect={(value) => handleOptionSelect(value, intervention.id)}
                              className="bg-white shadow-xl rounded-lg text-black w-48 sm:w-56 border"
                              setMenuOpen={setMenuOpenId}
                              isActive={!isPopupVisible}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Vue grille */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-6 w-full">
                    {displayedInterventions.map((intervention) => (
                      <div key={intervention.id} className="relative">
                        <InterventionCard
                          id={intervention.id}
                          nom={intervention.title}
                          urgence={intervention.urgence_display}
                          statut={intervention.statut_display}
                          equipement={intervention.equipement}
                          date={new Date(intervention.date_debut).toLocaleDateString("fr-FR")}
                          onClick={() => navigate(`/DetailsIntervention/${intervention.id}`)}
                          moreClick={() => setMenuOpenId(menuOpenId === intervention.id ? null : intervention.id)}
                        />

                        {!loading && isAdmin && menuOpenId === intervention.id && (
                          <div className="absolute top-12 right-3 z-[9999]">
                            <Options
                              options={getStatusOption(intervention.statut_display)}
                              handleSelect={(value) => handleOptionSelect(value, intervention.id)}
                              className="bg-white shadow-xl rounded-lg w-48 sm:w-56 border"
                              setMenuOpen={setMenuOpenId}
                              isActive={!isPopupVisible}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
                
                {visibleCount < interventions.length && (
                    <h3
                        className="mt-6 text-black font-semibold text-lg cursor-pointer hover:underline text-center"
                        onClick={() => setVisibleCount(visibleCount + 3)}
                    >
                        Afficher plus
                    </h3>
                )}
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



                {isCancelPopupVisible && (
                    <Popupdelete
                        isVisible={isCancelPopupVisible}
                        onClose={handleCancelPopupClose}
                        onConfirm={handleConfirmCancel}
                        title="Confirmer l'annulation ?"
                        message={`Êtes-vous sûr de vouloir annuler l'intervention #${selectedInterventionid}} ?`}
                        userId={selectedInterventionid} // Passez l'ID de l'intervention à onConfirm
                        confirmText="Annuler l'intervention"
                        confirmColor="#dc2626" // Couleur rouge pour l'annulation (facultatif)
                        //  iconSrc={attention} // Vous pouvez utiliser l'icône d'attention
                        // iconBgColor="#FFF0F0"
                    />
                )}

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
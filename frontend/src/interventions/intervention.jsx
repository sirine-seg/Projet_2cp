import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/Searchbar";
import Header from "../components/Header";
import AjouterButton from "../components/Ajouterbutton";
import Buttonrec from "../components/buttonrectangle";
import Popupdelete from "../components/Popupdelet";
import Options from "../components/options";
import InterventionCard from "../components/interventionCard";
import PopupMessage from "../components/Popupcheck";
import PopupChange from "../components/popupChange.jsx";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import AddMobile from "../components/addMobile";
import TabSelector from "../components/tabSelector";
import Filtre from "../components/filtre.jsx";

import ViewToggle from "../components/viewToggle";
import InterventionList from "../components/interventionList";
import InterventionListHeader from "../components/interventionListHeader";
import SelectionToolbarInter from "../components/selectionToolBarInter";

const Intervention = () => {
  const [interventions, setInterventions] = useState([]); // Stocke toutes les interventions
  const [displayedInterventions, setDisplayedInterventions] = useState([]); // Stocke les interventions affichées
  const [filter, setFilter] = useState("Tout");

  const [visibleCount, setVisibleCount] = useState(9); // Nombre d'utilisateurs affichés
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedInterventionid, setSelectedInterventionid] = useState(null);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

  const isSmall = useIsSmallScreen();

  const [selectedStatus, setSelectedStatus] = useState("");
  const safeTrim = (val) => (typeof val === "string" ? val.trim() : "");
  const [isCancelPopupVisible, setIsCancelPopupVisible] = useState(false);
  const [selectedTechniciens, setSelectedTechniciens] = useState([]);
  const [technicienOptions, setTechnicienOptions] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [equipementsList, setEquipementsList] = useState([]);
  const [selectedEquipements, setSelectedEquipements] = useState([]);

  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openFilterId, setOpenFilterId] = useState(null);

  const [menuData, setMenuData] = useState(null);

  const handleChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const etatOptions = [
    { label: "En attente", value: "En attente" },
    { label: "En cours", value: "En cours" },
    { label: "Terminé", value: "Terminé" },
  ];

  const urgenceOptions = [
    { value: 0, label: "Urgence vitale" },
    { value: 1, label: "Urgence élevée" },
    { value: 2, label: "Urgence modérée" },
    { value: 3, label: "Faible urgence" },
  ];
  const [selectedUrgence, setSelectedUrgence] = useState([]);

  const convertStatus = (value) => {
    switch (value) {
      case "En attente":
        return 1;
      case "En cours":
        return 3;
      case "Terminé":
        return 4;
    }
  };

  const handleCancelClick = () => {
    setIsCancelPopupVisible(true);
    console.log(
      "Bouton Annuler cliqué, isCancelPopupVisible:",
      isCancelPopupVisible
    ); // Ajout de console.log pour le débogage
  };

  // State et handlers pour la sélection des interventions
  const [currentView, setCurrentView] = useState("list"); // "list" ou "grid"
  const [selectedInterventions, setSelectedInterventions] = useState([]);

  // Toggle sélection d'une intervention
  const handleInterventionToggle = (id) => {
    setInterventions(
      interventions.map((intervention) =>
        intervention.id === id
          ? { ...intervention, checked: !intervention.checked }
          : intervention
      )
    );

    setSelectedInterventions((prev) => {
      const intervention = interventions.find((e) => e.id === id);
      console.log(interventions.find((i) => i.id === id));
      console.log("Current intervention.checked value:", intervention?.checked);
      if (!intervention) return prev;

      if (!intervention.checked) {
        return [...prev, intervention];
      } else {
        return prev.filter((e) => e.id !== id);
      }
    });
  };

  // Sélectionner toutes les interventions
  const handleSelectAllInterventions = () => {
    setInterventions(
      interventions.map((intervention) => ({
        ...intervention,
        checked: true,
      }))
    );
    setSelectedInterventions([...interventions]);
  };

  // Désélectionner toutes les interventions
  const handleDeselectAllInterventions = () => {
    setInterventions(
      interventions.map((intervention) => ({
        ...intervention,
        checked: false,
      }))
    );
    setSelectedInterventions([]);
  };

  // Action groupée sur les interventions sélectionnées
  const handleInterventionActionClick = (action) => {
    const selected = interventions.filter((i) => i.checked);
    console.log(
      `Action "${action}" sur ${selected.length} interventions(s)`,
      selected
    );
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:8000/api/accounts/me/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
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

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        let apiUrl = "http://127.0.0.1:8000/api/interventions/interventions";

        if (filter === "Curative") {
          apiUrl =
            "http://127.0.0.1:8000/api/interventions/interventions/currative/";
        } else if (filter === "Préventive") {
          apiUrl =
            "http://127.0.0.1:8000/api/interventions/interventions/preventive/";
        }

        const accessToken = localStorage.getItem("access_token");

        const response = await fetch(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la récupération des interventions depuis ${apiUrl}`
          );
        }

        const data = await response.json();

        // Trier les données par ID décroissant (du plus récent au plus ancien)
        data.sort((a, b) => b.id - a.id);

        // Apply all filters
        const filtered = data.filter((item) => {
          // Search term filtering
          const searchTermLower = searchTerm.toLowerCase();
          const titleMatch = safeTrim(item.title)
            .toLowerCase()
            .includes(searchTermLower);
          const equipementMatch = safeTrim(item.equipement_name)
            .toLowerCase()
            .includes(searchTermLower);
          const statutMatch = safeTrim(item.statut_display)
            .toLowerCase()
            .includes(searchTermLower);
          const urgenceMatch = safeTrim(item.urgence_display)
            .toLowerCase()
            .includes(searchTermLower);
          const technicienMatch = safeTrim(item.technicien_name)
            .toLowerCase()
            .includes(searchTermLower);

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
            statusFilterMatch = selectedStatus.some(
              (status) =>
                safeTrim(item.statut_display).toLowerCase() ===
                status.label.toLowerCase()
            );
          }

          let urgenceFilterMatch = true;
          if (Array.isArray(selectedUrgence) && selectedUrgence.length > 0) {
            urgenceFilterMatch = selectedUrgence.some(
              (urgence) =>
                safeTrim(item.urgence_display).toLowerCase() ===
                urgence.label.toLowerCase()
            );
          }

          let technicienFilterMatch = true;
          if (
            Array.isArray(selectedTechniciens) &&
            selectedTechniciens.length > 0
          ) {
            technicienFilterMatch = selectedTechniciens.some(
              (tech) =>
                item.technicien === tech.value ||
                (item.technicien && item.technicien.id === tech.value) ||
                item.technicien_id === tech.value
            );
          }

          let equipementFilterMatch = true;
          if (
            Array.isArray(selectedEquipements) &&
            selectedEquipements.length > 0
          ) {
            equipementFilterMatch = selectedEquipements.some(
              (equip) =>
                item.equipement === equip.value ||
                (item.equipement && item.equipement.id === equip.value) ||
                item.equipement_id === equip.value
            );
          }

          // Combine all filters
          return (
            typeFilterMatch &&
            (titleMatch ||
              equipementMatch ||
              statutMatch ||
              urgenceMatch ||
              technicienMatch) &&
            urgenceFilterMatch &&
            technicienFilterMatch &&
            equipementFilterMatch &&
            statusFilterMatch
          );
        });

        setInterventions(filtered);
        setDisplayedInterventions(filtered.slice(0, visibleCount));
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    fetchInterventions();
  }, [
    filter,
    searchTerm,
    visibleCount,
    selectedUrgence,
    selectedTechniciens,
    selectedEquipements,
    selectedStatus,
  ]);

  useEffect(() => {
    const fetchStatusList = async () => {
      try {
        const token = localStorage.getItem("access_token"); // or wherever you store your token
        const response = await fetch(
          "http://127.0.0.1:8000/api/interventions/interventions/status/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch statuses");
        const data = await response.json();
        // Format status list for filter dropdown
        const statusOptions = data.map((status) => ({
          value: status.id || status.value,
          label: status.name || status.label,
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
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          "http://127.0.0.1:8000/api/equipements/equipement/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Format équipements for dropdown, comme pour les techniciens
        const options = data.map((equip) => ({
          value: equip.id_equipement || equip.value,
          label: equip.nom || equip.label,
        }));
        setEquipementsList(options);
        console.log("Liste des équipements récupérée :", options);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des équipements :",
          error
        );
      }
    };

    fetchEquipements();
  }, []);

  useEffect(() => {
    const fetchTechniciens = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          "http://127.0.0.1:8000/api/accounts/techniciens/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Format techniciens for dropdown, similaire aux équipements
        const options = data.map((tech) => ({
          value: tech.id || tech.value,
          label: tech.user
            ? `${tech.user.first_name} ${tech.user.last_name}`
            : "Sans nom",
        }));
        setTechnicienOptions(options);
        console.log("Liste des techniciens récupérée :", options);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des techniciens :",
          error
        );
      }
    };

    fetchTechniciens();
  }, []);

  const handleTechnicienFilter = (selectedOptions) => {
    setSelectedTechniciens(
      Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]
    );
  };

  const handleStatusFilter = (selectedOptions) => {
    setSelectedStatus(
      Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]
    );
  };

  const handleEquipementFilter = (selectedOptions) => {
    setSelectedEquipements(
      Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]
    );
  };

  const handleUrgenceFilter = (selectedOptions) => {
    setSelectedUrgence(
      Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]
    );
  };

  const handleConfirmCancel = async (interventionid) => {
    try {
      console.log("i am here");
      const accessToken = localStorage.getItem("access_token");
      console.log("the id of the intervention", selectedInterventionid);
      console.log("the type of the intervention", menuData.type);
      const response = await fetch(
        `http://127.0.0.1:8000//api/interventions/interventions/cancel/${menuData.type}/${selectedInterventionid}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        }
      );

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      // Mise à jour de l'état après suppression
      setInterventions((prev) =>
        prev.filter((intervention) => intervention.id !== interventionid)
      );
      setDisplayedInterventions((prev) =>
        prev.filter((intervention) => intervention.id !== interventionid)
      );

      setIsSuccessPopupVisible(true);
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue !");
    }
  };

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

  const handleEnAttenteClick = () => {
    if (filter === "en attente") {
      setFilter("tout"); // or any default filter that means "no specific filter"
    } else {
      setFilter("en attente");
    }
  };

  const [menuOpenId, setMenuOpenId] = useState(null);

  // a function to get the menu options based on the status
  const getStatusOption = (status) => {
    const statusOptions = [
      { label: "Changer le statut", value: "changer le statut" },
      { label: "Cancel", value: "Cancel" },
    ];
    if (status === "en attente") {
      statusOptions.push({ label: "Affecter", value: "Affecter" });
    }
    if (currentView === "list") {
      statusOptions.push({ label: "Détails", value: "details" });
    }
    return statusOptions;
  };

  useEffect(() => {
    const selected = interventions.filter((e) => e.checked);
    setSelectedInterventions(selected);
  }, [interventions]);

  const selectedInterventionCount = interventions.filter(
    (e) => e.checked
  ).length;
  const allInterventionsSelected =
    selectedInterventionCount === interventions.length &&
    interventions.length > 0;

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

    if (value === "changer le statut") {
      setSelectedInterventionid(id);
      setIsPopupVisible(true); // Assurez-vous que isPopupVisible est remis à true ici
    } else if (value === "Cancel") {
      // Quand "Supprimer" est sélectionné
      setSelectedInterventionid(id); // Stocke l'ID de l'intervention à canceler
      setIsCancelPopupVisible(true); // Affiche le popup de cancel
      console.log("Cancel clicked, selectedInterventionid:", id); // Ajout de console.log pour le débogage
      console.log("selected type : ", menuData.type);
    } else if (value === "Affecter") {
      navigate(`/AffecterIntervention/${id}`);
    } else if (value === "details") {
      navigate(`/DetailsIntervention/${id}`);
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setSelectedInterventionid(null);
    setSelectedStatus("En attente"); // ou reset à la valeur de départ
  };

  // integration de la suppression
  const handleDeleteIntervention = async (interventionid) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/intervention/delete/${interventionid}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      // Mise à jour de l'état après suppression
      setInterventions((prev) =>
        prev.filter((intervention) => intervention.id !== interventionid)
      );
      setDisplayedInterventions((prev) =>
        prev.filter((intervention) => intervention.id !== interventionid)
      );

      setIsSuccessPopupVisible(true);
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue !");
    }
  };

  // integration de la mise a jour du status
  const updateStatus = async (currentStatus) => {
    if (!selectedInterventionid) {
      console.error("Aucune intervention sélectionnée !");
      return;
    }
    const typeInter = menuData.type;
    let api_url;

    try {
      console.log("this is the data : ", menuData);
      console.log("the id of intervention is : ", selectedInterventionid);
      if (typeInter === "currative") {
        api_url = `http://127.0.0.1:8000/api/interventions/interventions/currative/update/${selectedInterventionid}/`;
        console.log("successfully entered");
      } else if (typeInter === "preventive") {
        api_url = `http://127.0.0.1:8000/api/interventions/interventions/preventive/update/${selectedInterventionid}/`;
      }
      console.log("selectedStatus:", selectedStatus);

      const accessToken = localStorage.getItem("access_token");

      const response = await fetch(api_url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          statut: convertStatus(selectedStatus), // un int, par ex. 1, 2, 3...
        }),
      });

      if (response.ok) {
        setIsSuccessPopupVisible(true);
        setIsPopupVisible(false);

        setInterventions((prev) =>
          prev.map((intervention) =>
            intervention.id === selectedInterventionid
              ? { ...intervention, statut: currentStatus }
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
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] font-poppins">
      {/* Logo en haut à gauche */}
      <Header />

      {/* En-tête */}
      <div className="w-full bg-[#20599E] text-white pb-16 text-center">
        <h1 className="text-3xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Interventions
        </h1>

        {/* bare de recherhce  */}
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher..."
        />

        <div className="mx-auto w-full max-w-4xl px-4 mt-4 flex justify-center items-center">
          <div className="flex flex-row space-x-2 pb-2 items-center">
            <Filtre
              id="equipement"
              label="Équipement"
              options={equipementsList}
              onSelectFilter={handleEquipementFilter}
              titre="Filtrer par Équipement"
              isActive={!!selectedEquipements}
              isOpen={openFilterId === "equipement"}
              setOpenFilterId={setOpenFilterId}
            />

            <Filtre
              id="urgence"
              label="Urgence"
              options={urgenceOptions}
              onSelectFilter={handleUrgenceFilter}
              titre="Filtrer par Urgence"
              isActive={!!selectedUrgence}
              isOpen={openFilterId === "urgence"}
              setOpenFilterId={setOpenFilterId}
            />

            <Filtre
              id="technicien"
              label="Technicien"
              options={technicienOptions}
              onSelectFilter={handleTechnicienFilter}
              titre="Filtrer par Technicien"
              isActive={!!selectedTechniciens}
              isOpen={openFilterId === "technicien"}
              setOpenFilterId={setOpenFilterId}
            />

            <Filtre
              id="status"
              label="Statut"
              options={statusList}
              onSelectFilter={handleStatusFilter}
              titre="Filtrer par Status"
              isActive={!!selectedStatus}
              isOpen={openFilterId === "status"}
              setOpenFilterId={setOpenFilterId}
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

      <div className="w-full min-h-screen rounded-t-[35px] sm:rounded-t-[45px] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        {/* Résultats et bouton Ajouter */}

        <div className="relative w-full px-4 my-0">
          {/* Conteneur principal avec flex pour aligner les éléments */}
          <div className="flex justify-between items-center flex-wrap">
            {/* Message des résultats */}
            {currentView === "grid" ? (
              <div className="text-gray-600 font-semibold text-xs sm:text-sm md:text-base">
                {Math.min(visibleCount, interventions.length)} Résultats
                affichés sur {interventions.length}
              </div>
            ) : (
              <div></div>
            )}

            {/* Conteneur des boutons */}
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <div className="flex items-center">
                <ViewToggle onChange={(view) => setCurrentView(view)} />
              </div>

              {/* Bouton Disponible (s'affiche seulement si "Technicien" est sélectionné) */}
              <Buttonrec
                text="En attente"
                bgColor={filter === "en attente" ? "#F09C0A" : "#D1D5DB"} // yellow if selected, grey otherwise
                textColor={filter === "en attente" ? "white" : "black"} // blacktext if selected, white otherwise
                onClick={handleEnAttenteClick}
                className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg shadow-md hover:bg-gray-400"
              />

              {/* Bouton Ajouter */}
              {!isSmall && (
                <div>
                  <AjouterButton
                    onClick={() => navigate("/AjouterIntervention")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap space-y-4 p-4">
          <div className="flex justify-between items-center w-full">
            {currentView === "list" && (
              <div className="sm:py-0 w-full">
                <SelectionToolbarInter
                  selectedCount={selectedInterventionCount}
                  allSelected={allInterventionsSelected}
                  onSelectAll={handleSelectAllInterventions}
                  onDeselectAll={handleDeselectAllInterventions}
                  onActionClick={handleInterventionActionClick}
                  selectedInterventions={selectedInterventions} // You might need to adjust this based on your logic
                />
              </div>
            )}
          </div>

          {currentView === "list" ? (
            /* Vue liste */
            <div className="space-y-2 w-full">
              <InterventionListHeader />

              {interventions.map((intervention) => (
                <div key={intervention.id} className="relative">
                  <InterventionList
                    nom={intervention.title}
                    id={intervention.id}
                    urgence={intervention.urgence_display}
                    statut={intervention.statut_display}
                    moreClick={() => {
                      // Si vous souhaitez fermer le menu, vous pouvez aussi gérer cela
                      if (menuOpenId === intervention.id) {
                        setMenuData(null); // Fermer ou réinitialiser
                      } else {
                        setMenuOpenId(intervention.id); // Ouvrir le menu
                        setMenuData({
                          title: intervention.title,
                          urgence: intervention.urgence_display,
                          statut: intervention.statut_display,
                          equipement: intervention.equipement,
                          date: intervention.date_debut,
                          type: intervention.type_intervention,
                          id: intervention.id,
                        });
                      }
                    }}
                    checked={intervention.checked}
                    onToggle={() => handleInterventionToggle(intervention.id)}
                  />

                  {!loading && isAdmin && menuOpenId === intervention.id && (
                    <div className="menu-container">
                      <Options
                        options={getStatusOption(intervention.statut_display)}
                        handleSelect={(value) =>
                          handleOptionSelect(value, intervention.id)
                        }
                        className="absolute top-8 right-6 z-[9999] bg-white shadow-xl rounded-lg w-48 sm:w-56 border max-w-60"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-4 w-full">
              {displayedInterventions.map((intervention) => (
                <div key={intervention.id} className="relative">
                  <InterventionCard
                    id={intervention.id}
                    nom={intervention.title}
                    urgence={intervention.urgence_display}
                    statut={intervention.statut_display}
                    equipement={intervention.equipement}
                    date={new Date(intervention.date_debut).toLocaleDateString(
                      "fr-FR"
                    )}
                    onClick={() =>
                      navigate(`/DetailsIntervention/${intervention.id}`)
                    }
                    moreClick={() => {
                      // Si vous souhaitez fermer le menu, vous pouvez aussi gérer cela
                      if (menuOpenId === intervention.id) {
                        setMenuData(null); // Fermer ou réinitialiser
                      } else {
                        setMenuOpenId(intervention.id); // Ouvrir le menu
                        setMenuData({
                          title: intervention.title,
                          urgence: intervention.urgence_display,
                          statut: intervention.statut_display,
                          equipement: intervention.equipement,
                          date: intervention.date_debut,
                          type: intervention.type_intervention,
                          id: intervention.id,
                        });
                      }
                    }}
                  />

                  {!loading && isAdmin && menuOpenId === intervention.id && (
                    <div className="menu-container">
                      <Options
                        options={getStatusOption(intervention.statut_display)}
                        handleSelect={(value) =>
                          handleOptionSelect(value, intervention.id)
                        }
                        className="absolute top-8 right-6 z-[9999] bg-white shadow-xl rounded-lg w-48 sm:w-56 border max-w-60"
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

        {isSmall && (
          <div className="mt-4 flex justify-end pr-4">
            <AddMobile onClick={() => navigate("/AjouterUtilisateur")} />
          </div>
        )}

        {currentView === "grid" && visibleCount < interventions.length && (
          <h3
            className="mt-6 text-black font-semibold text-lg cursor-pointer hover:underline text-center"
            onClick={() => setVisibleCount(visibleCount + 60)}
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
            confirmColor="#dc2626" // Couleur rouge pour l'annulation
          />
        )}

        {isSuccessPopupVisible && (
          <PopupMessage
            title="Succès"
            message="L'intervention a été annulée avec succès!"
            onClose={() => setIsSuccessPopupVisible(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Intervention;

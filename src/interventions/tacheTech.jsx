import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/Searchbar";
import Header from "../components/Header";
import Options from "../components/options";
import InterventionCard from "../components/interventionCard.jsx";
import PopupChange from "../components/popupChange.jsx"; // casse correcte
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import Filtre from "../components/filtre";

import ViewToggle from "../components/viewToggle";
import InterventionList from "../components/interventionList";
import InterventionListHeader from "../components/interventionListHeader";
import SelectionToolbarInter from "../components/selectionToolBarInter";

const Mestaches = () => {
  const [interventions, setInterventions] = useState([]); // Stocke toutes les interventions
  const [displayedInterventions, setDisplayedInterventions] = useState([]); // Stocke les interventions affichées
  const [filter, setFilter] = useState("");

  const [visibleCount, setVisibleCount] = useState(9); // Nombre d'utilisateurs affichés
  const [selectedUser, setSelectedUser] = useState(null); // Utilisateur sélectionné pour modification
  const [showEditPopup, setShowEditPopup] = useState(false); // Affichage du pop-up
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedInterventionid, setSelectedInterventionid] = useState(null);

  const isSmall = useIsSmallScreen();

  const [loading, setLoading] = useState(true);

  const safeTrim = (val) => (typeof val === "string" ? val.trim() : "");
  const [isCancelPopupVisible, setIsCancelPopupVisible] = useState(false);

  const [statusList, setStatusList] = useState([]);
  const [equipementsList, setEquipementsList] = useState([]);
  const urgenceOptions = [
    { value: 0, label: "Urgence vitale" },
    { value: 1, label: "Urgence élevée" },
    { value: 2, label: "Urgence modérée" },
    { value: 3, label: "Faible urgence" },
  ];

  const [selectedStatus, setSelectedStatus] = useState("En cours");
  const [selectedEquipements, setSelectedEquipements] = useState([]);
  const [selectedUrgence, setSelectedUrgence] = useState([]);

  const handleChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const etatOptions = [
    { label: "En cours", value: "En cours" },
    { label: "Terminé", value: "Terminé" },
    { label: "Annulée", value: "Annulée" },
  ];

  const selectedInterventionCount = interventions.filter(
    (e) => e.checked
  ).length;
  const allInterventionsSelected =
    selectedInterventionCount === interventions.length &&
    interventions.length > 0;
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
      if (!intervention) return prev;

      // If equipment is being checked, add it to selectedEquipements
      if (!intervention.checked) {
        return [...prev, intervention];
      }
      // If equipment is being unchecked, remove it from selectedEquipements
      else {
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
    alert(
      `Action "${action}" sur ${selected.length} interventions(s)`,
      selected
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

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        let apiUrl = "http://127.0.0.1:8000/api/interventions/interventions";

        const accessToken = localStorage.getItem("access_token"); // Assuming token is stored in localStorage

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

        // Apply search filter (if needed)
        const filtered = data.filter((item) => {
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

          return (
            (titleMatch || equipementMatch || statutMatch || urgenceMatch) &&
            urgenceFilterMatch &&
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
    selectedEquipements,
    selectedStatus,
  ]);

  useEffect(() => {
    const fetchStatusList = async () => {
      try {
        const token = localStorage.getItem("access_token");
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

  const [menuOpenId, setMenuOpenId] = useState(null);
  const statusOptions = [
    { label: "Changer le statut", value: "changer le statut" },
  ];

  const handleOptionSelect = (value, id) => {
    setMenuOpenId(null); // close menu

    if (value === "changer le statut") {
      setSelectedInterventionid(id);
      setIsPopupVisible(true); // Assurez-vous que isPopupVisible est remis à true ici
    } else if (value === "cancel") {
      // Quand "Supprimer" est sélectionné
      setSelectedInterventionid(id); // Stocke l'ID de l'intervention à supprimer
      setIsCancelPopupVisible(true); // Affiche le popup de suppression
    }
  };

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

  const [MenuData, setMenuData] = useState(null);
  const updateStatus = async () => {
    let data;
    try {
      const token = localStorage.getItem("access_token"); // retrieve token
      let api_url = "";

      if (MenuData.type === "preventive") {
        api_url = `http://127.0.0.1:8000/api/interventions/interventions/preventive/update/${MenuData.id}/`;
      } else if (MenuData.type === "currative") {
        api_url = `http://127.0.0.1:8000/api/interventions/interventions/currative/update/${MenuData.id}/`;
      }

      if (api_url) {
        const response = await fetch(api_url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            statut: convertStatus(selectedStatus), // un int, par ex. 1, 2, 3...
          }),
        });
        if (!response.ok) throw new Error("Failed to fetch technicians");
        const responseData = await response.json();
        console.log(responseData);
        //setTechnicians(responseData);
        //const filtered = responseData.filter(tech => tech.disponibilite === true);
        //setAvailableTechnicians(filtered);
      }
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E]">
      {/* Logo en haut à gauche */}
      <Header />

      {/* En-tête */}
      <div className="w-full bg-[#20599E] text-white pb-16 text-center">
        <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Mes taches
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
              label={`Équipement`}
              options={equipementsList}
              onSelectFilter={handleEquipementFilter}
              titre="Filtrer par Équipement"
              isActive={!!selectedEquipements}
            />

            <Filtre
              label={`Urgence`}
              options={urgenceOptions}
              onSelectFilter={handleUrgenceFilter}
              titre="Filtrer par Urgence"
              isActive={!!selectedUrgence}
            />

            <Filtre
              label={`Status`}
              options={statusList}
              onSelectFilter={handleStatusFilter}
              titre="Filtrer par Status"
              isActive={!!selectedStatus}
            />
          </div>
        </div>
      </div>

      <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        <div className="relative w-full px-4 my-0">
          {/* Conteneur principal avec flex pour aligner les éléments */}
          <div className="flex justify-between items-center flex-wrap">
            {/* Message des résultats */}
            <div className="text-gray-600 font-semibold text-sm sm:text-base md:text-lg">
              {Math.min(visibleCount, interventions.length)} Résultats affichés
              sur {interventions.length}
            </div>

            <div className="flex space-x-2 mt-2 sm:mt-0">
              <div className="flex items-center">
                <ViewToggle onChange={(view) => setCurrentView(view)} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap space-y-4 p-4">
          <div className="flex justify-between items-center w-full">
            {currentView === "list" && (
              <div className="sm:py-2 w-full">
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

              {displayedInterventions.map((intervention) => (
                <div key={intervention.id} className="relative">
                  <InterventionList
                    nom={intervention.title}
                    equipement={intervention.equipement}
                    urgence={intervention.urgence_display}
                    statut={intervention.statut_display}
                    moreClick={() =>
                      setMenuOpenId(
                        menuOpenId === intervention.id ? null : intervention.id
                      )
                    }
                    checked={intervention.checked || false}
                    onToggle={() => handleInterventionToggle(intervention.id)}
                  />

                  {!loading && isAdmin && menuOpenId === intervention.id && (
                    <div className="absolute right-6 top-6 z-50">
                      <Options
                        options={getStatusOption(intervention.statut_display)}
                        handleSelect={(value) =>
                          handleOptionSelect(value, intervention.id)
                        }
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
                    date={new Date(
                      intervention.date_debut || "06/05/2025"
                    ).toLocaleDateString("fr-FR")}
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
                    <div className="absolute top-10 left-30 z-[9999]">
                      <Options
                        options={getStatusOption(intervention.statut_display)}
                        handleSelect={(value) =>
                          handleOptionSelect(value, intervention.id)
                        }
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

        {isSmall && (
          <div className="mt-4 flex justify-end pr-4">
            <AddMobile onClick={() => navigate("/AjouterUtilisateur")} />
          </div>
        )}

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
      </div>
    </div>
  );
};

export default Mestaches;

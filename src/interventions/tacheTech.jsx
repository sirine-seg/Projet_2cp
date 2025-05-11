import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/Searchbar";
import Header from "../components/Header";
import Options from "../components/options";
import InterventionCard from "../components/interventionCard.jsx";
import PopupChange from "../components/popupChange.jsx";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import Filtre from "../components/filtre";
import AddMobile from "../components/addMobile";

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

  const [openFilterId, setOpenFilterId] = useState(null);

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
        let apiUrl = "http://127.0.0.1:8000/api/interventions/interventions/tache/";

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
      // Find the intervention data by id
      const intervention = interventions.find(int => int.id === id);

      // Set the MenuData with the intervention details needed for the API call
      setMenuData({
        id: intervention.id,
        // Determine the type from the intervention object
        type: intervention.type_intervention || 'currative' // Default to currative if not specified
      });

      setSelectedInterventionid(id);
      setIsPopupVisible(true);
    } else if (value === "cancel") {
      // Quand "Supprimer" est sélectionné
      setSelectedInterventionid(id);
      setIsCancelPopupVisible(true);
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
    try {
      setLoading(true); // Add loading state
      const token = localStorage.getItem("access_token");
      let api_url = "";

      if (MenuData?.type === "preventive") {
        api_url = `http://127.0.0.1:8000/api/interventions/interventions/preventive/update/${MenuData.id}/`;
      } else if (MenuData?.type === "currative") {
        api_url = `http://127.0.0.1:8000/api/interventions/interventions/currative/update/${MenuData.id}/`;
      }

      if (api_url && MenuData) {
        console.log("Making API call to:", api_url);
        console.log("Sending data:", { statut: convertStatus(selectedStatus) });

        const response = await fetch(api_url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            statut: convertStatus(selectedStatus),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error:", errorData);
          throw new Error("Failed to update status");
        }

        const responseData = await response.json();
        console.log("Status updated successfully:", responseData);

        // Refresh the interventions list to show the updated status
        // You could either call fetchInterventions() again or update the local state:
        setInterventions(interventions.map(item =>
          item.id === MenuData.id
            ? { ...item, statut_display: selectedStatus }
            : item
        ));

        // Show success message
        alert("Statut mis à jour avec succès");
      } else {
        console.error("Missing MenuData or API URL for status update");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Erreur lors de la mise à jour du statut");
    } finally {
      setLoading(false);
      setIsPopupVisible(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] font-poppins">
      {/* Logo en haut à gauche */}
      <Header />

      {/* En-tête */}
      <div className="w-full bg-[#20599E] text-white pb-16 text-center">
        <h1 className="text-3xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-[#F4F4F4] mb-4 mt-2">
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
              id="equipement"
              label="Équipement"
              options={equipementsList}
              onSelectFilter={handleEquipementFilter}
              titre="Filtrer par Équipement"
              isOpen={openFilterId === "equipement"}
              setOpenFilterId={setOpenFilterId}
            />

            <Filtre
              id="urgence"
              label="Urgence"
              options={urgenceOptions}
              onSelectFilter={handleUrgenceFilter}
              titre="Filtrer par Urgence"
              isOpen={openFilterId === "urgence"}
              setOpenFilterId={setOpenFilterId}
            />

            <Filtre
              id="status"
              label="Status"
              options={statusList}
              onSelectFilter={handleStatusFilter}
              titre="Filtrer par Status"
              isOpen={openFilterId === "status"}
              setOpenFilterId={setOpenFilterId}
            />
          </div>
        </div>
      </div>

      <div className="w-full min-h-screen rounded-t-[35px] sm:rounded-t-[45px] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        <div className="relative w-full px-4 my-0">
          {/* Conteneur principal avec flex pour aligner les éléments */}
          <div className="flex justify-between items-center flex-wrap">
            {/* Message des résultats */}
            <div className="text-gray-600 font-semibold text-xs sm:text-sm md:text-base">
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

                  {menuOpenId === intervention.id && (
                    <div className="menu-container">
                      <Options
                        options={statusOptions}
                        handleSelect={(value) =>
                          handleOptionSelect(value, intervention.id)
                        }
                        className="absolute top-8 right-6 z-[9999] bg-white shadow-xl rounded-lg w-48 sm:w-56 border max-w-60"
                        setMenuOpen={setMenuOpenId}
                        isActive={!isPopupVisible} // Le menu est actif seulement si le PopupChange n'est pas visible
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
                      setMenuOpenId(
                        menuOpenId === intervention.id ? null : intervention.id
                      );
                    }}
                  />

                  {menuOpenId === intervention.id && (
                    <div className="menu-container">
                      <Options
                        options={statusOptions}
                        handleSelect={(value) =>
                          handleOptionSelect(value, intervention.id)
                        }
                        className="absolute top-8 right-6 z-[9999] bg-white shadow-xl rounded-lg w-48 sm:w-56 border max-w-60"
                        setMenuOpen={setMenuOpenId}
                        isActive={!isPopupVisible} // Le menu est actif seulement si le PopupChange n'est pas visible
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
      </div>
    </div>
  );
};

export default Mestaches;

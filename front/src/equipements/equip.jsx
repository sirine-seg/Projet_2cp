import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import Header from "../components/Header";
import SearchBar from "../components/Searchbar";
import Filtre from "../components/filtre";
import EquipCard from "../components/equipCard";
import AjouterButton from "../components/Ajouterbutton";
import AddMobile from "../components/addMobile";
import PopupChange from "../components/popupChange";

import useIsSmallScreen from "../hooks/useIsSmallScreen";
import exportToPDF from "../components/exportPdf";
import ViewToggle from "@/components/viewToggle";
import PopupMessage from "../components/Popupcheck";
import EquipList from "../components/equipList";
import EquipListHeader from "../components/equipListHeader";
import SelectionToolbar from "../components/selectionToolBar";

const EquipementsPage = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [displayedEquipements, setDisplayedEquipements] = useState([]);
  const [cachedEquipements, setCachedEquipements] = useState({});
  const [equipements, setEquipements] = useState([]);
  const [etats, setEtats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEquipement, setSelectedEquipement] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [localisations, setLocalisations] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredEquipements, setFilteredEquipements] = useState([]);
  
  const isSmall = useIsSmallScreen();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  
  // FIXED: Define filters with name-based keys for both UI and API
  const [filters, setFilters] = useState({
    'categorie__nom': "",
    'typee__nom': "",
    'localisation__nom': "",
    'etat__nom': "",
  });
  
  // Initialize currentView from localStorage or default to "grid"
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem("equipementsViewPreference");
    return savedView || "grid"; // Default to "grid" if no preference is saved
  });

  // Save view preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("equipementsViewPreference", currentView);
  }, [currentView]);

  // Function to handle view change
  const handleViewChange = (view) => {
    setCurrentView(view);
  };
  
  // Function to clear all filters
  const clearAllFilters = () => {
    setFilters({
      'categorie__nom': "",
      'typee__nom': "",
      'localisation__nom': "",
      'etat__nom': "",
    });
    setSelectedFilters([]);
    setSearchTerm("");
  };

  useEffect(() => {
    fetchEquipements();
  }, [searchTerm, visibleCount]);

  useEffect(() => {
    // Apply filters to the fetched equipment data
    const filteredData = equipements.filter(equip => {
      // FIXED: Compare using actual names instead of IDs 
      const matchesCategory = !filters['categorie__nom'] || equip.categorie_nom === filters['categorie__nom'];
      const matchesType = !filters['typee__nom'] || equip.typee_nom === filters['typee__nom'];
      const matchesLocation = !filters['localisation__nom'] || equip.localisation_nom === filters['localisation__nom'];
      const matchesStatus = !filters['etat__nom'] || equip.etat_nom === filters['etat__nom'];
      
      // Also filter by search term if it exists
      const matchesSearch = !searchTerm || 
        equip.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equip.code?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesType && matchesLocation && matchesStatus && matchesSearch;
    });
    
    // Update the displayed equipments with filtered results
    setDisplayedEquipements(filteredData.slice(0, visibleCount));
    setFilteredEquipements(filteredData);
  }, [equipements, filters, searchTerm, visibleCount]);

  async function fetchEquipements(search = searchTerm, currentFilters = filters) {
    // Create a cache key based on current search and filters
    const cacheKey = `${search}_${JSON.stringify(currentFilters)}_page_${Math.ceil(visibleCount / 6)}`;

    // Check if we already have this data cached
    if (cachedEquipements[cacheKey]) {
      console.log("Utilisation du cache pour :", cacheKey);
      setEquipements(cachedEquipements[cacheKey]);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      let url = "http://127.0.0.1:8000/api/equipements/equipement/?";
      const params = [];

      // Add search parameter if there's a search term
      if (search.trim() !== "") {
        params.push(`search=${encodeURIComponent(search.trim())}`);
      }

      // Add all active filters to the API request
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) {
          params.push(`${key}=${encodeURIComponent(value)}`);
        }
      });

      // Pagination parameters
      const limit = 30; // Increased limit to load more data at once
      const offset = 0; // Always get from the beginning when filters change
      
      params.push(`limit=${limit}`);
      params.push(`offset=${offset}`);

      // Construct the final URL
      if (params.length > 0) {
        url += params.join("&");
      }

      console.log("Fetching data with URL:", url);

      // Make the API request
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetch depuis le serveur pour :", cacheKey, data);
      
      // Save to cache and update state
      setCachedEquipements((prev) => ({ ...prev, [cacheKey]: data }));
      setEquipements(data);
      
      // Apply the filters immediately to the fetched data
      const filteredData = data.filter(equip => {
        // FIXED: Compare using names throughout
        const matchesCategory = !currentFilters['categorie__nom'] || equip.categorie_nom === currentFilters['categorie__nom'];
        const matchesType = !currentFilters['typee__nom'] || equip.typee_nom === currentFilters['typee__nom'];
        const matchesLocation = !currentFilters['localisation__nom'] || equip.localisation_nom === currentFilters['localisation__nom'];
        const matchesStatus = !currentFilters['etat__nom'] || equip.etat_nom === currentFilters['etat__nom'];
        
        const matchesSearch = !search || 
          equip.nom?.toLowerCase().includes(search.toLowerCase()) ||
          equip.code?.toLowerCase().includes(search.toLowerCase());
        
        return matchesCategory && matchesType && matchesLocation && matchesStatus && matchesSearch;
      });
      
      setDisplayedEquipements(filteredData.slice(0, visibleCount));
      setFilteredEquipements(filteredData);
    } catch (error) {
      console.error("Erreur lors de la récupération des équipements:", error);
    }
  }

  const [selectedEquipements, setSelectedEquipements] = useState([]);

  // Toggle sélection d'un équipement
  const handleEquipementToggle = (id) => {
    // Update checked status in equipements array
    setEquipements(equipements.map(equipement =>
      equipement.id_equipement === id 
        ? { ...equipement, checked: !equipement.checked } 
        : equipement
    ));
    
    // Update selectedEquipements array based on checked status
    setSelectedEquipements(prev => {
      const equipment = equipements.find(e => e.id_equipement === id);
      if (!equipment) return prev;
      
      // If equipment is being checked, add it to selectedEquipements
      if (!equipment.checked) {
        return [...prev, equipment];
      } 
      // If equipment is being unchecked, remove it from selectedEquipements
      else {
        return prev.filter(e => e.id_equipement !== id);
      }
    });
  };

  // Sélectionner tous les équipements
  const handleSelectAllEquipements = () => {
    // Update all equipements to checked
    setEquipements(equipements.map(equipement => ({
      ...equipement,
      checked: true
    })));
    
    // Update selectedEquipements to contain all equipements
    setSelectedEquipements([...equipements]);
  };

  // Désélectionner tous les équipements
  const handleDeselectAllEquipements = () => {
    // Update all equipements to unchecked
    setEquipements(equipements.map(equipement => ({
      ...equipement,
      checked: false
    })));
    
    // Clear selectedEquipements array
    setSelectedEquipements([]);
  };

  // Action groupée sur les équipements sélectionnés
  const handleEquipementActionClick = (action) => {
    const selected = equipements.filter(e => e.checked);
    console.log(`Action "${action}" sur ${selected.length} équipement(s)`, selected);
    // Implémentez ici la logique spécifique (suppression, export, etc.)
  };

  // Update selectedEquipements whenever checked status changes in equipements
  useEffect(() => {
    const selected = equipements.filter(e => e.checked);
    setSelectedEquipements(selected);
  }, [equipements]);

  const selectedEquipementCount = equipements.filter(e => e.checked).length;
  const allEquipementsSelected = selectedEquipementCount === equipements.length && equipements.length > 0;

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/equipements/etat/", {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((data) => {
      const etats = data.map((etat) => ({
        value: etat.id,
        label: etat.nom
      }));
      setEtats(etats);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des états:", error);
    });
  }, [token]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [typeRes, catRes, locRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/equipements/type/", { headers: { Authorization: `Token ${token}` } }),
          fetch("http://127.0.0.1:8000/api/equipements/categorie/", { headers: { Authorization: `Token ${token}` } }),
          fetch("http://127.0.0.1:8000/api/equipements/localisation/", { headers: { Authorization: `Token ${token}` } }),
        ]);

        const [typeData, catData, locData] = await Promise.all([
          typeRes.json(),
          catRes.json(),
          locRes.json(),
        ]);

        setTypes(typeData.map((t) => ({ value: t.id, label: t.nom })));
        setCategories(catData.map((c) => ({ value: c.id, label: c.nom })));
        setLocalisations(locData.map((l) => ({ value: l.id, label: l.nom })));
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchOptions();
  }, [token]);

  const handlePreviousEtat = async (id_equipement) => {
    const status = await previousEtat(id_equipement);
    setSelectedStatus(status);
  };
  
  useEffect(() => {
    if (selectedEquipement?.id_equipement) {
      handlePreviousEtat(selectedEquipement.id_equipement);
    }
  }, [selectedEquipement]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const updateEtat = async (equipementId, newEtat) => {
    if (!newEtat) {
      console.error("State is invalid:", newEtat);
      return;
    }
  
    try {
      console.log("Sending PATCH request for equipement:", equipementId, "with new state:", newEtat);
  
      const patchResponse = await fetch(`http://127.0.0.1:8000/api/equipements/equipement/${equipementId}/change-etat/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ etat: newEtat }),
      });
  
      if (!patchResponse.ok) {
        console.error("Failed to update state. Response status:", patchResponse.status);
        return;
      }
  
      const getResponse = await fetch(`http://127.0.0.1:8000/api/equipements/equipement/${equipementId}/`);
      const updatedEquipement = await getResponse.json();
  
      setEquipements(prevEquipements =>
        prevEquipements.map(equip =>
          equip.id_equipement === equipementId ? updatedEquipement : equip
        )
      );
  
      if (selectedEquipement?.id_equipement === equipementId) {
        setSelectedEquipement(updatedEquipement);
      }
      setIsPopupVisible(true);

    } catch (error) {
      console.error("Error occurred during API request:", error);
    }
  };

  const previousEtat = async (id_equipement, setEtat) => {
    if (!id_equipement) return;
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/equipements/equipement/${id_equipement}/`);
      const data = await response.json();
      if (response.ok) {
        setEtat(data.etat);
      } else {
        console.error("Erreur lors de la récupération de l'état.");
      }
    } catch (error) {
      console.error("Erreur réseau. Vérifiez votre connexion.");
    }
  };

  const handleEdit = (equipement) => {
    console.log("Redirection vers la page d'édition pour l'équipement ID:", equipement.id_equipement);
    navigate(`/edit/${equipement.id_equipement}`);
    setMenuOpen(null);
  };

  const handlesignale = (equipement) => {
    console.log("Redirection vers la page d'édition pour l'équipement ID:", equipement.id_equipement);
    navigate(`/signaler/${equipement.id_equipement}`);
    setMenuOpen(null);
  };

  const handlestatus = (equipement) => {
    console.log("Affichage du pop-up pour l'équipement ID:", equipement.id_equipement);
    setSelectedEquipement(equipement);
    setIsPopupOpen(true);
    setMenuOpen(null);
  };

  // FIXED: The handleFilterChange function now stores the label instead of the ID in filters
  const handleFilterChange = (filterName, selectedOption) => {
    // Reset visible count when applying a new filter to show first page
    setVisibleCount(6);

    let filterValue = "";
    let displayValue = "";

    if (selectedOption) {
      // FIXED: Use the label for both filtering and display
      filterValue = selectedOption.label;
      displayValue = selectedOption.label;
    }

    // Update the filters state with the selected value
    setFilters(prevFilters => {
      // If the value is the same as current, toggle it off (reset filter)
      if (prevFilters[filterName] === filterValue) {
        return {
          ...prevFilters,
          [filterName]: ""
        };
      }
      // Otherwise set the new filter value
      return {
        ...prevFilters,
        [filterName]: filterValue
      };
    });

    // Track which filters are currently active for display purposes
    if (displayValue) {
      const filterObj = { type: filterName, value: displayValue };
      setSelectedFilters(prev => [...prev.filter(f => f.type !== filterName), filterObj]);
    } else {
      setSelectedFilters(prev => prev.filter(f => f.type !== filterName));
    }

    // Force a re-fetch of equipment data when filters change
    fetchEquipements(searchTerm, {
      ...filters,
      [filterName]: filterValue // FIXED: Use the label for fetching too
    });
  };
    
  console.log("selected equipements:", selectedEquipements);
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md overflow-hidden">
      <Header />

      <div className="w-full bg-[#20599E] text-white py-16 text-center">
        <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Equipements
        </h1>

        <SearchBar
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Rechercher (nom, code inventaire...)"
        />
        <div className="mx-auto w-full max-w-4xl px-4 mt-4 -mt-8 flex justify-center">
          <div className="flex flex-nowrap space-x-2 overflow-x-auto no-scrollbar pb-2">
            <Filtre
              label={`Catégorie${filters['categorie__nom'] ? `: ${filters['categorie__nom']}` : ''}`}
              options={categories}
              onSelectFilter={(option) => handleFilterChange('categorie__nom', option)}
              titre="Filtrer par Catégorie"
              isActive={!!filters['categorie__nom']}
            />
            <Filtre
              label={`Type${filters['typee__nom'] ? `: ${filters['typee__nom']}` : ''}`}
              options={types}
              onSelectFilter={(option) => handleFilterChange('typee__nom', option)}
              titre="Filtrer par Type"
              isActive={!!filters['typee__nom']}
            />
            <Filtre
              label={`Localisation${filters['localisation__nom'] ? `: ${filters['localisation__nom']}` : ''}`}
              options={localisations}
              onSelectFilter={(option) => handleFilterChange('localisation__nom', option)}
              titre="Filtrer par Localisation"
              isActive={!!filters['localisation__nom']}
            />
            <Filtre
              label={`État${filters['etat__nom'] ? `: ${filters['etat__nom']}` : ''}`}
              options={etats}
              onSelectFilter={(option) => handleFilterChange('etat__nom', option)}
              titre="Filtrer par État"
              isActive={!!filters['etat__nom']}
            />
          </div>
        </div>
      </div>
      <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        {/* Résultats et bouton Ajouter */}
        <div className="relative w-full px-4 my-0">
          {/* Conteneur principal avec flex pour aligner les éléments */}
          <div className="flex justify-between items-center flex-wrap">
            {/* Message des résultats */}
            <div className="text-gray-600 font-semibold text-sm sm:text-base md:text-lg">
              {Math.min(visibleCount, filteredEquipements.length)} Résultats affichés sur {filteredEquipements.length}
            </div>
            <div className="flex space-x-3 mt-2 sm:mt-0">
              <div className="flex items-center">
                <ViewToggle onChange={handleViewChange} initialValue={currentView} />
              </div>
              {/* Bouton Ajouter */}
              {!isSmall && (
                <div>
                <AjouterButton onClick={() => navigate("/Ajout")} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap space-y-4 p-4">
          <div className="flex justify-between items-center w-full">
            {currentView === "list" && (
              <div className="sm:py-2 w-full">
                <SelectionToolbar
                  selectedCount={selectedEquipementCount}
                  allSelected={allEquipementsSelected}
                  onSelectAll={handleSelectAllEquipements}
                  onDeselectAll={handleDeselectAllEquipements}
                  onActionClick={handleEquipementActionClick}
                  selectedEquipments={selectedEquipements}
                />
              </div>
            )}
          </div>

          {/* ✅ Equipements */}
          {currentView === 'list' ? (
            /* Vue liste */
            <div className="w-full space-y-2">
              <EquipListHeader />
              
              {displayedEquipements.length > 0 ? (
                displayedEquipements.map((equipement) => (
                  <div key={equipement.id_equipement} className="relative">
                    <EquipList
                      nom={equipement.nom}
                      etat={equipement.etat_nom}
                      id={equipement.code}
                      localisation={equipement.localisation_nom}
                     
                      checked={equipement.checked}
                      onToggle={() => handleEquipementToggle(equipement.id_equipement)}
                      moreClick={() => {
                        setMenuOpen(equipement.id_equipement === menuOpen ? null : equipement.id_equipement);
                      }}
                    />

                    {menuOpen === equipement.id_equipement && (
                      <div
                        className="absolute top-10 right-2 bg-white shadow-lg rounded-md text-black w-64 z-50 menu-container"
                        onClick={(e) => e.stopPropagation()}
                        style={{ pointerEvents: "auto" }}
                      >
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                          onClick={() => handlesignale(equipement)}
                        >
                          Signaler un problème
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                          onClick={() => handlestatus(equipement)}
                        >
                          Changer le status
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                          onClick={() => handleEdit(equipement)}
                        >
                          Modifier
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                          onClick={() => navigate(`/equipements/${equipement.id_equipement}`)}
                        >
                          Details
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center w-full">Aucun équipement trouvé.</p>
              )}
            </div>
          ) : (
            /* Vue grille (votre code existant) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full">
              {displayedEquipements.length > 0 ? (
                displayedEquipements.map((equipement) => (
                  <div key={equipement.id_equipement} className="relative">
                    <EquipCard
                      nom={equipement.nom}
                      etat={equipement.etat_nom}
                      code={equipement.code}
                      localisation={equipement.localisation_nom}
                      onClick={() => navigate(`/equipements/${equipement.id_equipement}`)}
                      moreClick={() => {
                        setMenuOpen(equipement.id_equipement === menuOpen ? null : equipement.id_equipement);
                        console.log("Menu toggled for ID:", equipement.id_equipement);
                      }}
                    />
              
                    {/* Menu contextuel (si ouvert) */}
                    {menuOpen === equipement.id_equipement && (
                      <div
                        className="absolute top-10 right-2 bg-white shadow-lg rounded-md text-black w-64 z-50 menu-container"
                        onClick={(e) => e.stopPropagation()}
                        style={{ pointerEvents: "auto" }}
                      >
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                          onClick={() => handlesignale(equipement)}
                        >
                          Signaler un problème
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                          onClick={() => handlestatus(equipement)}
                        >
                          Changer le status
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                          onClick={() => handleEdit(equipement)}
                        >
                          Modifier
                        </button>
                       
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center w-full">Aucun équipement trouvé.</p>
              )}
            </div>
          )}
        </div>

        {isSmall && (
                    <div className="mt-4 flex justify-end pr-4">
                        <AddMobile onClick={() => navigate("/Ajout")} />
                    </div>
                )}
        <div className="w-full flex justify-center"> {/* Added flex and justify-center to the parent div */}
          {visibleCount < filteredEquipements.length && (
            <h3
              className="mt-6 text-black font-semibold text-lg cursor-pointer hover:underline text-center"
              onClick={() => setVisibleCount(visibleCount + 6)}
            >
              Afficher plus
            </h3>
          )}
        </div>

        {isPopupOpen && selectedEquipement && (
          <PopupChange
            title="Statut"
            etatOptions={etats}
            selectedStatus={selectedStatus}
            setSelectedStatus={(selected) => {
              setSelectedStatus(selected);
            }}
            update={() => {
              updateEtat(selectedEquipement.id_equipement, selectedStatus);
              setIsPopupOpen(false);
              setSelectedEquipement(null);
            }}
            onClose={() => {
              setIsPopupOpen(false);
              setSelectedEquipement(null);
            }}
          />
        )}

        {isPopupVisible && (
          <PopupMessage
            title="Etat changé avec succès !"
            onClose={() => setIsPopupVisible(false)}
          />)}
      </div>
    </div>
  );
};

export default EquipementsPage;
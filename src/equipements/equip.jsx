import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
//import logo from '../assets/logo.png';
import { LuBuilding2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
 import '../App.css';
 import Header from "../components/Header";
 import SearchBar from "../components/Searchbar"; 
//import Select from "react-select";
//import makeAnimated from "react-select/animated";
import { motion } from "framer-motion";
import Filterbutton from "../components/Filterbutton";
import AjouterButton from "../components/Ajouterbutton";
import Buttonrec from "../components/buttonrectangle";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import  EquipCard from "../components/equipCard";
import Popupdelete from "../components/Popupdelet";
import AddMobile  from "../components/addMobile";
import PopupChange from "../components/popupChange";
import Filtre from "../components/filtre";
import ViewToggle from "../components/viewToggle";
import EquipList from "../components/equipList";
import EquipListHeader from "../components/equipListHeader";
import SelectionToolbar from "../components/selectionToolBar";

const FilterSelect = ({ label, options, value, onChange }) => (
    <select
      className="w-full sm:w-1/4 px-4 py-2 rounded-md border border-gray-300 bg-[#F4F4F5]"
      value={value}
      onChange={onChange}
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
  

const EquipementsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState({ value: 'active', label: 'Active' });

    const [equipements, setEquipements] = useState([]);
    const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEquipement, setSelectedEquipement] = useState(null); 
    const [visibleCount, setVisibleCount] = useState(6);
    const [showEditPopup, setShowEditPopup] = useState(false); 
    const [filteredEquipements, setFilteredEquipements] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [statusOptions, setStatusOptions] = useState([]);
  
    const [menuOpen, setMenuOpen] = useState(null); 
    const [filter, setFilter] = useState(""); // ou "Catégorie", etc. selon ce que tu veux par défaut
const [activeDropdown, setActiveDropdown] = useState(null); // pour gérer l'ouverture des menus déroulants
const isSmall = useIsSmallScreen();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        categorie: "",
        type: "",
        localisation: "",
        etat: "",
    });
   
    

   
    const [options, setOptions] = useState({
        localisations: {},
        categories: {},
        types: {},
        etat: {},
      });


      // State et handlers pour la sélection des équipements
const [selectedEquipements, setSelectedEquipements] = useState([]);
const [currentView, setCurrentView] = useState("grid"); // "list" ou "grid"

// Toggle sélection d'un équipement
const handleEquipementToggle = (id) => {
  setEquipements(equipements.map(equipement =>
    equipement.id_equipement === id 
      ? { ...equipement, checked: !equipement.checked } 
      : equipement
  ));
};

// Sélectionner tous les équipements
const handleSelectAllEquipements = () => {
  setEquipements(equipements.map(equipement => ({
    ...equipement,
    checked: true
  })));
};

// Désélectionner tous les équipements
const handleDeselectAllEquipements = () => {
  setEquipements(equipements.map(equipement => ({
    ...equipement,
    checked: false
  })));
};

// Action groupée sur les équipements sélectionnés
const handleEquipementActionClick = (action) => {
  const selected = equipements.filter(e => e.checked);
  console.log(`Action "${action}" sur ${selected.length} équipement(s)`);
  // Implémentez ici la logique spécifique (suppression, export, etc.)
};

const selectedEquipementCount = equipements.filter(e => e.checked).length;
const allEquipementsSelected = selectedEquipementCount === equipements.length && equipements.length > 0;


    // ✅ Fetch Equipements (Runs when search or filters change)
    useEffect(() => {
       // const token = localStorage.getItem('authToken'); // 🔑 Get the token
        let url = "http://127.0.0.1:8000/equipements/equipements_list/?";
      
        // Add search term if present
        if (searchTerm) {
          url += `search=${searchTerm}&`;
        }
      
        // Add filters if any
        Object.keys(filters).forEach((key) => {
          if (filters[key]) {
            url += `${key}=${filters[key]}&`;
          }
        });
      
        // Make the authenticated fetch
        fetch(url, {
          method: 'GET',
        /*  headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }*/
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Filtered Equipments:", data);
            setEquipements(data);
          })
          .catch(error => {
            console.error("Error fetching data:", error);
          });
      }, [searchTerm, filters]);
      

      useEffect(() => {
        const filtered = equipements.filter(eq => {
          const matchesFilter = filter === "Tout" || eq.categorie === filter;
          const q = searchTerm.toLowerCase().trim();
          const name = (eq.nom || "").toLowerCase();
          const matchesSearch = q === "" || name.includes(q);
          return matchesFilter && matchesSearch;
        });
        setFilteredEquipements(filtered);
      }, [equipements, filter, searchTerm]);
      

    // ✅ Fetch Filter Options from Backend
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".menu-container")) {
                setMenuOpen(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);
    
     
    const closePopup = () => {
        setShowEditPopup(false);
        setSelectedEquipement(null);
    };


    const updateEtat = (equipementId, newEtat) => {
      if (!newEtat) {
          console.log("State is invalid:", newEtat);
          return;
      }
  
      console.log("Sending PATCH request for equipement:", equipementId, "with new state:", newEtat);
  
      fetch(`equipements/changerStatus/${equipementId}/`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ etat: newEtat }),
      })
      .then(response => {
          console.log("Response status:", response.status);
          if (!response.ok) {
              console.error("Failed to update state. Response status:", response.status);
              return;
          }
          // Check if the response is empty
          return response.text().then(text => {
              if (text) {
                  return JSON.parse(text);  // Manually parse the text if it's valid JSON
              }
              console.error("Response body is empty.");
              return null;
          });
      })
      .then(updatedEquipement => {
          if (updatedEquipement) {
              console.log("Updated equipement data:", updatedEquipement);
              setEquipements(prevEquipements =>
                  prevEquipements.map(equip =>
                      equip.id_equipement === equipementId ? { ...equip, etat: newEtat } : equip
                  )
              );
          }
      })
      .catch(error => {
          console.error("Error occurred during API request:", error);
      });
  };
  
    const handleEdit = (equipement) => {
        console.log("Redirection vers la page d'édition pour l'équipement ID:", equipement.id_equipement);
        
        // Navigate to the edit page with the equipment ID
        navigate(`/edit/${equipement.id_equipement}`);
    
        // Close the menu
        setMenuOpen(null);
    };

    const handleAdd = () => {
        console.log("Redirection vers la page d'ajout ");
        
        // Navigate to the edit page with the equipment ID
        navigate(`/ajouter`);
    
        // Close the menu
        setMenuOpen(null);
    };

    const handlesignale = (equipement) => {
        console.log("Redirection vers la page d'édition pour l'équipement ID:", equipement.id_equipement);
        
        // Navigate to the edit page with the equipment ID
        navigate(`/signaler/${equipement.id_equipement}`);
    
        // Close the menu
        setMenuOpen(null);
    };
    const handlestatus = (equipement) => {
        console.log("Affichage du pop-up pour l'équipement ID:", equipement.id_equipement);
        
        // Store selected equipment
        setSelectedEquipement(equipement);
    
        // Open the pop-up
        setIsPopupOpen(true);
    
        // Close the menu
        setMenuOpen(null);
    };
    


    const handleDelete = (equipementId) => {
        
    
            fetch(`http://localhost:8000/equipements/delete/${equipementId}/`, {
                method: "DELETE",
            })
            .then(async (response) => {
                console.log("Réponse complète:", response);
                const text = await response.text();
                console.log("Réponse du serveur:", text);
            
                if (response.ok) {
                    console.log("Suppression réussie pour l'équipement ID:", equipementId);
                    setEquipements(prevEquipements => 
                        prevEquipements.filter(equipement => equipement.id_equipement !== equipementId)
                    );
                } else {
                    console.error("Échec de la suppression", response.status);
                    alert("Échec de la suppression !");
                }
            })
            .catch(error => console.error("Erreur lors de la requête DELETE:", error));
            
        
    
        setMenuOpen(null);
    };
     /*
    useEffect(() => {
        fetch("http://localhost:8000/equipements/etatoptions/")
          .then((res) => res.json())
          .then((data) => {
            const options = data.map((etat) => ({
              value: etat.id,
              label: etat.nom
            }));
            setStatusOptions(options);
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des états:", error);
          });
      }, []);*/

      useEffect(() => {
        fetch("http://127.0.0.1:8000/equipements/equipementchoices/")  // ✅ update with your real endpoint
          .then((res) => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
          })
          .then((data) => {
            setOptions(data);
            console.log("Fetched choices:", data);
          })
          .catch((err) => {
            console.error("Error fetching choices:", err);
          });
      }, []);

      const etatOptions = Object.entries(options.etat).map(([value, label]) => ({
        value,
        label,
      }));

      const categorieOptions = options.categories
  ? Object.entries(options.categories).map(([value, label]) => ({
      value,
      label,
  }))
  : [];  // Fallback to an empty array if options.categories is undefined

const localisationOptions = options.localisations
  ? Object.entries(options.localisations).map(([value, label]) => ({
      value,
      label,
  }))
  : [];  // Fallback to an empty array if options.localisations is undefined

const typeOptions = options.types
  ? Object.entries(options.types).map(([value, label]) => ({
      value,
      label,
  }))
  : [];  // Fallback to an empty array if options.types is undefined

  const handleChangeStatus = (selectedOption) => {
    setSelectedStatus(selectedOption);
};

// Vérifier si selectedStatus est correctement défini
console.log("Selected status:", selectedStatus);

    
    return (
      <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md  overflow-hidden ">
             <Header />

             <div className="w-full bg-[#20599E] text-white pb-16 text-center">
                   
                    <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
                        Equipements
                    </h1>


                    <SearchBar
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Rechercher (nom, email, rôle...)"
          />
 <div className="mx-auto w-full max-w-4xl px-4 mt-4 -mt-8  flex justify-center">
        <div className="flex flex-nowrap space-x-2 overflow-x-auto no-scrollbar pb-2">
        <Filtre
    label={`Catégorie: ${filters.categorie }`}
    onClick={() => {
      // handle filter click (e.g. open a modal or dropdown to select value)
      console.log("Clicked Catégorie");
    }}
  />
  <Filtre
    label={`Type: ${filters.type}`}
    onClick={() => {
      console.log("Clicked Type");
    }}
  />
  <Filtre
    label={`Localisation: ${filters.localisation }`}
    onClick={() => {
      console.log("Clicked Localisation");
    }}
  />
  <Filtre
    label={`État: ${filters.etat }`}
    onClick={() => {
      console.log("Clicked État");
    }}
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
      {Math.min(visibleCount, equipements.length)} Résultats affichés sur { equipements.length}
    </div>
    <div className="flex space-x-2 mt-2 sm:mt-0">
      <div className="h-9 flex items-center">
        <ViewToggle onChange={(view) => setCurrentView(view)} />
      </div>

      {/* Bouton Ajouter */}
      {!isSmall && (
        
        <div >         
        <AjouterButton onClick={() => navigate("/Ajout")} />
        </div>
      )}
      {/* Le contenu principal ici */}

      {/* Bouton mobile affiché uniquement sur petits écrans */}
     
   

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
   />
 </div>
 )}
 </div>

                {/* ✅ Equipements */}
                {currentView === 'list' ? (
    /* Vue liste */
    <div className="w-full space-y-2">
      <EquipListHeader />
      
      {equipements.length > 0 ? (
        equipements.map((equipement) => (
          <div key={equipement.id_equipement} className="relative">
            <EquipList
              nom={equipement.nom}
              etat={equipement.statut_label}
              id={equipement.id_equipement}
              localisation={equipement.localisation}
              onClick={() => navigate(`/equipements/${equipement.id_equipement}`)}
              checked={equipement.checked}
              onToggle={() => handleEquipementToggle(equipement.id_equipement)}
              moreClick={() => {
                setMenuOpen(equipement.id_equipement === menuOpen ? null : equipement.id_equipement);
              }}
            />

{menuOpen === equipement.id_equipement && (
          <div
            className="absolute top-10 right-2 bg-white shadow-lg rounded-md text-black w-64 z-50"
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
              className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                console.log("🟢 Click event triggered on button!");
                console.log("Bouton supprimer cliqué pour l'équipement ID:", equipement.id_equipement);
                handleDelete(equipement.id_equipement);
              }}
            >
              Supprimer
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
      {equipements.length > 0 ? (
        equipements.map((equipement) => (
          <div key={equipement.id_equipement} className="relative">
            <EquipCard
              nom={equipement.nom}
              etat={equipement.statut_label}
              id={equipement.id_equipement}
              localisation={equipement.localisation}
              onClick={() => navigate(`/equipements/${equipement.id_equipement}`)}
              moreClick={() => {
                setMenuOpen(equipement.id_equipement === menuOpen ? null : equipement.id_equipement);
              }}
            />

          {menuOpen === equipement.id_equipement && (
          <div
            className="absolute top-10 right-2 bg-white shadow-lg rounded-md text-black w-64 z-50"
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
              className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                console.log("🟢 Click event triggered on button!");
                console.log("Bouton supprimer cliqué pour l'équipement ID:", equipement.id_equipement);
                handleDelete(equipement.id_equipement);
              }}
            >
              Supprimer
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

{visibleCount < equipements.length && (
                        <h3
                            className="mt-6 text-black font-semibold text-lg cursor-pointer hover:underline text-center"
                            onClick={() => setVisibleCount(visibleCount + 4)}
                        >
                            Afficher plus 
                        </h3>
                    )}
</div>


{isPopupOpen && selectedEquipement && (
  <PopupChange
    title="Statut"
    etatOptions={etatOptions}
    setSelectedStatus={(selected) => setSelectedStatus(selected)}
    update={() => {
      updateEtat(selectedEquipement.id_equipement, selectedStatus.value);
      setIsPopupOpen(false);
      setSelectedEquipement(null);
    }}
    onClose={() => {
      setIsPopupOpen(false);
      setSelectedEquipement(null);
    }}
  />
)}

<Popupdelete
  isVisible={isDeletePopupVisible}
  onClose={() => setIsDeletePopupVisible(false)}
  onConfirm={() => {
    handleDelete(selectedEquipement);
    setIsDeletePopupVisible(false);
  }}
  equipementId={selectedEquipement}
  title="Êtes-vous sûr de vouloir supprimer cet équipement ?"
  message=""
/>

            </div>
            
        
    );
};

export default EquipementsPage;

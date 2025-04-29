import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import logo from '../assets/logo.png';
import { LuBuilding2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
 import '../App.css';
 import Header from "../components/Header";
 import SearchBar from "../components/Searchbar"; 
import Select from "react-select";
import makeAnimated from "react-select/animated";
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

  const [displayedEquipements, setDisplayedEquipements] = useState([]);
  const [cachedEquipements, setCachedEquipements] = useState({});
    const [equipements, setEquipements] = useState([]);
    const [etats, setEtats] = useState([]);
    const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEquipement, setSelectedEquipement] = useState(null); 
    const [visibleCount, setVisibleCount] = useState(6);
    const [showEditPopup, setShowEditPopup] = useState(false); 
    const [filteredEquipements, setFilteredEquipements] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [statusOptions, setStatusOptions] = useState([]);
    const token = localStorage.getItem("access_token");
    const [etat, setEtat] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);

  
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


      useEffect(() => {
        fetchEquipements();
      }, [searchTerm, filters, visibleCount]);
      
      async function fetchEquipements() {
        const cacheKey = `${searchTerm}_${JSON.stringify(filters)}`;
      
        if (cachedEquipements[cacheKey]) {
          console.log("Utilisation du cache pour :", cacheKey);
          const cached = cachedEquipements[cacheKey];
          setEquipements(cached);
          setDisplayedEquipements(cached.slice(0, visibleCount));
          return;
        }
      
        try {
          const token = localStorage.getItem("authToken");
          let url = "http://127.0.0.1:8000/api/equipements/equipement/?";
      
          const params = [];
      
          if (searchTerm.trim() !== "") {
            params.push(`search=${encodeURIComponent(searchTerm.trim())}`);
          }
      
          Object.entries(filters).forEach(([key, value]) => {
            if (value) {
              params.push(`${key}=${encodeURIComponent(value)}`);
            }
          });
      
          if (params.length > 0) {
            url += params.join("&");
          }
      
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
          console.log("Fetch depuis le serveur pour :", cacheKey);
      
          setCachedEquipements((prev) => ({ ...prev, [cacheKey]: data }));
          setEquipements(data);
          setDisplayedEquipements(data.slice(0, visibleCount));
        } catch (error) {
          console.error("Erreur lors de la récupération des équipements:", error);
        }
      }

    
      

      /*
      useEffect(() => {
        const fetchEquipements = async () => {
          try {
            
            let url = "http://127.0.0.1:8000/api/equipements/equipement/?";
      
            const params = [];
      
            if (searchTerm.trim() !== "") {
              params.push(`search=${encodeURIComponent(searchTerm.trim())}`);
            }
      
            Object.entries(filters).forEach(([key, value]) => {
              if (value) {
                params.push(`${key}=${encodeURIComponent(value)}`);
              }
            });
      
            if (params.length > 0) {
              url += params.join("&");
            }
      
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
      
            const searchTermLower = searchTerm.toLowerCase();
            const filtered = data.filter((item) => {
              const nomMatch = item.nom?.toLowerCase().includes(searchTermLower);
              const refMatch = item.reference?.toLowerCase().includes(searchTermLower);
              const typeMatch = item.type?.toLowerCase().includes(searchTermLower);
              const statusMatch = item.statut?.toLowerCase().includes(searchTermLower);
      
              return nomMatch || refMatch || typeMatch || statusMatch;
            });
      
            setEquipements(filtered);
            setFilteredEquipements(filtered.slice(0, visibleCount));
          } catch (error) {
            console.error("Erreur lors de la récupération des équipements:", error);
          }
        };
      
        fetchEquipements();
      }, [searchTerm, filters, visibleCount]); */
      useEffect(() => {
        fetch("http://127.0.0.1:8000/api/equipements/etat/",
          {
          
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
            console.log("etats:",etats);
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des états:", error);
          });
      }, []);

      const etatOptions = Object.entries(etats).map(([value, label]) => ({
        value,
        label,
      }));




      const handlePreviousEtat = async (id_equipement) => {
        const status = await previousEtat(id_equipement);
        setSelectedStatus(status);  // Set the status once fetched
      };
      
      useEffect(() => {
        if (selectedEquipement?.id_equipement) {
          handlePreviousEtat(selectedEquipement.id_equipement);  // Fetch and set status when selectedEquipement changes
        }
      }, [selectedEquipement]);






      
      useEffect(() => {
        const filtered = equipements.filter(eq => {
          const q = searchTerm.toLowerCase().trim();
          const name = (eq.nom || "").toLowerCase();
          const matchesSearch = q === "" || name.includes(q);
      
          const matchesCategorie = !filters.categorie || eq.categorie === filters.categorie;
          const matchesType = !filters.type || eq.type === filters.type;
          const matchesLocalisation = !filters.localisation || eq.localisation === filters.localisation;
          const matchesEtat = !filters.etat || eq.etat === filters.etat;
      
          return matchesSearch && matchesCategorie && matchesType && matchesLocalisation && matchesEtat;
        });
        setFilteredEquipements(filtered);
      }, [equipements, searchTerm, filters]);
      
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
    
        // 🔄 Fetch the updated equipment with fresh data including etat_nom
        const getResponse = await fetch(`http://127.0.0.1:8000/api/equipements/equipement/${equipementId}/`);
        const updatedEquipement = await getResponse.json();
    
        // ✅ Update in state
        setEquipements(prevEquipements =>
          prevEquipements.map(equip =>
            equip.id_equipement === equipementId ? updatedEquipement : equip
          )
        );
    
        // ✅ Update selectedEquipement if it's the same one
        if (selectedEquipement?.id_equipement === equipementId) {
          setSelectedEquipement(updatedEquipement);
        }
    
      } catch (error) {
        console.error("Error occurred during API request:", error);
      }
    };
    
  /* 
  const updateEtat = (equipementId, newEtat) => {
    const formData = new FormData();
    formData.append("etat", newEtat);
   
  
    fetch(`http://127.0.0.1:8000/api/equipements/equipement/${equipementId}/update/`, {
      method: "PATCH",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          // Server returned an error, let's read it as text
          return response.text().then(text => {
            throw new Error(`Server Error: ${response.status} - ${text}`);
          });
        }
        return response.json(); // only try to parse JSON if OK
      })
      .then(() => {
        alert("Équipement mis à jour !");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour :", error);
        alert("Échec de la mise à jour !");
      });
  };*/

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
     
   

    /*  useEffect(() => {
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
      }, []);*/

     
/*
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
*/
  const handleChangeStatus = (selectedOption) => {
    setSelectedStatus(selectedOption);
};

// Vérifier si selectedStatus est correctement défini

useEffect(() => {
  console.log("Selected status changed:", selectedStatus);
}, [selectedStatus]);


    
    return (
      <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md  overflow-hidden ">
             <Header />

             <div className="w-full bg-[#20599E] text-white py-16 text-center">
                   
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

                {/* ✅ Equipements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-4">
  {equipements.length > 0 ? (
    displayedEquipements.map((equipement) => (
      <div key={equipement.id_equipement} className="relative">
        <EquipCard
          nom={equipement.nom}
          etat={
            equipement.etat_nom
          }
          
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
  
  

{visibleCount < equipements.length && (
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
    selectedStatus= {selectedStatus}
    setSelectedStatus={(selected) => {
      console.log("Selected status:", selected);
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
            
            

        </div>

        
    );
};

export default EquipementsPage;

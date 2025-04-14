import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import logo from './assets/logo.png';
import { LuBuilding2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import './App.css'
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { motion } from "framer-motion";

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
    
    const [equipements, setEquipements] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEquipement, setSelectedEquipement] = useState(null); 
    const [showEditPopup, setShowEditPopup] = useState(false); 
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [statusOptions, setStatusOptions] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null); 
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        categorie: "",
        type: "",
        localisation: "",
        etat: "",
    });
    const etatColors = {
        "EN SERVICE": "bg-[#49A146]",
        "EN MAINTENANCE": "bg-[#F09C0A]",
        "EN PANNE": "bg-[#FF4423]"
    };
    

   
    const [options, setOptions] = useState({
        localisations: {},
        categories: {},
        types: {},
        etat: {},
      });


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
        fetch(`equipements/ changerStatus/${equipementId}/`, {
            method: "PATCH", // Using PATCH to update only the 'etat' field
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ etat: newEtat }),
        })
        .then(response => response.json())
        .then(updatedEquipement => {
            console.log("Équipement mis à jour:", updatedEquipement);
            setEquipements(prevEquipements =>
                prevEquipements.map(equip =>
                    equip.id_equipement === equipementId ? { ...equip, etat: newEtat } : equip
                )
            );
            setIsPopupOpen(false); // Close the popup after updating
        })
        .catch(error => console.error("Erreur lors de la mise à jour:", error));
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
        if (window.confirm("Voulez-vous vraiment supprimer cet équipement ?")) {
            console.log("L'utilisateur a confirmé la suppression");
    
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
            
        } else {
            console.log("L'utilisateur a annulé la suppression");
        }
    
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
        fetch("https://127.0.0.1:8000/equipements/equipementchoices/")  // ✅ update with your real endpoint
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

      const localisationOptions = Object.entries(options.localisations).map(([value, label]) => ({
        value,
        label,
      }));

      const categorieOptions = Object.entries(options.categories).map(([value, label]) => ({
        value,
        label,
      }));

      const typeOptions = Object.entries(options.types).map(([value, label]) => ({
        value,
        label,
      }));
      
    
    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md">
            {/* ✅ Logo */}
            <img src={logo} alt="Logo" className="absolute top-4 left-4 w-12 sm:w-16 md:w-20 lg:w-24 h-auto" />

            {/* ✅ Header */}
            <div className="w-full bg-[#20599E] text-white py-20 sm:py-24 text-center">
                <h1 className="text-4xl font-bold text-[#F4F4F5] mb-10">Equipements</h1>
            </div>

            <div className="w-full max-w-7xl bg-[#F4F4F5] min-h-screen rounded-t-[80px] px-6 py-8 shadow-md flex flex-col">
                {/* ✅ Search Bar */}
                <div className="relative w-full max-w-md my-3 -mt-35 mx-auto">
                    <div className="relative">
                        <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#20599E]" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full text-black px-4 py-2 pl-10 rounded-full border border-[#20599E] bg-[#F4F4F5] shadow-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}

                        />
                    </div>
                </div>

                {/* ✅ Filter Dropdowns */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-xl w-full px-4 py-1 text-sm sm:text-base h-8 sm:h-10 mx-auto items-center justify-center ">
                    <FilterSelect
                        label="Catégorie"
                        options={categorieOptions}
                        //value={filters.categorie}
                        onChange={(selected) => {
                            if (selected) {
                              updateEtat(selectedEquipement.id_equipement, selected.value);
                            }
                          }}
                    />
                    
                    <FilterSelect
                        label="Type"
                        options={typeOptions}
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    />
                    <FilterSelect
                        label="Localisation"
                        options={ localisationOptions}
                        value={filters.localisation}
                        onChange={(e) => setFilters({ ...filters, localisation: e.target.value })}
                    />
                    <FilterSelect
                        label="État"
                        options={etatOptions}
                        value={filters.etat}
                        onChange={(e) => setFilters({ ...filters, etat: e.target.value })}
                    />
                </div>

                {/* ✅ Results & Add Button */}
                <div className="w-full px-4 my-10 flex justify-between">
                    <div className="text-[#4B5563] font-semibold">
                        {equipements.length} Résultats Trouvés
                    </div>
                    <button className="bg-[#20599E] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#1D4ED8]" onClick={() => handleAdd()}>
                        + Ajouter
                    </button>
                </div>

                {/* ✅ Equipements Grid */}
   {/* ✅ Equipements Grid */}
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl px-4 min-h-[200px]">
                    {equipements.length > 0 ? (
                        equipements.map((equipement) => (
                            <div key={equipement.id_equipement} className="relative p-5 bg-white rounded-lg shadow-md"  onClick={() => navigate(`/equipements/${equipement.id_equipement}`)}>
                                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                                    <div className="flex space-x-2">
                                        {equipement.etat && (
                                            <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${etatColors[equipement.statut_label] || "bg-gray-500"}`}>
                                                {equipement.statut_label}
                                            </span>
                                        )}
                                        {equipement.id_equipement && (
                                            <span className="px-3 py-1 text-xs font-bold text-white bg-[#9AA0A6] rounded-full">
                                                #{equipement.id_equipement}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        className={`px-2 py-1 rounded-md transition-colors ${menuOpen === equipement.id_equipement ? "bg-gray-300" : "bg-transparent"}`}
                                        onClick={(e) => {setMenuOpen(menuOpen === equipement.id_equipement ? null : equipement.id_equipement);
                                            e.stopPropagation();
                                            console.log("Menu toggled for ID:", equipement.id_equipement);}
                                        }
                                        
                                    >
                                        ⋮
                                    </button>
                                </div>
                                
                                {menuOpen === equipement.id_equipement && (
                                    
                                    <div className="absolute top-10 right-2 bg-white shadow-lg rounded-md text-black w-64 z-50" onClick={(e) => e.stopPropagation()} style={{ pointerEvents: "auto" }}>
                                        
                                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-200" onClick={() => {handlesignale(equipement);
                                             }
                                        }>Signaler un probléme</button>
                                         <button className="block w-full text-left px-4 py-2 hover:bg-gray-200" onClick={() => {handlestatus(equipement);
                                            }
                                        }>Changer le status</button>
                                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-200" onClick={() => {handleEdit(equipement);
                                             }
                                        }>Modifier</button>
   <button
    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
    onClick={(e) => {
        e.stopPropagation(); // Prevents closing immediately
        console.log("🟢 Click event triggered on button!");
        console.log("Bouton supprimer cliqué pour l'équipement ID:", equipement.id_equipement);
        handleDelete(equipement.id_equipement);

    }}
>
    Supprimer
</button>

 
                                    
                                    </div>)}
                                

                                <h2 className="text-xl font-bold text-[#20599E] py-8">{equipement.nom}</h2>
                                <div className="flex flex-row pl-4 mt-1">
                <LuBuilding2 className="h-5  w-5 text-[#20599E] mr-2"/>
                <p className="text-black text-sm flex items-center mt-1">{equipement.localisation}</p>
                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center w-full">Aucun équipement trouvé.</p>
                    )}
                </div>
                {isPopupOpen && selectedEquipement && (
  <div className="fixed inset-0 flex justify-center items-center  z-[9999]">
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
  >
    <h2 className="text-lg font-semibold text-gray-700 mb-4">Statut</h2>

    <Select
      
      isClearable
      isSearchable
      placeholder="Sélectionnez ou écrivez une urgence"
     options={etatOptions}
    
      
      onChange={(selected) => {
        console.log("Selected:", selected);
        setSelectedStatus(selected);
        
      }}
      lassName="w-full px-4 py-2 bg-white border border-gray-300 rounded-md"
      components={makeAnimated ? makeAnimated() : undefined}
      styles={{
        control: (base) => ({
          ...base,
          padding: "6px",
          borderRadius: "8px",
          borderColor: "#ccc",
          backgroundColor: "white",
        }),
      }}
    />

    {/* Buttons Row */}
    <div className="flex justify-between mt-4">
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded-md"
        onClick={() => {
          console.log("Fermeture du popup !");
          setIsPopupOpen(false)
          setSelectedEquipement(null);
        }}
      >
        Annuler
      </button>
      <button
        className="bg-[#20599E] text-white px-4 py-2 rounded-md"
        onClick={() => updateEtat()}
      >
        Terminer
      </button>
    </div>
  </motion.div>
</div>

  
)}

            </div>
            

        </div>

        
    );
};

export default EquipementsPage;

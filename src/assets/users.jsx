import { useState, useEffect } from "react";

import { useNavigate , useLocation } from "react-router-dom";
import SearchBar from "../components/Searchbar"; 
import Filterbutton from "../components/Filterbutton"; 
import Header from "../components/Header";
import AjouterButton from "../components/Ajouterbutton";
import Buttonrec from "../components/buttonrectangle";
import Usercard from "../components/Usercard";
import Badge from "../components/badge";
import Popupdelete from "../components/Popupdelet";
import "../App.css";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import AddMobile from "../components/addMobile";
import PopupMessage from "../components/Popupcheck";
import Filtre from "../components/filtrefleche";
import SelectionToolbar from "../components/selectionToolBar";
import UserList from "../components/userList";
import ViewToggle from "../components/viewToggle";
import UserListHeader from "../components/userListHeader"
import exportUsersToPDF from "../components/exportPdfuser";


const VIEW_STORAGE_KEY = "usersPageView"; // Key for localStorage
const UsersPage = () => {
    const [users, setUsers] = useState([]);  // Stocke tous les utilisateurs
    const [displayedUsers, setDisplayedUsers] = useState([]); // Stocke les utilisateurs affichés
    const [filter, setFilter] = useState("Tout");  // setFilter(newValue) → C'est la fonction qui met à jour filter avec newValue. et on a fait tout car "Tout" est la valeur initiale de filter.
    const [visibleCount, setVisibleCount] = useState(6);// Nombre d'utilisateurs affichés
    const [selectedUser, setSelectedUser] = useState(null);// Utilisateur sélectionné pour modification
    const [showEditPopup, setShowEditPopup] = useState(false); // Affichage du pop-up
    const [menuOpen, setMenuOpen] = useState(null);   //  gérer l'ouverture et la fermeture d'un menu.
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState({});
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const isSmall = useIsSmallScreen();
    const [selectedPostes, setSelectedPostes] = useState([]);
    const technicianRoles = ["Plombier", "Électricien", "Informaticien", "Femme de ménage"];
    const roles = ["Tout", "Administrateur", "Technicien", "Personnel"];
    const [cachedUsers, setCachedUsers] = useState({});
    const [isUnblockPopupVisible, setIsUnblockPopupVisible] = useState(false);
    const [isBlockPopupVisible, setIsBlockPopupVisible] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [postesList, setPostesList] = useState([]);
    const [selectedPoste, setSelectedPoste] = useState("");
    const [isPopupVisiblebloque, setisPopupVisiblebloque] = useState(false);
    const [selected, setSelected] = useState(false);
    const [techniciens, setTechniciens] = useState([]);
    const location = useLocation();
    const [filteredTechniciens, setFilteredTechniciens] = useState([]);
    const [currentView, setCurrentView] = useState(() => {
    const storedView = localStorage.getItem(VIEW_STORAGE_KEY);
      return storedView || "grid"; // Default to "grid" if nothing is stored
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [returnToList, setReturnToList] = useState(false);
 // Récupérer l'état de retour à la liste depuis l'historique de navigation
 useEffect(() => {
  if (location.state?.fromDetails && currentView === "list") {
      setReturnToList(true);
  } else {
      setReturnToList(false);
  }
}, [location, currentView]);

// Sauvegarder la préférence de vue dans le localStorage
useEffect(() => {
  localStorage.setItem(VIEW_STORAGE_KEY, currentView);
}, [currentView]);

// List view



useEffect(() => {
  const selected = users.filter(u => u.checked);
  setSelectedUsers(selected);
}, [users]);



const handleUserToggle = (id) => {
  setUsers(users.map(user =>
    user.id === id ? { ...user, checked: !user.checked } : user
  ));
};

const handleSelectAllUsers = () => {
  setUsers(users.map(user => ({ ...user, checked: true })));
};

const handleDeselectAllUsers = () => {
  setUsers(users.map(user => ({ ...user, checked: false })));
};



// 5. Action sur les utilisateurs sélectionnés
const handleUserActionClick = () => {
  const selected = users.filter(u => u.checked);
  alert(`Action sur ${selected.length} utilisateur(s)`);
};

const handleExportPDF = () => {
  console.log("Exporting users to PDF...", selectedUsers);
  exportUsersToPDF(selectedUsers);
};


const selectedUserCount = users.filter(u => u.checked).length;
const allUsersSelected = selectedUserCount === users.length && users.length > 0;

    // Récupération des postes à partir de l'API
    useEffect(() => {
        const fetchPostes = async () => {
            try {
              const response = await fetch('http://127.0.0.1:8000/api/accounts/postes/', {
                method: "GET",
                headers: {
                 // Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
            });
                if (!response.ok) throw new Error("Erreur lors du chargement des postes");
                const data = await response.json();
                setPostesList(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des postes :", error);
            }
        };
    
        fetchPostes();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [filter, searchTerm, visibleCount, selectedPostes]);

    async function fetchUsers() {
        const cacheKey = `${filter}_${searchTerm}_${JSON.stringify(selectedPostes)}`;

        if (cachedUsers[cacheKey]) {
            console.log("Utilisation du cache pour :", cacheKey);
            const cachedData = cachedUsers[cacheKey];
            setUsers(cachedData);
            setDisplayedUsers(cachedData.slice(0, visibleCount));
            return;
        }

        try {
            let url = "http://127.0.0.1:8000/api/accounts/users/?";
            const params = [];

            if (filter && filter !== "Tout") {
                params.push(`role=${filter}`);
            }
            
            if (searchTerm.trim() !== "") {
                params.push(`search=${encodeURIComponent(searchTerm.trim())}`);
            }
            
            // Ajout du filtre par poste si des postes sont sélectionnés
            if (filter === "Technicien" && selectedPostes.length > 0) {
                // Utiliser poste comme paramètre unique avec les IDs séparés par des virgules
                const posteIds = selectedPostes.map(poste => poste.id).join(',');
                params.push(`poste=${posteIds}`);
            }

            if (params.length > 0) {
                url += params.join('&');
            }

            console.log("Fetching URL:", url);
            const response = await fetch(url, {
              method: "GET",
              headers: {
               // Authorization: `Token ${token}`,
                  "Content-Type": "application/json",
              },
          });
          
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP! statut: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetch depuis le serveur pour :", cacheKey);
            console.log("Données reçues:", data);

            // Met à jour le cache
            setCachedUsers(prev => ({ ...prev, [cacheKey]: data }));

            setUsers(data);
            setDisplayedUsers(data.slice(0, visibleCount));
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs:", error);
        }
    }

    // Fonction pour gérer la sélection des postes dans le composant Filtre
    const handlePosteFilterSelect = (selectedPosteObjects) => {
        console.log("Postes sélectionnés:", selectedPosteObjects);
        setSelectedPostes(selectedPosteObjects);
    };

    const handleEdit = (user) => {
        navigate(`/Modifie/${user.id}`);
    };
    
    const roleColors = {
        "Technicien": "#F09C0A ",
        "Administrateur": "#20599E",
        "Personnel": "#6B7280",
    };
    
    const closePopup = () => {
        setShowEditPopup(false);
        setSelectedUser(null);
    };

    const handleBloquer = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/accounts/user/${selectedUserId}/block/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        
            if (response.ok) {
                console.log('Utilisateur bloqué avec succès');
                // Mettre à jour l'état local (isBlocked) de l'utilisateur
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === selectedUserId ? { ...user, is_blocked: true } : user
                    )
                );

                setDisplayedUsers((prevDisplayedUsers) =>
                    prevDisplayedUsers.map((user) =>
                    user.id === selectedUserId ? { ...user, is_blocked: true } : user
                    )
                );
                setIsPopupVisible(false); 
                setTimeout(() => {
                    setIsPopupVisible(true); 
                }, 10);
            } else {
                console.error('Erreur lors du blocage de l\'utilisateur');
            }
        } catch (error) {
            console.error('Erreur réseau :', error);
        } finally {
            setIsBlockPopupVisible(false); // Fermer le popup même si ça échoue
        }
    };

    const handleDeBloquer = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/accounts/users/${selectedUserId}/unblock/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        
            if (response.ok) {
                console.log('Utilisateur débloqué avec succès');
                // Mettre à jour l'état local (isBlocked) de l'utilisateur
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                    user.id === selectedUserId ? { ...user, is_blocked: false } : user
                    )
                );

                setDisplayedUsers((prevDisplayedUsers) =>
                    prevDisplayedUsers.map((user) =>
                    user.id === selectedUserId ? { ...user, is_blocked: false } : user
                    )
                );
                setisPopupVisiblebloque(false);
                setTimeout(() => {
                    setisPopupVisiblebloque(true);
                }, 10);
            } else {
                console.error('Erreur lors du déblocage de l\'utilisateur');
            }
        } catch (error) {
            console.error('Erreur réseau :', error);
        } finally {
            setIsUnblockPopupVisible(false); // Fermer le popup même si ça échoue
        }
    };

    const handlePosteSelect = (option) => {
        console.log("Poste sélectionné:", option);
        setSelectedPoste(option);
    };

    const handleClick = (user) => {
        navigate(`/TechnicienDetails/${user.id}`);
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".menu-container")) {
                setMenuOpen(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);


  

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md">
            {/* Logo en haut à gauche */}
            <Header />

            {/* En-tête */}
            <div className="w-full bg-[#20599E] text-white py-16 text-center">
                <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
                    Utilisateurs
                </h1>
                
                {/* Barre de recherche */}    
                <SearchBar
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Rechercher (nom, email,...)"
                />

                {/* Boutons de filtre */}
                <div className="mx-auto w-full max-w-4xl px-4 mt-4 -mt-8 flex justify-center">
                    <div className="flex flex-nowrap space-x-2 overflow-x-auto no-scrollbar">
                        {roles.map((role) => (
                            role === "Technicien" ? (
                                <Filtre
                                    key={role}
                                    label={role}
                                    filter={filter}
                                    setFilter={setFilter}
                                    isDropdownOpen={isDropdownOpen}
                                    setIsDropdownOpen={setIsDropdownOpen}
                                    postesList={postesList}
                                    onPosteSelect={handlePosteFilterSelect}
                                />
                            ) : (
                                <Filterbutton
                                    key={role}
                                    text={role}
                                    selected={filter === role}
                                    isDropdownOpen={isDropdownOpen[role]}
                                    onClick={() => {
                                        setFilter(role);
                                        setIsDropdownOpen((prev) => ({
                                            ...prev,
                                            [role]: !prev[role],
                                        }));
                                    }}
                                />
                            )
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
                {/* Résultats et bouton Ajouter */} 
                <div className="relative w-full px-4 my-0">
                    <div className="flex justify-between items-center flex-wrap">
                        <div className="text-gray-600 font-semibold text-sm sm:text-base md:text-lg">
                            {Math.min(visibleCount, users.length)} Résultats affichés sur {users.length}
                        </div>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
      {/* Bouton Disponible (s'affiche seulement si "Technicien" est sélectionné) */}
      {filter === "Technicien" && (
        <Buttonrec
          text="Disponible"
          bgColor="#D1D5DB"
          textColor="gray-600"
          onClick={() => navigate("/Disponible")}
          className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg shadow-md hover:bg-gray-400"
        />
      )}





      {/* View Toggle */}
      <div className="h-9 flex items-center">
        <ViewToggle onChange={(view) => setCurrentView(view)} />
      </div>

      {/* Bouton Ajouter */}
      {!isSmall && (
        <AjouterButton onClick={() => navigate("/AjouterUser")} />
      )}
    </div>
                    </div>
                </div>





<div className="flex flex-wrap space-y-4 p-4">

  <div className="flex justify-between items-center w-full">
    {currentView === "list" && (
      <div className="sm:py-2 w-full">
       <SelectionToolbar
                  selectedCount={selectedUserCount}
                  allSelected={allUsersSelected}
                  onSelectAll={handleSelectAllUsers}
                  onDeselectAll={handleDeselectAllUsers}
                  onActionClick={handleUserActionClick}
                  selectedEquipments ={selectedUsers} // Passer le tableau des utilisateurs sélectionnés
                />
      </div>
    )}
    </div>

  {currentView === "list" ? (
    /* Vue liste */
    <div className="w-full space-y-2">
      <UserListHeader />
      {displayedUsers.map((user) => (
        <div key={user.id} className="relative w-full">

<UserList
        nom={user.first_name}
        prenom={user.last_name}
        email={user.email}
        role={user.role}
        imageUrl={user.photo}
        checked={user.checked}
        onToggle={() => handleUserToggle(user.id)}
        user={user} // Passez l'objet utilisateur complet
        onEditClick={handleEdit} // Passez la fonction handleEdit
        onBlockClick={(userId) => { // Passez la fonction pour bloquer
            setMenuOpen(null);
            setSelectedUserId(userId);
            setIsBlockPopupVisible(true);
        }}
        onUnblockClick={(userId) => { // Passez la fonction pour débloquer
            setMenuOpen(null);
            setSelectedUserId(userId);
            setIsUnblockPopupVisible(true);
        }}
        setSelectedUserId={setSelectedUserId} // Passez setSelectedUserId
        setIsBlockPopupVisible={setIsBlockPopupVisible} // Passez setIsBlockPopupVisible
        setIsUnblockPopupVisible={setIsUnblockPopupVisible} // Passez setIsUnblockPopupVisible
    />

        </div>
      ))}
    </div>
  ) : (

    /* Liste des utilisateurs en mode carte */
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {displayedUsers.map((user) => (
        <div key={user.id} className="relative w-full sm:w-1/2 md:w-[360px]">
          <Usercard
            firstName={user.first_name}
            lastName={user.last_name}
            email={user.email}
            photo={user.photo}
         //   previewUrl={previewUrl}
            onClick={() => handleClick(user)}
            onMenuClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
            isMenuOpen={menuOpen === user.id}
            onEditClick={() => handleEdit(user)}
            is_blocked={user.is_blocked}
            onBlockClick={() => {
              setMenuOpen(null);
              setSelectedUserId(user.id);
              setIsBlockPopupVisible(true); 
            }}
            onUnblockClick={() => {
              setMenuOpen(null);
              setSelectedUserId(user.id);
              setIsUnblockPopupVisible(true);
            }}
          />

          {/* Affichage du badge en fonction du filtre */}
          {filter === "Technicien" && user.technicien && (
            <div className="absolute bottom-3 right-3 w-auto max-w-[90%] z-10">
              <div className="scale-[0.75] sm:scale-[0.85] md:scale-[0.95] lg:scale-100">
                <Badge
                  text={user.technicien.disponibilite ? "Disponible" : "Non disponible"}
                  className={`
                    text-[12px] sm:text-[9px] md:text-[10px] lg:text-xs
                    px-2 sm:px-2.5 md:px-3
                    py-[8px] sm:py-[3px] md:py-[5px]
                    rounded-full
                    max-w-full
                    whitespace-nowrap
                  `}
                />
              </div>
            </div>
          )}

          {filter === "Tout" && (
            <div className="absolute bottom-3 right-3 w-auto max-w-[90%] z-10">
              <div className="scale-[0.75] sm:scale-[0.85] md:scale-[0.95] lg:scale-100">
                <Badge
                  text={user.role}
                  bgColor={roleColors[user.role]}
                  className="
                    text-[12px] sm:text-[9px] md:text-[10px] lg:text-xs
                    px-2 sm:px-2.5 md:px-3
                    py-[8px] sm:py-[3px] md:py-[5px]
                    rounded-full
                    max-w-full
                    whitespace-nowrap
                  "
                />
              </div>
            </div>
          )}

          {filter !== "Tout" && filter !== "Technicien" && (
            <div className="absolute bottom-3 right-3 w-auto max-w-[90%] z-10">
              <div className="scale-[0.75] sm:scale-[0.85] md:scale-[0.95] lg:scale-100">
                <Badge
                  text={user.is_blocked ? "Bloqué" : "Débloqué"}
                  bgColor={user.is_blocked ? "#FF4423" : "#9ca3af"}
                  className="
                    text-[12px] sm:text-[9px] md:text-[10px] lg:text-xs
                    px-2 sm:px-2.5 md:px-3
                    py-[8px] sm:py-[3px] md:py-[5px]
                    rounded-full
                    max-w-full
                    whitespace-nowrap
                  "
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )}

</div>
                

                {isSmall && (
                    <div className="mt-4 flex justify-end pr-4">
                        <AddMobile onClick={() => navigate("/AjouterUser")} />
                    </div>
                )}

                {/* Afficher plus */}
                {visibleCount < users.length && (
                    <h3
                        className="mt-6 text-black font-semibold text-lg cursor-pointer hover:underline text-center"
                        onClick={() => setVisibleCount(visibleCount + 3)}
                    >
                        Afficher plus 
                    </h3>
                )}

                {/* Popup Bloquer */}
                <Popupdelete
                    isVisible={isBlockPopupVisible}
                    onClose={() => setIsBlockPopupVisible(false)}
                    onConfirm={handleBloquer}
                    userId={selectedUserId}
                    title="Êtes-vous sûr de vouloir bloquer cet utilisateur ?"
                    message=""
                />

                {/* Popup Débloquer */}
                <Popupdelete
                    isVisible={isUnblockPopupVisible}
                    onClose={() => setIsUnblockPopupVisible(false)}
                    onConfirm={handleDeBloquer}
                    userId={selectedUserId}
                    title="Êtes-vous sûr de vouloir débloquer cet utilisateur ?"
                    message=""
                    confirmText="Debloquer"
                />

                {isPopupVisible && (
                    <PopupMessage
                        title="L'utilisateur a été bloqué avec succès !"
                        message=""
                        onClose={() => setIsPopupVisible(false)} 
                    />
                )}

                {isPopupVisiblebloque && (
                    <PopupMessage
                        title="L'utilisateur a été Debloqué avec succès !"
                        message=""
                        onClose={() => setisPopupVisiblebloque(false)} 
                    />
                )}
            </div>
        </div>
    );
};

export default UsersPage;

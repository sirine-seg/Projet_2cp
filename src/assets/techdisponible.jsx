import { useState, useEffect } from "react";
import { MdAccountCircle } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate , useLocation } from "react-router-dom";
import SearchBar from "../components/Searchbar"; 
import Filterbutton from "../components/Filterbutton"; 
import Header from "../components/Header";
import AjouterButton from "../components/Ajouterbutton";
import Buttonrec from "../components/buttonrectangle";
import Usercard from "../components/Usercard";
import Badge from "../components/badge";
import Popupdelete from "../components/Popupdelet";
import UserDetailsCard from "../components/Userdetails";
//import "../App.css";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import AddMobile  from "../components/addMobile";
import PopupMessage from "../components/Popupcheck";
import Filtre from "../components/filtrefleche";
import SelectionToolbar from "../components/selectionToolBartech";
import UserList from "../components/userList";
import ViewToggle from "../components/viewToggle";
import UserListHeader from "../components/userListHeader"
import exportUsertToPDF from "../components/exportPdfusert";
const VIEW_STORAGE_KEY = "usersPageView"; // Key for localStorage

const UsersPage = () => {
    const [users, setUsers] = useState([]);  // Stocke tous les utilisateurs
    const [displayedUsers, setDisplayedUsers] = useState([]); // Stocke les utilisateurs affichés
    const [filter, setFilter] = useState("Tout");
    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [menuOpen, setMenuOpen] = useState(null);
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const isSmall = useIsSmallScreen();
    const technicianRoles = ["Plombier", "Électricien", "Informaticien", "Femme de ménage"];
    const roles = ["Tout", "Administrateur", "Technicien", "Personnel"];
    const [cachedUsers, setCachedUsers] = useState({});
    const [postesList, setPostesList] = useState([]);
     const [isUnblockPopupVisible, setIsUnblockPopupVisible] = useState(false);
    const [isBlockPopupVisible, setIsBlockPopupVisible] = useState(false);
    const [selectedPoste, setSelectedPoste] = useState("");
     const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isPopupVisiblebloque, setisPopupVisiblebloque] = useState(false);
    const [selectedPostes, setSelectedPostes] = useState([]);
    const [currentView, setCurrentView] = useState(() => {
      const storedView = localStorage.getItem(VIEW_STORAGE_KEY);
      return storedView || "grid"; // Default to "grid" if nothing is stored
  });
    const [selectedUsersForExport, setSelectedUsersForExport] = useState([]); // State to hold selected users for export
    const [returnToList, setReturnToList] = useState(false);





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

  

// 1. useEffect pour les utilisateurs sélectionnés
useEffect(() => {
  const selected = users.filter(u => u.checked);
  setSelectedUsersForExport(selected);
}, [users]);

// 2. Gestion du toggle des utilisateurs
const handleUserToggle = (id) => {
  setUsers(users.map(user =>
    user.user.id === id ? { ...user, checked: !user.checked } : user
  ));
};

// 3. Sélection de tous les utilisateurs
const handleSelectAllUsers = () => {
  setUsers(users.map(user => ({ ...user, checked: true })));
};

// 4. Désélection de tous les utilisateurs
const handleDeselectAllUsers = () => {
  setUsers(users.map(user => ({ ...user, checked: false })));
};

// 5. Action sur les utilisateurs sélectionnés
const handleUserActionClick = () => {
  const selected = users.filter(u => u.checked);
  alert(`Action sur ${selected.length} utilisateur(s)`);
};
const selectedUserCount = users.filter(u => u.checked).length;
const allUsersSelected = selectedUserCount === users.length && users.length > 0;

    



    useEffect(() => {
      const fetchPostes = async () => {
          try {
            const response = await fetch('http://127.0.0.1:8000/api/accounts/postes/', {
              method: "GET",
              headers: {
               // Authorization: `Token ${token}`,
                  "Content-Type": "application/json",
              },
          })
              if (!response.ok) throw new Error("Erreur lors du chargement des postes");
              const data = await response.json();
              setPostesList(data);
          } catch (error) {
              console.error("Erreur lors de la récupération des postes :", error);
          }
      };
  
      fetchPostes();
  }, []);

    // Récupérer les techniciens au chargement
    useEffect(() => {
      const fetchTechniciens = async () => {
        try {
          // Construction de l'URL avec les paramètres de filtrage
          const params = new URLSearchParams();
          
          // Toujours filtrer par disponibilité (true par défaut)
          params.append('disponibilite', 'true');
          
          // Si des postes sont sélectionnés et le filtre est sur "Technicien"
          if (filter === "Technicien" && selectedPostes && selectedPostes.length > 0) {
            // Si plusieurs postes sont sélectionnés, on doit faire plusieurs requêtes ou adapter le backend
            // Pour l'instant, prenons simplement le premier poste sélectionné
            params.append('poste__nom', selectedPostes[0].nom);
          }
          
          const url = `http://127.0.0.1:8000/api/accounts/techniciens/?${params.toString()}`;
          console.log("URL de requête:", url);
          
          const response = await fetch(url, {
            method: "GET",
            headers: {
          //  Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUsers(data);
            setDisplayedUsers(data);
            console.log("Techniciens récupérés:", data);
          } else {
            console.error('Erreur lors de la récupération des techniciens disponibles');
          }
        } catch (error) {
          console.error('Erreur réseau :', error);
        }
      };

      fetchTechniciens();
    }, [filter, selectedPostes]); // Recharger les données quand les filtres changent

    useEffect(() => {
      const filteredUsers = users.filter(user => {
          const searchRegex = new RegExp(searchTerm, 'i');
          const fullName = `${user.user.first_name} ${user.user.last_name}`;
          return (
              searchRegex.test(user.user.first_name) ||
              searchRegex.test(user.user.last_name) ||
              searchRegex.test(fullName) ||
              searchRegex.test(user.user.email)
          );
      });
      setDisplayedUsers(filteredUsers);
      setVisibleCount(6);
  }, [users, searchTerm]);


    const handleEdit = (user) => {
        navigate(`/Modifie/${user.id}`);
    };
   
   
    
    const closePopup = () => {
        setShowEditPopup(false);
        setSelectedUser(null);
    };

    // Fonction pour bloquer un utilisateur
    const handleBloquer = async () => {
      try {
        const response = await fetch(`http:///127.0.0.1:8000/api/accounts/user/${selectedUserId}/block/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
    
        if (response.ok) {
          console.log('Utilisateur bloqué avec succès');
          
          // Mettre à jour les états locaux
          setUsers((prevUsers) =>
            prevUsers.map((user) => {
              if (user.user && user.user.id === selectedUserId) {
                return {
                  ...user,
                  user: {
                    ...user.user,
                    is_blocked: true
                  }
                };
              }
              return user;
            })
          );

          setDisplayedUsers((prevDisplayedUsers) =>
            prevDisplayedUsers.map((user) => {
              if (user.user && user.user.id === selectedUserId) {
                return {
                  ...user,
                  user: {
                    ...user.user,
                    is_blocked: true
                  }
                };
              }
              return user;
            })
          );

          // Fermer le menu contextuel
          setMenuOpen(null);
          
          // Afficher le message de confirmation
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
        setIsBlockPopupVisible(false); // Fermer le popup de confirmation
      }
    };

    // Fonction pour débloquer un utilisateur
    const handleDeBloquer = async () => {
      try {
        const response = await fetch(`http:///127.0.0.1:8000/api/accounts/users/${selectedUserId}/unblock/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
    
        if (response.ok) {
          console.log('Utilisateur débloqué avec succès');
          
          // Mettre à jour les états locaux
          setUsers((prevUsers) =>
            prevUsers.map((user) => {
              if (user.user && user.user.id === selectedUserId) {
                return {
                  ...user,
                  user: {
                    ...user.user,
                    is_blocked: false
                  }
                };
              }
              return user;
            })
          );

          setDisplayedUsers((prevDisplayedUsers) =>
            prevDisplayedUsers.map((user) => {
              if (user.user && user.user.id === selectedUserId) {
                return {
                  ...user,
                  user: {
                    ...user.user,
                    is_blocked: false
                  }
                };
              }
              return user;
            })
          );
          
          // Fermer le menu contextuel
          setMenuOpen(null);
          
          // Afficher le message de confirmation
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
        setIsUnblockPopupVisible(false); // Fermer le popup de confirmation
      }
    };

    const handleClick = (user) => {
      navigate(`/TechnicienDetails/${user.id}`);
    };
    
    // Fonction pour gérer la sélection des postes dans le composant Filtre
    const handlePosteFilterSelect = (selectedPosteObjects) => {
      console.log("Postes sélectionnés:", selectedPosteObjects);
      setSelectedPostes(selectedPosteObjects);
    };

    // Gestionnaire pour cliquer en dehors du menu et le fermer
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
                  isDropdownOpen={isDropdownOpen["Technicien"] || false}
                  setIsDropdownOpen={(isOpen) => setIsDropdownOpen({...isDropdownOpen, "Technicien": isOpen})}
                  postesList={postesList}
                  onPosteSelect={handlePosteFilterSelect}
                />
              ) : (
                <Filterbutton
                  key={role}
                  text={role}
                  selected={false} // Ne jamais afficher comme sélectionné initialement
                  disabled={true} // Rendre le bouton non cliquable
                  className="cursor-not-allowed opacity-50" // Ajouter un style pour indiquer que ce n'est pas cliquable
                  isDropdownOpen={isDropdownOpen[role] || false}
                  onClick={() => {
                    // Ne rien faire ici, le bouton est désactivé
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
            {/* Conteneur principal avec flex */}
            <div className="flex justify-between items-center flex-wrap">
              {/* Message des résultats */}
              <div className="text-gray-600 font-semibold text-sm sm:text-base md:text-lg">
                {Math.min(visibleCount, users.length)} Résultats affichés sur {users.length}
              </div>

              {/* Conteneur des boutons */}
              <div className="flex space-x-2 mt-2 sm:mt-0">
                {/* Bouton Disponible */}
                <Buttonrec
                  text="Disponible"
                  bgColor="#F09C0A"
                  textColor="gray-600"
                  className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg shadow-md hover:bg-gray-400"
                />
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
        selectedEquipments={selectedUsersForExport}
      />
    </div>
  )}
</div>

{currentView === "list" ? (
  /* Vue liste */
  <div className="w-full space-y-2">
    <UserListHeader />
    {displayedUsers.map((user) => (
      <div key={user.user.id} className="relative w-full">
         <UserList
            nom={user.user.first_name}
            prenom={user.user.last_name}
            email={user.user.email}
            role="Technicien" // Assurez-vous que le rôle correct est passé
            imageUrl={user.user.photo}
            checked={user.checked}
            onToggle={() => handleUserToggle(user.user.id)}
            user={user.user} // Passez l'objet utilisateur ici
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
        {/* Carte utilisateur */}
        <Usercard
          firstName={user.user.first_name}
          lastName={user.user.last_name}
          email={user.user.email}
          photo={user.user.photo}
          previewUrl={previewUrl}
          onClick={() => handleClick(user.user)}
          onMenuClick={() => setMenuOpen(menuOpen === user.user.id ? null : user.user.id)}
          isMenuOpen={menuOpen === user.user.id}
          onEditClick={() => handleEdit(user.user)}
          is_blocked={user.user.is_blocked}
          onBlockClick={() => {
            setMenuOpen(null);
            setSelectedUserId(user.user.id);
            setIsBlockPopupVisible(true);
          }}
          onUnblockClick={() => {
            setMenuOpen(null);
            setSelectedUserId(user.user.id);
            setIsUnblockPopupVisible(true);
          }}
        />

        {/* Badge de disponibilité */}
        <div className="absolute bottom-3 right-3 w-auto max-w-[90%] z-10">
          <div className="scale-[0.75] sm:scale-[0.85] md:scale-[0.95] lg:scale-100">
            <Badge
              text={user.disponibilite ? "Disponible" : "Non disponible"}
              bgColor={user.disponibilite ? "#F09C0A" : "#EF4444"}
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
      </div>
    ))}
  </div>
)}
</div>

          {/* Bouton mobile Ajouter */}
          {isSmall && (
            <div className="mt-4 flex justify-end pr-4">
              <AddMobile onClick={() => navigate("/AjouterUser")} />
            </div>
          )}

          {/* Bouton "Afficher plus" */}
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

          {/* Notification de blocage réussi */}
          {isPopupVisible && (
            <PopupMessage
              title="L'utilisateur a été bloqué avec succès !"
              message=""
              onClose={() => setIsPopupVisible(false)} 
            />
          )}

          {/* Notification de déblocage réussi */}
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

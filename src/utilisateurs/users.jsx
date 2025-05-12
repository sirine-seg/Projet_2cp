import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../components/Searchbar";
import Filterbutton from "../components/Filterbutton";
import Header from "../components/Header";
import AjouterButton from "../components/Ajouterbutton";
import UserCard from "../components/Usercard";
import Popupdelete from "../components/Popupdelet";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import AddMobile from "../components/addMobile";
import PopupMessage from "../components/Popupcheck";
import Filtre from "../components/filtrefleche";
import ViewToggle from "../components/viewToggle";
import UserList from "../components/userList";
import UserListHeader from "../components/userListHeader";
import SelectionToolbaru from "../components/selectionToolBaru";
import exportUsersToPDF from "../components/exportPdfuser";
import Options from "../components/options";

const VIEW_STORAGE_KEY = "usersPageView"; // Key for localStorage

const UsersPage = () => {
  const [users, setUsers] = useState([]); // Stocke tous les utilisateurs
  const [displayedUsers, setDisplayedUsers] = useState([]); // Stocke les utilisateurs affichés
  const [filter, setFilter] = useState("Tout"); // setFilter(newValue) → C'est la fonction qui met à jour filter avec newValue. et on a fait tout car "Tout" est la valeur initiale de filter.
  const [visibleCount, setVisibleCount] = useState(6); // Nombre d'utilisateurs affichés
  const [selectedUser, setSelectedUser] = useState(null); // Utilisateur sélectionné pour modification
  const [showEditPopup, setShowEditPopup] = useState(false); // Affichage du pop-up
  const [menuOpen, setMenuOpen] = useState(null); //  gérer l'ouverture et la fermeture d'un menu.
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const navigate = useNavigate();
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const isSmall = useIsSmallScreen();
  const [selectedPostes, setSelectedPostes] = useState([]);
  const roles = ["Tout", "Administrateur", "Technicien", "Personnel"];
  const [cachedUsers, setCachedUsers] = useState({});
  const [isUnblockPopupVisible, setIsUnblockPopupVisible] = useState(false);
  const [isBlockPopupVisible, setIsBlockPopupVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [postesList, setPostesList] = useState([]);
  const [selectedPoste, setSelectedPoste] = useState("");
  const [isPopupVisiblebloque, setisPopupVisiblebloque] = useState(false);
  const location = useLocation();
  const [disponibleFilter, setDisponibleFilter] = useState(false);
  const [filteredTechniciens, setFilteredTechniciens] = useState([]);
  const [currentView, setCurrentView] = useState("list");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [returnToList, setReturnToList] = useState(false);

  // List view

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

  // Mise à jour de la liste des utilisateurs sélectionnés
  useEffect(() => {
    const selected = users.filter((u) => u.checked);
    setSelectedUsers(selected);
  }, [users]);

  const handleUserToggle = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, checked: !user.checked } : user
    );

    setUsers(updatedUsers);
    // Mettre à jour displayedUsers avec les mêmes données
    setDisplayedUsers(updatedUsers.slice(0, visibleCount));
  };

  const handleSelectAllUsers = () => {
    setUsers(users.map((user) => ({ ...user, checked: true })));
  };

  const handleDeselectAllUsers = () => {
    setUsers(users.map((user) => ({ ...user, checked: false })));
  };

  const handleUserActionClick = () => {
    const selected = users.filter((u) => u.checked);
    alert(`Action sur ${selected.length} utilisateur(s)`);
  };

  useEffect(() => {
    const selected = users.filter((u) => u.checked);
    setSelectedUsers(selected);
  }, [users]);

  const selectedUserCount = users.filter((u) => u.checked).length;
  const allUsersSelected =
    selectedUserCount === users.length && users.length > 0;

  // Récupération des postes à partir de l'API
  useEffect(() => {
    const fetchPostes = async () => {
      const token = localStorage.getItem("access_token");

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/accounts/postes/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok)
          throw new Error("Erreur lors du chargement des postes");
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
  }, [filter, searchTerm, visibleCount, selectedPostes, disponibleFilter]);

  async function fetchUsers() {
    const cacheKey = `${filter}_${searchTerm}_${JSON.stringify(
      selectedPostes
    )}_${disponibleFilter}`;

    if (cachedUsers[cacheKey]) {
      console.log("Utilisation du cache pour :", cacheKey);
      const cachedData = cachedUsers[cacheKey];
      setUsers(cachedData);
      setDisplayedUsers(cachedData.slice(0, visibleCount));
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Token d'accès non trouvé !");
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

      if (filter === "Technicien" && selectedPostes.length > 0) {
        const posteIds = selectedPostes.map((poste) => poste.id).join(",");
        params.push(`poste=${posteIds}`);
      }

      // Ajout du filtre de disponibilité pour les techniciens
      if (filter === "Technicien" && disponibleFilter) {
        params.push(`disponibilite=true`);
      }

      if (params.length > 0) {
        url += params.join("&");
      }

      console.log("URL finale envoyée:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetch depuis le serveur pour :", cacheKey);
      console.log("Données reçues:", data);

      setCachedUsers((prev) => ({ ...prev, [cacheKey]: data }));
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
    navigate(`/ModifierUtilisateur/${user.id}`);
  };

  const roleColors = {
    Technicien: "#F09C0A ",
    Administrateur: "#20599E",
    Personnel: "#6B7280",
  };

  const closePopup = () => {
    setShowEditPopup(false);
    setSelectedUser(null);
  };

  const handleBloquer = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Token d'accès introuvable !");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/accounts/user/${selectedUserId}/block/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Utilisateur bloqué avec succès");
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
        console.error("Erreur lors du blocage de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    } finally {
      setIsBlockPopupVisible(false);
    }
  };

  const handleDeBloquer = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Token d'accès introuvable !");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/accounts/users/${selectedUserId}/unblock/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Utilisateur débloqué avec succès");
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
        console.error("Erreur lors du déblocage de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    } finally {
      setIsUnblockPopupVisible(false);
    }
  };

  const handlePosteSelect = (option) => {
    console.log("Poste sélectionné:", option);
    setSelectedPoste(option);
  };

  const handleClick = (user) => {
    navigate(`/DetailsUtilisateur/${user.id}`);
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

  const handleDisponibleFilterToggle = () => {
    // Inverse l'état du filtre de disponibilité
    setDisponibleFilter(!disponibleFilter);

    // Réinitialise le cache pour forcer un nouveau chargement
    setCachedUsers({});
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] font-poppins">
      {/* Logo en haut à gauche */}
      <Header />

      {/* En-tête */}
      <div className="w-full bg-[#20599E] text-white pb-16 text-center">
        <h1 className="text-3xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Utilisateurs
        </h1>

        {/* Barre de recherche */}
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher (nom, email,...)"
        />

        {/* Boutons de filtre */}
        <div className="mx-auto w-full max-w-4xl px-4 mt-4 flex justify-center">
          <div className="flex flex-nowrap space-x-2 overflow-x-auto no-scrollbar">
            {roles.map((role) =>
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
            )}
          </div>
        </div>
      </div>

      <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        {/* Résultats et bouton Ajouter */}
        <div className="relative w-full px-4 my-0">
          <div className="flex justify-between items-center flex-wrap">
            <div className="text-gray-600 font-semibold text-sm sm:text-base md:text-lg">
              {Math.min(visibleCount, users.length)} Résultats affichés sur{" "}
              {users.length}
            </div>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              {/* View Toggle */}
              <div className="h-9 flex items-center">
                <ViewToggle onChange={(view) => setCurrentView(view)} />
              </div>
              
              {/* Bouton Disponible (s'affiche seulement si "Technicien" est sélectionné) */}
              {filter === "Technicien" && (
                <Filterbutton
                  text="Disponible"
                  selected={disponibleFilter}
                  onClick={handleDisponibleFilterToggle}
                  defaultBgColor="bg-gray-300" // Or any other gray shade like "bg-gray-400"
                  className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg shadow-md hover:bg-gray-400"
                />
              )}

              {/* Bouton Ajouter */}
              {!isSmall && (
                <AjouterButton
                  onClick={() => navigate("/AjouterUtilisateur")}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap space-y-4 p-4">
          <div className="flex justify-between items-center w-full">
            {currentView === "list" && (
              <div className="sm:py-2 w-full">
                <SelectionToolbaru
                  selectedCount={selectedUserCount}
                  allSelected={allUsersSelected}
                  onSelectAll={handleSelectAllUsers}
                  onDeselectAll={handleDeselectAllUsers}
                  selectedEquipments={selectedUsers} // Passer le tableau des utilisateurs sélectionnés
                />
              </div>
            )}
          </div>

          {currentView === "list" ? (
            /* Vue liste */
            <div className="w-full space-y-2">
              <UserListHeader />
              {users.map((user) => (
                <div key={user.id} className="relative w-full">
                  <UserList
                    nom={user.first_name}
                    prenom={user.last_name}
                    email={user.email}
                    role={user.role}
                    imageUrl={user.imageUrl}
                    checked={user.checked}
                    onToggle={() => handleUserToggle(user.id)}
                    onMoreClick={() =>
                      setMenuOpen(menuOpen === user.id ? null : user.id)
                    }
                    isMenuOpen={menuOpen === user.id}
                    user={user}
                  />

                  {menuOpen === user.id && (
                    <div className="menu-container">
                      <Options
                        options={[
                          { label: "Voir Détails", value: "view_details" },
                          { label: "Modifier", value: "modifier" },
                          {
                            label: user.is_blocked ? "Débloquer" : "Bloquer",
                            value: "toggle_block",
                          },
                        ]}
                        handleSelect={(value) => {
                          if (value === "view_details") {
                            navigate(`/DetailsUtilisateur/${user.id}`);
                          } else if (value === "modifier") {
                            handleEdit(user);
                          } else if (value === "toggle_block") {
                            if (user.is_blocked) {
                              setSelectedUserId(user.id);
                              setIsUnblockPopupVisible(true);
                            } else {
                              setSelectedUserId(user.id);
                              setIsBlockPopupVisible(true);
                            }
                          }
                          setMenuOpen(null);
                        }}
                        className="absolute top-10 right-2 z-[9999] bg-white shadow-xl rounded-lg w-48 border max-w-60"
                        setMenuOpen={setMenuOpen}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Liste des utilisateurs en mode carte */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-6 w-full">
              {displayedUsers.map((user) => (
                <div key={user.id} className="relative">
                  <UserCard
                    firstName={user.first_name}
                    lastName={user.last_name}
                    email={user.email}
                    photo={user.photo}
                    onClick={() => handleClick(user)}
                    onMenuClick={() =>
                      setMenuOpen(menuOpen === user.id ? null : user.id)
                    }
                    isMenuOpen={menuOpen === user.id}
                    role={user.role}
                    technicien={user.technicien}
                    filter={filter}
                  />

                  {menuOpen === user.id && (
                    <div className="menu-container">
                      <Options
                        options={[
                          { label: "Modifier", value: "modifier" },
                          {
                            label: user.is_blocked ? "Débloquer" : "Bloquer",
                            value: user.is_blocked ? "unblock" : "block",
                          },
                        ]}
                        handleSelect={(value) => {
                          if (value === "modifier") {
                            handleEdit(user);
                          } else if (value === "block") {
                            setSelectedUserId(user.id);
                            setIsBlockPopupVisible(true);
                          } else if (value === "unblock") {
                            setSelectedUserId(user.id);
                            setIsUnblockPopupVisible(true);
                          }
                          setMenuOpen(null);
                        }}
                        className="absolute top-10 right-6 z-[9999] bg-white shadow-xl rounded-lg w-48 sm:w-56 border max-w-60"
                        setMenuOpen={setMenuOpen}
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

        {/* Afficher plus */}
        {visibleCount < users.length && (
          <h3
            className="mt-6 text-black font-semibold text-lg cursor-pointer hover:underline text-center"
            onClick={() => setVisibleCount(visibleCount + 60)}
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
          confirmText="Bloquer"
        />

        {/* Popup Débloquer */}
        <Popupdelete
          isVisible={isUnblockPopupVisible}
          onClose={() => setIsUnblockPopupVisible(false)}
          onConfirm={handleDeBloquer}
          userId={selectedUserId}
          title="Êtes-vous sûr de vouloir débloquer cet utilisateur?"
          message=""
          confirmText="Debloquer"
        />

        {isPopupVisible && (
          <PopupMessage
            title="L'utilisateur a été bloqué avec succès!"
            message=""
            onClose={() => setIsPopupVisible(false)}
          />
        )}

        {isPopupVisiblebloque && (
          <PopupMessage
            title="L'utilisateur a été débloqué avec succès!"
            message=""
            onClose={() => setisPopupVisiblebloque(false)}
          />
        )}
      </div>
    </div>
  );
};

export default UsersPage;

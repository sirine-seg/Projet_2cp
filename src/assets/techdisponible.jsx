import { useState, useEffect } from "react";
import { MdAccountCircle } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

const UsersPage = () => {
    const [users, setUsers] = useState([]);  // Stocke tous les utilisateurs
    const [displayedUsers, setDisplayedUsers] = useState([]); // Stocke les utilisateurs affichés
    const [filter, setFilter] = useState("Tout");
    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [menuOpen, setMenuOpen] = useState(null);
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

    const [isUnblockPopupVisible, setIsUnblockPopupVisible] = useState(false);
    const [isBlockPopupVisible, setIsBlockPopupVisible] = useState(false);

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isPopupVisiblebloque, setisPopupVisiblebloque] = useState(false);
       
    // Récupérer les techniciens au chargement
    useEffect(() => {
      const fetchTechniciens = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/accounts/techniciens/?disponibilite=true');
          if (response.ok) {
            const data = await response.json();
            setUsers(data);
            setDisplayedUsers(data);
            console.log("Users:", data);
          } else {
            console.error('Erreur lors de la récupération des techniciens disponibles');
          }
        } catch (error) {
          console.error('Erreur réseau :', error);
        }
      };

      fetchTechniciens();
    }, []);

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
                <Filterbutton
                  key={role}
                  text={role}
                  selected={role === "Technicien"}
                  hasDropdown={role === "Technicien"}
                  isDropdownOpen={role === "Technicien" && isDropdownOpen}
                  onClick={() => {
                    if (role === "Technicien") {
                      setFilter(role);
                      setIsDropdownOpen(!isDropdownOpen);
                    } else {
                      setFilter(role);
                      setIsDropdownOpen(false);
                    }
                  }}
                />
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

                {/* Bouton Ajouter (desktop) */}
                {!isSmall && (
                  <div>
                    <AjouterButton onClick={() => navigate("/Ajout")} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Liste des utilisateurs */}
          <div className="flex flex-wrap md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-4">
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

          {/* Bouton mobile Ajouter */}
          {isSmall && (
            <div className="mt-4 flex justify-end pr-4">
              <AddMobile onClick={() => navigate("/Ajout")} />
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

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
    const [filter, setFilter] = useState("Tout");  // setFilter(newValue) → C'est la fonction qui met à jour filter avec newValue. et on a fait tout car "Tout" est la valeur initiale de filter.
    const [visibleCount, setVisibleCount] = useState(6);// Nombre d'utilisateurs affichés
    const [selectedUser, setSelectedUser] = useState(null);// Utilisateur sélectionné pour modification
    const [showEditPopup, setShowEditPopup] = useState(false); // Affichage du pop-up
    const [menuOpen, setMenuOpen] = useState(null);   //  gérer l'ouverture et la fermeture d'un menu.
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddUserOpen, setIsAddUserOpen] = useState(false); // isAdduseropen stock un boolean true ou false 
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

const [isPopupVisible, setIsPopupVisible] = useState(false); // au début, pas visible


const [isPopupVisiblebloque, setisPopupVisiblebloque] = useState(false); // au début, pas visible


        
//  useEffect est un hook React qui permet d'exécuter du code lorsque certaines valeurs changent
       
useEffect(() => {
  const fetchTechniciens = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/techniciens/?disponibilite=true');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setDisplayedUsers(data);
        console.log("Users:", data);  // Vérification des données récupérées
      } else {
        console.error('Erreur lors de la récupération des techniciens disponibles');
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
    }
  };

  fetchTechniciens();
}, []);


        // focntion pour faire la recherche par nom prenom role email 
        // Ajout de searchTerm et users dans les dépendances
        
 // Ajout de filteredUsers
       
         //  si visibleCount === 12, on prend les 3 premiers utilisateurs 
        // L’interface utilisateur est mise à jour pour afficher les utilisateurs sélectionnés.
        
    
       
    
     
    
        const handleEdit = (user) => {
            navigate(`/Modifie/${user.id}` );
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
              
              // Mettre à jour l'état local (isBlocked) de l'utilisateur après déblocage
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
        
              // Fermer le popup de déblocage
              setisPopupVisiblebloque(false);
        
              // Optionnel: Vous pouvez également afficher un message de succès ici
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
        
        
     
       
       
  
       // const handleDelete = (userId) => {
       //     console.log(" handleDelete appelé avec userId:", userId);
            
       //     if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
        //        console.log(" L'utilisateur a confirmé la suppression");
        
        //        fetch(`http://127.0.0.1:8000//api/user/${userId}/`, {
        //            method: "DELETE",
         //       })
          //      .then((response) => {
            //        console.log("Réponse serveur:", response.status);
        
            //        if (response.ok) {
             //           console.log(" Suppression réussie pour l'utilisateur ID:", userId);
             //           setUsers(prev => prev.filter(user => user.id !== userId));
             //           setDisplayedUsers(displayedUsers.filter(user => user.id !== userId));
              //      } else {
                  //      console.error(" Échec de la suppression");
                   //     alert("Échec de la suppression !");
                 //   }
             //   })
           //     .catch(error => console.error(" Erreur lors de la requête DELETE:", error));
          //  } else {
         //       console.log(" L'utilisateur a annulé la suppression");
          //  }
        
         //   setMenuOpen(null);
      //  };

   

        const handleClick = (user) => {
       
               navigate(`/TechnicienDetails/${user.id}`); // Redirige vers la page spéciale pour les techniciens
          
       };
        
      //  const handleClick = (user) => {
       //   setSelectedUser(user); // on affiche les détails de l'utilisateur sélectionné
       // };
        
     
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
      {/* bare de recherhce  */}    
<SearchBar
value={searchTerm}
onChange={e => setSearchTerm(e.target.value)}
placeholder="Rechercher (nom, email,...)"
/>





{/* Boutons de filtre – dans la partie bleue, au-dessus de la searchbar */}
<div className="mx-auto w-full max-w-4xl px-4 mt-4 -mt-8  flex justify-center">
<div className="flex flex-nowrap space-x-2 overflow-x-auto no-scrollbar">
{roles.map((role) => (
<Filterbutton
key={role}
text={role}
selected={role === "Technicien"}
hasDropdown={role === "Technicien"} // ou autre logique si d’autres rôles ont un menu
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



      
      { /* <div className="w-full max-w-7xl bg-[#F4F4F4] min-h-screen rounded-t-[80px] px-6 py-8 shadow-md flex flex-col"> */}
 
      <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">


        
    
    {/*  <div className="flex space-x-4 mb-4 mx-auto relative">*/}
   
      {/* Résultats et bouton Ajouter */}
      <div className="relative w-full px-4 my-0">
{/* Conteneur principal avec flex pour aligner les éléments */}
<div className="flex justify-between items-center flex-wrap">
{/* Message des résultats */}
<div className="text-gray-600 font-semibold text-sm sm:text-base md:text-lg">
{Math.min(visibleCount, users.length)} Résultats affichés sur {users.length}
</div>

{/* Conteneur des boutons */}
<div className="flex space-x-2 mt-2 sm:mt-0">
{/* Bouton Disponible (s'affiche seulement si "Technicien" est sélectionné) */}

<Buttonrec
text="Disponible"
bgColor="#F09C0A"
textColor="gray-600"
//onClick={() => navigate("/Disponible")}
className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg shadow-md hover:bg-gray-400"
/>



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

  
      {/* Liste des utilisateurs  :les cartes   ::: gap pour espace entre les cartes et grid pour si la carte prend un colone .. ect     ;;;;.map((user) => ( ... )) permet de générer une carte pour chaque utilisateur. */}
      {/* </div> <div className="flex flex-wrap  gap-4 px-2 mt-6 w-full max-w-7xl mx-auto justify-center  ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-4"> */}
 

<div className="flex flex-wrap md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-4">
  {displayedUsers.map((user) => (
    <div key={user.id} className="relative w-full sm:w-1/2 md:w-[360px]">
      
      {/* Carte sans rôle */}
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
          setIsBlockPopupVisible(true); // Affiche le popup de blocage
        }}
        onUnblockClick={() => {
          setMenuOpen(null);
          setSelectedUserId(user.user.id);
          setIsUnblockPopupVisible(true); // Affiche le popup de déblocage
        }}
      />

      

      {/* Affichage du badge de disponibilité */}



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


{isSmall && (
<div className="mt-4 flex justify-end pr-4">
<AddMobile onClick={() => navigate("/Ajout")} />

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
onConfirm={handleBloquer}  // Cette fonction va bloquer l'utilisateur
userId={selectedUserId}
title="Êtes-vous sûr de vouloir bloquer cet utilisateur ?"
message=""
/>

{/* Popup Débloquer */}
<Popupdelete
isVisible={isUnblockPopupVisible}
onClose={() => setIsUnblockPopupVisible(false)}
onConfirm={handleDeBloquer}  // Cette fonction va débloquer l'utilisateur
userId={selectedUserId}
title="Êtes-vous sûr de vouloir débloquer cet utilisateur ?"
message=""
confirmText="Debloquer"
/>

{isPopupVisible && (
<PopupMessage
title="L’utilisateur a été bloqué avec succès !"
message=""
onClose={() => setIsPopupVisible(false)} 
/>
)}



{isPopupVisiblebloque && (
<PopupMessage
title="L’utilisateur a été Debloqué avec succès !"
message=""
onClose={() =>setisPopupVisiblebloque(false)} 
/>
)}


</div>
  </div>
);
};

export default UsersPage;

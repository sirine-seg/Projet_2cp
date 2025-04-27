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
//import UserDetailsCard from "../components/Userdetails";
//import "../App.css";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import AddMobile  from "../components/addMobile";

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

useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/users/");
            if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs");

            const data = await response.json();
            setUsers(data);
            setDisplayedUsers(data.slice(0, visibleCount));
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    fetchUsers();
}, [visibleCount]); 

 
 // Charge les utilisateurs à chaque changement de page ou ajout d'affichage

         // Filtrer les utilisateurs par rôle si on a selectionne tout ca veut dire tout les utilisateurs affiche sinon je vais  affiche  par role 
        const filteredUsers = users.filter(user =>
            filter === "Tout" ? true : user.role === filter
        );
    


        
        const techniciensDispo = users.filter(user => 
            user.role === "Technicien" && user.technicien && user.technicien.disponibilite === true
        );
        

        
//  useEffect est un hook React qui permet d'exécuter du code lorsque certaines valeurs changent
       

    
        // focntion pour faire la recherche par nom prenom role email 
        useEffect(() => {
            const filteredUsers = users.filter(user => {
                const matchesFilter = filter === "Tout" || user.role === filter;
                
                const firstName = user.first_name ? user.first_name.toLowerCase() : "";
                const lastName = user.last_name ? user.last_name.toLowerCase() : "";
                const fullName = `${firstName} ${lastName}`.trim(); // Trim pour éviter espaces inutiles
                const reversedFullName = `${lastName} ${firstName}`.trim(); // Gère la recherche inversée
        
                const searchNormalized = searchTerm.toLowerCase().trim(); // Normalisation du terme de recherche
        
                const matchesSearch = searchNormalized === "" || 
                    firstName.includes(searchNormalized) ||
                    lastName.includes(searchNormalized) ||
                    user.email.toLowerCase().includes(searchNormalized) ||
                    user.role.toLowerCase().includes(searchNormalized) ||
                    fullName.includes(searchNormalized) ||   // Vérifie si "nom prénom" est inclus
                    reversedFullName.includes(searchNormalized); // Vérifie si "prénom nom" est inclus
        
                return matchesFilter && matchesSearch;
            });
        
            setDisplayedUsers(filteredUsers.slice(0, visibleCount));
        }, [filter, visibleCount, searchTerm, users]); // Ajout de searchTerm et users dans les dépendances
        
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
            placeholder="Rechercher (nom, email, rôle...)"
          />





          {/* Boutons de filtre – dans la partie bleue, au-dessus de la searchbar */}
          <div className="mx-auto w-full max-w-4xl px-4 mt-4 -mt-8  flex justify-center">
          <div className="flex flex-nowrap space-x-2 overflow-x-auto no-scrollbar">
    {roles.map((role) => (
      <Filterbutton
        key={role}
        text={role}
        selected={filter === role}
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
      {Math.min(visibleCount, filteredUsers.length)} Résultats affichés sur {filteredUsers.length}
    </div>

    {/* Conteneur des boutons */}
    <div className="flex space-x-2 mt-2 sm:mt-0">
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
                   <div className=" flex flex-wrap  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-4 ">
  {displayedUsers.map((user) => (
    <div key={user.id} className="relative w-full sm:w-1/2 md:w-[360px]">
      {/* Carte sans rôle */}
      <Usercard
        firstName={user.first_name}
        lastName={user.last_name}
        email={user.email}
        photo={user.photo}
        previewUrl={previewUrl}
        onClick={() => handleClick(user)}
        onMenuClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
        isMenuOpen={menuOpen === user.id}
        onEditClick={() => handleEdit(user)}
        onDeleteClick={() => {
          setMenuOpen(null);
          setSelectedUserId(user.id);
          setIsDeletePopupVisible(true);
        }}
      />


 

      {/* Badge de rôle – affiché seulement si le filtre est “Tout” */}
 
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


    </div>
  ))}
</div>


{isSmall && (
  <div className="mt-4 flex justify-end pr-4">
    <AddMobile onClick={() => navigate("/Ajout")} />
 
  </div>
)}
      

        
                  {/* Afficher plus */}
                  {visibleCount < filteredUsers.length && (
                        <h3
                            className="mt-6 text-black font-semibold text-lg cursor-pointer hover:underline text-center"
                            onClick={() => setVisibleCount(visibleCount + 4)}
                        >
                            Afficher plus 
                        </h3>
                    )}


 
  {/* Popup des techniciens disponibles */}
  {showPopup && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-md w-96 shadow-lg relative">
                        {/* Bouton X en haut à droite */}
                        <button
                            className="absolute top-2 right-2 text-gray-700 text-xl"
                            onClick={() => setShowPopup(false)}
                        >
                            X
                        </button>

                        <h2 className="text-black font-bold mb-2 text-lg">Techniciens Disponibles</h2>
                        <p className="text-black mb-2 text-sm">Liste des techniciens disponibles en ce moment.</p>

                        {/* Liste des techniciens */}
                        <div className="max-h-60 overflow-y-auto">
                            {techniciensDispo.length > 0 ? (
                                techniciensDispo.map((tech) => (
                                    <div key={tech.id} className="flex items-center border-b py-2 space-x-3">
                                        <MdAccountCircle className="text-gray-600 w-10 h-10" />
                                        <div>
                                            <p className="font-bold">{tech.first_name} {tech.last_name}</p>
                                            <p className="text-sm text-black">{tech.email}</p>
                                            <p className="text-sm text-black">{tech.technicien?.poste || "Aucun poste spécifié"}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 mt-2">Aucun technicien disponible.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
<Popupdelete
  isVisible={isDeletePopupVisible}
  onClose={() => setIsDeletePopupVisible(false)}
  // onConfirm={handleDelete}
   userId={selectedUserId}
  title="Etes vous sur que vous voulez bloque l'utilisateur  "
  message=""
/>



         </div>
                </div>
            );
        };
        
        export default UsersPage;
        

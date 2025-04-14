import { useState, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import logo from '../assets/logo.png';
import { FaChevronDown } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";






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

const technicianRoles = ["Plombier", "Électricien", "Informaticien", "Femme de ménage"];
const roles = ["Tout", "Administrateur", "Technicien", "Personnel"];

useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await fetch(" http://127.0.0.1:8000/users/");
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
            "Technicien": "bg-[#F09C0A] ",
            "Administrateur": "bg-[#20599E] ",
            "Personnel": "bg-gray-500",
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
            if (user.role === "Technicien") {
                navigate(`/TechnicienDetails/${user.id}`); // Redirige vers la page spéciale pour les techniciens
            } else {
                navigate(`/utilisateurDetails/${user.id}`); // Redirige vers AjoutPage
            }
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
 <img 
        src={logo} 
        alt="Logo"
        className="absolute top-6 left-6 w-32 h-auto"
    />

<div className="absolute top-6 right-16 flex items-center space-x-3">
        <MdAccountCircle className="text-white w-10 h-10" />
        <span className="text-white text-lg font-semibold">User Name</span>
    </div>




                    {/* En-tête */}
                    <div className="w-full bg-[#20599E] text-white py-16 text-center">
                   
                        <h1 className="text-4xl font-bold text-[#F4F4F4] mb-20">Utilisateurs</h1>
                    </div>





                    
                <div className="w-full max-w-7xl bg-[#F4F4F4] min-h-screen rounded-t-[80px] px-6 py-8 shadow-md flex flex-col">
                  {/* bare de recherhce  */}


                  <div className="relative w-full max-w-md my-8 -mt-40 mx-auto">
                              <div className="relative">
                                  <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                                  <input
                                      type="text"
                                     placeholder="Rechercher (nom, email, rôle...)"
                                      className="w-full text-balck  px-4 py-2 pl-10 rounded-full border border-gray-300 bg-[#F4F4F4] shadow-md"
                                      value={searchTerm}
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                  />
                              </div>
                    </div>
                      
                    {/* Filtres bouttons */}
                    <div className="flex space-x-4 mb-4 mx-auto relative">
            {roles.map((role) => (
                <button
                    key={role}
                    className={`px-6 py-2 rounded-md font-semibold flex items-center ${
                        filter === role ? "bg-[#F09C0A] text-white" : "bg-gray-200 text-black"
                    }`}
                    onClick={() => {
                        if (role === "Technicien") {
                            setFilter(role);
                            setIsDropdownOpen(!isDropdownOpen);
                        } else {
                            setFilter(role);
                            setIsDropdownOpen(false);
                        }
                    }}
                >
                    {role}
                    {role === "Technicien" && (
                        <FaChevronDown className="ml-2 cursor-pointer" />
                    )}
                </button>
            ))}

        

            
        </div>
                    {/* Résultats et bouton Ajouter */}
                    <div className="relative w-full px-4 my-6">
                    <div className="text-gray-600 ml-10 font-semibold">
    {Math.min(visibleCount, filteredUsers.length)} Résultat affiché sur {filteredUsers.length}
</div>


                        <div className="absolute top-1 right-16 flex space-x-2">
                                   {/* Bouton Disponible (s'affiche seulement si "Technicien" est sélectionné) */}
                             {filter === "Technicien" && (
                               <button className="bg-gray-300 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-400"
                               onClick={() => setShowPopup(true)}
                               >
                                    Disponible
                               </button>
                              )}

                          {/* Bouton Ajouter */}
                          <motion.button
    className="bg-[#20599E] text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 flex items-center space-x-2"
    whileHover={{ scale: 1.1 }} // Animation au survol
    whileTap={{ scale: 0.9 }}   // Animation au clic
    onClick={() => navigate("/Ajout")} // Redirection vers Ajout

>
    <span className="text-lg">+</span> {/* Icône ajouter */}
    <span>Ajouter</span>
</motion.button>
                       </div>
                    

                             



                    </div>
                
                    {/* Liste des utilisateurs  :les cartes   ::: gap pour espace entre les cartes et grid pour si la carte prend un colone .. ect     ;;;;.map((user) => ( ... )) permet de générer une carte pour chaque utilisateur. */}
                    <div className="flex flex-wrap justify-start gap-x-4 gap-y-4 px-2 mt-6 ml-2 w-full max-w-6xl">
                        {displayedUsers.map((user) => ( // le map utiliser pour parcourir le tableau et pour generer dynamiquement un js pour chauqe carte
                            <div 
                                key={user.id} // id dans le display dans le tableau de displaytableau 
                                className="p-5 bg-[#F4F4F4] bg-white  rounded-2xl  shadow-2xl flex items-center relative w-[360px] mx-auto"
                                onClick={() => handleClick(user)}
                            >
                                {/* Avatar */}
                                
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#20599E] flex items-center justify-center">
  <label htmlFor="photoUpload" className="w-full h-full cursor-pointer">
  {previewUrl ? (
  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
) : user.photo ? (
  <img
    src={
      user.photo.startsWith("http")
        ? user.photo
        : `http://127.0.0.1:8000${user.photo}`
    }
    alt= "Utilisateur"
    className="w-full h-full object-cover"
  />
) : (
  <div className="w-full h-full flex items-center justify-center bg-[#20599E] ">
    <FaUser className="text-white w-8 h-8" />
  </div>
)}

      </label>

</div>


        
                                {/* Infos */}
                               
                              
                                <div className="flex-1 pl-4 mt-1">
                                  <h2 className="text-xl t font-bold text-[#20599E] right-1 -mt-8 ">{user.first_name} {user.last_name} </h2>
                                <p className="text-black text-sm flex items-center mt-1">
                                <MdEmail className="h-5  w-5 text-[#20599E] mr-2" />

                                        {user.email}
                               </p>
                              </div>


                          {/* Rôle utilisateur */}
                          {filter === "Tout" && (
    <span className={`absolute bottom-2 right-4 px-3 py-1 text-xs font-bold text-white rounded-full ${roleColors[user.role]}`}>
        {user.role}
    </span>
)}



<button
    className="text-gray-600 hover:text-gray-800 -mt-16"
    onClick={(event) => {
        event.stopPropagation(); // Empêche le clic de se propager à la carte
        setMenuOpen(menuOpen === user.id ? null : user.id);
    }}
>
    ⋮
</button>




                                {/* Menu déroulant       absolute Positionne le menu par rapport au parent   ;top-10 right-2  Positionne le menu en dessous du bouton        */ }
                               {/* Menu déroulant (pop-up) */}
                               {menuOpen === user.id && (
        <div 
          className="absolute top-10 right-2 bg-white shadow-lg rounded-md text-black w-64 z-50"
          onClick={(e) => e.stopPropagation()} // Empêche la fermeture du menu si on clique dedans
        >
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(user);
            }}
          >
            Modifier
          </button>
          <button
  className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
  onClick={(e) => {
    e.stopPropagation();
    setSelectedUserId(user.id); // Stocke l'ID de l'utilisateur à supprimer
    setIsDeletePopupVisible(true); // Affiche le popup
  }}
>
  Supprimer
</button>

        </div>
          )}
               </div>
                        ))}
                    </div>
        
                  {/* Afficher plus */}
                  {visibleCount < filteredUsers.length && (
                        <h3
                            className="mt-6 text-black font-semibold text-lg cursor-pointer hover:underline text-center"
                            onClick={() => setVisibleCount(visibleCount + 3)}
                        >
                            Afficher plus 
                        </h3>
                    )}
       
  {/* Popup des techniciens disponibles */}
  {showPopup && (
                <div className="fixed inset-0 flex justify-center items-center z-999  bg-opacity-50">
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

{isDeletePopupVisible && (
  <div className="fixed inset-0 flex justify-center items-center z-999  bg-opacity-50">
    <div className="bg-white p-6 rounded-xl shadow-xl text-center w-96 relative">
      {/* Bouton X en haut à droite */}
      <button
        onClick={() => setIsDeletePopupVisible(false)}
        className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
      >
        ×
      </button>

      <p className="text-lg font-bold mt-4 text-black">
        Êtes-vous sûr de vouloir supprimer cet utilisateur ?
      </p>

      {/* Bouton Supprimer centré */}
      <div className="mt-6">
        <button
          onClick={() => {
            //  handleDelete(selectedUserId);
            setIsDeletePopupVisible(false);
          }}
          className="px-6 py-2 bg-[#F09C0A] text-white rounded-md"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
)}



         </div>
                </div>
            );
        };
        
        export default UsersPage;
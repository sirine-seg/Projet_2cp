import { useState, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";

import { FaChevronDown } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SearchBar from "../components/Searchbar"; // adapte le chemin selon ton arborescence
import Filterbutton from "../components/Filterbutton"; // adapte le chemin selon ton arborescence
import Header from "../components/Header";
import AjouterButton from "../components/Ajouterbutton";
import Button from "../components/buttonrectangle";
import Usercard from "../components/Usercard";
import Headerbar from "../components/Arrowleftt";  
import DisplayContainer from "../components/displayContainer";




const AjoutPagee =  () => {

    
  const [displayedUsers, setDisplayedUsers] = useState([]); // Stocke les utilisateurs affichés
  const [filter, setFilter] = useState("Tout");  // setFilter(newValue) → C'est la fonction qui met à jour filter avec newValue. et on a fait tout car "Tout" est la valeur initiale de filter.
  const [visibleCount, setVisibleCount] = useState(6);// Nombre d'utilisateurs affichés
  const [selectedUser, setSelectedUser] = useState(null);// Utilisateur sélectionné pour modification
  const [showEditPopup, setShowEditPopup] = useState(false); // Affichage du pop-up
  const [menuOpen, setMenuOpen] = useState(null);   //  gérer l'ouverture et la fermeture d'un menu.
  const [searchTerm, setSearchTerm] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);



  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
      nom: "__",
      prenom: "__",
      email: "__",
      role: "",
      telephone: "__"
  });
  const [errorMessage, setErrorMessage] = useState(""); // État pour afficher un message d'erreur
  const [isPopupVisible, setIsPopupVisible] = useState(false); //  Ajout du state pour le pop-up
  const roles = ["Tout", "Administrateur", "Technicien", "Personnel"];
  const roless = ["Tout", "Administrateur", "Technicien", "Personnel"];
  

  const handleChange = (e) => {
      setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };


 
  const { id } = useParams();  // Récupérer l'ID depuis l'URL
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Token non trouvé. Veuillez vous reconnecter.");
        return;
      }
  
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/accounts/users/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données utilisateur");
        }
  
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
  
    fetchUser();
  }, [id]);
  

  if (!user) {
      return <div className="text-center text-white mt-10">Chargement...</div>;
  }

  
  
  



    

  return (

      <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E]">
                  
      {/* Logo en haut à gauche */}
      <Header />
     
     
     
     
     
                         {/* En-tête */}
                         <div className="w-full bg-[#20599E] text-white pt-4 pb-16 text-center">
                        
                         <h1 className="text-4xl lg:text-5xl font-bold text-[#F4F4F4] mb-4">
                             Utilisateurs
                         </h1>
                       
              
                         </div>
     
     
        
                         
                         { /* <div className="w-full max-w-7xl bg-[#F4F4F4] min-h-screen rounded-t-[80px] px-6 py-8 shadow-md flex flex-col"> */}
                    
                         <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">


                         <div className="w-full">
<Headerbar title="" showPen={true} onClickPen={() => navigate(`/ModifierUtilisateur/${user.id}`)} />
</div>
             
             
         

        {/* Conteneur des champs utilisateur */}
  
    
        <div className="w-full max-w-6xl mx-auto px-6 mt-6 flex flex-col-reverse lg:flex-row-reverse gap-8">

{/* Partie Champs + Boutons */}
<div className="flex-1 flex flex-col space-y-6 text-base lg:pl-24 ">
  <div className="grid grid-cols-1 gap-4 ">
    <DisplayContainer title="Identifiant" content={user.id} />
    <DisplayContainer title="Rôle" content={user.role} />
  

{/* Afficher "Poste" seulement si le user est technicien */}
{user.role?.toLowerCase() === "technicien" && (
<DisplayContainer
  title="Poste"
  content={user.poste || "Non renseigné"} // Utilise user.poste ici
/>
)}
    <DisplayContainer title="E‑Mail" content={user.email} />
   
    {/* Téléphone + Boutons dans une même ligne sur desktop */}


    {user.role === "Technicien" && (
            <div>
              <DisplayContainer
                title="Disponibilité"
                content={user.disponibilite ? "Disponible" : "Pas disponible"}
              />
            </div>
          )}

{/* Est bloqué should be shown for all users */}
<div>
            <DisplayContainer
              title="Est bloqué"
              content={user.is_blocked ? "Utilisateur est bloqué" : "Utilisateur n'est pas bloqué"}

            />
          </div>

  
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">







<div className="flex-1 w-full order-2 sm:order-1">
  <DisplayContainer title="Téléphone" content={user.numero_tel || "Non renseigné"} />
</div>



</div>



  </div>
</div>

{/* Photo de profil à gauche (ou en haut sur mobile) */}
{/* Photo de profil à gauche (ou en haut sur mobile) */}
{/* Photo de profil à gauche (ou en haut sur mobile) */}
<div className="flex flex-col items-center top-8 text-center w-full  lg:w-auto">

{/* Avatar responsive */}
<div
  className="
    w-[150px]       /* mobile par défaut */
    sm:w-[200px]    /* ≥640px */
    md:w-[220px]    /* ≥768px */
    lg:w-[300px]    /* ≥1024px – agrandi pour PC */
    xl:w-[350px]    /* ≥1280px – encore plus grand */
    2xl:w-[400px]   /* ≥1536px si tu veux */
    aspect-square
    rounded-full
    overflow-hidden
    flex items-center justify-center
    mb-4
  "
>
  <label htmlFor="photoUpload" className="w-full h-full cursor-pointer ">

  {user.photo ? (
        <img
    
        src={user.photo}
        alt="Utilisateur"
        className="w-full h-full object-cover"
      />
    ) : (
      <MdAccountCircle className="text-primary w-full h-full" />
    )}
  </label>
</div>

{/* Nom + Prénom en dessous de la photo */}
<p className="text-black text-2xl font-semibold text-center lg:text-right">
  {user.first_name} {user.last_name}
</p>

{user.role?.toLowerCase() === "technicien" && (
  <div className="flex flex-wrap mt-8 order-1 sm:order-2">
    <Button
      text="Voir Tâches"
      bgColor="#F09C0A"
      onClick={() => navigate(`/Tacheechnicien/${id}`)}
      className="mr-auto sm:mr-0" // Ajout de la classe pour aligner à gauche
    />
  </div>
)}

</div>


</div>

          </div>
      </div>
  );
};

export default AjoutPagee;
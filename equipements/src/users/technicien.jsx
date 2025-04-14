import { useState, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import logo from '../assets/logo.png';
import { FaChevronDown } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";





const AjoutPagee =  () => {

    
    const [displayedUsers, setDisplayedUsers] = useState([]); // Stocke les utilisateurs affichés
    const [filter, setFilter] = useState("Tout");  // setFilter(newValue) → C'est la fonction qui met à jour filter avec newValue. et on a fait tout car "Tout" est la valeur initiale de filter.
    const [visibleCount, setVisibleCount] = useState(6);// Nombre d'utilisateurs affichés
    const [selectedUser, setSelectedUser] = useState(null);// Utilisateur sélectionné pour modification
    const [showEditPopup, setShowEditPopup] = useState(false); // Affichage du pop-up
    const [menuOpen, setMenuOpen] = useState(null);   //  gérer l'ouverture et la fermeture d'un menu.
    const [searchTerm, setSearchTerm] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);




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
    const roles = ["Administrateur", "Technicien", "Personnel"];
    const roless = ["Tout", "Administrateur", "Technicien", "Personnel"];
    

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const filteredUsers = users.filter(user => {
            const matchesFilter = filter === "Tout" || user.role === filter;
            
            const firstName = user.first_name ? user.first_name.toLowerCase() : "";
            const lastName = user.last_name ? user.last_name.toLowerCase() : "";
            const fullName = `${firstName} ${lastName}`.trim(); // Trim pour éviter espaces inutiles
            const reversedFullName = `${lastName} ${firstName}`.trim(); // Gère la recherche inversée
    
            const searchNormalized = searchTerm.toLowerCase().trim(); // pour quand je fais les espaces entre par example le nom et le prenom ne fait pas des erreurs 
    
            const matchesSearch = searchNormalized === "" || 
                firstName.includes(searchNormalized) ||
                lastName.includes(searchNormalized) ||
                user.email.toLowerCase().includes(searchNormalized) ||
                user.role.toLowerCase().includes(searchNormalized) ||
                fullName.includes(searchNormalized) ||   // Vérifie si "nom prénom" est inclus
                reversedFullName.includes(searchNormalized); // Vérifie si "prénom nom" est inclus
    
            return matchesFilter && matchesSearch;  // matchesFilter  Vérifie si l'utilisateur correspond au rôle sélectionné ( Administrateur, Technicien, Personnel)   matchesSearch Vérifie si l'utilisateur correspond au terme de recherche.
        });

        setDisplayedUsers(filteredUsers.slice(0, visibleCount));
    }, [filter, visibleCount]); // Ajout de filteredUsers
   
    const { id } = useParams();  // Récupérer l'ID depuis l'URL
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/users/user/${id}/`)

        // Modifier avec votre API
            .then((response) => response.json())
            .then((data) => setUser(data))
            .catch((error) => console.error("Erreur lors de la récupération des données :", error));
    }, [id]);

    if (!user) {
        return <div className="text-center text-white mt-10">Chargement...</div>;
    }
  
    
    
    



      

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md overflow-x-hidden ">
            <img src={logo} alt="Logo" className="absolute top-6 left-6 w-32 h-auto" />

            <div className="w-full bg-[#20599E] text-white py-16 text-center">
                <h1 className="text-4xl font-bold text-[#F4F4F4] mb-20">Utilisateurs</h1>
            </div>
            <div className="absolute top-6 right-16 flex items-center space-x-3">
        <MdAccountCircle className="text-white w-10 h-10" />
        <span className="text-white text-lg font-semibold">User Name</span>
    </div>


            <div className="w-full max-w-7xl bg-[#F4F4F4] min-h-screen rounded-t-[80px] px-6 py-10 shadow-md flex flex-col">
           

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
            {roless.map((rolee) => (
                <button
                    key={rolee}
                    className={`px-6 py-2 rounded-md font-semibold flex items-center ${
                        filter === rolee ? "bg-[#F09C0A] text-white" : "bg-gray-200 text-black"
                    }`}
                    onClick={() => {
                        if (rolee === "Technicien") {
                            setFilter(rolee);
                           
                        } else {
                            setFilter(rolee);
                           
                        }
                    }}
                >
                    {rolee}
                    {rolee === "Technicien" && (
                        <FaChevronDown className="ml-2 cursor-pointer" />
                    )}
                </button>
            ))}

                   
        </div>


                         {/* Image et Nom 
           
                {user.image ? (
                    <img src={user.image} alt={user.first_name} className="w-32 h-32 rounded-full mx-auto mb-4" />
                ) : (
                    <div className="w-32 h-32 bg-gray-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl">👤</span>
                    </div>
                )}*/}




          {/* Flèche de retour */}
          <div className="w-full max-w-4xl flex items-center mb-4">
                <ArrowLeft 
                    className="w-8 ml-2 mt-2 h-8 text-dark cursor-pointer" 
                    onClick={() => navigate(-1)} 
                />
            </div>
            

         
               
               
           

          {/* Conteneur des champs utilisateur */}
    
        {/* Identifiant */}
        <div className="p-6 space-y-4 w-full  ml-80 items-start pl-64">
        <div className="flex flex-col ">
            <label className="text-gray-700 font-medium">Identifiant</label>
            <input 
                type="text" 
                value={user.id} 
                disabled 
                className="w-1/2 bg-white p-3 rounded-lg border border-gray-300 mt-1 text-black shadow-xl"
            />
        </div>

        {/* Rôle */}
        <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Rôle</label>
            <input 
                type="text" 
                value={user.role} 
                disabled 
                className="w-1/2 bg-white p-3 rounded-lg border border-gray-300 mt-1 text-black shadow-xl"
            />
        </div>

        <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Poste</label>
            <input 
    type="text" 
    value={user.technicien?.poste || "Non renseigné"} 
    disabled 
    className="w-1/2 bg-white p-3 rounded-lg border border-gray-300 mt-1 text-black shadow-xl " 
/>

        </div>

        {/* Email */}
        <div className="flex flex-col">
            <label className="text-gray-700 font-medium">E-Mail</label>
            <input 
                type="email" 
                value={user.email} 
                disabled 
                className="w-1/2 bg-white p-3 rounded-lg border border-gray-300 mt-1 text-black shadow-xl "
            />
        </div>

        

                  {/* Numéro de téléphone + Voir Tâches */}
               {/* Numéro de téléphone + Voir Tâches */}
<div className="flex items-center justify-start space-x-4 w-full mr-16">
    {/* Bouton Voir Tâches */}
  

    {/* Champ Numéro de Téléphone */}
    <div className="flex flex-col w-1/2">
        <label className="text-gray-700 font-medium">Numéro De Téléphone</label>
        <input
            type="text"
            value={user.numero_tel || "Non renseigné"}
            disabled
            className="w-full bg-white p-3 rounded-lg border border-gray-300 mt-1 text-black shadow-xl"
        />
    </div>

    

  
</div>
<div className="flex  space-x-40  w-full">
    {/* Bouton Voir Tâches à gauche */}
    <button
        className="mt-6 px-4 py-2 bg-[#F09C0A] text-white rounded-md"
        onClick={() => navigate(`/Tacheechnicien/${id}`)}
    >
        Voir Tâches
    </button>

    {/* Autre bouton à droite 
    <button
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md"
      
    >
    Disponibilite
    </button>*/}
</div>





<div className="flex flex-col items-center justify-start pl-10 w-1/2">
  <div className="flex flex-col items-center" style={{ marginLeft: "-1100px", marginTop: "-580px" }}>
    
    {/* Cercle de 300px qui affiche soit l'image, soit l'icône */}
    <div className="w-[300px] h-[300px] rounded-full overflow-hidden  flex items-center justify-center">
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
            alt="Utilisateur"
            className="w-full h-full object-cover"
          />
        ) : (
          <MdAccountCircle className="text-[#20599E] " style={{ fontSize: "300px" }} />
        )}
      </label>
    </div>

    {/* Nom de l'utilisateur */}
    <p className="text-black text-2xl font-semibold mb-2 text-center">
      {user.first_name} {user.last_name}
    </p>
  </div>
</div>



</div>
       



 

            </div>
        </div>
    );
};

export default AjoutPagee;
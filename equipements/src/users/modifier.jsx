import { useState, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import logo from '../assets/logo.png';
import { FaChevronDown } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useParams } from "react-router-dom";



const ModifierPagesss = () => {



    
    const [displayedUsers, setDisplayedUsers] = useState([]); // Stocke les utilisateurs affichés
    const [filter, setFilter] = useState("Tout");  // setFilter(newValue) → C'est la fonction qui met à jour filter avec newValue. et on a fait tout car "Tout" est la valeur initiale de filter.
    const [visibleCount, setVisibleCount] = useState(6);// Nombre d'utilisateurs affichés
    const [selectedUser, setSelectedUser] = useState(null);// Utilisateur sélectionné pour modification
    const [showEditPopup, setShowEditPopup] = useState(false); // Affichage du pop-up
    const [menuOpen, setMenuOpen] = useState(null);   //  gérer l'ouverture et la fermeture d'un menu.
    const [searchTerm, setSearchTerm] = useState("");





    const [users, setUsers] = useState([]);
    const [updatedUser, setupdatedUser] = useState({
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
    const navigate = useNavigate();
    const { id } = useParams();

    const handleChange = (e) => {
        setupdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };
    const handleUpdate = async () => {
        if (!updatedUser.nom || !updatedUser.prenom || !updatedUser.email || !updatedUser.role || !updatedUser.telephone) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }

    
    
        const updatedUserData = {
            first_name: updatedUser.prenom,
            last_name: updatedUser.nom,
            email: updatedUser.email,
            phone: updatedUser.telephone,
            role: updatedUser.role,
            password: Math.random().toString(36).slice(-8),
        };
    
        console.log("Données envoyées à l'API :", updatedUserData);
        console.log("URL de l'API :", `http://localhost:8000/api/user/${id}/`);
    
        try {
            const response = await fetch(`http://localhost:8000/api/user/${id}/`, { 
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUserData),
            });
    
            const data = await response.json();
            console.log("Réponse API:", response.status, data);
    
            if (response.ok) {
                console.log("Utilisateur modifié avec succès !");
                setUsers(users.map(u => (u.id === selectedUser.id ? data : u)));
                setIsPopupVisible(true);
                setTimeout(() => setIsPopupVisible(false), 3000);
            } else {
                setErrorMessage("Erreur lors de la mise à jour : " + JSON.stringify(data));
            }
        } catch (error) {
            console.error("Erreur fetch :", error);
            setErrorMessage("Erreur réseau. Vérifiez votre connexion.");
        }
    };
    

    useEffect(() => {
        if (updatedUser.role === "Technicien") {
            navigate("/ModifierTechnicien"); // Redirige vers la page des techniciens
        }
    }, [updatedUser.role, navigate]); // S'exécute quand le rôle change




    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md">
            <img src={logo} alt="Logo" className="absolute top-6 left-6 w-32 h-auto" />

            <div className="w-full bg-[#20599E] text-white py-16 text-center">
                <h1 className="text-4xl font-bold text-dark mb-20">Utilisateurs</h1>
            </div>
            <div className="absolute top-6 right-16 flex items-center space-x-3">
        <MdAccountCircle className="text-white w-10 h-10" />
        <span className="text-white text-lg font-semibold">User Name</span>
    </div>


            <div className="w-full max-w-7xl bg-[#F4F4F4] min-h-screen rounded-t-[80px] px-6 py-10 shadow-md flex flex-col">
            <h2 className="text-black text-5xl font-bold text-center mt-4">
  Modifier un nouvel utilisateur
 </h2>

                   {/* bare de recherhce  */}


                   <div className="relative  w-full max-w-md my-8 -mt-60 mx-auto">
                              <div className="relative">
                                  <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                                  <input
                                      type="text"
                                     placeholder="Rechercher (nom, email, rôle...)"
                                      className="w-full bg-white text-balck  px-4 py-2 pl-10 rounded-full border border-gray-300 bg-darck shadow-md"
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


<div className="w-full max-w-3xl mx-auto mt-12 p-6">
    {/* Champs du formulaire */}
    <div className="flex space-x-4  mt-16 mb-4">
        <div className="w-full">
            <label className="block text-black font-bold">Rôle</label>
            <select
                name="role"
                value={updatedUser.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md bg-white text-black"
            >
                <option value="">__</option>
                {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>
        </div>

        <div className="w-full">
            <label className="block text-black font-bold">Nom</label>
            <input
                type="text"
                name="nom"
                value={updatedUser.nom}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md bg-white text-black"
            />
        </div>
    </div>

    <div className="flex space-x-4 mb-4">
        <div className="w-full">
            <label className="block text-black font-bold">E-mail</label>
            <input
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md bg-white text-black"
            />
        </div>

        <div className="w-full">
            <label className="block text-black font-bold">Prénom</label>
            <input
                type="text"
                name="prenom"
                value={updatedUser.prenom}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md bg-white text-black"
            />
        </div>
    </div>

    <div className="w-1/2 mb-6">
        <label className="block text-black font-bold">Numéro de téléphone</label>
        <input
            type="text"
            name="telephone"
            value={updatedUser.telephone}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md bg-white text-black"
        />
    </div>

    {/* Affichage du message d'erreur */}
    {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

    {/* Bouton Ajouter avec animation */}
    <div className="flex justify-center items-center mt-2">
        <motion.button
            onClick={handleUpdate}
            whileTap={{ scale: 0.9 }}
            className="px-4 bg-[#20599E] text-white py-2 rounded-md font-bold transition duration-200"
        >
            Modifier
        </motion.button>
    </div>
</div>

  {/* Flèche de retour */}
  <div className="w-full max-w-4xl flex items-center mb-4 relative top-[-400px]">
                <ArrowLeft 
                    className="w-8 ml-2 mt-2 h-8 text-dark cursor-pointer" 
                    onClick={() => navigate(-1)} 
                />
            </div>
            

 {/* Pop-up de confirmation */}
 {isPopupVisible && (
               <div className="fixed inset-0 flex justify-center items-center bg-transparent">

                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="text-4xl text-blue-500">✖</div>
                        <p className="text-lg font-bold mt-2">L’utilisateur a été modifier avec succès !</p>
                        <button
                            onClick={() => setIsPopupVisible(false)}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}




            </div>
        </div>
    );
};

export default ModifierPagesss;

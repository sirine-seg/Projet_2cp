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



const AjoutPage = () => {

    
    const [displayedUsers, setDisplayedUsers] = useState([]); // Stocke les utilisateurs affichés
    const [filter, setFilter] = useState("Tout");  // setFilter(newValue) → C'est la fonction qui met à jour filter avec newValue. et on a fait tout car "Tout" est la valeur initiale de filter.
    const [visibleCount, setVisibleCount] = useState(6);// Nombre d'utilisateurs affichés
    const [selectedUser, setSelectedUser] = useState(null);// Utilisateur sélectionné pour modification
    const [showEditPopup, setShowEditPopup] = useState(false); // Affichage du pop-up
    const [menuOpen, setMenuOpen] = useState(null);   //  gérer l'ouverture et la fermeture d'un menu.
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();



    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        nom: "__",
        prenom: "__",
        email: "__",
        role: "",
        telephone: "__"
    });
    const [errorMessage, setErrorMessage] = useState(""); // État pour afficher un message d'erreur
    const [isPopupVisible, setIsPopupVisible] = useState(false); // 🔹 Ajout du state pour le pop-up
    const roles = ["Administrateur", "Technicien", "Personnel"];
    const roless = ["Tout", "Administrateur", "Technicien", "Personnel"];
    

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleAddUser = async () => {
        // Vérifier si tous les champs sont remplis
        if (!newUser.nom || !newUser.prenom || !newUser.email || !newUser.telephone) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }
        setIsPopupVisible(true); //  Affiche le pop-up si on ajoute un user
        setTimeout(() => setIsPopupVisible(false), 3000); // Cache après 3 secondes


        const newUserData = {
            first_name: newUser.prenom,
            last_name: newUser.nom,
            email: newUser.email,
            numero_tel: newUser.telephone,
            role: newUser.role,
            password: Math.random().toString(36).slice(-8),
        };

        try {
            const response = await fetch("http://localhost:8000/api/user/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUserData),
            });

            const data = await response.json();
            console.log("Réponse API:", data);

            if (response.ok) {
                console.log("Utilisateur ajouté avec succès !");
                setUsers([...users, data]);
                setNewUser({ nom: "", prenom: "", email: "", role: "", telephone: "" });
                setErrorMessage(""); // Réinitialise l'erreur après un ajout réussi
            } else {
                setErrorMessage("Erreur lors de l'ajout : " + JSON.stringify(data));
            }
        } catch (error) {
            setErrorMessage("Erreur réseau. Vérifiez votre connexion.");
        }
    };

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
    
            useEffect(() => {
                if (newUser.role === "Technicien") {
                    navigate("/AjoutTechnicien"); // Redirige vers la page des techniciens
                }
            }, [newUser.role, navigate]); // S'exécute quand le rôle change


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
    Ajouter un nouvel utilisateur
 </h2>

                   {/* bare de recherhce  */}


                   <div className="relative w-full max-w-md my-8 -mt-60 mx-auto">
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
        <div className="flex flex-wrap justify-center space-x-1 sm:space-x-4 mt-2 mb-2">
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
                value={newUser.role}
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
                value={newUser.nom}
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
                value={newUser.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md bg-white text-black"
            />
        </div>

        <div className="w-full">
            <label className="block text-black font-bold">Prénom</label>
            <input
                type="text"
                name="prenom"
                value={newUser.prenom}
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
            value={newUser.telephone}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md bg-white text-black"
        />
    </div>

    {/* Affichage du message d'erreur */}
    {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

    {/* Bouton Ajouter avec animation */}
    <div className="flex justify-center items-center mt-2">
        <motion.button
            onClick={handleAddUser}
            whileTap={{ scale: 0.9 }}
            className="px-4 bg-[#20599E] text-white py-2 rounded-md font-bold transition duration-200"
        >
            Ajouter
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
                        <p className="text-lg font-bold mt-2">L’utilisateur a été ajouté avec succès !</p>
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

export default AjoutPage;
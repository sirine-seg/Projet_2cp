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
        nom: "",
        prenom: "",
        email: "",
        role: "",
        telephone: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState(""); // État pour afficher un message d'erreur
    const [isPopupVisible, setIsPopupVisible] = useState(false); //  Ajout du state pour le pop-up
    const roles = ["Administrateur", "Technicien", "Personnel"];
    const roless = ["Tout", "Administrateur", "Technicien", "Personnel"];
    
    
    useEffect(() => {
        setNewUser((prevUser) => ({ ...prevUser, role: "Technicien" }));
    }, []);


    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleAddUser = async () => {
        // Vérifier si tous les champs sont remplis
        if (!newUser.nom || !newUser.prenom || !newUser.email || !newUser.telephone) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }

       


        const newUserData = {
            first_name: newUser.prenom,
            last_name: newUser.nom,
            email: newUser.email,
            numero_tel: newUser.telephone ,
            role: newUser.role ,
            poste: newUser.poste || "", // Optionnel, peut être vide
            password:newUser.password,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/users/create_technicien/", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                   
                },
                body: JSON.stringify(newUserData),
            });

            const data = await response.json();
            console.log("Réponse API:", data);

            if (response.ok) {
                console.log("Utilisateur ajouté avec succès !");
                setUsers([...users, data]);
                setNewUser({ nom: "", prenom: "", email: "", role: "", telephone: "" , poste: ""  });
                setErrorMessage(""); // Réinitialise l'erreur après un ajout réussi
                setIsPopupVisible(true); 
            } else {
                setErrorMessage("Erreur lors de l'ajout : " + JSON.stringify(data));
                setIsPopupVisible(false); 
            }
        } catch (error) {
           //   setErrorMessage("Erreur réseau. Vérifiez votre connexion.");
           //   setIsPopupVisible(false); 
            setIsPopupVisible(true); 
        }
    };

   // useEffect(() => {
    //    const fetchUsers = async () => {  // On crée une fonction asynchrone  pour récupérer les données depuis le backend.
         //   let url = "http://127.0.0.1:8000/api/user/?";

         //   if (searchTerm) {
         //       url += `search=${searchTerm}&`;  // Envoie la recherche à Django  si searchterm n'est pas vide, on ajoute un paramètre search= à l’URL.
         //   }
          //  if (filter !== "Tout") {
          //      url += `role=${filter}&`;  // Filtre par rôle
           // }

           // const response = await fetch(url);  //  envoie vers le backend 
           // const data = await response.json();
           // setUsers(data); // Met à jour l’état users pour afficher les utilisateurs filtrés
     //   };

      //  fetchUsers();
 //   }, [searchTerm, filter]);  // a chaque fois que searchTerm ou filter change, React exécute fetchUsers().


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
            disabled //  Désactive le champ pour empêcher la modification
            className="w-full px-4 py-3 border rounded-md bg-white text-black cursor-not-allowed"
        >
            <option value="Technicien">Technicien</option> {/* Fixe l'option */}
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
    <div className="flex space-x-4 mb-4"> 
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


    
    <div className="w-1/2 mb-6">
        <label className="block text-black font-bold">Poste</label>
        <input
            type="text"
            name="poste"
            value={newUser.poste}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md bg-white text-black"
        />
    </div>
    </div>

    <div className="w-1/2 mb-6 -mt-5">
    <label className="block text-black font-bold">Mot de passe</label>
    <input
        type="text"
        name="password"
        value={newUser.password}
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
  <div className="fixed inset-0 flex justify-center items-center  bg-opacity-40 z-999">
    <div className="bg-white p-8 rounded-3xl shadow-2xl w-[90%] max-w-md relative text-center">

      {/* Icône cercle avec check */}
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#E0ECF8] flex items-center justify-center">
        <svg className="w-8 h-8 text-[#20599E] " fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Texte principal */}
      <p className="text-xl font-semibold text-gray-900">L’utilisateur a été ajouté avec succès !</p>

      {/* Bouton fermer */}
      <button
        onClick={() => setIsPopupVisible(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-black text-lg"
      >
        ✖
      </button>
    </div>
  </div>
)}





            </div>
        </div>
    );
};

export default AjoutPage;
import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import PopupMessage from "../components/Popupcheck";
import SearchBar from "../components/Searchbar"; 
import Filterbutton from "../components/Filterbutton"; 
import Header from "../components/Header";
import AjouterButton from "../components/Ajouterbutton";
import Buttonrec from "../components/buttonrectangle";
import Usercard from "../components/Usercard";
import Badge from "../components/badge";
import ChoiceContainer from "../components/choiceContainer"; 
import WriteContainer from "../components/writeContainer";   
import Headerbar from "../components/Arrowleftt";  




const  ModifierPagesss= () => {

    
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    useEffect(() => {
        setNewUser((prevUser) => ({ ...prevUser, role: "Technicien" }));
    }, []);


    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };
    const role = newUser.role || "Technicien";


    const handleAddUser = async () => {
        // Vérifier si tous les champs sont remplis
        if (!newUser.nom || !newUser.prenom || !newUser.email || !newUser.telephone || !newUser.password) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
          }
          

       


        const newUserData = {
            first_name: newUser.prenom,
            last_name: newUser.nom,
            email: newUser.email,
            numero_tel: newUser.telephone ,
            role: role ,
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
                    
        {/* Logo en haut à gauche */}
        <Header />
       
       
       
       
       
                           {/* En-tête */}
                           <div className="w-full bg-[#20599E] text-white py-16 text-center">
                          
                           <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
                            Utilisateur
                           </h1>
                           {/* bare de recherhce  */}    
                 <SearchBar
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   placeholder="Rechercher (nom, email, rôle...)"
                 />
       
       
       
       
       
                 {/*


              {/* Boutons de filtre – dans la partie bleue, au-dessus de la searchbar */}
          <div className="mx-auto w-full max-w-4xl px-4 mt-4 -mt-8  flex justify-center">
          <div className="flex flex-nowrap space-x-2 overflow-x-auto no-scrollbar">
    {roless.map((role) => (
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
                    <div className="w-full ">
  <Headerbar title="Modifier un nouvel utilisateur" />
</div>

             
                    <div className="w-full max-w-5xl mx-auto mt-12 p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Rôle bloqué */}



  <ChoiceContainer
  title="Rôle"
  options={[
   
    { label: "Administrateur", value: "Administrateur" },
    { label: "Technicien", value: "Technicien" },
  ]}
  selectedOption={newUser.role}
  onSelect={(val) => setNewUser({ ...newUser, role: val })}
/>

{newUser.role === "Technicien" && (
  <WriteContainer
    title="Poste"
    value={newUser.poste}
    onChange={(val) => setNewUser({ ...newUser, poste: val })}
  />
)}





<WriteContainer
  title="Nom"
  value={newUser.nom}

  onChange={(val) => setNewUser({ ...newUser, nom: val })}
/>

<WriteContainer
  title="Prénom"
  value={newUser.prenom}
 
  onChange={(val) => setNewUser({ ...newUser, prenom: val })}
/>

<WriteContainer
  title="E-mail"
  value={newUser.email}
 
  onChange={(val) => setNewUser({ ...newUser, email: val })}

/>

<WriteContainer
  title="Numéro de téléphone"
  value={newUser.telephone}
  
  onChange={(val) => setNewUser({ ...newUser, telephone: val })}
/>

{newUser.role === "Technicien" && (
  <WriteContainer
    title="Poste"
    value={newUser.poste}
    onChange={(val) => setNewUser({ ...newUser, poste: val })}
  />
)}





</div>


   
    {/* Bouton Ajouter avec animation */}
    <div className="flex justify-center mt-4">
  <Buttonrec text="Modifier" onClick={handleAddUser} />
</div>
 {/* Affichage du message d'erreur */}
 {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

{/* Flèche de retour */}
 
            {isPopupVisible && (
  <PopupMessage
    title="L’utilisateur a été Modifier avec succès !"
    onClose={() => setIsPopupVisible(false)}
  />
)}


            </div>
        </div>
    );
};

export default ModifierPagesss;

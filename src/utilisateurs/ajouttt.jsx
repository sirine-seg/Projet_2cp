import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PopupMessage from "../components/Popupcheck";
import Buttonrec from "../components/buttonrectangle";
import ChoiceContainer from "../components/choiceContainer";
import WriteContainer from "../components/writeContainer";
import Headerbar from "../components/Arrowleftt";

const AjoutPage = () => {
  const [menuOpen, setMenuOpen] = useState(null); //  gérer l'ouverture et la fermeture d'un menu.
  const [postesList, setPostesList] = useState([]);

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "",
    telephone: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // État pour afficher un message d'erreur
  const [isPopupVisible, setIsPopupVisible] = useState(false); //  Ajout du state pour le pop-up

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.nom || !newUser.prenom) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    const newUserData = {
      first_name: newUser.prenom,
      last_name: newUser.nom,
      email: newUser.email,
      numero_tel: newUser.telephone,
      role: role,
      ...(newUser.poste && { poste: newUser.poste }),
      ...(newUser.password &&
        newUser.password.trim() && { password: newUser.password }),
    };

    const token = localStorage.getItem("access_token");
    if (!token) {
      setErrorMessage("Token d'accès non trouvé !");
      return;
    }

    try {
      const response = await fetch(
        "https://esi-track-deployement.onrender.com/api/accounts/createUser/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newUserData),
        }
      );

      const data = await response.json();
      console.log("Réponse API:", data);

      if (response.ok) {
        setUsers([...users, data]);
        setNewUser({
          nom: "",
          prenom: "",
          email: "",
          role: "",
          telephone: "",
          poste: "",
        });
        setErrorMessage("");
        setIsPopupVisible(true);
      } else {
        setErrorMessage("Erreur lors de l'ajout : " + JSON.stringify(data));
        setIsPopupVisible(false);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setErrorMessage("Erreur réseau. Vérifiez votre connexion.");
      setIsPopupVisible(false);
    }
  };

  // Récupération des postes à partir de l'API
  useEffect(() => {
    const fetchPostes = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Token d'accès non trouvé !");
        return;
      }

      try {
        const response = await fetch(
          "https://esi-track-deployement.onrender.com/api/accounts/postes/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok)
          throw new Error("Erreur lors du chargement des postes");
        const data = await response.json();
        setPostesList(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des postes :", error);
      }
    };

    fetchPostes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleCloseSuccessPopup = () => {
    navigate("/Utilisateurs");
    setIsPopupVisible(false);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] font-poppins">
      {/* Logo en haut à gauche */}
      <Header />

      {/* En-tête */}
      <div className="w-full bg-[#20599E] text-white pb-16 text-center">
        <h1 className="text-3xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Utilisateurs
        </h1>
      </div>

      <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        <div className="w-full ">
          <Headerbar title="Ajouter un nouvel utilisateur" />
        </div>

        <div className="w-full max-w-5xl mx-auto mt-4 p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mt-2">
            <ChoiceContainer
              title="Rôle"
              options={[
                { label: "Administrateur", value: "Administrateur" },
                { label: "Technicien", value: "Technicien" },
                { label: "Personnel", value: "Personnel" },
              ]}
              selectedOption={newUser.role}
              onSelect={(val) => setNewUser({ ...newUser, role: val })}
            />
            {newUser.role === "Technicien" && (
              <ChoiceContainer
                title="Poste"
                options={postesList.map((poste) => ({
                  label: poste.nom, // Ce qui sera affiché
                  value: poste.id, // La vraie valeur sélectionnée
                }))}
                selectedOption={
                  postesList.find((poste) => poste.id === newUser.poste)?.nom ||
                  ""
                }
                onSelect={(val) => setNewUser({ ...newUser, poste: val })}
              />
            )}
          </div>

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

          <WriteContainer
            value={newUser.password}
            onChange={(val) => setNewUser({ ...newUser, password: val })}
            title="Mot de passe"
          />
        </div>

        {/* Bouton Ajouter avec animation */}
        <div className="flex justify-center mt-4">
          <Buttonrec text="Ajouter" onClick={handleAddUser} />
        </div>
        {/* Affichage du message d'erreur */}
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {/* Flèche de retour */}

        {isPopupVisible && (
          <PopupMessage
            title="L'utilisateur a été ajouté avec succès!"
            onClose={handleCloseSuccessPopup}
          />
        )}
      </div>
    </div>
  );
};

export default AjoutPage;

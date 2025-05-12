import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PopupMessage from "../components/Popupcheck";
import Header from "../components/Header";
import Buttonrec from "../components/buttonrectangle";
import ChoiceContainer from "../components/choiceContainer";
import WriteContainer from "../components/writeContainer";
import Headerbar from "../components/Arrowleftt";
import { useParams } from "react-router-dom";

const ModifierPagesss = () => {
  const [postesList, setPostesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "",
    telephone: "",
    poste: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  // Récupération des données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Token d'accès non trouvé !");
        setErrorMessage("Accès refusé : veuillez vous reconnecter.");
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/accounts/users/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log("Données utilisateur récupérées:", data);
          setNewUser({
            nom: data.last_name,
            prenom: data.first_name,
            email: data.email,
            role: data.role || "Personnel",
            telephone: data.numero_tel,
            poste:
              data.role === "Technicien"
                ? data.technicien?.poste?.id || ""
                : "",
          });
        } else {
          setErrorMessage("Erreur lors de la récupération des données.");
        }
      } catch (error) {
        console.error("Erreur fetch:", error);
        setErrorMessage("Erreur réseau. Vérifiez votre connexion.");
      }
    };

    fetchUserData();
  }, [id]);

  // Récupération des postes
  useEffect(() => {
    const fetchPostes = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Token d'accès non trouvé !");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/accounts/postes/",
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
        console.log("Postes disponibles:", data);
      } catch (error) {
        console.error("Erreur lors de la récupération des postes :", error);
      }
    };

    fetchPostes();
  }, []);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async () => {
    if (!newUser.nom || !newUser.prenom || !newUser.email) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    if (newUser.role === "Technicien" && !newUser.poste) {
      setErrorMessage("Veuillez sélectionner un poste pour le technicien.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setErrorMessage("Token d'accès non trouvé. Veuillez vous reconnecter.");
      return;
    }

    const userData = {
      first_name: newUser.prenom,
      last_name: newUser.nom,
      email: newUser.email,
      numero_tel: newUser.telephone,
      role: newUser.role,
    };

    const technicienData = {
      poste: newUser.role === "Technicien" ? parseInt(newUser.poste) : null,
    };

    try {
      const userResponse = await fetch(
        `http://127.0.0.1:8000/api/accounts/users/${id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        setErrorMessage(
          "Erreur lors de la modification des informations de l'utilisateur : " +
            JSON.stringify(errorData)
        );
        return;
      }

      const userDataResult = await userResponse.json();
      console.log("Réponse de l'API (user):", userDataResult);

      if (newUser.role === "Technicien") {
        const technicienResponse = await fetch(
          `http://127.0.0.1:8000/api/accounts/techniciens/${id}/update/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(technicienData),
          }
        );

        if (!technicienResponse.ok) {
          const errorData = await technicienResponse.json();
          setErrorMessage(
            "Erreur lors de la modification du poste : " +
              JSON.stringify(errorData)
          );
          return;
        }

        const technicienDataResult = await technicienResponse.json();
        console.log("Réponse de l'API (technicien):", technicienDataResult);
      }

      setIsPopupVisible(false);
      setTimeout(() => setIsPopupVisible(true), 10);
    } catch (error) {
      console.error("Erreur complète:", error);
      setErrorMessage("Erreur réseau. Vérifiez votre connexion.");
    }
  };

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
        <div className="w-full">
          <Headerbar title="Modifier un utilisateur" />
        </div>

        <div className="w-full max-w-5xl mx-auto mt-4 p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Affichage du sélecteur de poste uniquement pour les techniciens */}
          {newUser.role === "Technicien" && (
            <ChoiceContainer
              title="Poste"
              options={postesList.map((poste) => ({
                label: poste.nom,
                value: poste.id,
              }))}
              selectedOption={
                postesList.find((poste) => poste.id === parseInt(newUser.poste))
                  ?.nom || ""
              }
              onSelect={(val) => {
                setNewUser({ ...newUser, poste: val });
              }}
            />
          )}
        </div>

        {/* Bouton Modifier avec animation */}
        <div className="flex justify-center mt-4">
          <Buttonrec text="Modifier" onClick={handleAddUser} />
        </div>

        {/* Affichage du message d'erreur */}
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {/* Popup de confirmation */}
        {isPopupVisible && (
          <PopupMessage
            title="L'utilisateur a été modifié avec succès !"
            onClose={handleCloseSuccessPopup}
          />
        )}
      </div>
    </div>
  );
};

export default ModifierPagesss;

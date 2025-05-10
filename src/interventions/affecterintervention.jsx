import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Buttonrec from "../components/buttonrectangle";
import Headerbar from "../components/Arrowleftt";
import DisModContainer from "../components/disModContainer";
import UserProfilMail from "../components/userProfilMail";
import ChoiceContainer from "../components/choiceContainer";
import AssignPopUp from "../components/assignPopUp";


const Affecter = () => {
  const [users, setUsers] = useState([]); // Stocke tous les utilisateurs
  const [displayedUsers, setDisplayedUsers] = useState([]); // Stocke les utilisateurs affichés
  const [filter, setFilter] = useState("Tout");
  const [visibleCount, setVisibleCount] = useState(9); // Nombre d'utilisateurs affichés
  const [selectedUser, setSelectedUser] = useState(null); // Utilisateur sélectionné pour modification
  const [showEditPopup, setShowEditPopup] = useState(false); // Affichage du pop-up
  const [menuOpen, setMenuOpen] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [intervention, setIntervention] = useState(null);
  const [urgenceLabel, setUrgenceLabel] = useState("");
  const [availableTechnicians, setAvailableTechnicians] = useState([]);
  const { id_intervention } = useParams(); // récupère l'ID de l'URL
  const [showComponent2, setShowComponent2] = useState(false);
  const [selectedTech, setSelectedTech] = useState([]);
  const [selectedProfil, setSelectedProfil] = useState(false);
  const [selectedDateFin, setSelectedDateFin] = useState("");
  // États pour les données simulées
  const urgenceOptions = [
    { value: 1, label: "Urgence vitale" },
    { value: 2, label: "Urgence élevée" },
    { value: 3, label: "Urgence modérée" },
    { value: 4, label: "Faible urgence" },
  ];

  // États de sélection
  const [selectedUrgence, setSelectedUrgence] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [assignedTechniciens, setAssignedTechniciens] = useState([]);
  const [selectedDatedebut, setSelectedDatedebut] = useState("");
  console.log(id_intervention);

  // integration de fetch des technicien :
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const token = localStorage.getItem("access_token"); // adjust the key if different
        const response = await fetch(
          "http://127.0.0.1:8000/api/accounts/techniciens/",
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch technicians");
        const data = await response.json();
        console.log(data);
        // set all technicians
        //setTechnicians(data);

        // filter by disponibilite = true
        const filtered = data.filter((tech) => tech.disponibilite === true);
        setAvailableTechnicians(filtered);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    };

    fetchTechnicians();
  }, []);

  const techniciensDispo = users.filter(
    (user) =>
      user.role === "Technicien" &&
      user.technicien &&
      user.technicien.disponibilite === true
  );

  const addTechnicien = (technicien) => {
    setAssignedTechniciens([...assignedTechniciens, technicien]);
    setIsPopupVisible(false); // Fermer le popup après l'ajout
  };

  // integration de fetch des interventions :
  const technicianIds = selectedTech.map((tech) => tech.id);
  const gatherdDataCurrative = {
    technicien: technicianIds,
    urgence: selectedUrgence - 1,
    date_debut: selectedDatedebut,
    date_fin: selectedDateFin,
  };

  //quand je tape sur l'ecran le pop up disparaitre
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest(".popup-menu")) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // integration de update des interventions :
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token"); // retrieve token
      const payload = {
        urgence: selectedUrgence,
        technicien:
          assignedTechniciens.length > 0 ? assignedTechniciens[0].id : null,

        date_fin: selectedDate,
      };

      const response = await fetch(
        `http://127.0.0.1:8000/api/interventions/interventions/affecter/${id_intervention}/  `,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(gatherdDataCurrative),
        }
      );

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      const updatedData = await response.json();
      setIntervention(updatedData); // Mets à jour l’état avec les nouvelles données
      alert("Intervention mise à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Échec de la mise à jour !");
    }
  };

  const removeTechnicien = (indexToRemove) => {
    setAssignedTechniciens((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };
  const handleChoiceCLick2 = () => {
    setShowComponent2(true);
  };

  // for handling urgency selection
  const handleUrgenceSelect = (option) => {
    console.log("option" + option);
    setSelectedUrgence(option);
    console.log("the String" + selectedUrgence); // Update the value
    //      const label = urgenceOptions.find(option => option.value === valueToFind)?.label || '--';
    setUrgenceLabel(option.label); // Update the label instantly
  };
  const labelUrgence =
    urgenceOptions.find((option) => option.value === selectedUrgence)?.label ||
    "--";

  function handleChoisir(tech) {
    setSelectedTech((prevTechs) => {
      if (!prevTechs.includes(tech.user)) {
        return [...prevTechs, tech.user];
      }
      return prevTechs;
    });
    setSelectedProfil(true);
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E]">
      {/* Logo en haut à gauche */}
      <Header />

      {/* En-tête */}
      <div className="w-full bg-[#20599E] text-white pb-16 text-center">
        <h1 className="text-3xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Interventions
        </h1>
      </div>

      <div className="w-full min-h-screen rounded-t-[35px] sm:rounded-t-[45px] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        <div className="w-full ">
          <Headerbar title="Affecte une Intervention" />
        </div>

        <div className="w-full max-w-5xl mx-auto mt-8 sm:mt-10 p-0 grid grid-cols-1 md:grid-cols-2  gap-x-16 gap-6">
          {/* ───────── Colonne de gauche : Technicien(s) ───────── */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-4">
            <div className="technician-section">
              <Buttonrec
                text="Assigne un Techncien"
                bgColor="#F09C0A"
                textColor="white"
                onClick={handleChoiceCLick2}
                className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg shadow-md hover:bg-gray-400"
              />

              {/* List of selected technicians appears here */}
              {selectedTech.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-2 font-semibold">
                    Technicians sélectionnés:
                  </h3>
                  {selectedTech.map((tech, index) => (
                    <UserProfilMail
                      key={index}
                      nom={tech.last_name}
                      prenom={tech.first_name}
                      email={tech.email}
                      imageUrl={tech.photo}
                    />
                  ))}
                </div>
              )}

              {/* Keep the AssignPopUp component */}
              {showComponent2 && (
                <AssignPopUp
                  technicians={availableTechnicians}
                  buttonTitle="Assigner"
                  onClose={() => setShowComponent2(false)}
                  onAssign={handleChoisir}
                />
              )}
            </div>
          </div>

          {/* ───────── Colonne de droite : Urgence + Dates ───────── */}

          <div className="space-y-6">
            <ChoiceContainer
              title="Urgence"
              options={urgenceOptions}
              selectedOption={labelUrgence}
              onSelect={handleUrgenceSelect}
              className="text-sm py-1 px-2 max-w-xs w-full"
            />

            <DisModContainer
              title="Date de début"
              value={selectedDatedebut}
              onSave={(value) => setSelectedDatedebut(value)}
              type="date"
              className="text-sm py-1 px-2  max-w-full md:max-w-[400px]"
            />

            <DisModContainer
              title="Date de fin"
              value={selectedDateFin}
              onSave={(value) => setSelectedDateFin(value)}
              type="date"
              className="py-2 px-3 text-sm"
            />
          </div>

        </div>

        {/* ───────── Bouton Terminer en dessous ───────── */}
        <div className="flex justify-center mt-4 sm:mt-10">
          <Buttonrec text="Terminer" onClick={handleUpdate} />
        </div>

        {/* ───────── Popup d’assignation ───────── */}
        {showPopup && (
          <AssignPopUp
            titre="Technicien(s) disponibles"
            description="Les techniciens disponibles en ce moment."
            buttonTitle="Ajouter"
            technicians={techniciensDispo.map((t) => ({
              id: t.id,
              nom: t.last_name,
              prenom: t.first_name,
              poste: t.technicien?.poste || "Non spécifié",
              imageUrl: t.technicien?.photo?.startsWith("http")
                ? t.technicien.photo
                : `http://127.0.0.1:8000${t.technicien?.photo}`,
            }))}
            onClose={() => setShowPopup(false)}
            onAssign={(user) =>
              addTechnicien({
                id: user.id,
                name: `${user.prenom} ${user.nom}`,
                email: user.email,
                imageUrl: user.imageUrl,
                poste: user.poste,
              })
            }
          />
        )}
      </div>
    </div>
  );
};

export default Affecter;

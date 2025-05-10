import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import PopupMessage from "../components/Popupcheck";
import Headerbar from "../components/Arrowleftt";
import DisModContainer from "../components/disModContainer";
import UserProfilMail from "../components/userProfilMail";
import ChoiceContainer from "../components/choiceContainer";
import AssignPopUp from "../components/assignPopUp";
import DisModContainerEquip from "../components/disModContainerEquip";
import WriteContainer from "../components/writeContainer";
import Buttonrec from "../components/buttonrectangle";
import DurationInput from "../components/DurationInput.jsx";

const AjouterIntervention = () => {
  // STATES FOP EQUIPEMENT CONTAINER
  const [equipments, setEquipments] = useState([]); // the list of equipement instances
  const [selectedEquip, setSelectedEquip] = useState(null); // the selected equipement instance
  const [selectedEquipId, setSelectedEquipId] = useState(null); // the selected equipement ID
  const [formattedEquipement, setformattedEquipement] = useState(null);
  const [interventions, setInterventions] = useState([]); // Stocke toutes les interventions
  const [displayedInterventions, setDisplayedInterventions] = useState([]); // Stocke les interventions affichées
  const [filter, setFilter] = useState("Tout");
  const [users, setUsers] = useState([]); // Stocke tous les utilisateurs
  const [displayedUsers, setDisplayedUsers] = useState([]); // Stocke les utilisateurs affichés
  const [visibleCount, setVisibleCount] = useState(9); // Nombre d'utilisateurs affichés
  const [showComponent, setShowComponent] = useState(false);
  const [showComponent2, setShowComponent2] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [availableTechnicians, setAvailableTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState([]);
  const [selectedProfil, setSelectedProfil] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isDisponibleActive, setIsDisponibleActive] = useState(false);
  const [selectedInterventionid, setSelectedInterventionid] = useState(null);
  const [selectedStatutName, setSelectedStatutName] = useState("");
  const [statusList, setStatusList] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedStatutId, setSelectedStatutId] = useState("");
  const [title, settitle] = useState("");
  // États de sélection
  const [selectedUrgence, setSelectedUrgence] = useState(3);
  const [selectedDateFin, setSelectedDateFin] = useState("");
  const [assignedTechniciens, setAssignedTechniciens] = useState([]);
  const [selectedTypeIntervention, setSelectedTypeIntervention] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  //const [setEquip, setSelectedEquip] = useState("");
  const [showPopupadmin, setshowPopupadmin] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [description, setdescription] = useState("");
  const [selectedDatedebut, setSelectedDatedebut] = useState("");
  const [UrgenceLabel, setUrgenceLabel] = useState("");
  // use state for duration display  :
  const [afficherDuree, setAfficherDuree] = useState(false);
  // use state for getting the entered data  :
  const [durationValue, setDurationValue] = useState("");

  const [estCurrative, setestCurrative] = useState(true);

  const handleChange = (event) => {
    setSelectedStatus(event.target.value);
  };
  // for handling equipement opening  :
  const handleChoiceClick = () => {
    setShowComponent(true);
  };
  const handleChoiceCLick2 = () => {
    setShowComponent2(true);
  };

  function handleChoisir(tech) {
    setSelectedTech((prevTechs) => {
      if (!prevTechs.includes(tech.user)) {
        return [...prevTechs, tech.user];
      }
      return prevTechs;
    });
    setSelectedProfil(true);
  }

  function handleAssign(tech) {
    // tech is expected to be the full technician object, including user info
    setSelectedTech(tech.user); // or adjust if tech is already user object
    setSelectedProfil(true);
  }

  const [assignedAdmins, setAssignedAdmins] = useState([]);

  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const [intervention, setIntervention] = useState(null);
  // Appel des hooks TOUJOURS EN HAUT
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const accessToken = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  useEffect(() => {
    const fetchStatusList = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/interventions/interventions/status/",
          {
            headers: headers,
          }
        );

        if (!response.ok) throw new Error("Failed to fetch statuses");
        const data = await response.json();
        setStatusList(data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchStatusList();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/accounts/users/",
          {
            headers: headers,
          }
        );

        if (!response.ok)
          throw new Error("Erreur lors de la récupération des utilisateurs");

        const data = await response.json();
        setUsers(data);
        setDisplayedUsers(data.slice(0, visibleCount));
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    fetchUsers();
  }, [visibleCount]);

  const techniciensDispo = users.filter(
    (user) =>
      user.role?.toLowerCase() === "technicien" &&
      user.technicien?.disponibilite === true
  );

  const admintab = users.filter(
    (user) => user.role?.toLowerCase() === "administrateur"
  );

  const addTechnicien = (technicien) => {
    setAssignedTechniciens([...assignedTechniciens, technicien]);
    setIsPopupVisible(false); // Fermer le popup après l'ajout
  };

  const addAdmin = (admin) => {
    setAssignedAdmins((prev) => [...prev, admin]);
    setshowPopupadmin(false); // Fermer le pop-up des admins
  };

  const removeTechnicien = (indexToRemove) => {
    setAssignedTechniciens((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const urgenceOptions = [
    { value: 1, label: "Urgence vitale" },
    { value: 2, label: "Urgence élevée" },
    { value: 3, label: "Urgence modérée" },
    { value: 4, label: "Faible urgence" },
  ];
  const labelUrgence =
    urgenceOptions.find((option) => option.value === selectedUrgence)?.label ||
    "--";

  const statutOptions = [
    { id: 1, label: "En attente" },
    { id: 2, label: "En cours" },
    { id: 3, label: "Terminé" },
    { id: 4, label: "Affecté" },
  ];

  const typeInterventionOptions = [
    // Add your options here, for example:
    { label: "Preventive", value: "preventive" },
    { label: "Currative", value: "currative" },
  ];

  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (typeof onSave === "function") {
      //  onSave({ setContent }); // Call the onSave function passed as a prop
      setIsEditing(false); // Exit editing mode
    } else {
      console.error("onSave is not a function");
    }
  };

  useEffect(() => {
    if (selectedInterventionid && selectedStatutName) {
      setInterventions((prev) =>
        prev.map((intervention) =>
          intervention.id === selectedInterventionid
            ? { ...intervention, statut_label: selectedStatutName }
            : intervention
        )
      );
    }
  }, [selectedStatutName]);

  const handleAssignAdmin = (admin) => {
    setAssignedAdmins([
      {
        nom: admin.nom,
        prenom: admin.prenom,
        email: admin.email,
        imageUrl: admin.imageUrl,
      },
    ]);
  };

  const handlePreventiveChoice = (selectedCHoice) => {
    console.log(selectedCHoice);
    setSelectedTypeIntervention(selectedCHoice);
    if (selectedCHoice === "preventive") {
      setAfficherDuree(true);
      setestCurrative(false);
    } else if (selectedCHoice === "currative") {
      setAfficherDuree(false);
      setestCurrative(true);
    }
  };

  const handleUrgenceSelect = (option) => {
    console.log("option" + option);
    setSelectedUrgence(option);
    console.log("the String" + selectedUrgence); // Update the value
    //      const label = urgenceOptions.find(option => option.value === valueToFind)?.label || '--';
    setUrgenceLabel(option.label); // Update the label instantly
  };

  // integrarion des fetch des equipement  :

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          "http://127.0.0.1:8000/api/equipements/equipement",
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch equipments");
        const data = await response.json();
        console.log(data);
        setEquipments(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEquipments();
  }, []);

  /// integration des fetch des technician  :
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
        setTechnicians(data);

        // filter by disponibilite = true
        const filtered = data.filter((tech) => tech.disponibilite === true);
        setAvailableTechnicians(filtered);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    };

    fetchTechnicians();
  }, []);

  // integration de submission :

  const technicianIds = selectedTech.map((tech) => tech.id);
  const gatherdDataCurrative = {
    type_intervention: selectedTypeIntervention,
    title: title,
    equipement: selectedEquip ? selectedEquip.id_equipement : null,
    technicien: technicianIds,
    urgence: selectedUrgence - 1,
    date_debut: selectedDatedebut,
    date_fin: selectedDateFin,
    description: description,
  };

  const days = parseInt(durationValue, 10) * 7;
  const formatedDays = `${days} 00:00:00`;
  const gatherDataPreventive = {
    type_intervention: selectedTypeIntervention,
    title: title,
    equipement: selectedEquip ? selectedEquip.id_equipement : null,
    technicien: technicianIds,
    urgence: selectedUrgence - 1,
    period: formatedDays,
    date_debut: selectedDatedebut,
    description: description,
  };

  const submitData = async () => {
    let data;
    try {
      const token = localStorage.getItem("access_token"); // retrieve token
      let api_url = "";

      if (selectedTypeIntervention === "preventive") {
        api_url =
          "http://127.0.0.1:8000/api/interventions/interventions/preventive/create/";
        data = gatherDataPreventive;
        console.log(JSON.stringify(data));
      } else if (selectedTypeIntervention === "currative") {
        api_url =
          "http://127.0.0.1:8000/api/interventions/interventions/currative/create/";
        data = gatherdDataCurrative;
        console.log(JSON.stringify(data));
      }

      if (api_url) {
        const response = await fetch(api_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to fetch technicians");
        const responseData = await response.json();
        console.log(responseData);

        setIsPopupVisible(true);
      }
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] font-poppins">
      {/* Logo en haut à gauche */}
      <Header />
      <div className="w-full bg-[#20599E] text-white pb-16 text-center">
        <h1 className="text-3xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Interventions
        </h1>
        {/* bare de recherhce  */}
      </div>

      <div className="w-full min-h-screen rounded-t-[35px] sm:rounded-t-[45px] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        <div className="w-full">
          <Headerbar title={"Ajouter une Intervention"} />
        </div>

        <div className="w-full max-w-5xl mx-auto mt-4 p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div onClick={handleChoiceClick}>
            <DisModContainerEquip
              initialName=""
              title="Equipement"
              equipements={equipments}
              onAssignEquip={(equip) => {
                setSelectedEquip(equip);
                setSelectedEquipId(equip.id_equipement);
                console.log("Assigned equipment:", equip);
              }}
            />
          </div>

          <ChoiceContainer
            title="type d'intervention"
            options={typeInterventionOptions}
            onSelect={handlePreventiveChoice}
            selectedOption={selectedTypeIntervention}
          />

          <WriteContainer
            title="Titre"
            //  value={"---"}
            multiline
            onChange={(val) => settitle(val)}
            className=" px-8"
          />

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
            className="text-sm py-1 px-2  max-w-full md:max-w-[400px] "
          />

          <WriteContainer
            title="Description"
            //  value={"---"}
            multiline
            onChange={(val) => setdescription(val)}
            className=" px-8"
          />

          {estCurrative && (
            <DisModContainer
              title="Date de fin"
              value={selectedDateFin}
              onSave={(value) => setSelectedDateFin(value)}
              type="date"
              className="py-2 px-3 text-sm"
            />
          )}

          {afficherDuree && (
            <DurationInput
              value={durationValue}
              onChange={(newDuration) => setDurationValue(newDuration)}
              name={"Durée"}
            />
          )}

          <Buttonrec
            text="Attacher une image"
            bgColor="#20599E"
            textColor="white"
            className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg shadow-md hover:bg-gray-400"
          />

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

        <div className="flex justify-center mt-4 sm:mt-10">
          <Buttonrec
            text="Ajouter une intervention"
            bgColor="#20599E"
            textColor="white"
            onClick={submitData}
            className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg shadow-md hover:bg-gray-400"
          />
        </div>
      </div>

      {isPopupVisible && (
        <PopupMessage
          title="Intervention ajoutée avec succès!"
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </div>
  );
};

export default AjouterIntervention;

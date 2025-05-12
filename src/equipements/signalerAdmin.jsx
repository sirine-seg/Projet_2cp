import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Headerbar from "../components/Arrowleftt";
import AutoGrowTextarea from "../components/description";
import SelectableInput from "../components/SelectableInput";
import DateInput from "../components/date";
import Assigner from "../components/assign";
import Buttonrec from "../components/buttonrectangle";
import WriteContainer from "../components/writeContainer";
import ImageUploader from "../components/imageUploader";
import PopupMessage from "../components/Popupcheck";
import { useParams } from "react-router-dom";
import UserProfilMail from "../components/userProfilMail.jsx";
import AssignPopUp from "../components/assignPopUp.jsx";
import ChoiceContainer from "../components/choiceContainer.jsx";
import { useNavigate } from "react-router-dom";

const SignalerAdmin = () => {
  // URL parameter
  const { id_equipement } = useParams();
  console.log("the equipement id : ", id_equipement);

  // State management
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [newIntervention, setNewIntervention] = useState({});
  const [techniciensAjoutes, setTechniciensAjoutes] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [selectedDatedebut, setSelectedDatedebut] = useState(null);
  const [selectedDatefin, setSelectedDatefin] = useState(null);
  const [selectedUrgence, setSelectedUrgence] = useState("");
  const [users, setUsers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [showComponent2, setShowComponent2] = useState(false);
  const [selectedTech, setSelectedTech] = useState([]);
  const [selectedProfil, setSelectedProfil] = useState(false);
  const [description, setdescription] = useState("");
  const [UrgenceLabel, setUrgenceLabel] = useState("");
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

  // Reference for textarea
  const textareaRef = useRef(null);

  // Urgency options
  const urgenceOptions = [
    { value: 1, label: "Urgence vitale" },
    { value: 2, label: "Urgence élevée" },
    { value: 3, label: "Urgence modérée" },
    { value: 4, label: "Faible urgence" },
  ];

  const labelUrgence =
    urgenceOptions.find((option) => option.value === selectedUrgence)?.label ||
    "--";

  const handleUrgenceSelect = (option) => {
    console.log("option" + option);
    setSelectedUrgence(option);
    console.log("the String" + selectedUrgence); // Update the value
    //      const label = urgenceOptions.find(option => option.value === valueToFind)?.label || '--';
    setUrgenceLabel(option.label); // Update the label instantly
  };

  // Handle input changes
  const handleChange = (e) => {
    setNewIntervention({ ...newIntervention, [e.target.name]: e.target.value });
  };

  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newIntervention.description]);

  function handleAssign(tech) {
    // tech is expected to be the full technician object, including user info
    setSelectedTech(tech.user); // or adjust if tech is already user object
    setSelectedProfil(true);
  }

  // Fetch technicians
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Récupération du token depuis le localStorage
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          "http://127.0.0.1:8000/api/accounts/techniciens/",
          {
            headers: {
              "Content-Type": "application/json",
              // Ajout du token d'autorisation si disponible
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!response.ok)
          throw new Error("Erreur lors de la récupération des utilisateurs");

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };
    fetchUsers();
  }, [visibleCount]);

  const techniciensDispo = users.filter((user) => user.disponibilite === true);
  console.log("the dispo techs : ", techniciensDispo);
  const technicianIds = selectedTech.map((tech) => tech.id);

  // Handle form submission
  const gatherdDataCurrative = {
    type_intervention: "currative",
    title: newIntervention.title,
    equipement: id_equipement,
    technicien: technicianIds,
    urgence: selectedUrgence - 1,
    date_debut: selectedDatedebut,
    date_fin: selectedDatefin,
    description: description,
  };

  const handleAddIntervention = () => {
    console.log(gatherdDataCurrative);
    // Récupération du token depuis le localStorage
    const token = localStorage.getItem("access_token");

    // Create headers with authorization token
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Submit intervention with the gathered data
    fetch(
      "http://127.0.0.1:8000/api/interventions/interventions/currative/create/",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(gatherdDataCurrative),
      }
    )
      .then(async (response) => {
        let data;
        try {
          data = await response.json();
        } catch (error) {
          console.warn("Non-JSON response received:", error);
          data = null;
        }

        if (!response.ok) {
          throw new Error(data?.message || "Échec de l'ajout !");
        }

        setIsPopupVisible(true);
        setInterventions([...interventions, data]);
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout:", error);
        alert("Erreur lors de l'ajout !");
      });
  };

  const handleCloseSuccessPopup = () => {
    navigate("/Equipements");
    setIsPopupVisible(false);
    console.log("the close popup");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] font-poppins">
      <Header />

      {/* Banner section */}
      <div className="w-full bg-[#20599E] text-white pb-16 text-center">
        <h1 className="text-3xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Equipements
        </h1>
      </div>

      {/* Main content area */}
      <div className="w-full min-h-screen rounded-t-[35px] sm:rounded-t-[45px] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        {/* Back navigation */}
        <div className="w-full">
          <Headerbar title="Créer une intervention" />
        </div>

        {/* Form title */}
        <div className="w-full sm:w-80 h-6 justify-start text-neutral-800 text-lg sm:text-xl md:text-2xl font-normal font-['Poppins'] leading-snug tracking-wide my-6 ml-8">
          Détails de l'intervention
        </div>

        {/* Form fields */}
        <div className="flex flex-col space-y-4 mt-4 mx-8">
          {/* Date fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Problem title field */}

            <WriteContainer
              title="titre"
              value={newIntervention.title}
              onChange={(val) =>
                setNewIntervention({ ...newIntervention, title: val })
              }
            />

            {/* Urgency selection */}

            <ChoiceContainer
              title="Urgence"
              options={urgenceOptions}
              selectedOption={labelUrgence}
              onSelect={handleUrgenceSelect}
              className="text-sm py-1 px-2 max-w-xs w-full"
            />

            {/* Description field */}
            <WriteContainer
              title="Description"
              //  value={"---"}
              multiline
              onChange={(val) => setdescription(val)}
              className=" px-8"
            />

            {/* Date */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-24">
              <DateInput
                label="Date début"
                selectedDate={selectedDatedebut}
                setSelectedDate={setSelectedDatedebut}
              />
              <DateInput
                label="Date fin"
                selectedDate={selectedDatefin}
                setSelectedDate={setSelectedDatefin}
              />
            </div>
            <div className="flex space-x-4 items-center">
              <Buttonrec
                text="Assigne un Techncien"
                bgColor="#F09C0A"
                textColor="white"
                onClick={handleChoiceCLick2}
                className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg shadow-md hover:bg-gray-400"
              />
            </div>
            <div className="flex items-center">
              <ImageUploader />
            </div>
          </div>

          {/* List of selected technicians appears here */}
          {selectedTech.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 font-semibold">Technicians sélectionnés:</h3>
              <div className="flex flex-col gap-4 mt-4">
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
            </div>
          )}

          {/* Keep the AssignPopUp component */}
          {showComponent2 && (
            <AssignPopUp
              technicians={techniciensDispo}
              buttonTitle="Assigner"
              onClose={() => setShowComponent2(false)}
              onAssign={handleChoisir}
            />
          )}
        </div>

        {/* Submit button */}
        <div className="flex justify-center mt-14 mb-8">
          <Buttonrec
            text="Enregistrer"
            onClick={handleAddIntervention}
            className="w-auto px-4"
          />
        </div>

        {/* Success popup */}
        {isPopupVisible && (
          <PopupMessage
            title="Intervention créer avec succès !"
            onClose={handleCloseSuccessPopup}
          />
        )}
      </div>
    </div>
  );
};

export default SignalerAdmin;
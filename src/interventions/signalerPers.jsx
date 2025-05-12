import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AutoGrowTextarea from "../components/description";
import Header from "../components/Header";
import ImageUploader from "../components/imageUploader.jsx";
import PopupMessage from "../components/Popupcheck";
import Buttonrec from "../components/buttonrectangle";
import ChoiceContainer from "../components/choiceContainer";
import WriteContainer from "../components/writeContainer";
import Headerbar from "../components/Arrowleftt";
import DisModContainerEquip from "../components/disModContainerEquip";

const Signaler = () => {
  const [selectedUrgence, setSelectedUrgence] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedEquipp, setSelectedEquipp] = useState(null);
  const [equipments, setEquipments] = useState([]); // the list of equipement instances
  const [selectedEquipId, setSelectedEquipId] = useState(null); // the selected equipement ID
  // const [urgenceOptions, setUrgenceOptions] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [selectedEquip, setSelectedEquip] = useState(null); // the selected equipement instance
  const [urgence, setUrgence] = useState("");
  const [UrgenceLabel, setUrgenceLabel] = useState("");
  const [newIntervention, setNewIntervention] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const urgenceOptions = [
    { value: 1, label: "Urgence vitale" },
    { value: 2, label: "Urgence élevée" },
    { value: 3, label: "Urgence modérée" },
    { value: 4, label: "Faible urgence" },
  ];

  const labelUrgence =
    urgenceOptions.find((option) => option.value === selectedUrgence)?.label ||
    "--";

  const handleChange = (e) => {
    setNewIntervention({ ...newIntervention, [e.target.name]: e.target.value });
  };

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newIntervention.description]);

  const handleEquipSelect = (equip) => {
    setSelectedEquipp(equip);
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleChoiceClick = () => {
    setShowComponent(true);
  };

  const handleUrgenceSelect = (option) => {
    console.log("option" + option);
    setSelectedUrgence(option);
    console.log("the String" + selectedUrgence); // Update the value
    //      const label = urgenceOptions.find(option => option.value === valueToFind)?.label || '--';
    setUrgenceLabel(option.label); // Update the label instantly
  };

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

  const gatherdDataCurrative = {
    equipement: selectedEquip ? selectedEquip.id_equipement : null,
    type_intervention: "currative",
    title: newIntervention.title,
    urgence: selectedUrgence - 1,
    description: newIntervention.value,
  };
  console.log("gatherdDataCurrative" + gatherdDataCurrative.title);

  // integration de submittion
  const submitData = async () => {
    console.log("this is the gathered data" + gatherdDataCurrative);
    try {
      const token = localStorage.getItem("access_token"); // retrieve token
      const response = await fetch(
        "http://127.0.0.1:8000/api/interventions/interventions/currative/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(gatherdDataCurrative),
        }
      );
      if (!response.ok) throw new Error("Failed to fetch technicians");
      const responseData = await response.json();
      console.log("this is the response" + responseData);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };

  const handleCloseSuccessPopup = () => {
    navigate("/Interventions");
    setIsPopupVisible(false);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] font-poppins">
      {/* Logo en haut à gauche */}
      <Header />

      <div className="w-full bg-[#20599E] text-white pb-16 text-center">
        <h1 className="text-3xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Interventions
        </h1>
      </div>

      <div className="w-full min-h-screen rounded-t-[35px] sm:rounded-t-[45px] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        <div className="w-full ">
          <Headerbar title="Ajouter une intervention" />
        </div>

        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-8 md:gap-y-2 px-3 py-4 mt-2">
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

          <WriteContainer
            title="Titre"
            value={newIntervention.title}
            onChange={(val) =>
              setNewIntervention({ ...newIntervention, title: val })
            }
          />

          <ChoiceContainer
            title="Urgence"
            options={urgenceOptions}
            selectedOption={labelUrgence}
            onSelect={handleUrgenceSelect}
            className="text-sm py-1 px-2 max-w-xs w-full"
          />

          <WriteContainer
            title="Description"
            //  value={"---"}
            multiline
            onChange={(val) => setdescription(val)}
            className=" px-8"
          />
        </div>

        <div className="flex items-center w-full sm:w-1/2 py-4 px-7">
          <ImageUploader />
        </div>

        <div className="flex justify-center mt-4">
          <Buttonrec
            text="Enregistrer"
            onClick={submitData}
            className="w-full sm:w-auto px-4"
          />
        </div>
        {/* Affichage du message d'erreur */}
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {isPopupVisible && (
          <PopupMessage
            title="problème signalé avec succès!"
            onClose={handleCloseSuccessPopup}
          />
        )}
      </div>
    </div>
  );
};

export default Signaler;

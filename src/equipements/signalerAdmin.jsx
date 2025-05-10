import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Headerbar from "../components/Arrowleftt";
import AutoGrowTextarea from "@/components/description";
import SelectableInput from "@/components/SelectableInput";
import DateInput from "@/components/date";
import Assigner from "@/components/assign";
import Buttonrec from "../components/buttonrectangle";
import WriteContainer from "../components/writeContainer";
import ImageUploader from "@/components/imageUploader";
import PopupMessage from "../components/Popupcheck";
import { useParams } from "react-router-dom";

const SignalerAdmin = () => {
  // URL parameter
  const { id } = useParams();

  // State management
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

  // Reference for textarea
  const textareaRef = useRef(null);

  // Urgency options
  const urgenceOptions = [
    { id: 0, label: "Urgence vitale" },
    { id: 1, label: "Urgence élevée" },
    { id: 2, label: "Urgence modérée" },
    { id: 3, label: "Faible urgence" },
  ];

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

  // Handle technician assignment
  const handleAssign = (technicien) => {
    // Avoid adding duplicates
    setTechniciensAjoutes((prev) => {
      if (!prev.some((t) => t.email === technicien.email)) {
        return [...prev, technicien];
      }
      return prev;
    });
  };

  // Fetch technicians
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/accounts/techniciens/"
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

  // Filter available technicians
  const techniciensDispo = users.filter((user) => user.disponibilite === true);

  // Handle form submission
  const handleAddIntervention = () => {
    const formatDate = (dateStr) => {
      if (!dateStr) return null;
      return new Date(dateStr).toISOString();
    };

    const formData = new FormData();
    formData.append("title", newIntervention.title);

    if (selectedDatedebut) {
      formData.append("date_debut", formatDate(selectedDatedebut));
    }

    if (selectedDatefin) {
      formData.append("date_fin", formatDate(selectedDatefin));
    }

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    // Add technicians
    if (techniciensAjoutes.length > 0) {
      techniciensAjoutes.forEach((t) => {
        formData.append("technicien", t.user.id);
      });
    }

    formData.append("description", newIntervention.description);
    formData.append("equipement", id);

    if (selectedUrgence) {
      formData.append("urgence", selectedUrgence.id);
    }

    // Log form data for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Submit intervention
    fetch(
      "http://127.0.0.1:8000/api/interventions/interventions/currative/create/",
      {
        method: "POST",
        body: formData,
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
          <Headerbar title="Signaler Un Problème" />
        </div>

        {/* Form title */}
        <div className="w-full sm:w-80 h-6 justify-start text-neutral-800 text-lg sm:text-xl md:text-2xl font-normal font-['Poppins'] leading-snug tracking-wide mt-8 ml-8">
          Détails de l'intervention
        </div>

        {/* Form fields */}
        <div className="flex flex-col space-y-4 mt-4">
          {/* Date fields */}
          <div className="flex flex-row w-full space-x-4">
            {/* Date Début */}
            <div className="flex-1">
              <DateInput
                label="Date début"
                selectedDate={selectedDatedebut}
                setSelectedDate={setSelectedDatedebut}
              />
            </div>

            {/* Date Fin */}
            <div className="flex-1">
              <DateInput
                label="Date fin"
                selectedDate={selectedDatefin}
                setSelectedDate={setSelectedDatefin}
              />
            </div>
          </div>

          {/* Problem title field */}
          <div className="w-full">
            <WriteContainer
              title="Problem"
              value={newIntervention.title}
              onChange={(val) =>
                setNewIntervention({ ...newIntervention, title: val })
              }
            />
          </div>

          {/* Urgency selection */}
          <div className="w-full">
            <SelectableInput
              title="Urgence"
              options={urgenceOptions}
              selectedOption={selectedUrgence}
              onSelect={(selectedOption) => setSelectedUrgence(selectedOption)}
            />
          </div>

          {/* Description field */}
          <div className="w-full">
            <AutoGrowTextarea onChange={handleChange} />
          </div>

          {/* File upload section */}
          <div className="w-full">
            <div className="flex items-center">
              <ImageUploader />
            </div>

            {/* Technician assignment */}
            <div className="w-full">
              <Assigner
                allTechnicians={techniciensDispo}
                techniciensAjoutes={techniciensAjoutes}
                handleAssign={handleAssign}
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-center mt-4">
          <Buttonrec
            text="Enregistrer"
            onClick={handleAddIntervention}
            className="w-full sm:w-auto px-4"
          />
        </div>

        {/* Success popup */}
        {isPopupVisible && (
          <PopupMessage
            title="Intervention affecté avec succès !"
            onClose={() => setIsPopupVisible(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SignalerAdmin;

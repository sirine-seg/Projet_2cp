import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../components/Searchbar";
import Header from "../components/Header";
import Headerbar from "../components/Arrowleftt";
import ChoiceContainer from "../components/choiceContainer";
import DisModContainerEquip from "../components/disModContainerEquip";
import WriteContainer from "../components/writeContainer";
import Buttonrec from "../components/buttonrectangle";
import TabSelector from "../components/tabSelector";
import ImageUploader from "@/components/imageUploader";
import AutoGrowTextarea from "../components/description";
import PopupMessage from "../components/Popupcheck"; // Assuming you have this component
import SelectableInput from "@/components/SelectableInput";

const SignalerPer = () => {
  const [interventions, setInterventions] = useState([]);  // Stocke toutes les interventions
  const [displayedInterventions, setDisplayedInterventions] = useState([]); // Stocke les interventions affichées
  const [filter, setFilter] = useState("Tout");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newIntervention, setNewIntervention] = useState({
    title: "",
    description: "",
  });
  const navigate = useNavigate();
  const [selectedInterventionid, setSelectedInterventionid] = useState(null);
  const [selectedStatutName, setSelectedStatutName] = useState("");
  const [statusList, setStatusList] = useState([]);

  const [selectedStatutId, setSelectedStatutId] = useState("");

  // États de sélection
  const [selectedUrgence, setSelectedUrgence] = useState(null); // Initialize as null
  const [selectedDate, setSelectedDate] = useState("");
  const [assignedTechniciens, setAssignedTechniciens] = useState([]);

  const [selectedEquip, setSelectedEquip] = useState(null); // Initialize as null

  const [selectedStatus, setSelectedStatus] = useState("");

  const [description, setdescription] = useState("");
  const [selectedDatedebut, setSelectedDatedebut] = useState("");

  const [assignedAdmins, setAssignedAdmins] = useState([]);

  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const [intervention, setIntervention] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEquipp, setSelectedEquipp] = useState(null); // Initialize selectedEquipp

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

  const handleTabSelect = (category) => {
    setFilter(category);
  };

   
const urgenceOptions = [
    { id: 0, label: 'Urgence vitale' },
    { id: 1, label: 'Urgence élevée' },
    { id: 2, label: 'Urgence modérée' },
    { id: 3, label: 'Faible urgence' },
  ];

  const tabOptions = [
    { label: "Tout" },
    { label: "Curative" },
    { label: "Préventive" },
  ];

  const handleChange = (e) => {
    setNewIntervention({ ...newIntervention, [e.target.name]: e.target.value });
  };
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (typeof onSave === 'function') {
      // onSave({ setContent }); // Call the onSave function passed as a prop
      setIsEditing(false); // Exit editing mode
    } else {
      console.error('onSave is not a function');
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
  }, [selectedStatutName, selectedInterventionid]);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleEquipSelect = (equip) => {
    setSelectedEquipp(equip);
  };

  const handleAddIntervention = () => {
    const formData = new FormData();

    // Vérifie et ajoute l'image si sélectionnée
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    // Vérifie et ajoute l'urgence si sélectionnée
    if (selectedUrgence?.value) { // Access value property
      formData.append("urgence", selectedUrgence.value); // Send the value
    }

    formData.append("title", newIntervention.title);
    // Description
    formData.append("description", newIntervention.description);

    // ID équipement
    if (selectedEquipp?.id) { // Access id property
      formData.append("equipement", selectedEquipp.id);
    }

    // Facultatif : log des valeurs envoyées
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // Log all FormData entries in a readable way
    console.log("--- Data to be sent ---");
    for (let [key, value] of formData.entries()) {
      // For files, log some metadata instead of the whole file
      if (value instanceof File) {
        console.log(`${key}:`, {
          name: value.name,
          type: value.type,
          size: value.size + " bytes"
        });
      } else {
        console.log(`${key}:`, value);
      }
    }
    console.log("-----------------------");

    // Envoi de la requête
    const accessToken = localStorage.getItem('access_token');

    fetch("http://127.0.0.1:8000/api/interventions/interventions/currative/create/", {
      method: "POST",
      credentials: "include",
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        // If you're sending form data, the browser will automatically set the Content-Type
        // with the boundary, so you don't need to set it manually
      },
      body: formData,
    })
      .then(async (response) => {
        const text = await response.text();

        let data;
        console.log("Raw response:", text);
        try {
          data = JSON.parse(text);
        } catch (error) {
          console.warn("Réponse non JSON :", error);
          console.warn("Texte brut reçu :", text);
          alert("Erreur du serveur. Voir la console pour plus de détails.");
          return;
        }

        console.log("Réponse du serveur :", data);

        if (!response.ok) {
          throw new Error(data?.message || "Échec de l'ajout !");
        }

        setIsPopupVisible(true);
        setInterventions([...interventions, data]);
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout :", error);
        alert("Erreur lors de l'ajout !");
      });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md">

      {/* Logo en haut à gauche */}
      <Header />
      <div className="w-full bg-[#20599E] text-white py-16 text-center">

        <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Intervention
        </h1>
        {/* bare de recherhce  */}

        <TabSelector
          options={tabOptions}
          activeOption={filter}
          setActiveOption={handleTabSelect}
        />
      </div>

      <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">

        <div className="w-full">
          <Headerbar
            title={"Ajouter Intervention"}
            showPen={false} // Si tu veux afficher un bouton d'édition
          />
        </div>

        <div className="w-full max-w-5xl mx-auto mt-12 p-4 grid grid-cols-1 md:grid-cols-2 gap-6">

          <DisModContainerEquip
            title="Équipement"
            onEquipSelected={handleEquipSelect} // Callback to get selected equip
          />

           <SelectableInput
                    title="Urgence"
                    options={urgenceOptions}
                    selectedOption={selectedUrgence}
                    onSelect={(selectedOption) => setSelectedUrgence(selectedOption)}
                  />

          <WriteContainer
            title="Problem"
            value={newIntervention.title}
            onChange={(val) => setNewIntervention({ ...newIntervention, title: val })}
          />

         
          <AutoGrowTextarea
            name="description"
            onChange={handleChange}
            placeholder="Description du problème"
          />

          <ImageUploader onImageSelect={handleImageSelect} />

        </div>

        <div className="flex justify-center mt-4">
          <Buttonrec text="Enregistrer" onClick={handleAddIntervention} className="w-full sm:w-auto px-4" />
        </div>

        {isPopupVisible && (
          <PopupMessage
            title="problème signalé avec succès !"
            onClose={() => setIsPopupVisible(false)}
          />)}

      </div>
    </div>
  );
};

export default SignalerPer;
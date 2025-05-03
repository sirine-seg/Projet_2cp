import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectableInput from "../components/SelectableInput";
import AutoGrowTextarea from "../components/description";
import Header from "../components/Header";
import ImageUploader from "@/components/imageUploader";
import PopupMessage from "../components/Popupcheck";
import Buttonrec from "../components/buttonrectangle";
import Headerbar from "../components/Arrowleftt";
import WriteContainer from "@/components/writeContainer";

/**
 * Signaler component - Allows users to report problems with equipment
 * Form for entering problem details, urgency level, description, and optional image
 */
const Signaler = () => {
  // Get equipment ID from URL parameters
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [selectedUrgence, setSelectedUrgence] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newIntervention, setNewIntervention] = useState({
    title: "",
    description: ""
  });
  
  // UI state
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [interventions, setInterventions] = useState([]);
  
  // Reference for textarea auto-grow
  const textareaRef = useRef(null);

  // Predefined urgency options
  const urgenceOptions = [
    { id: 0, label: 'Urgence vitale' },
    { id: 1, label: 'Urgence élevée' },
    { id: 2, label: 'Urgence modérée' },
    { id: 3, label: 'Faible urgence' },
  ];

  // Handle form field changes
  const handleChange = (e) => {
    setNewIntervention({ ...newIntervention, [e.target.name]: e.target.value });
  };

  // Auto-grow textarea when content changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newIntervention.description]);

  /**
   * Handle form submission to create a new intervention
   * Sends form data to the server with authentication
   */
  const handleAddIntervention = () => {
    const formData = new FormData();

    // Add image if selected
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    // Add urgency level if selected
    if (selectedUrgence) {
      formData.append("urgence", selectedUrgence.id);
    }
    
    // Add title and description
    formData.append("title", newIntervention.title);
    formData.append("description", newIntervention.description);

    // Add equipment ID
    formData.append("equipement", id);

    // Log form data for debugging
    console.log("--- Data to be sent ---");
    for (let [key, value] of formData.entries()) {
      // For files, log metadata instead of the whole file
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

    // Get authentication token from local storage
    const accessToken = localStorage.getItem('access_token');

    // Send the request
    fetch("http://127.0.0.1:8000/api/interventions/interventions/currative/create/", {
      method: "POST",
      credentials: "include",
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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
        setErrorMessage("Erreur du serveur. Voir la console pour plus de détails.");
        return;
      }

      console.log("Réponse du serveur :", data);

      if (!response.ok) {
        throw new Error(data?.message || "Échec de l'ajout !");
      }

      // Show success popup and update state
      setIsPopupVisible(true);
      setInterventions([...interventions, data]);
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout :", error);
      setErrorMessage("Erreur lors de l'ajout !");
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md overflow-hidden">
      {/* Header component */}
      <Header />
      
      {/* Page title */}
      <div className="w-full bg-[#20599E] text-white py-16 text-center">
        <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Equipements
        </h1>
      </div>

      {/* Main content area */}
      <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        {/* Navigation header */}
        <div className="w-full">
          <Headerbar title="Signaler Un Problème" />
        </div>

        {/* Form section title */}
        <div className="w-full sm:w-80 h-6 justify-start text-neutral-800 text-lg sm:text-xl md:text-2xl font-normal font-['Poppins'] leading-snug tracking-wide mt-8 ml-8">
          Détails de l'intervention
        </div>

        {/* Form fields */}
        <div className="flex flex-col w-full mx-auto px-3.5 mt-2">
          {/* Problem title input */}
          <WriteContainer
            title="Problem"
            value={newIntervention.title}
            onChange={(val) => setNewIntervention({ ...newIntervention, title: val })}
          />
          
          {/* Urgency selection dropdown */}
          <div className="w-full">
            <SelectableInput
              title="Urgence"
              options={urgenceOptions}
              selectedOption={selectedUrgence}
              onSelect={(selectedOption) => setSelectedUrgence(selectedOption)}
            />
          </div>

          {/* Description textarea */}
          <div className="w-full mt-4">
            <AutoGrowTextarea onChange={handleChange} />
          </div>
        </div>

        {/* Image upload section */}
        <div className="flex items-center w-full sm:w-1/2 py-4 px-7">
          <ImageUploader 
            onImageSelected={(image) => setSelectedImage(image)}
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-center mt-4">
          <Buttonrec 
            text="Enregistrer" 
            onClick={handleAddIntervention}
            className="w-full sm:w-auto px-4"
          />
        </div>
        
        {/* Error message display */}
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

        {/* Success message popup */}
        {isPopupVisible && (
          <PopupMessage
            title="Problème signalé avec succès !"
            onClose={() => setIsPopupVisible(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Signaler;
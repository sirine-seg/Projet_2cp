import { useState, useRef, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SelectableInput from "../components/SelectableInput";
import { FaCalendarAlt } from "react-icons/fa";
import AutoGrowTextarea from "../components/description"
import Header from "../components/Header";
import PicField from "../components/picField.jsx";
import ImageUploader from "../components/imageUploader.jsx";

import { MdAccountCircle } from "react-icons/md";
import Filtre from "../components/filtre";
import PopupMessage from "../components/Popupcheck";
import SearchBar from "../components/Searchbar"; 

import Buttonrec from "../components/buttonrectangle";
import ChoiceContainer from "../components/choiceContainer"; 
import WriteContainer from "../components/writeContainer";   
import Headerbar from "../components/Arrowleftt";  
import DisModContainerEquip from "../components/disModContainerEquip";


const Signaler = () => {
  const [selectedUrgence, setSelectedUrgence] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [displayedEquipements, setDisplayedEquipements] = useState([]);
  const [filter, setFilter] = useState("Tout");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedEquipement, setSelectedEquipement] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [selectedDatedebut, setSelectedDatedebut] = useState(null);
  const [selectedDatefin, setSelectedDatefin] = useState(null);
  const [selectedEquipp, setSelectedEquipp] = useState(null);
  const [selected, setSelected] = useState("");
  const [equipments, setEquipments] = useState([]); // the list of equipement instances
     const [selectedEquipId, setSelectedEquipId] = useState(null); // the selected equipement ID
  // const [urgenceOptions, setUrgenceOptions] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [selectedEquip, setSelectedEquip] = useState(null); // the selected equipement instance
  const [urgence, setUrgence] = useState("");
  const [UrgenceLabel,setUrgenceLabel] = useState("");
  const [newIntervention, setNewIntervention] = useState({
    
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    etats: [],
    localisations: [],
    types: [],
  });
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    description: "",
    
  });



    const urgenceOptions = [
        { value: 1, label: 'Urgence vitale' },
        { value: 2, label: 'Urgence élevée' },
        { value: 3, label: 'Urgence modérée' },
        { value: 4, label: 'Faible urgence' },
    ];

const labelUrgence = urgenceOptions.find(option => option.value === selectedUrgence)?.label || "--";


  const handleChange = (e) => {
    setNewIntervention({ ...newIntervention, [e.target.name]: e.target.value });
  };

 /* // Fetch urgence options from backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/urgences/")
      .then((response) => response.json())
      .then((data) => setUrgenceOptions(data))
      .catch((error) => console.error("Error fetching urgences:", error));
  }, []);*/

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
        console.log("option"+option) ;
        setSelectedUrgence(option);
        console.log ( "the String"+ selectedUrgence)// Update the value
//      const label = urgenceOptions.find(option => option.value === valueToFind)?.label || '--';
        setUrgenceLabel(option.label);    // Update the label instantly
    };

// Helper function to reset the form after successful submission

/*const handleAddIntervention = () => {
  const formData = new FormData();

  // Vérifie et ajoute l'image si sélectionnée
  if (selectedImage) {
    formData.append("image", selectedImage);
  }

  
  if (selectedUrgence) {
    formData.append("urgence", selectedUrgence.id);
  }
  formData.append("title", newIntervention.title);
  // Description
  formData.append("description", newIntervention.description);

  // ID équipement
  formData.append("equipement",  selectedEquipp.id);

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
  console.log("-----------------------")

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
    
}; */

    /**  ____________________________    **/
    useEffect(() => {
        const fetchEquipments = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch("http://127.0.0.1:8000/api/equipements/equipement", {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch equipments");
                const data = await response.json();
                console.log (data) ;
                setEquipments(data);
                // Instead of mapping to {label, value}, keep full objects with expected properties
                /*const equipmentsFormatted = data.map((equip) => ({
                    id: equip.id_equipement,        // Adjust id field name as needed
                    name: equip.nom,                // Assuming 'nom' = name in your API
                    localisation: equip.localisation || "", // Add localisation if available or empty string
                    // add any other properties you might want to keep
                })); */

                /*const  equipmentsCopy = data.map(equip => equip);*/
                /*await setEquipments(equipments => [...equipments , data])*/

            } catch (error) {
                console.error(error);
            }
        }
        fetchEquipments();
    }, []);

    const gatherdDataCurrative = {
        equipement: selectedEquip ? selectedEquip.id_equipement : null ,
        type_intervention: "currative",
        title: newIntervention.title ,
        urgence : selectedUrgence-1  ,
        description : newIntervention.value ,
    }
    console.log("gatherdDataCurrative" + gatherdDataCurrative.title) ;


    // integration de submittion
    const submitData = async () => {
        console.log("this is the gathered data" + gatherdDataCurrative) ;
        try {
            const token = localStorage.getItem('access_token'); // retrieve token
            const response = await fetch('http://127.0.0.1:8000/api/interventions/interventions/currative/create/'
                , {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify(gatherdDataCurrative)
                });
                if (!response.ok) throw new Error('Failed to fetch technicians');
                const responseData = await response.json();
                console.log("this is the response" + responseData);
        } catch (error) {
            console.error('Error fetching technicians:', error);
        }
    };








    return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md  overflow-hidden">

                    
    {/* Logo en haut à gauche */}
    <Header />
  {/* ✅ Header */}
 
  <div className="w-full bg-[#20599E] text-white py-16 text-center">
                      
                      <h1 className="text-4xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#F4F4F4] mb-4 mt-2">
                       Interventions
                      </h1>
                      {/* bare de recherhce  */}    
           
      </div>

      <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
                <div className="w-full ">
                    <Headerbar title="Ajouter une intervention" />
                </div>



        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-8 md:gap-y-2 px-3 py-4 mt-2">

            <div onClick={handleChoiceClick}>
                <DisModContainerEquip
                    initialName="salem"
                    title = "Equipement"
                    equipements={equipments}
                    onAssignEquip={(equip) => {
                        setSelectedEquip(equip);
                        setSelectedEquipId(equip.id_equipement);
                        console.log("Assigned equipment:", equip);
                    }}
                />
            </div>
         
                <WriteContainer
                    title="titre"
                    value={newIntervention.title}
                    onChange={(val) =>setNewIntervention({ ...newIntervention, title: val })}
                />


            <ChoiceContainer
                title="Urgence"
                options={urgenceOptions}
                selectedOption={labelUrgence}
                onSelect={handleUrgenceSelect}
                className="text-sm py-1 px-2 max-w-xs w-full"
            />

                <AutoGrowTextarea onChange={handleChange} />
    
        </div>

        <div className="flex items-center w-full sm:w-1/2 py-4 px-7">
        <ImageUploader />
        </div>

      
        <div className="flex justify-center mt-4">
  <Buttonrec text="Enregistrer" onClick={submitData}   className="w-full sm:w-auto px-4"/>
</div>
 {/* Affichage du message d'erreur */}
 {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

 {isPopupVisible && (
  <PopupMessage
    title="problème signalé avec succès !"
    onClose={() => setIsPopupVisible(false)}
  />)}  
        
      </div>

      

      
    </div>
    
  );
};

export default Signaler;
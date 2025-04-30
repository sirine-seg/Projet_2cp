import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import SearchBar from "../components/Searchbar"; 
import Header from "../components/Header";
import Options from "../components/options";
import PopupMessage from "../components/Popupcheck";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import AddMobile  from "../components/addMobile";
import Headerbar from "../components/Arrowleftt";
import InfoIntervUser from "../components/infoIntervUserContainer";
import DisModContainer from "../components/disModContainer";
import UserProfilMail from "../components/userProfilMail";
import ChoiceContainer from "../components/choiceContainer"; 
import Button from  "../components/button"; 
import TechnicienAssign from  "../components/technicienAssign"; 
import AssignPopUp from "../components/assignPopUp"
import DisModContainerEquip from "../components/disModContainerEquip";
import Profil from "../pages/Profil.svg";
import InfoIntervUserr from "../components/infoIntervUser"
import EditIntervUser from "../components/editIntervUser";
import WriteContainer from "../components/writeContainer";
import Buttonrec from "../components/buttonrectangle";

const Userspageee= () => {
    const [interventions, setInterventions] = useState([]);  // Stocke toutes les interventions
    const [displayedInterventions, setDisplayedInterventions] = useState([]); // Stocke les interventions affichées
    const [filter, setFilter] = useState("Tout");
    const [users, setUsers] = useState([]);  // Stocke tous les utilisateurs
    const [displayedUsers, setDisplayedUsers] = useState([]); // Stocke les utilisateurs affichés
    const [visibleCount, setVisibleCount] = useState(9);// Nombre d'utilisateurs affichés
   
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

     // États de sélection
     const [selectedUrgence, setSelectedUrgence] = useState("");
     const [selectedDate, setSelectedDate] = useState("");
     const [assignedTechniciens, setAssignedTechniciens] = useState([]);
    
     const [showPopup, setShowPopup] = useState(false);
     const [setEquip, setSelectedEquip] = useState("");
     const [showPopupadmin, setshowPopupadmin] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [showMoreInfo, setShowMoreInfo] = useState(false);
    const [description, setdescription] = useState("");
    const [actions_effectuees, setactions_effectuees] = useState("");
    const [ pieces_remplacees, setpieces_remplacees] = useState("");
    const [selectedDatedebut, setSelectedDatedebut] = useState("");

    const handleChange = (event) => {
    setSelectedStatus(event.target.value);
};


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
  
  // L'autre useEffect aussi
  useEffect(() => {
    const fetchIntervention = async () => {
      try {
        const response = await fetch(`http://127.0.0.0:8000/intervention/intervention/${id}/`);
        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();
        setIntervention(data);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };
  
    fetchIntervention();
  }, [id]);
  
   

  useEffect(() => {
  const fetchStatusList = async () => {
    try {
      const response = await fetch('http://127.0.0.0:8000/api/interventions/interventions/status/'); // Make sure the URL matches your backend
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
            const response = await fetch(" http://127.0.0.0:8000/api/accounts/users/");
            if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs");

            const data = await response.json();
            setUsers(data);
            setDisplayedUsers(data.slice(0, visibleCount));
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    fetchUsers();
}, [visibleCount]); 




const techniciensDispo = users.filter(user =>
  user.role?.toLowerCase() === "technicien" &&
  user.technicien?.disponibilite === true
);



const admintab = users.filter(user =>
  user.role?.toLowerCase() === "administrateur"
);



const addTechnicien = (technicien) => {
setAssignedTechniciens([...assignedTechniciens, technicien]);
setIsPopupVisible(false); // Fermer le popup après l'ajout
};


const addAdmin = (admin) => {
  setAssignedAdmins(prev => [...prev, admin]);
  setshowPopupadmin(false); // Fermer le pop-up des admins
};

       
   
const removeTechnicien = (indexToRemove) => {
    setAssignedTechniciens((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
    );
};

    
const urgenceOptions = [
  { value: 0, label: 'Urgence vitale' },
  { value: 1, label: 'Urgence élevée' },
  { value: 2, label: 'Urgence modérée' },
  { value: 3, label: 'Faible urgence' },
];

const statutOptions = [
  { id: 1, label: "En attente" },
  { id: 2, label: "En cours" },
  { id: 3, label: "Terminé" },
  { id: 4, label: "Affecté" }
];


const [content, setContent] = useState('');
const [isEditing, setIsEditing] = useState(false);

const handleSave = () => {
  if (typeof onSave === 'function') {
  //  onSave({ setContent }); // Call the onSave function passed as a prop
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
}, [selectedStatutName]);

const handleAssignAdmin = (admin) => {
  setAssignedAdmins([{
    nom: admin.nom,
    prenom: admin.prenom,
    email: admin.email,
    imageUrl: admin.imageUrl,

  }]);
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
                      
              
              
               
       <div className="flex justify-center space-x-6 my-4">
   {["Tout", "Curative", "Préventive"].map((category) => (
       <button
           key={category}
           className={`text-lg font-semibold pb-1 transition duration-300 ${
               filter === category ? "text-white underline" : "text-white"
           }`}
           onClick={() => setFilter(category)}
       >
           {category}
       </button>
   ))}


</div>  

</div>  

  <div className="w-full min-h-screen rounded-t-[45px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
 

  <div className="w-full">
      <Headerbar
        title={"Ajouter Intervention"}
        showPen={false} // Si tu veux afficher un bouton d'édition
      />
    </div>






    <div className="w-full max-w-5xl mx-auto mt-12 p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
 
  <ChoiceContainer
  title="Equipement"
  options={[
   
    { label: "Administrateur", value: "Administrateur" },
    { label: "Technicien", value: "Technicien" },
  ]}
 // selectedOption={newUser.role}
 // onSelect={(val) => setNewUser({ ...newUser, role: val })}
/>



<WriteContainer
      title="Date de début"
    value={selectedDatedebut}
      onChange={(value) => setSelectedDatedebut(value)}
      type="date"
    className="text-sm py-1 px-2  max-w-full md:max-w-[400px]  md:max-w-[480px] "
    />

 <ChoiceContainer
      title="Urgence"
      options={[
        { value: "Urgence vitale",  label: "Urgence vitale"  },
        { value: "Urgence élevée",  label: "Urgence élevée"  },
        { value: "Urgence modérée", label: "Urgence modérée" },
        { value: "Faible urgence",  label: "Faible urgence"  },
      ]}
      selectedOption={selectedUrgence}
      onSelect={setSelectedUrgence}
      className="text-sm py-1 px-2 max-w-xs w-full"
    />









<WriteContainer
      title="Date de fin"
      value={selectedDate}
      onChange={(value) => setSelectedDate(value)}
      type="date"
      className="py-2 px-3 text-sm"
    />



 <WriteContainer
        title="Description"
      //  value={"---"}
        multiline
        onChange={(val) => setdescription(val)}
          className=" px-8"
      />




<Buttonrec
      text="Attacher une image"
      bgColor="#20599E"
      textColor="white"
     // onClick={handleDisponibleClick}
     className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg shadow-md hover:bg-gray-400"
    />




<Buttonrec
      text="Assigne un Techncien"
      bgColor="#F09C0A"
      textColor="white"
     // onClick={handleDisponibleClick}
     className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg shadow-md hover:bg-gray-400"
    />



</div>




  </div>
                </div>
            );
        };
        
        export default Userspageee;
        
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
import Profil from "../assets/Profil.svg";
import InfoIntervUserr from "../components/infoIntervUser"
import EditIntervUser from "../components/editIntervUser";
import WriteContainer from "../components/writeContainer";

const Userspageee= () => {
    const [interventions, setInterventions] = useState([]);  // Stocke toutes les interventions
    const [displayedInterventions, setDisplayedInterventions] = useState([]); // Stocke les interventions affichées
    const [filter, setFilter] = useState("Tout");
    const [users, setUsers] = useState([]);  // Stocke tous les utilisateurs
    const [displayedUsers, setDisplayedUsers] = useState([]); // Stocke les utilisateurs affichés
    const [visibleCount, setVisibleCount] = useState(9);// Nombre d'utilisateurs affichés
    const [admintab, setAdmintab] = useState([]);
   
    const [menuOpen, setMenuOpen] = useState(null);   
    const [searchTerm, setSearchTerm] = useState("");
   // const [debutDate, setDebutDate] = useState(intervention?.date_debut || "");
    const [period, setPeriod] = useState(""); // State for the 'periode' field in preventive
    const [user_name, setUserName] = useState(""); // State for 'déclarer par' name
    const [user_email, setUserEmail] = useState(""); // State for 'déclarer par' email
    const [role_declarant, setRoleDeclarant] = useState(""); // State for 'déclarer par' role
    const navigate = useNavigate();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isDisponibleActive, setIsDisponibleActive] = useState(false);
    const [selectedInterventionid, setSelectedInterventionid] = useState(null);
    const [selectedStatutName, setSelectedStatutName] = useState("");
    const [statusList, setStatusList] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedStatutId, setSelectedStatutId] = useState("");
    const [technicien_email, setTechEmail] = useState("");
    const [technicien_name, setTechName] = useState("");
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
    const [notes,setnotes] = useState("");
    const [ pieces_remplacees, setpieces_remplacees] = useState("");
    const [techniciensDispo, setTechniciensDispo] = useState([]);
    const [postesList, setPostesList] = useState([]);
    const [equipementsList, setEquipementsList] = useState([]);
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
            const response = await fetch(`http://127.0.0.1:8000/api/interventions/interventions/${id}/`);
            if (!response.ok) throw new Error("Erreur lors du chargement");
            const data = await response.json();
            setIntervention(data);
            setSelectedUrgence(data.urgence_display !== undefined ? data.urgence : "");
            setSelectedStatus(data.statut_display !== undefined ? data.statut : "");
            setDateDebut(data.date_debut || "");
            setSelectedDate(data.date_fin || "");
            setdescription(data.description || "");
            setnotes(data.notes || "");
            setPeriod(data.period || "");
            setUserName(data.user_name || "");
            setUserEmail(data.user_email || "");
            setTechName(data.technicien_name || "");
            setTechEmail(data.technicien_email || "");
            setRoleDeclarant(data.role_declarant || "");
            setSelectedEquipp({ name: data.nom_equipement || "", id: data.equipement || "" });

            if (data.technicien && Array.isArray(data.technicien)) {
                // Tableau pour stocker les détails des techniciens
                const techniciansDetails = [];

                // Fonction asynchrone pour récupérer les détails d'un technicien
                const fetchTechnicianDetails = async (technicianId) => {
                    try {
                        const techResponse = await fetch(`http://127.0.0.1:8000/api/accounts/users/${technicianId}/`); // Assure-toi que cette URL est correcte pour récupérer un utilisateur par ID
                        if (!techResponse.ok) {
                            console.error(`Erreur lors de la récupération du technicien ${technicianId}`);
                            return null;
                        }
                        return await techResponse.json();
                    } catch (error) {
                        console.error(`Erreur lors de la récupération du technicien ${technicianId} :`, error);
                        return null;
                    }
                };

                // Parcourir les IDs des techniciens et récupérer leurs détails
                for (const techId of data.technicien) {
                    const techDetails = await fetchTechnicianDetails(techId);
                    if (techDetails) {
                        techniciansDetails.push({
                            id: techDetails.id,
                            name: techDetails.last_name,
                            prenom: techDetails.first_name,
                            email: techDetails.email,
                            photo: techDetails.photo,
                            poste: techDetails.poste_nom // Assure-toi que cette propriété existe
                        });
                    }
                }
                setAssignedTechniciens(techniciansDetails);
            }
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    fetchIntervention();
}, [id]);

  useEffect(() => {
  const fetchStatusList = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/interventions/interventions/status/'); // Make sure the URL matches your backend
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
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(" http://127.0.0.1:8000/api/accounts/users/");
      if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
      const data = await response.json();
      setUsers(data);
      setDisplayedUsers(data.slice(0, visibleCount));
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };

  fetchAllUsers();
}, [visibleCount]);

useEffect(() => {
  const fetchAvailableTechnicians = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/techniciens/?disponibilite=true');
      if (response.ok) {
        const data = await response.json();
        setTechniciensDispo(data);
        console.log("Techniciens disponibles:", data);
      } else {
        console.error('Erreur lors de la récupération des techniciens disponibles');
      }
    } catch (error) {
      console.error('Erreur réseau lors de la récupération des techniciens :', error);
    }
  };

  fetchAvailableTechnicians();
}, []);

useEffect(() => {
  const fetchPostes = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/postes/');
      if (!response.ok) throw new Error("Erreur lors du chargement des postes");
      const data = await response.json();
      setPostesList(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des postes :", error);
    }
  };

  fetchPostes();
}, []);

//const techniciensDispo = users.filter(user =>
//  user.role?.toLowerCase() === "technicien" &&
 // user.technicien?.disponibilite === true
//);


useEffect(() => {
  const fetchAdmins = async () => {
      try {
          const response = await fetch('http://127.0.0.1:8000/api/accounts/admins/');
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setAdmintab(data);
      } catch (error) {
          console.error("Erreur lors de la récupération des administrateurs :", error);
          // Gérer l'erreur ici (afficher un message à l'utilisateur, etc.)
      }
  };

  fetchAdmins();
}, []); //
//const admintab = users.filter(user =>
 // user.role?.toLowerCase() === "administrateur"
//);



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

useEffect(() => {
  const fetchEquipements = async () => {
      try {
          const response = await fetch('http://127.0.0.1:8000/api/equipements/equipement/');
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setEquipementsList(data);
          console.log("Liste des équipements récupérée :", data);
      } catch (error) {
          console.error("Erreur lors de la récupération des équipements :", error);
          // Gérer l'erreur ici
      }
  };

  fetchEquipements();
}, []);
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
          ? { ...intervention, statut_display: selectedStatutName }
          : intervention
      )
    );
  }
}, [selectedStatutName]);
const handleAssignAdmin = (admin) => {
  setAssignedAdmins([
    {
      id: admin.id,
      nom: admin.first_name,
      prenom: admin.last_name,
      email: admin.email,
      imageUrl: admin.photo,
    }
  ]);
  setIntervention((prev) => ({
    ...prev,
    admin: admin.id, // Mettre à jour l'ID de l'administrateur dans l'objet intervention
    admin_name: admin.nom, // Mettre à jour le nom pour l'affichage immédiat (optionnel)
    admin_email: admin.email, // Mettre à jour l'e-mail pour l'affichage immédiat (optionnel)
  }));
};


const handleUpdate = async () => {
  if (!intervention) {
    console.error("Intervention data not loaded yet.");
    alert("Impossible de mettre à jour : les informations de l'intervention n'ont pas été chargées.");
    return;
  }

  const payload = {
    urgence: selectedUrgence,
  //  technicien: assignedTechniciens.length > 0 ? assignedTechniciens[0].id : null,
  
    // ... autres champs
    technicien: assignedTechniciens.map(tech => tech.id),
    // ...
 
    statut: selectedStatus,
    date_debut: dateDebut,
    description: description,
   // date_fin:dateFin,
    notes: notes,
    equipement: selectedEquipp.id || null, // Ensure equipement ID is sent
    admin: assignedAdmins.length > 0 ? assignedAdmins[0].id : null, // Assuming you might want to update admin
    user_name: user_name,
    user_email: user_email,
    role_declarant: role_declarant,
    // Conditionally add fields based on intervention type
    ...(intervention.type_intervention?.toLowerCase() === "preventive"
      ? { period: period }
      : { date_fin: selectedDate }), // Use selectedDate for date_fin
  };

  let updateUrl = "";
  if (intervention.type_intervention?.toLowerCase() === "preventive") {
    updateUrl = `http://127.0.0.1:8000/api/interventions/interventions/preventive/update/${id}/`;
  } else if (intervention.type_intervention?.toLowerCase() === "currative") {
    updateUrl = `http://127.0.0.1:8000/api/interventions/interventions/currative/update/${id}/`;
  } else {
    console.error("Type d'intervention non reconnu.");
    alert("Impossible de déterminer le type d'intervention pour la mise à jour.");
    return;
  }

  try {
    const response = await fetch(updateUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur lors de la mise à jour :", errorData);
      throw new Error(`Erreur lors de la mise à jour: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const updatedData = await response.json();
    setIntervention(updatedData);
    setIsPopupVisible(true);
    setTimeout(() => {
      setIsPopupVisible(false);
    }, 3000); // Adjust the timeout as needed

  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    alert(`Échec de la mise à jour ! ${error.message}`);
  }
};

        useEffect(() => {
          if (intervention?.admin) {
            setAssignedAdmins([
              {
                nom: intervention.admin.last_name || "",
                prenom: intervention.admin.first_name || "",
                email: intervention.email_admin || "",
                imageUrl:
                  intervention.admin.photo?.startsWith("http")
                    ? intervention.admin.photo
                    : intervention.admin.photo
                    ? `http://127.0.0.1:8000${intervention.admin.photo}`
                    : "",
              },
            ]);
          }
        }, [intervention]);                                          
      




        const [selectedEquipp, setSelectedEquipp] = useState({ name: "", id: "" });
        useEffect(() => {
          if (intervention) {
            setSelectedEquipp({
              name: intervention.equipement_name || "",
              id: intervention.equipement || "",
            });
          }
        }, [intervention]);
        const handleAssignEquip = (equipement) => {
          setSelectedEquipp({
              name: equipement.nom,
              id: equipement.id_equipement,
          });
          setIntervention((prev) => ({
              ...prev,
              equipement: equipement.id_equipement,
              equipement_name: equipement.nom,
          }));
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
 


<div >
{intervention && (
  <>
    <div className="w-full">
      <Headerbar
        title={`Modifier Intervention #${intervention.id}`}
        showPen={false} // Si tu veux afficher un bouton d'édition
      />
    </div>

    {/* Première ligne : Equipement + Urgence */}



    
    <div className="w-full max-w-5xl mx-auto mt-14 p-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      {selectedEquipp.name && selectedEquipp.id && (
       <DisModContainerEquip
       title="Équipement"
       initialName={selectedEquipp.name}
       initialId={selectedEquipp.id}
       equipements={equipementsList.map(equip => ({ // Passer la liste des équipements
           id: equip.id_equipement,
           name: equip.nom, // Assure-toi que le nom correspond
       }))}
       onAssignEquip={handleAssignEquip} // Utiliser la fonction locale
   />
      )}

      <ChoiceContainer
        title="Urgence"
        options={urgenceOptions}
        selectedOption={urgenceOptions.find(opt => opt.value === selectedUrgence)?.label || ""}
        onSelect={(value) => setSelectedUrgence(value)}
      />
    </div>

    {/* Deuxième ligne : Technicien(s) + Statut */}
    <div className="w-full max-w-5xl mx-auto mt-14 p-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-4">
        {assignedTechniciens.map((tech, index) => (
          <div key={index} className="flex items-center justify-between">
            <TechnicienAssign
              nom={tech.name}
              prenom={tech.prenom}
              email={tech.email}
              imageUrl={tech.photo}
              poste={tech.poste}
              buttonTitle="Retirer"
              onAssign={() => removeTechnicien(index)}
            />
          </div>
        ))}
        {/* Bouton Ajouter */}
        <div className="flex justify-center">
          <Button
            text="Ajouter"
            bgColor="#F09C0A"
            textColor="#ffffff"
            onClick={() => setShowPopup(true)}
          />
        </div>
      </div>

      {showPopup && (
        <AssignPopUp
          titre="Technicien(s) disponibles"
          description="Les techniciens disponibles en ce moment."
          buttonTitle="Ajouter"
          technicians={techniciensDispo.map((tech) => ({
            id: tech.user.id,
            nom: tech.user.last_name,
            prenom: tech.user.first_name,
            poste: tech.poste_nom|| "Non spécifié",
            email:tech.user.email,
            imageUrl:tech.user.photo,
            
          }))}
          onClose={() => setShowPopup(false)}
          onAssign={(user) => {
            addTechnicien({
              id: user.id,
              name: `${user.prenom} ${user.nom}`,
              email: user.email,
              imageUrl: user.photo,
              poste: user.poste,
            });
          }}
        />
      )}

<ChoiceContainer
  title="Status"
  options={statusList.map((status) => ({
    label: status.name,
    value: status.id,
  }))}
  selectedOption={statusList.find(status => status.id === selectedStatus)?.name || ""}
  onSelect={(value) => setSelectedStatus(value)}
/>

    </div>

    {/* Troisième ligne : Date Début + Date Fin */}
    <div className="w-full max-w-5xl mx-auto mt-14 p-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
     
    {intervention?.type_intervention?.toLowerCase() === "currative" && (
        <>
          <DisModContainer
            title="Date fin"
            initialContent={intervention.date_fin}
            onSave={(value) => setIntervention((prev) => ({ ...prev, date_fin: value }))}
            type="date"
          />
          <EditIntervUser
            title="Déclarer par:"
            initialNom={intervention.user_name}
            // initialPrenom={intervention.prenom_declarant}
            initialEmail={intervention.user_email} // Email ici
            initialImageUrl={
              previewUrl
                ? previewUrl
                : intervention.photo_declarant
                ? intervention.photo_declarant.startsWith("http")
                  ? intervention.photo_declarant
                  : `http://127.0.0.1:8000${intervention.photo_declarant}`
                : Profil
            }
            titre="Sélectionnez un utilisateur"
            description="Choisissez un utilisateur parmi la liste"
            users={users.map((user) => ({
              id: user.id,
              nom: user.last_name,
              prenom: user.first_name,
           //   poste: user.poste_nom,
              rolee: user.role,
              imageUrl: user.photo,
              email: user.email,
            }))}
            buttonTitle="Sélectionner"
            onAssignUser={(user) => {
              setIntervention((prev) => ({
                ...prev,
                user_name: user.nom,
                // prenom_declarant: user.prenom,
                user_email: user.email,
                //   photo_declarant: user.imageUrl,
                role_declarant: user.rolee,
              }));
            }}
          />
        </>
      )}



{intervention?.type_intervention?.toLowerCase() === "preventive" && (
        <DisModContainer
          title="Periode"
          initialContent={intervention.period} // Adjust field name
          onSave={(value) => setIntervention((prev) => ({ ...prev, period: value }))} // Adjust state update
          type="text" // Or a custom duration input component
        />
      )}



      <DisModContainer
        title="Date debut"
        initialContent={intervention.date_debut}
        onSave={(value) => setIntervention((prev) => ({ ...prev, date_debut: value }))}
        type="date"
      />

      <EditIntervUser
        title="Admin"
       // initialNom={assignedAdmins[0]?.nom || ""}
    //  initialPrenom={assignedAdmins[0]?.prenom || ""}
   
     initialPrenom={intervention?.admin_name|| ""}
     initialEmail={intervention?.admin_email || ""}
    //  
    //  initialEmail={assignedAdmins[0]?.admin_email || ""}
        initialImageUrl={assignedAdmins[0]?.imageUrl || ""}
        titre="Administrateur"
        buttonTitle="Modifier"
        description=""
        users={admintab.map((admin) => ({
          id: admin.user.id,
          nom: admin.user.last_name,
          prenom: admin.user.first_name,
          email: admin.user.email,
          imageUrl:
            admin.user.photo?.startsWith("http")
              ? admin.user.photo
              : admin.user.photo
              ? `http://127.0.0.1:8000${admin.user.photo}`
              : "",
        }))}
        onAssignUser={handleAssignAdmin}
      />
 {/* Quatrième ligne : Déclarée par + Admin */}
 
     
      <WriteContainer
        title="Description"
        value={intervention.description || "---"}
        multiline
        onChange={(val) => setdescription(val)}
          className=" px-8"
      />
  

      
    </div>

   
    {/* Plus d'infos : Actions & Pièces */}
    {!showMoreInfo ? (
      <h3
        className="mt-6 text-black font-semibold text-lg cursor-pointer hover:underline text-center"
        onClick={() => setShowMoreInfo(true)}
      >
        Plus d'infos
      </h3>
    ) : (
      <>
        <h2 className="text-lg font-semibold text-black mb-4 mt-6 text-center">
          Plus d'Infos :
        </h2>

        <div className="w-full max-w-5xl mx-auto mt-14 p-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <WriteContainer
            title="Actions Effectuées"
            value={intervention.notes || "---"}
            onChange={(val) => setnotes(val)}
          />

          <WriteContainer
            title="Pièces remplacées"
            value={intervention.pieces || "---"}
            onChange={(val) => {
              console.log("Pièces modifiées:", val);
            }}
              className=" px-8"
          />
        </div>
      </>
    )}

    <div className="flex justify-center mt-12">
      <Button
        text="Modifier"
        bgColor="#20599E"
        textColor="white"
        onClick={handleUpdate}
      />
    </div>

    {isPopupVisible && (
      <PopupMessage
        title="L’intervention a été Modifiée avec succès !"
        onClose={() => setIsPopupVisible(false)}
      />
    )}
  </>
  
)}

</div>





       
                 </div>
                </div>
            );
        };
        
        export default Userspageee;
        
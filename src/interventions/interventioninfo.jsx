import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Headerbar from "../components/Arrowleftt";
import DisplayContainer from "../components/displayContainer";
import InfoIntervUser from "../components/infoIntervUser";
import cube from "../assets/cube.svg";

const InfoIntervention = () => {
  const [interventions, setInterventions] = useState([]); // Stocke toutes les interventions
  const [displayedInterventions, setDisplayedInterventions] = useState([]); // Stocke les interventions affichées

  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState("En attente");

  const handleChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const [intervention, setIntervention] = useState(null);

  // integration de fetch des detail  :

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
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/interventions/interventions/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : {}),
            },
          }
        );
        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();
        setIntervention(data);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    fetchIntervention();
  }, [id]);

  const urgenceColors = {
    "tres urgent": "bg-[#F09C0A] ",
    "urgence moyenne": "bg-[#20599E] ",
    "Urgence critique": "bg-[#FF4423] ",
    "Faible Urgence ": "bg-[#49A146] ",
  };

  const statusColors = {
    Affecte: "bg-[#F09C0A] ",
    "En cours ": "bg-[#20599E] ",
    "En attente": "bg-[#FF4423] ",
    Terminee: "bg-[#49A146] ",
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E]">
      {/* Logo en haut à gauche */}
      <Header />

      {/* En-tête */}
      <div className="w-full bg-[#20599E] text-white pb-16 text-center">
        <h1 className="text-3xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Interventions
        </h1>
        {/* Barre de recherche */}
      </div>

      <div className="w-full min-h-screen rounded-t-[35px] sm:rounded-t-[45px] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12">
        {intervention && (
          <>
            <div className="w-full">
              <Headerbar
                title={`Intervention #${intervention.id}`}
                showPen={false}
              />
            </div>

            {/* Conteneur principal à deux colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 px-8 mt-6">
              {/* Colonne de gauche */}
              <div className="space-y-6">
                {/* Type */}
                <DisplayContainer
                  title="Type de l'intervention"
                  content={intervention.type_intervention || "---"}
                />

                {/* Urgence */}
                <DisplayContainer
                  title="Urgence"
                  content={intervention?.urgence_display || "---"}
                />

                {/* Technicien(s) */}
                <DisplayContainer
                  title="Technicien(s)"
                  content={
                    Array.isArray(intervention?.technicien_name) &&
                    intervention.technicien_name.length > 0 ? (
                      intervention.technicien_name.map((name, index) => (
                        <InfoIntervUser
                          key={index}
                          nom={name}
                          prenom=""
                          email={
                            intervention?.technicien_email?.[index] || "---"
                          }
                        />
                      ))
                    ) : (
                      <InfoIntervUser
                        nom={
                          intervention?.technicien_name?.[0] ||
                          intervention?.technicien_name ||
                          "---"
                        }
                        prenom=""
                        email={
                          intervention?.technicien_email?.[0] ||
                          intervention?.technicien_email ||
                          "---"
                        }
                      />
                    )
                  }
                />

                {/* Déclarée par (uniquement pour currative) */}
                {intervention.type_intervention === "currative" && (
                  <DisplayContainer
                    title="Déclarée par"
                    content={
                      <InfoIntervUser
                        nom={intervention.user_name || "---"}
                        prenom=""
                        email={intervention.user_email || "---"}
                        imageUrl={intervention.image_declarant}
                      />
                    }
                  />
                )}

                {/* Admin */}
                <DisplayContainer
                  title="Admin"
                  content={
                    <InfoIntervUser
                      nom={intervention?.admin_name}
                      email={intervention?.admin_email}
                      imageUrl={intervention?.admin?.photo}
                    />
                  }
                />
              </div>

              {/* Colonne de droite */}
              <div className="space-y-6">
                {/* Équipement */}
                <DisplayContainer
                  title="Équipement"
                  content={
                    <div className="flex items-center text-black">
                      <img
                        src={cube}
                        alt="Cube"
                        className="w-5 h-5 flex-shrink-0 mr-2"
                      />
                      <span className="mr-2">
                        {intervention.equipement_name}
                      </span>
                      <span className="font-semibold">{`#${intervention.equipement}`}</span>
                    </div>
                  }
                />

                {/* Statut */}
                <DisplayContainer
                  title="Statut"
                  content={intervention?.statut_display || "---"}
                />

                {/* Date début */}
                <DisplayContainer
                  title="Date début"
                  content={
                    <input
                      type="date"
                      value={intervention?.date_debut?.slice(0, 10) || ""}
                      disabled
                      className="bg-white outline-none w-full"
                    />
                  }
                />

                {/* Date fin (uniquement pour currative) */}
                {intervention.type_intervention === "currative" && (
                  <DisplayContainer
                    title="Date fin"
                    content={
                      <input
                        type="date"
                        value={intervention.date_fin?.slice(0, 10) || ""}
                        disabled
                        className="bg-white outline-none w-full"
                      />
                    }
                  />
                )}

                {/* Période (uniquement pour preventive) */}
                {intervention.type_intervention === "preventive" && (
                  <DisplayContainer
                    title="Période (durée)"
                    content={intervention.period || "---"}
                  />
                )}

                {/* Description */}
                <DisplayContainer
                  title="Description"
                  content={
                    <div className="min-h-[80px] p-2 rounded-md">
                      {intervention?.description || "---"}
                    </div>
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InfoIntervention;

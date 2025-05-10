import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PicView from "@/components/viewPic";
import ImportManual from "../components/importManual";
import PopupMessage from "../components/Popupcheck";
import WriteContainer from "../components/writeContainer";
import Headerbar from "../components/Arrowleftt";
import Header from "../components/Header";
import Buttonrec from "../components/buttonrectangle";
import ChoiceContainer from "../components/choiceContainer";

const EditPage = () => {
  // Get equipment ID from URL params
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // State for form submission feedback
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // State for uploaded files
  const [previewUrl, setPreviewUrl] = useState(null);

  // Authentication token from local storage
  const token = localStorage.getItem("access_token");

  // State for dropdown options
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [localisations, setLocalisations] = useState([]);

  // Main equipment state
  const [equipement, setEquipement] = useState(
    state?.equipement || {
      nom: "",
      type: "",
      categorie: "",
      localisation: "",
      codebar: "",
      code: "",
      manuel: null,
      image: null,
    }
  );

  // Fetch equipment data when component mounts
  useEffect(() => {
    const fetchEquipement = async () => {
      const token = localStorage.getItem("access_token"); // Vérifie bien que le nom du token est correct

      console.log("ID équipement demandé :", id);
      console.log("Token utilisé :", token);

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/equipements/equipement/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        console.log("Réponse brute de l'API :", response);

        if (!response.ok) {
          console.error("Erreur HTTP - Statut :", response.status);
          throw new Error(`Équipement introuvable ! (code ${response.status})`);
        }

        const data = await response.json();
        console.log("Données récupérées :", data);
        setEquipement(data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'équipement:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEquipement();
    } else {
      console.warn("Aucun ID d'équipement fourni !");
      setError("Aucun ID d'équipement fourni !");
      setLoading(false);
    }
  }, [id]);

  // Fetch type options
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.warn("Aucun access_token trouvé !");
      return;
    }

    fetch("http://127.0.0.1:8000/api/equipements/type/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const typeOptions = data.map((type) => ({
          value: type.id,
          label: type.nom,
        }));
        setTypes(typeOptions);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des types:", error);
      });
  }, []);

  // Fetch category options
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.warn("Aucun access_token trouvé !");
      return;
    }

    fetch("http://127.0.0.1:8000/api/equipements/categorie/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const categoryOptions = data.map((cat) => ({
          value: cat.id,
          label: cat.nom,
        }));
        setCategories(categoryOptions);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des catégories:", error);
      });
  }, []);

  // Fetch location options
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.warn("Aucun access_token trouvé !");
      return;
    }

    fetch("http://127.0.0.1:8000/api/equipements/localisation/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const locationOptions = data.map((loc) => ({
          value: loc.id,
          label: loc.nom,
        }));
        setLocalisations(locationOptions);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des localisations:",
          error
        );
      });
  }, []);

  // Handle manual file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setEquipement({ ...equipement, manuel: file });
      // Create a preview link
      const fileURL = URL.createObjectURL(file);
      setPreviewUrl(fileURL);
    }
  };

  // Handle form submission to update equipment
  const handleUpdate = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Aucun token trouvé dans le localStorage !");
      setErrorMessage("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    const formData = new FormData();

    // Ajout des champs dans formData
    formData.append("nom", equipement.nom);
    formData.append("type", equipement.type);
    formData.append("categorie", equipement.categorie);
    formData.append("localisation", equipement.localisation);
    formData.append("codebar", equipement.codebar);
    formData.append("code", equipement.code);

    if (equipement.image && equipement.image instanceof File) {
      formData.append("image", equipement.image);
    }

    if (equipement.manuel instanceof File) {
      formData.append("manuel", equipement.manuel);
    }

    fetch(`http://127.0.0.1:8000/api/equipements/equipement/${id}/update/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`, // ⬅️ ajout ici
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Server Error: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then(() => {
        setIsPopupVisible(true);
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour :", error);
        setErrorMessage("Échec de la mise à jour !");
      });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E]">
      <Header />

      {/* Page title */}
      <div className="w-full bg-[#20599E] text-white pb-16 text-center">
        <h1 className="text-3xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-[#F4F4F4] mb-4 mt-2">
          Equipements
        </h1>
      </div>

      {/* Main content area */}
      <div className="w-full min-h-screen rounded-t-[35px] sm:rounded-t-[45px] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-8 shadow-md flex flex-col bg-[#F4F4F4] -mt-12 ">
        {/* Back navigation */}
        <div className="w-full">
          <Headerbar title="Modifier Un Equipement" />
        </div>

        {/* Two-column layout for form */}
        <div className="flex flex-col-reverse sm:flex-row px-3.5 mt-12 gap-4">
          {/* Left Column - Text fields */}
          <div className="flex flex-col w-full sm:w-1/2 pr-0 sm:pr-2">
            {/* Name field */}
            <div className="my-2">
              <WriteContainer
                title="Nom"
                value={equipement.nom || ""}
                onChange={(val) =>
                  setEquipement((prev) => ({ ...prev, nom: String(val) }))
                }
              />
            </div>

            {/* Barcode field */}
            <div className="my-2">
              <WriteContainer
                title="Code Bar"
                value={equipement.codebar}
                onChange={(val) =>
                  setEquipement({ ...equipement, codebar: val })
                }
              />
            </div>

            {/* Inventory code field */}
            <div className="my-2">
              <WriteContainer
                title="Code Inventaire"
                value={equipement.code || ""}
                onChange={(val) =>
                  setEquipement((prev) => ({ ...prev, code: String(val) }))
                }
              />
            </div>
          </div>

          {/* Right Column - Image preview */}
          <div className="flex justify-center items-center w-full sm:w-1/2 py-4">
            <PicView equipement={equipement} />
          </div>
        </div>

        {/* Category and Type selection */}
        <div className="flex flex-col sm:flex-row w-full mx-auto px-3.5 mt-2">
          {/* Category dropdown */}
          <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
            <ChoiceContainer
              title="Catégorie"
              options={categories}
              selectedOption={
                categories.find((cat) => cat.value === equipement.categorie)
                  ?.label || ""
              }
              onSelect={(value) =>
                setEquipement({ ...equipement, categorie: value })
              }
            />
          </div>

          {/* Type dropdown */}
          <div className="w-full sm:w-1/2 pl-0 sm:pl-2">
            <ChoiceContainer
              title="Type"
              options={types}
              selectedOption={
                types.find((t) => t.value === equipement.type)?.label || ""
              }
              onSelect={(value) =>
                setEquipement({ ...equipement, type: value })
              }
            />
          </div>
        </div>

        {/* Manual upload and Location selection */}
        <div className="flex flex-col sm:flex-row w-full mx-auto px-3.5 mt-2">
          {/* Manual file upload */}
          <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
            <label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[0.8125rem] mb-1 ml-0.25rem">
              Manuel
            </label>

            {/* Manual upload component */}
            <ImportManual onChange={handleFileChange} />

            {/* Display current manual if available */}
            {equipement.manuel && typeof equipement.manuel === "string" && (
              <p className="text-gray-700 mb-2">
                Fichier actuel :{" "}
                <a
                  href={equipement.manuel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Voir le manuel
                </a>
              </p>
            )}
          </div>

          {/* Location dropdown */}
          <div className="w-full sm:w-1/2 pl-0 sm:pl-2">
            <ChoiceContainer
              title="Localisation"
              options={localisations}
              selectedOption={
                localisations.find(
                  (loc) => loc.value === equipement.localisation
                )?.label || ""
              }
              onSelect={(value) =>
                setEquipement({ ...equipement, localisation: value })
              }
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-center mt-4">
          <Buttonrec text="Enregistrer" onClick={handleUpdate} />
        </div>

        {/* Error message display */}
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {/* Success popup */}
        {isPopupVisible && (
          <PopupMessage
            title="Équipement mis à jour avec succès !"
            onClose={() => setIsPopupVisible(false)}
          />
        )}
      </div>
    </div>
  );
};

export default EditPage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import ChoiceContainer from "../components/choiceContainer";
import WriteContainer from "../components/writeContainer";
import Headerbar from "../components/Arrowleftt";
import PicField from "../components/picfield.jsx";
import ImportManual from "@/components/importManual.jsx";
import PopupMessage from "@/components/Popupcheck.jsx";
const AjoutPage = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [equipements,setEquipements]=useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedManual, setSelectedManual] = useState(null);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [localisations, setLocalisations] = useState([]);
  const token = localStorage.getItem("access_token");

  const [newEquipement, setNewEquipement] = useState({
    nom: "",
    type: "",
    categorie: "",
    localisation: "",
    codebar: "",
    code: "",
    etat: "1",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setNewEquipement({ ...newEquipement, [e.target.name]: e.target.value });
  };


  const handleFileChange = (event) => setSelectedManual(event.target.files[0]);

  const handleAddEquipement = () => {
    const formData = new FormData();
    formData.append("nom", newEquipement.nom);
    formData.append("type", newEquipement.type);
    formData.append("categorie", newEquipement.categorie);
    formData.append("localisation", newEquipement.localisation);
    formData.append("codebar", newEquipement.codebar);
    formData.append("etat", newEquipement.etat);

    if (selectedImage && selectedImage instanceof File) {
      formData.append("image", selectedImage);
    }

    if (selectedManual) {
      formData.append("manuel", selectedManual);
    }
    fetch("http://127.0.0.1:8000/api/equipements/equipement/create/", {
        method: "POST",
        body: formData,
      })
        .then(async (response) => {
          let data;
          try {
            data = await response.json(); // Try parsing JSON
          } catch (error) {
            console.warn("Non-JSON response received:", error);
            data = null;
          }
      
          console.log("Server response:", data);
      
          if (!response.ok) {
            throw new Error(data?.message || "Échec de l'ajout !");
          }
      
        
         
          setEquipements([...equipements, data]);
          setIsPopupVisible(true);
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout:", error);
          alert("Erreur lors de l'ajout !");
        });
      
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [typeRes, catRes, locRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/equipements/type/", { headers: { Authorization: `Token ${token}` } }),
          fetch("http://127.0.0.1:8000/api/equipements/categorie/", { headers: { Authorization: `Token ${token}` } }),
          fetch("http://127.0.0.1:8000/api/equipements/localisation/", { headers: { Authorization: `Token ${token}` } }),
        ]);

        const [typeData, catData, locData] = await Promise.all([
          typeRes.json(),
          catRes.json(),
          locRes.json(),
        ]);

        setTypes(typeData.map((t) => ({ value: t.id, label: t.nom })));
        setCategories(catData.map((c) => ({ value: c.id, label: c.nom })));
        setLocalisations(locData.map((l) => ({ value: l.id, label: l.nom })));
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchOptions();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#20599E] rounded-r-md overflow-x-hidden">
      <Header />
      <div className="w-full bg-[#20599E] text-white py-16 text-center">
        <h1 className="text-4xl font-bold text-[#F4F4F4] mb-4">Equipements</h1>
        
      </div>

      <div className="w-full min-h-screen bg-[#F4F4F4] rounded-t-[45px] px-6 py-8">
        <Headerbar title="Ajouter Un Equipement" />
        <div className="flex flex-col-reverse sm:flex-row mt-12 gap-4">
          <div className="w-full sm:w-1/2">
            <WriteContainer name="nom" title="Nom" value={newEquipement.nom} onChange={(val) => setNewEquipement({ ...newEquipement, nom: val })} />
            <WriteContainer name="codebar" title="Code Bar" value={newEquipement.codebar} onChange={handleChange} />
            <WriteContainer name="code" title="Code d'inventaire" value={newEquipement.code} onChange={(val) => setNewEquipement({ ...newEquipement, code: val })} />
          </div>
          <div className="w-full sm:w-1/2 flex justify-center items-center">
            <PicField selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row mt-2 gap-2">
          <div className="w-full sm:w-1/2">
            <ChoiceContainer title="Catégorie" options={categories} 
            selectedOption={
              categories.find((cat) => cat.value === newEquipement.categorie)?.label || ""
            }
            onSelect={(value) => setNewEquipement({ ...newEquipement, categorie: value })} />
          </div>
          <div className="w-full sm:w-1/2">
            <label className="text-sm font-medium text-[#202124] mb-1">Manual</label>
             <ImportManual  onChange={handleFileChange}/>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row mt-2 gap-2">
          <div className="w-full sm:w-1/2">
            <ChoiceContainer title="Localisation" options={localisations} 
            selectedOption={
              localisations.find((loc) => loc.value === newEquipement.localisation)?.label || ""
            }
            onSelect={(value) => setNewEquipement({ ...newEquipement, localisation: value })} />
          </div>
          <div className="w-full sm:w-1/2">
            <ChoiceContainer title="Type" options={types} 
             selectedOption={
              types.find((t) => t.value === newEquipement.type)?.label || ""
            }
             onSelect={(value) => setNewEquipement({ ...newEquipement, type: value })} />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={handleAddEquipement} className="bg-[#20599E] text-white px-6 py-2 rounded-md">Ajouter</button>
        </div>

        
      </div>
      
      {isPopupVisible && (
  <PopupMessage
    title="Équipement ajouté avec succès !"
    onClose={() => setIsPopupVisible(false)}
  />
)}
    </div>
  );
};

export default AjoutPage;
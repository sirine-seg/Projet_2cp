import SideBar from "../components/sideBar";
import FieldGrid from "../components/fieldGrid";
import Breadcrumb from "../components/breadCrumbs";
import Header from "../components/Header";
import ChampTitle from "../components/champTitle";
import FieldLines from "../components/fieldLines";
import PopupAdd from "../components/popupAdd";
import { useState } from "react";

export default function ChampsDynamiquesPage() {
  const [showPopup, setShowPopup] = useState(false);
  const fieldDisplayNames = {
    Localisations: "une localisation",
    Postes: "un poste",
    Categories: "une catégorie",
    Etats: "un etat",
    Status: "un statut",
  };
  const [newFieldName, setNewFieldName] = useState("");
  const [editingField, setEditingField] = useState("");
  const [Localisations, setLocalisations] = useState([
    "S30",
    "AP2",
    "Bibliotheque",
    "A6",
    "S10",
    "CP7",
    "DE",
    "S19+20",
    "M2",
    "Salle",
    "DG-A",
    "A3",
  ]);
  const [categories, setCategories] = useState([
    {
      title: "Mobilier",
      subfields: ["Chaise", "Table", "Bureau", "Armoire"],
    },
    {
      title: "Informatique",
      subfields: ["Ordinateur", "Ecran", "Imprimante", "Scanner"],
    },
  ]);
  const [parentCategory, setParentCategory] = useState(null);
  const [Postes, setPostes] = useState([
    "Plombier",
    "Electricien",
    "mechanicien",
  ]);
  const [Etats, setEtats] = useState([
    "En service",
    "En maintenance",
    "En panne",
  ]);
  const [Status, setStatus] = useState(["En attente", "En cour", "Terminée"]);

  const handleFieldClick = (field) => {
    console.log("Clicked field:", field);
  };

  const handleAjouterClick = (fieldName, parent = null) => {
    setEditingField(fieldName);
    setParentCategory(parent);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setNewFieldName("");
  };

  const handlePopupUpdate = (newFieldName) => {
    if (newFieldName.trim() !== "") {
      if (editingField === "Localisations") {
        setLocalisations((prev) => [...prev, newFieldName]);
      } else if (editingField === "Postes") {
        setPostes((prev) => [...prev, newFieldName]);
      } else if (editingField === "Etats") {
        setEtats((prev) => [...prev, newFieldName]);
      } else if (editingField === "Status") {
        setStatus((prev) => [...prev, newFieldName]);
      } else if (editingField === "Categories") {
        setCategories((prev) => [
          ...prev,
          { title: newFieldName, subfields: [] },
        ]);
      } else if (editingField === "Type" && parentCategory) {
        setCategories((prev) =>
          prev.map((category) =>
            category.title === parentCategory
              ? {
                  ...category,
                  subfields: [...category.subfields, newFieldName],
                }
              : category
          )
        );
      }
    }
    handlePopupClose();
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="fixed top-0 left-0 h-screen w-64 z-30">
        <SideBar />
      </div>

      <div className="top-0 left-0 right-0 z-20">
        <Header bleu />
      </div>

      <div className="ml-80 pt-10 p-6 mr-24">
        <div className="mb-12">
          <Breadcrumb path={["Administration", "Champs Dynamiques"]} />
        </div>

        <ChampTitle
          title="Localisations"
          handleAjouterClick={() => handleAjouterClick("Localisations")}
        />
        <FieldGrid fields={Localisations} onFieldClick={handleFieldClick} />

        <div className="mb-12 ml-10"></div>
        <ChampTitle
          title="Categories et types d'équipement"
          handleAjouterClick={() => handleAjouterClick("Categories")}
        />
        <FieldLines
          fields={categories}
          onSubfieldClick={handleFieldClick}
          onClickAdd={(categoryTitle) =>
            handleAjouterClick("Type", categoryTitle)
          }
        />
        <div className="mb-12 ml-10"></div>

        <ChampTitle
          title="Postes"
          handleAjouterClick={() => handleAjouterClick("Postes")}
        />
        <FieldGrid fields={Postes} onFieldClick={handleFieldClick} />
        <div className="mb-12 ml-10"></div>

        <ChampTitle
          title="Etats des equipements"
          handleAjouterClick={() => handleAjouterClick("Etats")}
        />
        <FieldGrid fields={Etats} onFieldClick={handleFieldClick} />
        <div className="mb-12 ml-10"></div>

        <ChampTitle
          title="Status des interventions"
          handleAjouterClick={() => handleAjouterClick("Status")}
        />
        <FieldGrid fields={Status} onFieldClick={handleFieldClick} />
        <div className="mb-12 ml-10"></div>
      </div>

      
      {showPopup && (
        <PopupAdd
          title={editingField === "Type" && parentCategory
            ? `Ajouter un type dans ${parentCategory}`
            : `Ajouter ${fieldDisplayNames[editingField] || ""}`}
          added={() => handlePopupUpdate(newFieldName)}
          onClose={handlePopupClose}
          newFieldName={newFieldName}
          setNewFieldName={setNewFieldName}
        />
      )}
    </div>
  );
}

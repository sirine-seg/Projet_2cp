import SideBar from "../components/sideBar";
import FieldGrid from "../components/fieldGrid";
import Breadcrumb from "../components/breadCrumbs";
import Header from "../components/Header";
import ChampTitle from "../components/champTitle";
import FieldLines from "../components/fieldLines";
import PopupAdd from "../components/popupAdd";
import { useState, useEffect } from "react";

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
  const [Localisations, setLocalisations] = useState([]);
  const [Etats, setEtats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState(null);
  const [Status, setStatus] = useState([]);
  const [Postes, setPostes] = useState([]);

  useEffect(() => {
    // Localisations
    fetch("http://localhost:8000/api/equipements/localisation/")
      .then((res) => res.json())
      .then((data) => setLocalisations(data.map((loc) => loc.nom)))
      .catch((err) => console.error("❌ Failed to fetch localisations", err));

    // États
    fetch("http://localhost:8000/api/equipements/etat/")
      .then((res) => res.json())
      .then((data) => setEtats(data.map((etat) => etat.nom)))
      .catch((err) => console.error("❌ Failed to fetch états", err));

    // Categories and their types
    fetch("http://localhost:8000/api/equipements/categorie/")
      .then((res) => res.json())
      .then(async (cats) => {
        const updated = await Promise.all(
          cats.map(async (cat) => {
            const typesRes = await fetch(
              `http://localhost:8000/api/equipements/type/?categorie=${cat.id}`
            );
            const types = await typesRes.json();
            return {
              id: cat.id,
              title: cat.nom,
              subfields: types.map((t) => t.nom),
            };
          })
        );
        setCategories(updated);
      })
      .catch((err) =>
        console.error("❌ Failed to fetch categories/types", err)
      );

    // Status
    fetch("http://localhost:8000/api/interventions/interventions/status/")
      .then((res) => res.json())
      .then((data) => setStatus(data.map((status) => status.name)))
      .catch((err) => console.error("❌ Failed to fetch status", err));

    // Postes
    fetch("http://localhost:8000/api/accounts/postes/")
      .then((res) => res.json())
      .then((data) => setPostes(data.map((poste) => poste.nom)))
      .catch((err) => console.error("❌ Failed to fetch postes", err));
  }, []);

  const handleFieldClick = (field) => {
    console.log("Clicked field:", field);
  };

  const handleAjouterClick = (fieldName, parent = null) => {
    console.log("💡 Adding:", fieldName);
    setEditingField(fieldName);
    setParentCategory(parent);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setNewFieldName("");
  };

  const handlePopupUpdate = async (newFieldName) => {
    if (newFieldName.trim() === "") return;

    // Localisations
    if (editingField === "Localisations") {
      try {
        const response = await fetch(
          "http://localhost:8000/api/equipements/localisation/create/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom: newFieldName }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setLocalisations((prev) => [...prev, data.nom || newFieldName]);
        } else {
          console.error(
            "❌ Failed to add localisation:",
            response.status,
            data
          );
        }
      } catch (error) {
        console.error("❌ Fetch error (localisation):", error);
      }
    }

    // États
    else if (editingField === "Etats") {
      try {
        const response = await fetch(
          "http://localhost:8000/api/equipements/etat/create/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom: newFieldName }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setEtats((prev) => [...prev, data.nom || newFieldName]);
        } else {
          console.error("❌ Failed to add etat:", response.status, data);
        }
      } catch (error) {
        console.error("❌ Fetch error (etat):", error);
      }
    }

    // Categories and their types
    else if (editingField === "Categories") {
      try {
        const response = await fetch(
          "http://localhost:8000/api/equipements/categorie/create/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom: newFieldName }),
          }
        );

        if (response.ok) {
          const added = await response.json();
          setCategories((prev) => [
            ...prev,
            { title: added.nom || newFieldName, subfields: [] },
          ]);
        } else {
          const errorText = await response.text();
          console.error(
            "❌ Failed to add category",
            response.status,
            errorText
          );
        }
      } catch (error) {
        console.error("❌ Fetch error (category):", error);
      }
    } else if (editingField === "Type" && parentCategory) {
      const matchedCategory = categories.find(
        (cat) => cat.title === parentCategory
      );
      if (!matchedCategory) {
        console.error("❌ No matching category for:", parentCategory);
        return;
      }

      const categoryId = matchedCategory.id;

      try {
        const response = await fetch(
          "http://localhost:8000/api/equipements/type/create/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nom: newFieldName,
              categorie: categoryId,
            }),
          }
        );

        if (response.ok) {
          const added = await response.json();
          setCategories((prev) =>
            prev.map((cat) =>
              cat.title === parentCategory
                ? {
                    ...cat,
                    subfields: [...cat.subfields, added.nom || newFieldName],
                  }
                : cat
            )
          );
        } else {
          const errorText = await response.text();
          console.error("❌ Failed to add type", response.status, errorText);
        }
      } catch (error) {
        console.error("❌ Fetch error (type):", error);
      }
    }

    // Status
    else if (editingField === "Status") {
      try {
        const response = await fetch(
          "http://localhost:8000/api/interventions/interventions/status/create/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newFieldName }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setStatus((prev) => [...prev, data.name || newFieldName]);
        } else {
          console.error("❌ Failed to add status:", response.status, data);
        }
      } catch (error) {
        console.error("❌ Fetch error (status):", error);
      }
    }

    // Postes
    else if (editingField === "Postes") {
      try {
        const response = await fetch(
          "http://localhost:8000/api/accounts/postes/create/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom: newFieldName }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setPostes((prev) => [...prev, data.nom || newFieldName]);
        } else {
          console.error("❌ Failed to add poste:", response.status, data);
        }
      } catch (error) {
        console.error("❌ Fetch error (poste):", error);
      }
    }

    handlePopupClose();
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F4F4]">
      <div className="fixed top-0 left-0 h-screen w-64 z-30">
        <SideBar />
      </div>

      <div className="top-0 left-0 right-0 z-20">
        <Header bleu />
      </div>

      <div className="pt-10 p-4 mr-4 ml-4 sm:ml-80 sm:mr-24">
        <div className="mb-6 sm:mb-12">
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
          title={
            editingField === "Type" && parentCategory
              ? `Ajouter un type dans ${parentCategory}`
              : `Ajouter ${fieldDisplayNames[editingField] || ""}`
          }
          added={() => handlePopupUpdate(newFieldName)}
          onClose={handlePopupClose}
          newFieldName={newFieldName}
          setNewFieldName={setNewFieldName}
        />
      )}
    </div>
  );
}

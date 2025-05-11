import SideBar from "../components/sideBar";
import FieldGrid from "../components/fieldGrid";
import Breadcrumb from "../components/breadCrumbs";
import Header from "../components/Header";
import ChampTitle from "../components/champTitle";
import FieldLines from "../components/fieldLines";
import PopupAdd from "../components/popupAdd";
import { useState, useEffect } from "react";
import Popupdelete from "../components/Popupdelet";

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
  const [localisationNameToId, setLocalisationNameToId] = useState({});
  const [etatNameToId, setEtatNameToId] = useState({});
  const [statusNameToId, setStatusNameToId] = useState({});
  const [posteNameToId, setPosteNameToId] = useState({});
  const [categorieNameToId, setCategorieNameToId] = useState({});
  const [typeNameToId, setTypeNameToId] = useState({});
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const accessToken = localStorage.getItem("access_token"); // Assuming token is stored in localStorage

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const authHeader = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    // Localisations
    fetch("http://localhost:8000/api/equipements/localisation/", {
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLocalisations(data.map((loc) => loc.nom));
        const mapping = {};
        data.forEach((loc) => {
          mapping[loc.nom] = loc.id;
        });
        setLocalisationNameToId(mapping);
      })
      .catch((err) => console.error("❌ Failed to fetch localisations", err));

    // États
    fetch("http://localhost:8000/api/equipements/etat/", {
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setEtats(data.map((etat) => etat.nom));
        const mapping = {};
        data.forEach((etat) => {
          mapping[etat.nom] = etat.id;
        });
        setEtatNameToId(mapping);
      })
      .catch((err) => console.error("❌ Failed to fetch états", err));

    // Catégories et types
    fetch("http://localhost:8000/api/equipements/categorie/", {
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        const categoryNameToId = {};
        const updated = await Promise.all(
          data.map(async (cat) => {
            categoryNameToId[cat.nom] = cat.id;

            const typesRes = await fetch(
              `http://localhost:8000/api/equipements/type/?categorie=${cat.id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  ...authHeader,
                },
              }
            );
            const types = await typesRes.json();
            types.forEach((t) => {
              typeNameToId[t.nom] = t.id;
            });
            return {
              id: cat.id,
              title: cat.nom,
              subfields: types.map((t) => t.nom),
            };
          })
        );
        setCategories(updated);
        setCategorieNameToId(categoryNameToId);
        setTypeNameToId(typeNameToId);
      })
      .catch((err) =>
        console.error("❌ Failed to fetch categories/types", err)
      );

    // Status
    fetch("http://localhost:8000/api/interventions/interventions/status/", {
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.map((status) => status.name));
        const mapping = {};
        data.forEach((status) => {
          mapping[status.name] = status.id;
        });
        setStatusNameToId(mapping);
      })
      .catch((err) => console.error("❌ Failed to fetch status", err));

    // Postes
    fetch("http://localhost:8000/api/accounts/postes/", {
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPostes(data.map((poste) => poste.nom));
        const mapping = {};
        data.forEach((poste) => {
          mapping[poste.nom] = poste.id;
        });
        setPosteNameToId(mapping);
      })
      .catch((err) => console.error("❌ Failed to fetch postes", err));
  }, []);

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

    const accessToken = localStorage.getItem("access_token");
    const authHeaders = {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    try {
      let response, data;

      // Localisations
      if (editingField === "Localisations") {
        response = await fetch(
          "http://localhost:8000/api/equipements/localisation/create/",
          {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ nom: newFieldName }),
          }
        );
        data = await response.json();
        if (response.ok)
          setLocalisations((prev) => [...prev, data.nom || newFieldName]);
        else
          console.error(
            "❌ Failed to add localisation:",
            response.status,
            data
          );
      }

      // États
      else if (editingField === "Etats") {
        response = await fetch(
          "http://localhost:8000/api/equipements/etat/create/",
          {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ nom: newFieldName }),
          }
        );
        data = await response.json();
        if (response.ok)
          setEtats((prev) => [...prev, data.nom || newFieldName]);
        else console.error("❌ Failed to add etat:", response.status, data);
      }

      // Categories
      else if (editingField === "Categories") {
        response = await fetch(
          "http://localhost:8000/api/equipements/categorie/create/",
          {
            method: "POST",
            headers: authHeaders,
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
      }

      // Types (under category)
      else if (editingField === "Type" && parentCategory) {
        const matchedCategory = categories.find(
          (cat) => cat.title === parentCategory
        );
        if (!matchedCategory) {
          console.error("❌ No matching category for:", parentCategory);
          return;
        }

        const categoryId = matchedCategory.id;

        response = await fetch(
          "http://localhost:8000/api/equipements/type/create/",
          {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ nom: newFieldName, categorie: categoryId }),
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
      }

      // Status
      else if (editingField === "Status") {
        response = await fetch(
          "http://localhost:8000/api/interventions/interventions/status/create/",
          {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ name: newFieldName }),
          }
        );
        data = await response.json();
        if (response.ok)
          setStatus((prev) => [...prev, data.name || newFieldName]);
        else console.error("❌ Failed to add status:", response.status, data);
      }

      // Postes
      else if (editingField === "Postes") {
        response = await fetch(
          "http://localhost:8000/api/accounts/postes/create/",
          {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ nom: newFieldName }),
          }
        );
        data = await response.json();
        if (response.ok)
          setPostes((prev) => [...prev, data.nom || newFieldName]);
        else console.error("❌ Failed to add poste:", response.status, data);
      }
    } catch (error) {
      console.error("❌ General fetch error:", error);
    }

    handlePopupClose();
  };

  const handleDeleteClick =
    (fieldType) =>
    (fieldName, parent = null) => {
      setEditingField(fieldType); // Set the type being deleted
      setItemToDelete(fieldName); // Set the item name
      setParentCategory(parent); // For types
      setIsDeletePopupOpen(true);
    };

  const handleClosePopup = () => {
    setIsDeletePopupOpen(false);
  };

  const handleDeleteField = async (fieldName, categoryId = null) => {
    const accessToken = localStorage.getItem("access_token");
    const authHeaders = {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    try {
      let id, url;

      switch (editingField) {
        case "Localisations":
          id = localisationNameToId[fieldName];
          url = `http://localhost:8000/api/equipements/localisation/${id}/delete/`;
          break;

        case "Etats":
          id = etatNameToId[fieldName];
          url = `http://localhost:8000/api/equipements/etat/${id}/delete/`;
          break;

        case "Postes":
          id = posteNameToId[fieldName];
          url = `http://localhost:8000/api/accounts/postes/${id}/delete/`;
          break;

        case "Status":
          id = statusNameToId[fieldName];
          url = `http://localhost:8000/api/interventions/interventions/status/${id}/`;
          break;

        case "Categories":
          id = categorieNameToId[fieldName];
          url = `http://localhost:8000/api/equipements/categorie/${id}/delete/`;
          break;

        case "Type":
          id = typeNameToId[fieldName];
          url = `http://localhost:8000/api/equipements/type/${id}/delete/`;
          break;

        default:
          console.error("❌ Unsupported editing field:", editingField);
          return;
      }

      if (!id) {
        console.error("❌ ID introuvable pour:", fieldName);
        return;
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!response.ok) {
        const err = await response.text();
        console.error(`❌ Failed to delete ${editingField}:`, err);
        return;
      }

      // Update frontend state
      switch (editingField) {
        case "Localisations":
          setLocalisations((prev) => prev.filter((name) => name !== fieldName));
          setLocalisationNameToId((prev) => {
            const newMap = { ...prev };
            delete newMap[fieldName];
            return newMap;
          });
          break;

        case "Etats":
          setEtats((prev) => prev.filter((name) => name !== fieldName));
          setEtatNameToId((prev) => {
            const newMap = { ...prev };
            delete newMap[fieldName];
            return newMap;
          });
          break;

        case "Postes":
          setPostes((prev) => prev.filter((name) => name !== fieldName));
          setPosteNameToId((prev) => {
            const newMap = { ...prev };
            delete newMap[fieldName];
            return newMap;
          });
          break;

        case "Status":
          setStatus((prev) => prev.filter((name) => name !== fieldName));
          setStatusNameToId((prev) => {
            const newMap = { ...prev };
            delete newMap[fieldName];
            return newMap;
          });
          break;

        case "Categories":
          setCategories((prev) =>
            prev.filter((cat) => cat.title !== fieldName)
          );
          setCategorieNameToId((prev) => {
            const newMap = { ...prev };
            delete newMap[fieldName];
            return newMap;
          });
          break;

        case "Type":
          if (!categoryId) {
            console.error("❌ categoryId is required to delete a type");
            return;
          }
          setCategories((prev) =>
            prev.map((cat) =>
              cat.id === categoryId
                ? {
                    ...cat,
                    subfields: cat.subfields.filter((t) => t !== fieldName),
                  }
                : cat
            )
          );
          setTypeNameToId((prev) => {
            const newMap = { ...prev };
            delete newMap[fieldName];
            return newMap;
          });
          break;
      }
    } catch (error) {
      console.error("❌ Error during delete:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F4F4]">
      {/* <div className="fixed top-0 left-0 h-screen w-64 z-30"> */}
      {/* Mobile - always closed or controlled differently */}
      {/* <div className="lg:hidden">
          <SideBar isOpen={false} />
        </div> */}

      {/* Desktop - always open */}
      {/* <div className="hidden lg:block">
          <SideBar isOpen={true} />
        </div>
      </div> */}
      <Header bleu />

      <div className="pt-10 p-4 mr-4 ml-4 lg:ml-40 lg:mr-16 xl:mr-24">
        <div className="mb-6 sm:mb-12">
          <Breadcrumb path={["Administration", "Champs Dynamiques"]} />
        </div>

        <ChampTitle
          title="Localisations"
          handleAjouterClick={() => handleAjouterClick("Localisations")}
        />
        <FieldGrid
          fields={Localisations}
          onFieldClick={(fieldName) =>
            handleDeleteClick("Localisations")(fieldName)
          }
        />

        <div className="mb-12 ml-10"></div>
        <ChampTitle
          title="Categories et types d'équipement"
          handleAjouterClick={() => handleAjouterClick("Categories")}
        />
        <FieldLines
          fields={categories}
          onSubfieldClick={(typeName, categoryId) =>
            handleDeleteClick("Type")(typeName, categoryId)
          }
          onClickAdd={(categoryTitle) =>
            handleAjouterClick("Type", categoryTitle)
          }
          onClickDelete={(categoryName) =>
            handleDeleteClick("Categories")(categoryName)
          }
        />
        <div className="mb-12 ml-10"></div>

        <ChampTitle
          title="Postes"
          handleAjouterClick={() => handleAjouterClick("Postes")}
        />
        <FieldGrid
          fields={Postes}
          onFieldClick={(fieldName) => handleDeleteClick("Postes")(fieldName)}
        />
        <div className="mb-12 ml-10"></div>

        <ChampTitle
          title="Etats des equipements"
          handleAjouterClick={() => handleAjouterClick("Etats")}
        />
        <FieldGrid
          fields={Etats}
          onFieldClick={(fieldName) => handleDeleteClick("Etats")(fieldName)}
        />
        <div className="mb-12 ml-10"></div>

        <ChampTitle
          title="Status des interventions"
          handleAjouterClick={() => handleAjouterClick("Status")}
        />
        <FieldGrid
          fields={Status}
          onFieldClick={(fieldName) => handleDeleteClick("Status")(fieldName)}
        />
        <div className="mb-12 ml-10"></div>
      </div>

      {isDeletePopupOpen && (
        <Popupdelete
          isVisible={isDeletePopupOpen}
          onClose={handleClosePopup}
          onConfirm={() => handleDeleteField(itemToDelete, parentCategory)}
          title={`Voulez-vous vraiment supprimer "${itemToDelete}" ?`}
          confirmText="Confirmer"
        />
      )}

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

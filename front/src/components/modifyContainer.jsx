import { useState } from "react";
import EditableChoice from "../components/EditableChoice"; // your component

export default function EditEquipementPage() {
  // Simulated existing equipment data
  const existingEquipment = {
    location: "Salle 101",
    status: "En service"
  };

  const [formValues, setFormValues] = useState({
    location: existingEquipment.location,
    status: existingEquipment.status
  });

  const handleUpdate = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted updated values:", formValues);
    // Send updated data to the server here
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Modifier l'équipement</h2>

      <EditableChoice
        title="Emplacement"
        options={["Salle 101", "Salle 102", "Magasin", "Laboratoire"]}
        selectedOption={formValues.location}
        onSelect={(val) => handleUpdate("location", val)}
      />

      <EditableChoice
        title="État"
        options={["En service", "En panne", "En maintenance"]}
        selectedOption={formValues.status}
        onSelect={(val) => handleUpdate("status", val)}
      />

      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Enregistrer les modifications
      </button>
    </form>
  );
}

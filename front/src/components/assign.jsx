import { useState } from "react";
import AssignPopUp from "./AssignPopUp"; // Adjust path if needed
import { MdAccountCircle } from "react-icons/md";

export default function Assigner() {
  const [showPopup, setShowPopup] = useState(false);
  const [techniciensAjoutes, setTechniciensAjoutes] = useState([]);

  // Full list of available techniciens
  const allTechnicians = [
    { id: 1, nom: "John", prenom: "Doe", email: "john@example.com", poste: "Électricien" },
    { id: 2, nom: "Jane", prenom: "Smith", email: "jane@example.com", poste: "Plombier" },
    // Add more if needed
  ];

  const handleAssign = (technicien) => {
    // Avoid adding duplicates if needed
    setTechniciensAjoutes((prev) => {
      if (!prev.some((t) => t.email === technicien.email)) {
        return [...prev, technicien];
      }
      return prev;
    });
    setShowPopup(false);
  };

  return (
    <div className="w-full">
      {/* Button to open popup */}
      <button
        onClick={() => setShowPopup(true)}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md"
      >
        Assigner un technicien
      </button>

      {/* Popup */}
      {showPopup && (
        <AssignPopUp
          titre="Assigner un technicien"
          description="Sélectionnez un technicien à assigner."
          buttonTitle="Assigner"
          technicians={allTechnicians}
          onClose={() => setShowPopup(false)}
          onAssign={handleAssign}
        />
      )}

      {/* Display assigned techniciens */}
      <div style={{ marginTop: "1rem" }}>
        {techniciensAjoutes.map((tech) => (
          <div
            key={tech.email}
            className="flex justify-between items-center border-b py-2"
          >
            <div className="flex items-center space-x-3">
              <MdAccountCircle className="text-gray-600 w-10 h-10" />
              <div>
                <p className="font-bold">
                  {tech.nom} {tech.prenom}
                </p>
                <p className="text-sm text-black">{tech.email}</p>
                <p className="text-sm text-black">
                  {tech.poste || "Aucun poste spécifié"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


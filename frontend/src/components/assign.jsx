import { useState } from "react";
import AssignPopUp from "./AssignPopUp"; // Adjust path if needed
import { MdAccountCircle } from "react-icons/md";
import UserProfilMail from "./userProfilMail"

export default function Assigner({ allTechnicians }) {
  const [showPopup, setShowPopup] = useState(false);
  const [techniciensAjoutes, setTechniciensAjoutes] = useState([]);

 
 

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
      {/* Display assigned techniciens */}
<div style={{ marginTop: "1rem" }}>
  {techniciensAjoutes.map((tech) => (
    <div key={tech.email} className="flex justify-between items-center  py-2">
      <div className="flex items-center space-x-3">
        <UserProfilMail
          nom={tech.nom}
          prenom={tech.prenom}
          email={tech.email}
          imageUrl={tech.imageUrl}  // assuming the technician has an imageUrl property
          poste={tech.poste || "Aucun poste spécifié"}  // Default message if no poste is provided
          role={tech.role || "Aucun rôle spécifié"}  // Default message if no role is provided
        />
      </div>
    </div>
  ))}
</div>

    </div>
  );
}


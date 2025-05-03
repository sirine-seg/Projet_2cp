import { useState } from "react";
import AssignPopUp from "./AssignPopUp"; // Adjust path if needed
import { MdAccountCircle } from "react-icons/md";
import UserProfilMail from "./userProfilMail"

export default function Assigner({ allTechnicians ,techniciensAjoutes,handleAssign}) {
  const [showPopup, setShowPopup] = useState(false);


 

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
          nom={tech.user.nom}
          prenom={tech.user.prenom}
          email={tech.user.email}
          imageUrl={tech.user.imageUrl}  // assuming the technician has an imageUrl property
          poste={tech.user.poste || "Aucun poste spécifié"}  // Default message if no poste is provided
          role={tech.user.role || "Aucun rôle spécifié"}  // Default message if no role is provided
        />
      </div>
    </div>
  ))}
</div>

    </div>
  );
}


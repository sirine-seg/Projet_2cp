import { useState } from "react";
import UserProfilMail from "./userProfilMail";
import ModifyPen from "../assets/modifyPen.svg";
import AssignPopUp from "./assignPopUp";

export default function EditIntervUser({
  title,
  initialNom,
  initialPrenom,
  initialEmail,
  initialImageUrl,
  titre,
  description,
  users=[],
  onAssignUser = () => {}
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [nom, setNom] = useState(initialNom);
  const [prenom, setPrenom] = useState(initialPrenom);
  const [email, setEmail] = useState(initialEmail);
  const [isHovered, setIsHovered] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSave = () => {
    setIsPopupOpen(false);
  };
  const handleAssign = (selectedUser) => {
    onAssignUser(selectedUser);
  };

  return (
    <div className="w-full mx-auto">
      <label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[1rem] mb-1.5 ml-0.25rem">
        {title}
      </label>

      <div className="bg-white flex items-center w-full p-3 rounded-lg transition-all duration-300">
        {isEditing ? (
          <div className="flex-1 space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom"
                className="flex-1 border-b border-gray-300 focus:outline-none py-1"
              />
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom"
                className="flex-1 border-b border-gray-300 focus:outline-none py-1"
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border-b border-gray-300 focus:outline-none py-1"
            />
          </div>
        ) : (
          <div className="flex-1">
            <UserProfilMail
              nom={initialNom}
              prenom={initialPrenom}
              email={initialEmail}
              imageUrl={initialImageUrl}
            />
          </div>
        )}

<div className="ml-4">
      {isPopupOpen ? (
        <button
          onClick={handleSave}
          className="text-[#20599E] font-medium text-sm mr-1 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
        >
          Save
        </button>
      ) : (
        <button
          onClick={() => setIsPopupOpen(true)} // Show popup
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="p-3 rounded-full hover:bg-gray-100 transition-all"
          style={{
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
        >
          <img
            src={ModifyPen}
            alt="Modify"
            className="w-5 h-5"
            style={{
              opacity: isHovered ? 0.8 : 1,
              transition: "opacity 200ms ease",
            }}
          />
        </button>
      )}
      {isPopupOpen && (
        <AssignPopUp
        titre={titre}
        description={description}
        technicians={users}
        onAssign={handleAssign}
        onClose={() => setIsPopupOpen(false)} />
      )}
    </div>

      </div>
    </div>
  );
}

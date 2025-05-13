import { useState } from "react";
import SearchBar from "./Searchbar";
import TechnicienAssign from "./technicienAssign";
import Quitter from "../assets/quitter.svg";
import UserProfilMail from "./userProfilMail";
export default function AssignPopUp({
    titre,
    description,
    buttonTitle,
    technicians = [],
    onClose = () => {},
    onAssign = () => {} 
  }) {

    const [isHovered, setIsHovered] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [selectedTech, setSelectedTech] = useState(null);

    function handleAssign(tech) {
        setSelectedTech(tech);

        setIsPopupOpen(false);
    }



    const [searchQuery, setSearchQuery] = useState('');
  
    const filtered = technicians.filter(tech =>
      `${tech.user.first_name} ${tech.user.email}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[1rem] shadow-xl max-w-xl max-h-[62vh] flex flex-col overflow-hidden lg:min-w-[30rem]">
        
          <div className="flex justify-between items-center px-4 py-3">
            <div>
              <h1 className="text-xl px-2 pt-1 text-[#202124] font-semibold">{titre}</h1>
              <p className="text-sm px-2 text[#202124]">{description}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-[#202124] hover:text[#202124] text-xl pr-4"
            >
            <img src={Quitter} alt="Quitter" className="h-5 w-5" />
            </button>
          </div>
  
          <div className="px-4">
            <SearchBar 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Recherche"
              className="w-full"
            />
          </div>
  
          <div className="flex-1 overflow-y-auto px-4">
            {filtered.map((tech) => (
              <div key={tech.user.email}>
                <TechnicienAssign
                  nom={tech.user.last_name}
                  prenom={tech.user.first_name}
                  email={tech.user.email}
                  photo={tech.user.photo}
                  onAssign={() => onAssign(tech)}
                  buttonTitle={buttonTitle}
                />
              </div>
            ))}

              {filtered.length === 0 && (
              <p className="text-center p-4 text-[#202124]">Aucun résultat trouvé</p>
            )}
          </div>
        </div>
      </div>
    );
}
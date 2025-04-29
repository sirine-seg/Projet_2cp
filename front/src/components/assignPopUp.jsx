import { useState } from "react";
import SearchBar from "./Searchbar";
import TechnicienAssign from "./technicienAssign";
import Quitter from "../assets/quitter.svg";
export default function AssignPopUp({
  titre,
  description,
  buttonTitle,
  technicians = [],  // ici ce sont des objets { first_name, last_name, email, technicien… }
  onClose = () => {},
  onAssign = () => {},
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = technicians.filter((tech) => {
    const query = searchQuery.toLowerCase().trim();
  
    // Construction du nom complet et autres champs
    const fullName = `${tech.nom} ${tech.prenom}`.toLowerCase();
    const fullNameReverse = `${tech.prenom} ${tech.nom}`.toLowerCase();
    const email = tech.email?.toLowerCase() || "";
    const poste = tech.poste?.toLowerCase() || "";
    const role = tech.rolee?.toLowerCase() || "";
  
    // Filtrage selon la recherche
    return (
      fullName.includes(query) ||
      fullNameReverse.includes(query) ||
      email.includes(query) ||
      poste.includes(query) ||
      role.includes(query)
    );
  });
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[1rem] shadow-xl max-w-xl max-h-[62vh] flex flex-col overflow-hidden lg:min-w-[30rem] relative z-50">
        {/* header */}
        <div className="flex justify-between items-center px-4 py-3">
          <div>
            <h1 className="text-xl font-semibold text-[#202124]">{titre}</h1>
            <p className="text-sm text-[#202124]">{description}</p>
          </div>
          <button onClick={onClose} className="p-2">
            <img src={Quitter} alt="Quitter" className="h-5 w-5" />
          </button>
        </div>

        {/* recherche */}
        <div className="px-4">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Recherche"
            className="w-full"
          />
        </div>

        {/* liste */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3">
          {filtered.map((tech) => (
            <TechnicienAssign
           
            key={tech.id}
            nom={tech.nom} 
            prenom={tech.prenom} 
            poste={tech.poste}
            role={tech.rolee} 
              email={tech.email}
              imageUrl={tech.photo}
            
              buttonTitle={buttonTitle}
              onAssign={() => onAssign(tech)}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-[#202124] p-4">
              Aucun résultat trouvé
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

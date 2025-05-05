import { useEffect, useRef, useState } from "react";
import SearchbarFiltre from "./searchbarFiltre";
import FiltreUserCheck from "./filtreUserCheck";

function FiltreUserPopUp({
  titre = "Techniciens",
  technicians = [],
  onSelect = () => {},
  onClose = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnicians, setSelectedTechnicians] = useState([]);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const filteredTechnicians = technicians.filter(tech =>
    `${tech.nom || tech.name} ${tech.prenom} ${tech.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTechnician = (technician) => {
    setSelectedTechnicians(prev => 
      prev.includes(technician) 
        ? prev.filter(tech => tech !== technician) 
        : [...prev, technician]
    );
    onSelect(technician);
  };
  
  const resetFilters = () => setSelectedTechnicians([]);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div ref={popupRef} className="bg-white rounded-[1rem] shadow-xl w-70 sm:w-80 max-h-60 flex flex-col overflow-hidden">
        <div className="px-10 pb-1">
          <SearchbarFiltre
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Recherche"
            className="w-full"
          />
        </div>

        <div className="flex justify-between items-center text-[#5F6368] px-4 pb-2">
          <span>{titre}</span>
          <button onClick={resetFilters} className="text-sm hover:underline">
            Reset
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {filteredTechnicians.map((tech, index) => (
            <div key={`${tech.email}-${index}`}>
              <FiltreUserCheck
                technicien={tech}
                checked={selectedTechnicians.includes(tech)}
                onCheck={() => toggleTechnician(tech)}
              />
            </div>
          ))}
          {filteredTechnicians.length === 0 && (
            <p className="text-center p-4 text-[#202124]">Aucun résultat</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FiltreUserPopUp;
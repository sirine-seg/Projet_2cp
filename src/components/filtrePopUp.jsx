import { useEffect, useRef, useState } from "react";
import SearchbarFilre from "./searchbarFiltre";
import FiltreCheck from "./filtreCheck";

function FiltrePopUp({
    titre,
    options = [],
    onSelect = () => {},
    onClose = () => {}
  }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const popupRef = useRef(null); // Référence pour détecter le clic en dehors
  
    // Gestion du clic en dehors du popup
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            onClose();
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Toggle sélection
  const toggleOption = (option) => {
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(opt => opt !== option);
      } else {
        return [...prev, option];
      }
    });
    onSelect(option);
  };

  // Reset des filtres
  const resetFilters = () => {
    setSelectedOptions([]);
  };

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div ref={popupRef} className="bg-white rounded-[1rem] shadow-xl w-60 sm:w-64 max-h-60 flex flex-col overflow-hidden">
  
          {/* Barre de recherche */}
          <div className="px-10 pb-1">
            <SearchbarFilre
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Recherche"
              className="w-full"
            />
          </div>

          {/* Titre + Reset */}
          <div className="flex justify-between items-center text-[#5F6368] px-4 pb-2">
            <span>{titre}</span>
            <button
              onClick={resetFilters}
              className="text-sm hover:underline"
            >
              Reset
            </button>
          </div>
  
          {/* Liste */}
          <div className="flex-1 overflow-y-auto px-4">
            {filteredOptions.map((option, index) => (
              <div key={index}>
                <FiltreCheck
                  label={option}
                  checked={selectedOptions.includes(option)}
                  onCheck={() => {
                    onSelect(option);
                    toggleOption(option)
                  }}
                />
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <p className="text-center p-4 text-[#202124]">Aucun résultat</p>
            )}
          </div>
        </div>
      </div>
    );
}

export default FiltrePopUp;

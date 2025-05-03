import { useEffect, useRef, useState } from "react";
import SearchbarFiltre from "./searchbarFiltre";
import FiltreCheck from "./filtreCheck";

function FiltrePopUp({
  titre,
  options = [],
  onSelect = () => {},
  onClose = () => {},
  selectedOptions = [] // Recevoir les options déjà sélectionnées
}) {
  const [searchQuery, setSearchQuery] = useState('');
  // Convertir les selectedOptions en array si nécessaire
  const initialSelectedOptions = Array.isArray(selectedOptions) ? selectedOptions : [];
  const [localSelectedOptions, setLocalSelectedOptions] = useState(initialSelectedOptions);
  const popupRef = useRef(null);
  
  // Synchroniser l'état local avec les props
  useEffect(() => {
    if (Array.isArray(selectedOptions)) {
      setLocalSelectedOptions(selectedOptions);
    }
  }, [selectedOptions]);

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

  // Filtrage des options par le nom (label)
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle sélection avec console.log pour débogage
  const toggleOption = (option) => {
    console.log("Toggle option:", option);
    console.log("Current selections:", localSelectedOptions);
  
    const isAlreadySelected = localSelectedOptions.includes(option.value);
  
    let newSelectedOptions;
    if (isAlreadySelected) {
      newSelectedOptions = []; // Uncheck if already selected
    } else {
      newSelectedOptions = [option.value]; // Only one selection allowed
    }
  
    console.log("New selections:", newSelectedOptions);
    setLocalSelectedOptions(newSelectedOptions);
  
    onSelect({
      option: option,
      allSelected: newSelectedOptions,
      isSelected: !isAlreadySelected
    });
  };
  
  // Reset des filtres
  const resetFilters = () => {
    console.log("Resetting all filters");
    setLocalSelectedOptions([]);
    onSelect({ allSelected: [], isReset: true });
  };

  // Afficher dans la console pour débogage
 
  return (
    <div className="fixed inset-0 flex items-center z-50 justify-center p-4" onClick={(e) => e.stopPropagation()}>
      <div 
        ref={popupRef} 
        className="bg-white rounded-[1rem] shadow-xl w-60 sm:w-64 max-h-72 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barre de recherche */}
        <div className="px-4 pt-2 pb-1">
          <SearchbarFiltre
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
            onClick={(e) => {
              e.stopPropagation();
              resetFilters();
            }} 
            className="text-sm hover:underline"
          >
            Reset
          </button>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto px-4">
          {filteredOptions.map((option) => (
            <div key={option.value} onClick={(e) => e.stopPropagation()}>
              <FiltreCheck
                label={option.label}
                checked={localSelectedOptions.includes(option.value)}
                onCheck={() => toggleOption(option)}
              />
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <p className="text-center p-4 text-[#202124]">Aucun résultat</p>
          )}
        </div>
        
        {/* Bouton de confirmation */}
       
      </div>
    </div>
  );
}

export default FiltrePopUp;
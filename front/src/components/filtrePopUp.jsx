import { useEffect, useRef, useState } from "react";
import SearchbarFiltre from "./searchbarFiltre";
import FiltreCheck from "./filtreCheck";

function FiltrePopUp({
  titre,
  options = [],
  onSelect = () => {},
  onClose = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
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

  // Modify the filtering to search within the 'nom' property
  const filteredOptions = options.filter(option =>
    option?.label?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  const toggleOption = (option) => {
    setSelectedOptions(prev => {
      // Compare based on the entire object or a unique identifier (like 'id' or 'nom')
      const isAlreadySelected = prev.some(selected => selected.value === option.value);

      if (isAlreadySelected) {
        return prev.filter(selected => selected.id !== option.id);
      } else {
        return [...prev, option];
      }
    });
    onSelect(option); // You might want to adjust what you pass to onSelect
  };

  const resetFilters = () => {
    setSelectedOptions([]);
    onSelect([]);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-999">
      <div ref={popupRef} className="bg-white rounded-[1rem] shadow-xl w-60 sm:w-64 max-h-60 flex flex-col overflow-hidden">

        {/* Barre de recherche */}
        <div className="px-4 pb-1">
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
  label={option.label}
  checked={selectedOptions.some(selected => selected.value === option.value)}
  onCheck={() => toggleOption(option)}
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

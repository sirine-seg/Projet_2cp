import React, { useState, useEffect, useRef } from "react";
import chevronFiltre from "../assetss/chevronFiltre.svg";
import FiltrePopUp from "./filtrepopUpuser";

const Filtre = ({
  label,
  postesList = [],
  filter,
  setFilter,
  isDropdownOpen,
  setIsDropdownOpen,
  onPosteSelect,
}) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isCardsVisible, setIsCardsVisible] = useState(false);
  const containerRef = useRef(null);
  const [buttonColor, setButtonColor] = useState('bg-white text-black'); // Ajout de l'état pour la couleur du bouton
  const [isActive, setIsActive] = useState(false);
  const [selectedPostes, setSelectedPostes] = useState([]);

  // Fonction pour gérer le clic sur le bouton
  const handleButtonClick = () => {
    if (label === "Technicien") {
      setIsCardsVisible(!isCardsVisible);
    }
  };

  // Fonction pour gérer le clic sur la flèche
  const handleChevronClick = (e) => {
    e.stopPropagation();
    setIsPopUpOpen(!isPopUpOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsPopUpOpen(false);
        setButtonColor('bg-white text-black'); // Réinitialise la couleur du bouton
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePosteSelect = ({ option, allSelected, isReset }) => {
    // Mettre à jour les postes sélectionnés localement
    if (isReset) {
      setSelectedPostes([]);
    } else {
      setSelectedPostes(allSelected);
    }

    // Notifier le parent (UsersPage) avec les ID des postes sélectionnés
    // Convertir les IDs en objets avec id et nom
    const selectedPosteObjects = allSelected ? allSelected.map(posteId => {
      const poste = postesList.find(p => p.id === posteId);
      return { id: posteId, nom: poste ? poste.nom : "" };
    }) : [];

    // Appel au callback du parent
    if (onPosteSelect) {
      onPosteSelect(selectedPosteObjects);
    }
  };

  // Garder le bouton actif si des filtres sont appliqués
  useEffect(() => {
    setIsActive(selectedPostes.length > 0);
  }, [selectedPostes]);

  
  // Fonction pour déterminer le style du bouton
  const getButtonStyle = () => {
    if (isActive) {
      return "bg-[#F09C0A] text-white"; // Orange au clic
    }
    return "bg-white text-black"; // Blanc par défaut
  };
  return (
    <div ref={containerRef} className="relative">
      <button
        className={`
          flex items-center justify-between gap-2
          px-2.5 xs:px-3.5 sm:px-3.5 md:px-4 lg:px-6
          py-2 xs:py-2 sm:py-2.5 md:py-1.5
          text-[10px] xs:text-xs sm:text-sm md:text-base
          rounded-md
          shadow-sm
          cursor-pointer
          border
          transition-all duration-300
          border-transparent
          hover:shadow-md
          text-sm sm:text-base md:text-lg
          ${getButtonStyle()}
        `}
        onClick={() => {
          setFilter(label);
          setIsDropdownOpen((prev) => ({
            ...prev,
            [label]: !prev[label],
          }));
          handleButtonClick();
          setIsActive(true);
        }}
      >
        <span className="font-semibold">{label}</span>
       
        <img
          src={chevronFiltre}
          alt="Chevron"
          onClick={handleChevronClick}
          className={`
            h-2 w-2 sm:h-4 sm:w-4 md:h-4 md:w-4
            transition-transform duration-300
            ${isPopUpOpen ? "rotate-180" : ""}
            cursor-pointer
          `}
        />
      </button>

      {isPopUpOpen && (
        <FiltrePopUp
          titre="Sélectionner un Poste"
          options={postesList.map((poste) => ({
            label: poste.nom,
            value: poste.id,
          }))}
          selectedOptions={selectedPostes}
          onSelect={handlePosteSelect}
          onClose={() => {
            setIsPopUpOpen(false);
          }}
        />
      )}
    </div>
  );
};


export default Filtre;

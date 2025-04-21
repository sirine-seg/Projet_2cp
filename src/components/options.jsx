import { useEffect, useRef } from "react";

export default function Options({ options = [], handleSelect, setMenuOpen, isActive }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isActive && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null); // Fermer si clic en dehors ET que le menu est actif
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setMenuOpen, isActive]);

  return (
    <div
      ref={menuRef}
      className="absolute top-12 right-3 bg-white shadow-xl rounded-lg text-black w-48 sm:w-56 z-50 border"
    >
      {options.map((option) => (
        <div
          key={option.value || option}
          className="px-4 py-2 cursor-pointer transition-colors duration-200"
          onClick={() => {
            handleSelect(option.value || option);
            if (isActive) {
              setMenuOpen(null); // Fermer le menu seulement s'il est actif
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#E1E3E4";
            e.currentTarget.style.color = "#202124";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "#202124";
          }}
        >
          {option.label || option}
        </div>
      ))}
    </div>
  );
}

import React, { useState, useEffect } from "react";

// Icône d'œil ouvert en SVG
const EyeOpenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye" style={{ width: '1.2em', height: '1.2em' }}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Icône d'œil barré en SVG
const EyeClosedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye-off" style={{ width: '1.2em', height: '1.2em' }}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function WriteContainer({ title, onSubmit, onChange, value, message, bgColor = "bg-[#FFFFFF]" }) {
  const [input, setInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setInput(value);
    } else if (title === "Numéro de téléphone") {
      setInput("+213"); // Initialise avec +213 pour le téléphone
    }
  }, [value, title]);

  const handleChange = (e) => {
    let newValue = e.target.value;
    if (title === "Numéro de téléphone") {
      if (!newValue.startsWith("+213")) {
        newValue = "+213";
      }
    }
    setInput(newValue);
    if (onChange) onChange(newValue);
  };

  const handleBlur = () => {
    if (onSubmit) onSubmit(input);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Fonction pour vérifier si l'étoile rouge doit être affichée
  const shouldShowAsterisk = ["Nom", "Prénom", "E-mail"].includes(title);

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="flex items-center text-sm font-poppins font-medium text-[#202124] text-[1rem] mb-1 ml-0.25rem">
          {title}
          {shouldShowAsterisk && <span className="text-red-500 ml-1 text-lg">*</span>}
        </label>
        {message && (
          <div className="text-xs text-gray-500 mb-1 ml-0.25rem">
            {message}
          </div>
        )}
        <div className="relative mt-0.25rem">
          <input
            value={input}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={title === "Numéro de téléphone" ? "+213XXXXXXXXX" : "---"}
            className={`w-full py-3 px-4 border border-white rounded-[0.5rem] text-[1rem] font-regular font-poppins ${bgColor} resize-none focus:outline-0 focus:ring-0 shadow-md`}
            type={title === "Mot de passe" && !showPassword ? "password" : "text"}
          />
          {title === "Mot de passe" && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer focus:outline-none"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
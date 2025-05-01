import React, { useState, useEffect } from "react";

export default function WriteContainer({ title, onSubmit, onChange, value, message }) {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (value !== undefined) {
      setInput(value);
    } else if (title === "Numéro de téléphone") {
      setInput("+213"); // Initialise avec +213 pour le téléphone
    }
  }, [value, title]);

  const handleChange = (e) => {
    let newValue = e.target.value;
     if (title === "Numéro de téléphone")
    {
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

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[0.8125rem] mb-1 ml-0.25rem">
          {title}
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
            className="w-full py-3 px-4 border border-white rounded-[0.5rem] text-[0.8125rem] font-regular font-poppins bg-white resize-none focus:outline-0 focus:ring-0"
          />
        </div>
      </div>
    </div>
  );
}

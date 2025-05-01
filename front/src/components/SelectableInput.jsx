import { useState, useRef, useEffect } from "react";
import Options from "./options";

export default function SelectableInput({
  title,
  options = [],
  selectedOption = "",
  onSelect = () => {},
  placeholder = "--",
  bgColor = "bg-white",
 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const containerRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setCustomInput("");
    setIsOpen(false);
  };

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      handleSelect({ id: Date.now(), label: customInput.trim() });
      setCustomInput("");
      setIsOpen(false);
    }
  };
  

  return (
    <div className="w-full" ref={containerRef}>
      <label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[0.8125rem] mb-1 ml-0.25rem">
        {title}
      </label>
      <div className={`relative w-full `}>
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex w-full py-3 px-4 border border-white rounded-[0.5rem] text-[#80868B] text-[0.8125rem] font-regular font-poppins justify-between ${bgColor} cursor-pointer`}
        >
        <span>{selectedOption?.label || placeholder}</span>

          <svg
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 border border-gray-200 rounded-md bg-white shadow-lg">
            <Options options={options} handleSelect={handleSelect} />
            <div className="px-4 py-2 border-t border-gray-100">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Write your own..."
                className="w-full px-3 py-1.5 text-sm border rounded-md outline-none focus:ring-1 ring-blue-400"
              />
              <button
                onClick={handleCustomSubmit}
                className="mt-2 w-full text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md"
              >
                Add Custom Option
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

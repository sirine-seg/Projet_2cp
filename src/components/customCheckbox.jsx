const CustomCheckbox = ({ 
  checked, 
  color = "#F09C0A", // Couleur par défaut bleue
  uncheckedColor = "white" // Couleur quand non coché
}) => {
    return (
      <div
        className={`w-5 h-5 flex items-center justify-center rounded-md transition-colors duration-200 cursor-pointer ${
          checked 
            ? `bg-[${color}]` 
            : `bg-${uncheckedColor} border border-gray-400`
        }`}
      >
        {checked && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    );
};
  
export default CustomCheckbox;

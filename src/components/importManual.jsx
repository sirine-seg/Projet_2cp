import Cloud from "../assets/Cloud.svg";

export default function ImportManual({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full max-w-xs px-4 py-3 bg-white text-[#80868B] text-sm font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
    >
      <span className="text-left flex-grow">Importer le manuel</span>
      <img src={Cloud} alt="Cloud icon" className="w-5 h-5 ml-4" />
    </button>
  );
}

import Cloud from "../assets/Cloud.svg";

export default function ImportManual({ onChange }) {
  return (
    <label className="flex items-center justify-between w-full px-4 py-3 bg-white text-[#80868B] text-[0.8125rem] font-regular font-poppins rounded-[0.5rem] cursor-pointer border border-white shadow-sm transition-colors duration-200">
     
      
      <input
        type="file"
        name="manuel"
        accept=".pdf,.doc,.docx"
        onChange={onChange}
      
      />
      <img src={Cloud} alt="Cloud icon" className="w-5 h-5 ml-4" />
    </label>
  );
}

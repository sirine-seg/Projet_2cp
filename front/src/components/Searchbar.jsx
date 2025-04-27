
import Searchloop from "../assets/Searchloop.svg";
const SearchBar = ({
  placeholder = "Rechercher...",
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`relative w-[90%] sm:w-full max-w-md my-5 mx-auto ${className}`}>
    <div className="relative">
      <img 
        src={Searchloop} 
        alt="Searchloop" 
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" 
      />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full focus:outline-0 focus:ring-0 text-[#202124] px-4 py-2 text-[0.8125rem] pl-10 rounded-[8px] border border-[#C3D4E9] bg-[#FFFFFF] shadow-md"
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
  );
};

export default SearchBar;


import SearchloopFiltre from "../assets/searchloopFiltre.svg";

const SearchBar = ({
  placeholder = "Rechercher",
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`relative w-full max-w-md my-3 mx-auto ${className}`}>
      <div className="relative">
        <img 
          src={SearchloopFiltre} 
          alt="Searchloop" 
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" 
        />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full focus:outline-0 focus:ring-0 text-[#202124] px-2 py-1 pl-8 text-[13px] rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF]"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;

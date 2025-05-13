import Searchloop from "../assets/Searchloop.svg";

const SearchBar = ({
  placeholder = "Rechercher...",
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`relative w-[90%] sm:w-full max-w-md my-4 mx-auto ${className}`}>
      <div className="relative">
        <img 
          src={Searchloop} 
          alt="Searchloop" 
          className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" 
        />
        <input
          type="text"
          placeholder={placeholder}
          className="
            w-full focus:outline-0 focus:ring-0 text-[#202124] 
            px-3 py-1.5 text-[0.65rem] pl-9 
            rounded-[6px] border border-[#C3D4E9] 
            bg-[#FFFFFF] shadow-md
          "
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;

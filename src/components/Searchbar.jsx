import { MdSearch } from "react-icons/md";

const SearchBar = ({
  placeholder = "Rechercher...",
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`relative w-full max-w-md my-5 -mt-38 mx-auto  ${className}` }>
      <div className="relative">
        <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full text-black px-4 py-2 pl-10 rounded-full border border-gray-300 bg-[#F4F4F4] shadow-md"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;

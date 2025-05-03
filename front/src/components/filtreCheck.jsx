import CustomCheckbox from "./customCheckbox";

const FiltreCheck = ({
  label,
  checked = false,
  onCheck = () => {}
}) => {
  // Gérer le clic de manière plus robuste
  const handleCheckClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onCheck(e);
  };

  return (
    <div
      className="flex items-center space-x-3 max-w-[220px] py-2 cursor-pointer"
      onClick={handleCheckClick}
    >
      <CustomCheckbox checked={checked} onChange={handleCheckClick} />
      <span className="text-sm text-[#5F6368]">{label}</span>
    </div>
  );
};

export default FiltreCheck;
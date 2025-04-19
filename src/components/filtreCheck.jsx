const FiltreCheck = ({ 
  label,
  checked = false,
  onCheck = () => {}
}) => {
  return (
    <label
      className="flex items-center space-x-3 max-w-[220px] py-2 cursor-pointer"
      onClick={onCheck}
    >
      <CustomCheckbox checked={checked} />
      <span className="text-sm text-[#5F6368]">{label}</span>
    </label>
  );
};

export default FiltreCheck;

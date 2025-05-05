const badge = ({ 
  text, 
  bgColor,
  className="",
}) => {
  return (
    <span
      className={`px-3 py-1 rounded-full font-bold text-[12px] text-[#F4F4F4] ${className} `}
      style={{
        backgroundColor: bgColor,
      }}
    >
      {text}
    </span>
  );
};

export default badge;
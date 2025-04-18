const badge = ({ 
    text, 
    bgColor,
  }) => {
    return (
      <span
        className="px-3 py-1 rounded-full font-bold text-[10px] text-[#F4F4F4]"
        style={{
          backgroundColor: bgColor,
        }}
      >
        {text}
      </span>
    );
  };
  
  export default badge;

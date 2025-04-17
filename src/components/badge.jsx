const badge = ({ 
    text, 
    bgColor = "#20599E",
  }) => {
    return (
      <span
        className="px-4 py-2 rounded-full font-bold text-[#F4F4F4]"
        style={{
          backgroundColor: bgColor,
        }}
      >
        {text}
      </span>
    );
  };
  
  export default badge;
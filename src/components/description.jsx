import React, { useRef } from "react";

const AutoGrowTextarea = ({ onChange }) => {
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[0.8125rem] mb-1 ml-1">
        Description
      </label>
      <textarea
        name="description"
        onChange={onChange}
        onInput={handleInput}
        ref={textareaRef}
        rows="1"
        className="w-full py-3 px-4 border border-white rounded-[0.5rem] text-[#80868B] text-[0.8125rem] font-regular font-poppins bg-white transition-colors duration-200 focus:outline-0 focus:ring-0"
        style={{ minHeight: "48px" }}
      />
    </div>
  );
};

export default AutoGrowTextarea;

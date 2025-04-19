import { useState, useEffect } from "react";

export default function WriteContainer({ title, onSubmit, onChange , value }) {
  const [input, setInput] = useState("");


  useEffect(() => {
    if (value !== undefined) {
      setInput(value);
    }
  }, [value]);

  const handleChange = (e) => {
    setInput(e.target.value);
    if (onChange) onChange(e.target.value); 
  };

  const handleBlur = () => {
    if (onSubmit) onSubmit(input);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[0.8125rem] mb-1 ml-0.25rem">
          {title}
        </label>

        <div className="relative mt-0.25rem">
          <input
            value={input}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="---"
           
            className=" flex flex-col items-start w-full py-3 px-4 border border-white rounded-[0.5rem] text-[0.8125rem] font-regular font-poppins bg-white resize-none focus:outline-0 focus:ring-0 "
           
            
          />
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";

export default function WriteContainer({ title, onSubmit }) {
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleBlur = () => {
    if (onSubmit) onSubmit(input);
  };

  return (
    <div className="max-w-xs mx-auto">
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
            className="flex flex-col items-start truncate w-full py-3 px-4 border border-white rounded-[0.5rem] text-[#80868B] text-[0.8125rem] font-regular font-poppins bg-white resize-none focus:outline-0 focus:ring-0"
          />
        </div>
      </div>
    </div>
  );
}

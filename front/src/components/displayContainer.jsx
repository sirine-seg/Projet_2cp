export default function DisplayContainer({ title, content, className = "" }) {
	return (
	  <div className={`w-full mx-auto ${className}`}>
		<label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[1rem] mb-1.5 ml-0.25rem">
		  {title}
		</label>
  
		<div className="bg-white flex items-start w-full py-2 px-4 border border-white rounded-[0.5rem] font-regular font-poppins justify-between shadow-md min-h-[40px] my-2">
		  <span className="font-medium text-[#202124]">{content}</span>
		</div>
	  </div>
	);
  }
  

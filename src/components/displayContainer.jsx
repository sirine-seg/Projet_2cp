export default function DisplayContainer({ title, content }) {
	return (
		<div className="bg-gray-500 h-100">
	  <div className="max-w-md mx-auto"> 
		{/* <div className="bg-white shadow-md rounded-lg p-6"> */}
		  <div className="mb-4">
			<label className="block text-sm font-poppins font-medium text-[#202124] text-[13px] mb-2 ml-1">
			  {title}
			</label>
			<div className="relative mt-1">
			  <div className="w-full py-4 px-4 border border-gray-200 rounded-[8px]  text-[#80868B] text-[13px] font-regular font-poppins bg-white cursor-default">
			  {content}
			</div>
		  </div>
		  </div>
		</div> 
</div>
//</div>
	);
  }
export default function DisplayContainer({ title, content }) {
  return (
    <div className="max-w-xs mx-auto">
      <div className="mb-4">
        <label className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[0.8125rem] mb-0.5 ml-0.25rem">
          {title}
        </label>
        <div className="relative mt-0.25rem">
          <div className="flex flex-col items-start w-full py-3 px-4 border border-white rounded-[0.5rem] text-[#80868B] text-[0.8125rem] font-regular font-poppins bg-white">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

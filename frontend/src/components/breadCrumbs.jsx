export default function Breadcrumb({ path = [] }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center text-[#202124] text-lg sm:text-xl md:text-2xl font-medium gap-x-1 sm:gap-x-2 pb-3 sm:pb-4 ml-4 sm:ml-6 md:ml-8">
        {path.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="break-words max-w-[180px] sm:max-w-none">
              {item}
            </span>
            {index < path.length - 1 && (
              <span className="mx-1 sm:mx-2">/</span>
            )}
          </div>
        ))}
      </div>
      <div className="border-b border-gray-300 w-full md:max-w-2xl" />
    </div>
  );
}
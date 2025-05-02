export default function Breadcrumb({ path = [] }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center text-[#202124] text-xl sm:text-3xl font-medium space-x-1 pb-4 ml-2 sm:ml-8">
        {path.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="truncate max-w-[200px] sm:max-w-full">{item}</span>
            {index < path.length - 1 && <span className="mx-1">/</span>}
          </div>
        ))}
      </div>
      <div className="border-b border-gray-300 max-w-full sm:max-w-2xl" />
    </div>
  );
}

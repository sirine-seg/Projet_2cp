export default function Breadcrumb({ path = [] }) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center text-[#202124] text-3xl font-medium space-x-1 pb-4 ml-8">
          {path.map((item, index) => (
            <div key={index} className="flex items-center">
              <span>{item}</span>
              {index < path.length - 1 && <span className="mx-1">/</span>}
            </div>
          ))}
        </div>
        <div className="border-b border-gray-300 max-w-2xl" />
      </div>
    );
  }
  
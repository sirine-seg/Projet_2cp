export default function FieldContainer({ field, onClick }) {
  return (
    <div className="flex justify-center items-center">
      <div
        onClick={onClick}
        className="bg-white text-[#202124] px-4 py-2 rounded-lg font-semibold cursor-pointer"
      >
        {field}
      </div>
    </div>
  );
}

import Cube from "../assets/cube.svg";

export default function EquipModifier({ name, id, localisation, buttonTitle,onAssign }) {
  return (
    <div className="max-w-xl h-[4.5rem]">
      <div className="bg-white p-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-[#202124]">
            <img src={Cube} alt="Cube" className="h-7 w-7" />
          </span>

          <div className="flex flex-col min-w-0 max-w-40">
            <h3 className="text-[#5F6368] font-medium text-sm truncate">
              {name} #{id}
            </h3>
            <p className="text-[#80868B] text-sm truncate">{localisation}</p>
          </div>
        </div>
        <div>
          <button
            onClick={onAssign}
            className="items-center justify-center gap-1 px-4 py-1 bg-white border border-[#DDD0D3] rounded-md text-sm text-[#202124] font-medium hover:bg-[#BCCDE2] transition-colors duration-200 active:bg-[#BCCDE2]"
          >
            {buttonTitle}
          </button>
        </div>
      </div>
    </div>
  );
}

import Alert from "../assets/allert.svg";

export default function SignalRaccourci() {
  return (
    <div className="p-4 flex justify-center">
      <div className="rounded-xl w-full max-w-sm bg-[#20599E] p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-full flex items-center justify-center">
            <img
              src={Alert}
              alt="Alert"
              className="w-25 h-25"
            />
          </div>
          
          <div className="flex flex-col gap-2 flex-grow">
            <h3 className="text-md font-semibold text-white leading-tight">
              Vous avez rencontré un problème avec l'un des équipements de notre École? <br />
            </h3>
            <h3 className="text-md font-bold text-white leading-tight mb-2">Signalez le!</h3>
            
            <button className="bg-[#F09C0A] text-white text-xs font-semibold py-1 px-4 rounded-full transition-colors duration-200 w-fit cursor-pointer">
              Signaler un équipement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
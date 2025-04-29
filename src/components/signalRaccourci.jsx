import Alert from "../assets/allert.svg";

export default function SignalRaccourci() {
  return (
    <div className="flex justify-center">
      <div className="rounded-xl w-full bg-[#20599E] p-4 sm:p-6 shadow-[10px_10px_30px_-10px_rgba(32,33,36,0.7)]">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-14 sm:w-16 h-full flex items-center justify-center">
            <img
              src={Alert}
              alt="Alert"
              className="w-25 h-25"
            />
          </div>
          
          <div className="flex flex-col gap-2 sm:gap-4 flex-grow">
            <div className="flex flex-col gap-2 flex-grow">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white leading-tight">
              Vous avez rencontré un problème avec l'un des équipements de notre École? <br />
            </h3>
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold sm:font-bold text-white leading-tight mb-2">Signalez le!</h3>
            </div>
            <button className="bg-[#F09C0A] text-white text-sm sm:text-base font-semibold py-1.5 px-5 rounded-full transition-colors duration-200 w-fit cursor-pointer">
              Signaler un équipement
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}

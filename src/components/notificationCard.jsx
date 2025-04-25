import { ChevronLeft, MoreHorizontal } from "lucide-react";
import Profil from "../assets/Profil.svg";

export default function NotificationCard({
  title,
  description,
  time,
  imageUrl,
  type,
  buttonTitle,
  unread,
}) {
  return (
    <div className="flex justify-center">
      <div className="rounded-lg w-full max-w-[900px] flex justify-between items-start border-b border-[#E0E0E0] overflow-hidden">
        <div className="p-3 flex gap-3 w-full min-w-0">
          <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#E8EAED] flex items-center justify-center text-xs font-medium text-[#80868B] mr-2 mt-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={imageUrl}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <img
                src={Profil}
                alt="Profil"
                className="w-full h-full"
              />
            )}
          </div>

          <div className="flex-grow min-w-0 space-y-1.5">
            {type && (
              <div className="text-xs md:text-sm font-poppins font-semibold text-[#5F6368] mb-1">
                {type}
              </div>
            )}
            
            <div className="text-sm md:text-base font-poppins font-bold text-[#202124]">
              {title}
            </div>
            
            <div className="text-xs md:text-sm font-poppins text-[#202124] leading-snug">
              {description}
            </div>

            <div className="pt-2">
              {buttonTitle && (
                <button className="bg-[#20599E] text-white px-2.5 py-1 md:px-3 md:py-1.5 pr-3 rounded font-poppins font-semibold flex items-center justify-center gap-1 transition cursor-pointer text-xs md:text-sm">
                  <ChevronLeft size={12} className="md:w-3 md:h-3" /> 
                  {buttonTitle}
                </button>
              )}
            </div>

            <div className="font-poppins text-xs text-[#5F6368] pt-1.5">
              il y a {time}
            </div>
          </div>

          <div className="flex-shrink-0 text-[#202124] ml-1.5">
            <button className="cursor-pointer">
              <MoreHorizontal size={16} className="md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

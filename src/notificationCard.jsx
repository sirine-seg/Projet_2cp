import { Card, CardContent } from "./compo/card";
import { Button } from "./compo/button";
import { Avatar } from "./compo/avatar";
import { ChevronLeft, MoreHorizontal } from "lucide-react";

export default function NotificationCard({ title, description, time, initials, unread }) {
  return (
    <div className="p-2 flex justify-center">
      <Card className="flex justify-between items-start w-[980px]">
      <div className="border-b border-[#E0E0E0] ">
        <CardContent className="flex gap-4 w-full">
          <Avatar />

          <div className="flex-grow">
            <div className="text-[16px] font-poppins font-semibold text-[#5F6368]">Planifier</div>
            <div className="text-[24px] font-poppins font-bold text-[#202124] mt-1">{title}</div>
            <div className="text-[20px] font-poppins text-[#202124] mt-1">{description}</div>

            <div className="mt-4">
              <Button>
                <ChevronLeft size={16} /> Voir
              </Button>
            </div>

            <div className="font-poppins text-[16px] text-[#5F6368] mt-4">{time}</div>

          </div>

          <div className="text-[#202124]">
            <MoreHorizontal size={28} />
          </div>
        </CardContent>
      </div>
      </Card>
    </div>
  );
}

import AjouterButton from "./Ajouterbutton";
import { ChevronRight } from "lucide-react";

export default function ChampTitle ({title, handleAjouterClick}){
    return (
        <div className="w-full flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <ChevronRight size={18} />
            <h1 className="text-2xl font-semibold">{title}</h1>
          </div>
          <AjouterButton text="Ajouter" onClick={handleAjouterClick} />
        </div>
    )
}
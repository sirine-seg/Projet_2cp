import { useState } from "react";
import SearchBar from "./Searchbar";
import EquipModifier from "./equipModifier";
import Quitter from "../assets/quitter.svg";

export default function EquipModifierPopUp({
    equipements = [], 
    onClose = () => {},
    onAssign = () => {} 
  }) {
    const [searchQuery, setSearchQuery] = useState('');
  
    const filteredequipements = equipements.filter(equip =>
      `${equip.name} ${equip.localisation}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[1rem] shadow-xl max-w-xl max-h-[62vh] flex flex-col overflow-hidden lg:min-w-[30rem]">
        
          <div className="flex justify-between items-center px-4 py-3">
            <div>
              <h1 className="text-xl px-2 pt-1 text-[#202124] font-semibold">Equipements</h1>
            </div>
            <button 
              onClick={onClose}
              className="text-[#202124] hover:text[#202124] text-xl pr-4"
            >
            <img src={Quitter} alt="Quitter" className="h-5 w-5" />
            </button>
          </div>
  
          <div className="px-4">
            <SearchBar 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Recherche"
              className="w-full"
            />
          </div>
  
          <div className="flex-1 overflow-y-auto px-4">
            {filteredequipements.map((equip) => (
              <div key={equip.id}>
                <EquipModifier
                  name={equip.name}
                  id={equip.id}
                  localisation={equip.localisation}
                  onAssign={() => onAssign(equip)}
                  buttonTitle="Modifier"
                />
              </div>
            ))}
            {filteredequipements.length === 0 && (
              <p className="text-center p-4 text-[#202124]">Aucun equipements trouvé</p>
            )}
          </div>
        </div>
      </div>
    );
}
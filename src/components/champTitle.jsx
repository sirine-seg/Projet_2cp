import AjouterButton from "./Ajouterbutton";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import addBlack from "../assets/addBlack.svg";

export default function ChampTitle({ title, handleAjouterClick }) {
  return (
    <div className="w-full flex items-center justify-between mb-8">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <ChevronRight size={18} className="flex-shrink-0" />
        <h1 className="text-lg sm:text-3xl font-semibold">{title}</h1>
      </div>

      <div className="block md:hidden">
      <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAjouterClick}
            className="p-1.5 rounded-full cursor-pointer flex items-center justify-center"
          >
            <img src={addBlack} alt="add" className="h-6 w-6" />
          </motion.button>
      </div>
      <div className="hidden md:block">
        <AjouterButton text="Ajouter" onClick={handleAjouterClick} />
      </div>
    </div>
  );
}

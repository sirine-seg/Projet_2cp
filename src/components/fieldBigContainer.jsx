import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import addBlack from "../assets/addBlack.svg";
import { ChevronDown, ChevronUp } from "lucide-react";
import FieldGrid from "./fieldGrid";

export default function FieldBigContainer({
  field,
  subfields = [],
  onSubfieldClick,
  onClickAdd,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full">
      <div className="relative w-full rounded-md shadow-xs px-4 py-2 flex items-center justify-between bg-white">
        <h2 className="ml-2 text-md font-semibold text-[#202124]">{field}</h2>
        <div className="flex items-center sm:gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClickAdd}
            className="p-1.5 rounded-full cursor-pointer flex items-center justify-center"
          >
            <img src={addBlack} alt="add" className="h-5 w-5 sm:h-6 sm:w-6" />
          </motion.button>
          <button
            onClick={toggleOpen}
            className="p-1.5 rounded-full cursor-pointer transition-transform"
          >
            {isOpen ? (
              <ChevronUp className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="overflow-hidden py-4"
          >
            <FieldGrid fields={subfields} onFieldClick={onSubfieldClick} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
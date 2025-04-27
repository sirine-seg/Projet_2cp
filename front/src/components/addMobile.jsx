import Plus from "../assets/plus.svg";
import { motion } from "framer-motion";

export default function AddMobile ({onClick}) {
  return (
      <div className="relative group">
        <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="flex items-center justify-center w-16 h-16 bg-amber-500 text-white rounded-full focus:outline-none cursor-pointer active:scale-75 transition-transform duration-100
">
          <img
            src={Plus}
            alt="Plus"
            className="mt-1"
          />
        </motion.button>
      </div>
  );
}

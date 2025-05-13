import Plus from "../assets/plus.svg";
import { motion } from "framer-motion";

export default function AddMobile({ onClick }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="flex items-center justify-center w-16 h-16 bg-amber-500 text-white rounded-full focus:outline-none cursor-pointer active:scale-75 transition-transform duration-100 shadow-lg"
      >
        <img
          src={Plus}
          alt="Plus"
          className="mt-1"
        />
      </motion.button>
    </div>
  );
}
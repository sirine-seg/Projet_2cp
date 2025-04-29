
 import { motion } from "framer-motion";
import React, { useState } from "react";
import Button from "./Button";
import WriteContainer from "./writeContainer";

const PopupAdd = ({ 
  title, 
  added, 
  onClose,
  newFieldName,
  setNewFieldName
}) => {

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[9999]  bg-opacity-30 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-[95vw] sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto p-6 shadow-2xl"
      >

        <WriteContainer 
        title ={title}
        bgColor="bg-[#F4F4F4]"
        value={newFieldName}
        onChange={setNewFieldName}
        />

        <div className="flex flex-row justify-between mt-4 gap-4 flex-nowrap">
          <Button
            text="Annuler"
            bgColor="#80868B"
            onClick={onClose}
            className="min-w-[100px]"
          />
          <Button
            text="Terminer"
            onClick={added}
            className="min-w-[100px]"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PopupAdd;

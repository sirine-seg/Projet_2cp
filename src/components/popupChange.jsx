import { motion } from "framer-motion";
import React, { useState } from "react";
import ChoiceContainer from "./choiceContainer";
import Button from "./Button";

const PopupChange = ({ 
  title, 
  etatOptions, 
  setSelectedStatus, 
  update 
  }) => {

  const [isPopupVisible, setIsPopupVisible] = useState(true); // Popup visible par défaut

  if (!isPopupVisible) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[9999]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="
          bg-white 
          rounded-3xl 
          w-full 
          max-w-xs md:max-w-md lg:max-w-lg
          mx-auto 
          p-6 
          shadow-2xl
        "
      >

        <ChoiceContainer
          title={title}
          bgColor="bg-[#F4F4F4]"
          maxWidth="max-w-full"
          options={etatOptions}
          onChange={(selected) => {
            setSelectedStatus(selected);
          }}
        />

        <div className="flex justify-between mt-4">
          <Button
            text="Annuler"
            bgColor="#80868B"
            onClick={() => {
              setIsPopupVisible(false);
            }}
          />

          <Button
            onClick={update}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PopupChange;

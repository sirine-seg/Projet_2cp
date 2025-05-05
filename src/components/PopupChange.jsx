import { motion } from "framer-motion";
import React, { useState } from "react";
import ChoiceContainer from "./choiceContainer";
import Button from "./Button";

const PopupChange = ({ 
  title, 
  etatOptions, 
  setSelectedStatus, 
  update, 
  onClose 
}) => {
  const [selectedStatus, setSelectedStatusState] = useState(""); // State for selected status ID

  const handleStatusSelect = (selected) => {
    setSelectedStatusState(selected); // Update the local state with the selected status ID
    setSelectedStatus(selected); // Call the function passed from parent to update selected status
  };

  // Find the 'nom' corresponding to the selected 'id' in etatOptions
  const selectedStatusNom = etatOptions.find((etat) => etat.value === selectedStatus)?.label || ""

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[9999]  bg-opacity-30 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-[95vw] sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto p-6 shadow-2xl"
      >
        <ChoiceContainer
          title={title}
          bgColor="bg-[#F4F4F4]"
          maxWidth="max-w-full"
          options={etatOptions}
          selectedOption={selectedStatusNom} // Pass the ID of the selected status
          onSelect={handleStatusSelect} // Handle the selection
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
            onClick={update}
            className="min-w-[100px]"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PopupChange;
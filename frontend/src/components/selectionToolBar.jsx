import React from "react";
import CustomCheckbox from "./customCheckbox";
import upload from "../assets/upload.svg";
import quitter from "../assets/quitter.svg";
import exportToPDF from "./exportPdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import excelExport from "../assets/excelExport.svg"
const SelectionToolbar = ({
  selectedCount,
  allSelected,
  onSelectAll,
  onDeselectAll,
  selectedEquipments, // <-- this should be passed as a prop
}) => {
  if (selectedCount === 0) return null;
  const handleExportExcel = () => {
    const selectedData = selectedEquipments.filter((e) => e.checked);

    console.log("Selected Data to Export:", selectedData);

    const dataToExport = selectedData.map((equip) => ({
      ID: equip.id_equipement,
      Nom: equip.nom,
      Date: equip.date_ajout,
      Localisation: equip.localisation_nom || "N/A",
      Categorie: equip.categorie_nom || "N/A",
      Type: equip.typee_nom || "N/A",
      État: equip.etat_nom || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Équipements");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const date = new Date().toISOString().split("T")[0]; // format: YYYY-MM-DD
    saveAs(file, `selectedEquipments_${date}.xlsx`);
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-8 py-2 bg-[#DDDEDF] rounded-full shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onDeselectAll}
            className="text-gray-600 hover:text-black focus:outline-none cursor-pointer"
            title="Tout désélectionner"
          >
            <img
              src={quitter}
              alt="quitter"
              className="h-[22px] w-[22px] shrink-0"
            />
          </button>

          <span className="text-sm font-medium">
            {selectedCount} Sélectionné{selectedCount > 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <CustomCheckbox
            checked={allSelected}
            id="selectAll"
            onChange={(e) => {
              if (!allSelected) {
                onSelectAll();
              } else {
                onDeselectAll();
              }
            }}
          />
          <label htmlFor="selectAll" className="text-sm font-medium">
            <span className="hidden sm:inline">Sélectionner </span>Tout
          </label>
        </div>
      </div>
      <div className="flex items-center space-x-3">
      <div
        onClick={() => exportToPDF(selectedEquipments)}
        className="cursor-pointer"
        title="Exporter en PDF"
      >
        <img
          src={upload}
          alt="export pdf"
          className="h-[20px] w-[20px] shrink-0"
        />

      </div>
      <div onClick={handleExportExcel}
       className="cursor-pointer"
       title="Exporter en Excel">
        <img
          src={excelExport}
          alt="export excel"
          className="h-[20px] w-[20px] shrink-0 "
        />
      </div>
      </div>
    </div>
  );
};

export default SelectionToolbar;
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Exports dashboard data to Excel format
 * @param {Object} dashboardData - Object containing all dashboard data
 * @param {Object} dashboardData.stats - Basic stats like intervention and equipment counts
 * @param {Array} dashboardData.resolutionTimeData - Resolution time by equipment category
 * @param {Array} dashboardData.technicianData - Technician intervention data
 * @param {Array} dashboardData.equipmentData - Equipment status data
 * @param {Array} dashboardData.interventionsByMonth - Monthly intervention data
 * @param {Array} dashboardData.percentageChartData - Intervention status percentages
 */
const exportDashboardToExcel = (dashboardData) => {
  const {
    stats,
    resolutionTimeData,
    technicianData,
    equipmentData,
    interventionsByMonth,
    percentageChartData
  } = dashboardData;

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // 1. Summary Sheet with basic statistics
  const summaryData = [
    ["Tableau de Bord Maintenance - Résumé"],
    ["Date d'exportation", new Date().toLocaleDateString()],
    [""],
    ["Statistiques Clés"],
    ["Nombre total d'interventions", stats.interventions],
    ["Nombre total d'équipements", stats.equipements]
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Résumé");

  // 2. Resolution Time Sheet
  const resolutionTimeHeader = [["Catégorie d'Équipement", "Temps Moyen de Résolution"]];
  const resolutionTimeRows = resolutionTimeData.map(item => [
    item.category,
    item.displayTime
  ]);
  
  const resolutionTimeSheetData = [...resolutionTimeHeader, ...resolutionTimeRows];
  const resolutionTimeSheet = XLSX.utils.aoa_to_sheet(resolutionTimeSheetData);
  XLSX.utils.book_append_sheet(workbook, resolutionTimeSheet, "Délais de Résolution");

  // 3. Technician Data Sheet
  const technicianHeader = [["Technicien", "Terminées", "En Cours", "Annulées", "Total"]];
  const technicianRows = technicianData.map(item => [
    item.technician,
    item.Terminee,
    item.EnCours,
    item.Annulee,
    (item.Terminee + item.EnCours + item.Annulee)
  ]);
  
  const technicianSheetData = [...technicianHeader, ...technicianRows];
  const technicianSheet = XLSX.utils.aoa_to_sheet(technicianSheetData);
  XLSX.utils.book_append_sheet(workbook, technicianSheet, "Techniciens");

  // 4. Equipment Data Sheet
  const equipmentHeader = [["État", "Pourcentage (%)"]];
  const equipmentRows = equipmentData.map(item => [
    item.name,
    item.value
  ]);
  
  const equipmentSheetData = [...equipmentHeader, ...equipmentRows];
  const equipmentSheet = XLSX.utils.aoa_to_sheet(equipmentSheetData);
  XLSX.utils.book_append_sheet(workbook, equipmentSheet, "États Équipements");

  // 5. Monthly Interventions Sheet
  const monthlyHeader = [["Mois", "Préventives", "Curatives", "Total"]];
  const monthlyRows = interventionsByMonth.map(item => [
    item.month,
    item.Preventives,
    item.Curatives,
    (item.Preventives + item.Curatives)
  ]);
  
  const monthlySheetData = [...monthlyHeader, ...monthlyRows];
  const monthlySheet = XLSX.utils.aoa_to_sheet(monthlySheetData);
  XLSX.utils.book_append_sheet(workbook, monthlySheet, "Interventions Mensuelles");

  // 6. Intervention Status Percentages
  if (percentageChartData && percentageChartData.length > 0) {
    const statusHeader = [["Statut", "Pourcentage (%)"]];
    const statusRows = percentageChartData.map(item => [
      item.label,
      item.value
    ]);
    
    const statusSheetData = [...statusHeader, ...statusRows];
    const statusSheet = XLSX.utils.aoa_to_sheet(statusSheetData);
    XLSX.utils.book_append_sheet(workbook, statusSheet, "Statuts");
  }

  // Apply some styling to the sheets (basic styling for headers)
  const sheets = workbook.SheetNames;
  sheets.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    
    // Make headers bold by setting cell styles
    const range = XLSX.utils.decode_range(sheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!sheet[address]) continue;
      sheet[address].s = { font: { bold: true } };
    }
  });

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });
  
  // Create Blob and trigger download
  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  
  // Generate filename with current date
  const date = new Date().toISOString().split("T")[0]; // format: YYYY-MM-DD
  saveAs(file, `dashboard_report_${date}.xlsx`);
};

export default exportDashboardToExcel;
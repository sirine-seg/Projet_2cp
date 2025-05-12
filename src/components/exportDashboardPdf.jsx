import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import headerImg from "../assets/headerEsi.png";

/**
 * Exports dashboard data to PDF with tables and charts data
 * @param {Object} dashboardData - Object containing all dashboard data
 * @param {Object} dashboardData.stats - Basic stats like intervention and equipment counts
 * @param {Array} dashboardData.resolutionTimeData - Resolution time by equipment category
 * @param {Array} dashboardData.technicianData - Technician intervention data
 * @param {Array} dashboardData.equipmentData - Equipment status data
 * @param {Array} dashboardData.interventionsByMonth - Monthly intervention data
 */
const exportDashboardToPDF = (dashboardData) => {
  const {
    stats,
    resolutionTimeData,
    technicianData,
    equipmentData,
    interventionsByMonth,
    percentageChartData
  } = dashboardData;
  
  // Create new PDF document
  const doc = new jsPDF();
  
  // Calculate page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  let yPosition = margin;
  
  // Add header image (if available)
   const imgProps = doc.getImageProperties(headerImg);
   const imgWidth = pageWidth;
   const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
   doc.addImage(headerImg, "PNG", 0, 0, imgWidth, imgHeight);
   yPosition += imgHeight;
  
  // Add title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text("Tableau de Bord Maintenance", pageWidth / 2, yPosition + 10, { align: "center" });
  yPosition += 20;
  
  // Add date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const today = new Date();
  doc.text(`Généré le: ${today.toLocaleDateString()}`, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 10;
  
  // Add general statistics
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text("Statistiques Générales", margin, yPosition += 10);
  
  // Create a simple table for statistics
  const statsData = [
    ["Nombre des interventions", stats.interventions.toString()],
    ["Nombre des équipements", stats.equipements.toString()]
  ];
  
  autoTable(doc, {
    startY: yPosition += 5,
    head: [["Indicateur", "Valeur"]],
    body: statsData,
    theme: 'grid',
    headStyles: { fillColor:  [20, 66, 125], textColor: [255, 255, 255] },
    margin: { top: yPosition }
  });
  
  yPosition = doc.lastAutoTable.finalY + 10;
  
  // Resolution time data table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text("Délais de Résolution par Catégorie", margin, yPosition);
  
  const resolutionTableData = resolutionTimeData.map(item => [
    item.category,
    item.displayTime
  ]);
  
  autoTable(doc, {
    startY: yPosition += 5,
    head: [["Catégorie d'Équipement", "Temps Moyen de Résolution"]],
    body: resolutionTableData,
    theme: 'striped',
    headStyles: { fillColor: [32, 89, 158], textColor:  [255, 255, 255]},
    margin: { top: yPosition }
  });
  
  yPosition = doc.lastAutoTable.finalY + 10;
  
  // Check if need to add new page for technician data
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }
  
  // Technician intervention table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text("Interventions par Technicien", margin, yPosition);
  
  const technicianTableData = technicianData.map(item => [
    item.technician,
    item.Terminee.toString(),
    item.EnCours.toString(),
    item.Annulee.toString(),
    (item.Terminee + item.EnCours + item.Annulee).toString()
  ]);
  
  autoTable(doc, {
    startY: yPosition += 5,
    head: [["Technicien", "Terminées", "En Cours", "Annulées", "Total"]],
    body: technicianTableData,
    theme: 'grid',
    headStyles: { fillColor:[88, 131, 182], textColor: [255, 255, 255] },
    margin: { top: yPosition }
  });
  
  yPosition = doc.lastAutoTable.finalY + 10;
  
  // Check if need to add new page for equipment data
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }
  
  // Equipment status table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text("État des Équipements", margin, yPosition);
  
  const equipmentTableData = equipmentData.map(item => [
    item.name,
    item.value.toString() + "%"
  ]);
  
  autoTable(doc, {
    startY: yPosition += 5,
    head: [["État", "Pourcentage"]],
    body: equipmentTableData,
    theme: 'striped',
    headStyles: { fillColor:[143, 172, 207], textColor: [255, 255, 255] },
    margin: { top: yPosition }
  });
  
  yPosition = doc.lastAutoTable.finalY + 10;
  
  // Check if need to add new page for monthly data
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }
  
  // Monthly interventions table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text("Interventions Mensuelles", margin, yPosition);
  
  const monthlyTableData = interventionsByMonth.map(item => [
    item.month,
    item.Preventives.toString(),
    item.Curatives.toString(),
    (item.Preventives + item.Curatives).toString()
  ]);
  
  autoTable(doc, {
    startY: yPosition += 5,
    head: [["Mois", "Préventives", "Curatives", "Total"]],
    body: monthlyTableData,
    theme: 'grid',
    headStyles: { fillColor: [240, 156, 10], textColor: [255, 255, 255] },
    margin: { top: yPosition }
  });
  
  // Intervention status percentages
  if (percentageChartData && percentageChartData.length > 0) {
    yPosition = doc.lastAutoTable.finalY + 10;
    
    // Check if need to add new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Statut des Interventions", margin, yPosition);
    
    const statusTableData = percentageChartData.map(item => [
      item.label,
      item.value.toString() + "%"
    ]);
    
    autoTable(doc, {
      startY: yPosition += 5,
      head: [["Statut", "Pourcentage"]],
      body: statusTableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
      margin: { top: yPosition }
    });
  }
  
  // Add footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  const date = new Date();
  const timestamp = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  doc.save(`dashboard_report_${timestamp}.pdf`);
};

export default exportDashboardToPDF;
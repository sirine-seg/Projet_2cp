import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import headerImg from "../assets/headerEsi.png";
const exportToPDF = (interventions) => {
  const doc = new jsPDF();


   const imgProps = doc.getImageProperties(headerImg);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
    doc.addImage(headerImg, "PNG", 0, 0, pdfWidth, imgHeight);

  
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Liste des Intervention", doc.internal.pageSize.getWidth() / 2, imgHeight + 10, { align: "center" });

  const tableData = interventions.map((i) => [
    i.id,
    i.title || "Sans titre",
    i.type_intervention_display || "N/A",
    i.equipement_name || "N/A",
    i.urgence_display || "N/A",
    i.date_debut || "Non définie",
    i.statut_display || "Non défini",
  ]);

   
  autoTable(doc,{
    startY:  imgHeight + 20,
    head: [
      [
        "ID",
        "Titre",
        "Type",
        "Équipement",
        "Urgence",
        "Date début",
        "Statut",
      ],
    ],
    body: tableData,
   
  });

  doc.save(`interventions_.pdf`);
};

export default exportToPDF;
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerImg from "../assets/headerEsi.png"; // adjust the path based on your file location

const exportToPDF = (equipements) => {
  const doc = new jsPDF();

  const imgProps = doc.getImageProperties(headerImg);
  const pdfWidth = doc.internal.pageSize.getWidth();
  const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

  doc.addImage(headerImg, "PNG", 0, 0, pdfWidth, imgHeight);


  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text("Liste des équipements", doc.internal.pageSize.getWidth() / 2, imgHeight + 10, { align: "center" });

  const tableData = equipements.map((e) => [
    e.nom,
    e.etat_nom,
    e.code,
    e.localisation_nom,
    e.categorie_nom,
    e.typee_nom,
  ]);

  autoTable(doc, {
    startY: imgHeight + 20,
    head: [["Nom", "État", "Code", "Localisation", "Catégorie", "Type"]],
    body: tableData,
  });

  doc.save("equipements.pdf");
};

export default exportToPDF;


import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerImg from "../assets/headerEsi.png"; // adjust the path based on your file location

const exportUsersToPDF = (users) => {
    const doc = new jsPDF();

    // Image d'en-tête
    const imgProps = doc.getImageProperties(headerImg);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(headerImg, "PNG", 0, 0, pdfWidth, imgHeight);

    // Titre
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Liste des utilisateurs", doc.internal.pageSize.getWidth() / 2, imgHeight + 10, { align: "center" });

    const tableData = users.map((user) => [
        user.first_name,
        user.last_name,
        user.email,
        user.role,
    ]);

    autoTable(doc, {
        startY: imgHeight + 20, // Démarre après l'image
        head: [["Nom", "Prénom", "Email", "Rôle"]],
        body: tableData,
    });

    doc.save("utilisateurs.pdf");
};

export default exportUsersToPDF;

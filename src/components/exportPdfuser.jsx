import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportUsersToPDF = (users) => {
  const doc = new jsPDF();

  const tableData = users.map((user) => [
    user.first_name,
    user.last_name,
    user.email,
    user.role,
  ]);

  autoTable(doc, {
    head: [["Nom", "Prénom", "Email", "Rôle"]],
    body: tableData,
  });

  doc.save("utilisateurs.pdf");
};

export default exportUsersToPDF;
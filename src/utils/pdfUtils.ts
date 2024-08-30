import { VocabWord } from "@/app/vocabulary/page";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getTranslationData } from "./vocab.utils";

// interface UserData {
//   id: number;
//   name: string;
//   age: number;
// }

export const generatePDF = (data: VocabWord[], locale: "en" | "uk") => {
  const doc = new jsPDF();

  const columns = ["infinitive", "translation"];
  const rows = data.map((item) => [
    item.inf,
    getTranslationData(item, locale).translation as string,
  ]);

  doc.text("Vocab", 14, 20);

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 30,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [22, 160, 133] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  doc.save("vocab.pdf");
};

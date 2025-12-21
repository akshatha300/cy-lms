// backend/services/certificateService.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateCertificatePDF = ({ name, courseTitle, date = new Date().toLocaleDateString() }) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const filename = `certificate-${name.replace(/\s+/g, "_")}-${Date.now()}.pdf`;
    const outPath = path.join(process.cwd(), "backend", "data", "certificates");
    if (!fs.existsSync(outPath)) fs.mkdirSync(outPath, { recursive: true });
    const filePath = path.join(outPath, filename);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Simple certificate layout
    doc.fontSize(24).text("Certificate of Completion", { align: "center" });
    doc.moveDown(1.5);
    doc.fontSize(18).text(`${name}`, { align: "center", underline: true });
    doc.moveDown(0.5);
    doc.fontSize(14).text(`has successfully completed the course:`, { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(16).text(`${courseTitle}`, { align: "center", underline: true });
    doc.moveDown(2);
    doc.fontSize(12).text(`Date: ${date}`, { align: "right" });

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", (err) => reject(err));
  });
};

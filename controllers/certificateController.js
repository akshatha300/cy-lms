// backend/controllers/certificateController.js
import { generateCertificatePDF } from "../services/certificateService.js";

export const createCertificate = async (req, res) => {
  try {
    const { name, courseTitle } = req.body;
    if (!name || !courseTitle) return res.status(400).json({ message: "name and courseTitle required" });
    const filePath = await generateCertificatePDF({ name, courseTitle });
    // return local path or stream it
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import { generateCertificatePDF } from "../services/certificateService.js";
import Certificate from "../models/Certificate.js";
import fs from "fs";

export const createCertificate = async (req, res) => {
  try {
    const { name, courseTitle } = req.body;
    const recipientName = (name || req.user?.name || "").trim();

    if (!recipientName || !courseTitle) {
      return res.status(400).json({ message: "name and courseTitle required" });
    }

    const filePath = await generateCertificatePDF({ name: recipientName, courseTitle });

    // Persist issuance so we can list/download later
    await Certificate.create({
      user: req.user._id,
      recipientName,
      courseTitle,
      filePath,
    });

    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(
      certs.map((c) => ({
        id: c._id,
        recipientName: c.recipientName,
        courseTitle: c.courseTitle,
        issuedAt: c.issuedAt,
        createdAt: c.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const downloadCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const cert = await Certificate.findOne({ _id: id, user: req.user._id }).lean();

    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    if (!cert.filePath || !fs.existsSync(cert.filePath)) {
      return res.status(410).json({ message: "Certificate file is unavailable" });
    }

    res.download(cert.filePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import { appendToSheet } from "../utils/sheetService.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// === CONFIGURE FILE UPLOAD ===
const uploadDir = "uploads/pitchdecks";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const uploadPitchDeck = multer({ storage }).single("pitchDeck");

// === REGISTER COMPANY CONTROLLER ===
export const registerCompany = async (req, res) => {
  console.log("🏢 Incoming Company Registration:", req.body);

  try {
    const {
      companyName,
      founderName,
      email,
      phone,
      website,
      industry,
      stage,
      serviceRequired,
      fundraisingAmount,
      description,
    } = req.body;

    // Validate required fields
    if (!companyName || !founderName || !email || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const pitchDeck = req.file ? req.file.filename : "No file uploaded";
    const COMPANY_SHEET_ID = process.env.COMPANY_SHEET_ID;

    // Append to Google Sheet
    await appendToSheet(COMPANY_SHEET_ID, "Sheet1!A:K", [
      [
        new Date().toISOString(),
        companyName,
        founderName,
        email,
        phone,
        website || "N/A",
        industry || "N/A",
        stage || "N/A",
        serviceRequired || "N/A",
        fundraisingAmount || "N/A",
        description || "N/A",
        pitchDeck,
      ],
    ]);

    res.status(200).json({
      success: true,
      message: "✅ Company registered successfully!",
      uploadedFile: pitchDeck,
    });
  } catch (error) {
    console.error("❌ Company Registration Failed:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error.message });
  }
};

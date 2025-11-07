import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan"; // ✅ Add Morgan for logging

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ===============================
   🔒 1. Middleware Configuration
================================ */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 // handle preflight requests


// ✅ CORS Setup (allow frontend origin only)
const allowedOrigins = [
  "http://192.168.0.161:4173/",
  "http://localhost:4173/" // local frontend (Vite)
    // replace with your deployed frontend
];

// ✅ Flexible CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // allow all localhost or local IPs
      if (!origin || origin.startsWith("http://localhost") || origin.startsWith("http://192.168.")) {
        return callback(null, true);
      }

      // whitelist production domain
      const allowedOrigins = ["https://metora.ai"];
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // otherwise block
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Must handle OPTIONS preflight (important)
app.options(/.*/, cors()); // ✅ works in Express 5+



// ✅ Logger Setup (morgan)
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

// ✅ Multer setup for file uploads (Pitch Decks)
const upload = multer({ dest: "uploads/" });

// ✅ Google Sheets Auth Setup
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "config", "credentials.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const INVESTOR_SHEET_ID = process.env.INVESTOR_SHEET_ID;
const COMPANY_SHEET_ID = process.env.COMPANY_SHEET_ID;

/* ===============================
   🧭 ROUTE 1: Investor Registration
================================ */
app.post("/register-investor", async (req, res) => {
  try {
    const {
      name,
      organization,
      email,
      phone,
      investorType,
      investmentFocus,
      preferredStage,
      investmentRange,
      additionalInfo,
    } = req.body;

    console.log("📥 Incoming Investor Data:", req.body);

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: INVESTOR_SHEET_ID,
      range: "Sheet1!A:J",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          name,
          organization,
          email,
          phone,
          investorType,
          investmentFocus,
          preferredStage,
          investmentRange,
          additionalInfo,
          new Date().toISOString(),
        ]],
      },
    });

    res.status(200).json({ success: true, message: "✅ Investor registered successfully!" });
  } catch (error) {
    console.error("❌ Error saving investor data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ===============================
   🧭 ROUTE 2: Company Registration
================================ */
app.post("/register-company", upload.single("pitchDeck"), async (req, res) => {
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

    const pitchDeck = req.file ? req.file.originalname : "No file uploaded";

    console.log("📥 Incoming Company Data:", req.body);

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: COMPANY_SHEET_ID,
      range: "Sheet1!A:L",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
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
          pitchDeck,
          new Date().toISOString(),
        ]],
      },
    });

    res.status(200).json({ success: true, message: "✅ Company registered successfully!" });
  } catch (error) {
    console.error("❌ Error saving company data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ===============================
   🚀 Server Initialization
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Arctic Advisory API running on port ${PORT}`);
});

import path from "path";
import { google } from "googleapis";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let auth;

try {
  const credentialsPath = path.join(__dirname, "credentials.json");
  if (!fs.existsSync(credentialsPath)) {
    throw new Error("Missing Google credentials file in /config/credentials.json");
  }

  auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  console.log("✅ Google Auth initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize Google Auth", error);
}

export default auth;

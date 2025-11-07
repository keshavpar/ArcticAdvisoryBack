import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function logError(message, error) {
  const timestamp = new Date().toISOString();
  const text = `\n[${timestamp}] ❌ ${message}: ${error?.stack || error?.message || error}`;
  fs.appendFileSync(path.join(__dirname, "../error.log"), text);
  console.error(text);
}

export const errorLogger = (err, req, res, next) => {
  logError("Unhandled Server Error", err);
  res.status(500).json({ success: false, error: "Internal Server Error" });
};

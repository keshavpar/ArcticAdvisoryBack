import { google } from "googleapis";
import auth from "../config/googleAuth.js";

export async function appendToSheet(spreadsheetId, range, values) {
  if (!auth) throw new Error("Google Auth not initialized");

  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
}

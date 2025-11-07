import { appendToSheet } from "../utils/sheetService.js";

export const registerInvestor = async (req, res) => {
  console.log("📩 Incoming Investor Registration:", req.body);

  try {
    const {
additionalInfo,
      name,
      organization,
      email,
      phone,
      investorType,
      investmentFocus,
      preferredStage,
      investmentRange,
      
    } = req.body;

    const INVESTOR_SHEET_ID = process.env.INVESTOR_SHEET_ID;
    await appendToSheet(INVESTOR_SHEET_ID, "Sheet1!A:J", [[
        new Date().toISOString(),
      name,
      organization,
      email,
      phone,
      investorType,
      investmentFocus,
      preferredStage,
      investmentRange,
      additionalInfo,
    
    ]]);

    res.status(200).json({ success: true, message: "Investor registered successfully!" });
  } catch (error) {
    console.error("Investor Registration Failed", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

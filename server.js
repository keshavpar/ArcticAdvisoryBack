import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

import investorRoutes from "./routes/investorRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import { requestLogger } from "./middlewares/morganLogger.js";
import { corsConfig } from "./middlewares/corsConfig.js";
import { errorLogger, logError } from "./middlewares/errorLogger.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

/* ------------------ Middleware ------------------ */
app.use(requestLogger);
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------ Routes ------------------ */
app.get("/ping", (req, res) => {
  console.log("✅ Ping successful");
  res.send("Server is alive");
});

app.use("/api/investor", investorRoutes);
app.use("/api/company", companyRoutes);

/* ------------------ Error Handlers ------------------ */
app.use(errorLogger);

/* ------------------ Start Server ------------------ */
app.listen(PORT, () => {
  console.log(`🚀 Arctic Advisory API running on http://localhost:${PORT}`);
});

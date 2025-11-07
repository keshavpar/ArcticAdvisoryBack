import express from "express";
import { registerInvestor } from "../controllers/investorController.js";

const router = express.Router();
router.post("/", registerInvestor);

export default router;

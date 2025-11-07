import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logStream = fs.createWriteStream(path.join(__dirname, "../server.log"), { flags: "a" });

export const requestLogger = [
  morgan(":method :url :status :res[content-length] - :response-time ms", { stream: logStream }),
  morgan("dev"),
];

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DATA_FILE = path.join(__dirname, "../data/storedBills.json");
export const KEYWORDS_FILE = path.join(__dirname, "../data/keyWords.json");

export const PORT = process.env.PORT || 3000;
export const URL = "https://itd.rada.gov.ua/billinfo/Bills/period";

export const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

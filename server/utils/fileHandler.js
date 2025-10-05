import fs from "fs";
import { DATA_FILE } from "../constants/constants.js";

export function loadBills() {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  }
  return [];
}

export function saveBills(bills) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(bills, null, 2), "utf-8");
}

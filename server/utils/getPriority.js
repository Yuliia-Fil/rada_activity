import fs from "fs";
import { KEYWORDS_FILE } from "../constants/constants.js";

const priorityKeywords = JSON.parse(fs.readFileSync(KEYWORDS_FILE, "utf-8"));

export function getPriority(text) {
  text = text.toLowerCase();
  if (priorityKeywords.high.some((word) => text.includes(word.toLowerCase())))
    return "high";
  if (priorityKeywords.medium.some((word) => text.includes(word.toLowerCase())))
    return "medium";
  return "low";
}

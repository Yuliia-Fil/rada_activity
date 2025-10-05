import express from "express";
import { scrapeAllBills } from "../services/scrapeAllBills.js";
import { getPriority } from "../utils/getPriority.js";
import { loadBills, saveBills } from "../utils/fileHandler.js";

const router = express.Router();

let storedBills = loadBills();

router.get("/", async (req, res) => {
  try {
    const scrapedBills = await scrapeAllBills();

    scrapedBills.forEach((bill) => {
      if (!storedBills.find((b) => b.number === bill.number)) {
        storedBills.push({
          ...bill,
          priority: getPriority(bill.title),
          status: "new",
        });
      }
    });

    saveBills(storedBills);
    res.json(storedBills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scraping failed" });
  }
});

router.patch("/:number/status", (req, res) => {
  const { number } = req.params;
  const { status } = req.body;

  const bill = storedBills.find((b) => b.number === number);
  if (!bill) return res.status(404).json({ error: "Bill not found" });

  bill.status = status;
  saveBills(storedBills);

  res.json(bill);
});

export default router;

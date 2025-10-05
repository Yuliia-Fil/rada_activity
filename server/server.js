import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json()); // глобальний парсер JSON

const PORT = 3000;
const url = "https://itd.rada.gov.ua/billinfo/Bills/period";

// Завантажуємо ключові слова для пріоритетів
const priorityKeywords = JSON.parse(
  fs.readFileSync("server/keyWords.json", "utf-8")
);

// Функція для визначення пріоритету
function getPriority(text) {
  text = text.toLowerCase();
  if (priorityKeywords.high.some((word) => text.includes(word.toLowerCase())))
    return "high";
  if (priorityKeywords.medium.some((word) => text.includes(word.toLowerCase())))
    return "medium";
  if (priorityKeywords.low.some((word) => text.includes(word.toLowerCase())))
    return "low";
  return "low"; // дефолтний пріоритет
}

// Масив для збереження законів у пам'яті
let storedBills = [];

// Функція скрапінгу
async function scrapeAllBills() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const bills = [];

  // Кількість сторінок
  const totalPages = await page.$$eval(".pagination-button", (buttons) =>
    buttons
      .map((btn) => parseInt(btn.getAttribute("data-page")))
      .filter(Boolean)
  );
  const maxPage = Math.max(...totalPages, 1);
  console.log(`Найбільше сторінок: ${maxPage}`);

  for (let i = 1; i <= maxPage; i++) {
    if (i > 1) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2" }),
        page.click(`.pagination-button[data-page='${i}']`),
      ]);
    }

    const pageBills = await page.$$eval("table.table-hover tbody tr", (rows) =>
      rows.map((row) => {
        const numberEl = row.querySelector("td:nth-child(2) a");
        const number = numberEl?.innerText.trim() || "";
        const link = numberEl?.href || "";
        const date =
          row.querySelector("td:nth-child(3)")?.innerText.trim() || "";
        const title =
          row.querySelector("td:nth-child(4)")?.innerText.trim() || "";
        return { number, link, date, title };
      })
    );

    bills.push(...pageBills);
  }

  await browser.close();
  return bills;
}

// GET /bills – отримати всі закони
app.get("/bills", async (req, res) => {
  try {
    const bills = await scrapeAllBills();

    // Додаємо priority і статус
    storedBills = bills.map((bill) => ({
      ...bill,
      priority: getPriority(bill.title + " " + bill.number),
      status: "new",
    }));

    res.json(storedBills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scraping failed" });
  }
});

// PATCH /bills/:number/status – оновити статус закону
app.patch("/bills/:number/status", (req, res) => {
  const { number } = req.params;
  const { status } = req.body;

  const bill = storedBills.find((b) => b.number === number);
  if (!bill) return res.status(404).json({ error: "Bill not found" });

  bill.status = status;
  res.json(bill);
});

// Старт сервера
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

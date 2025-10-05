import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
const PORT = 3000;
const url = "https://itd.rada.gov.ua/billinfo/Bills/period";

const priorityKeywords = JSON.parse(
  fs.readFileSync("server/keyWords.json", "utf-8")
);

// Функція для визначення пріоритету
function getPriority(text) {
  text = text.toLowerCase();
  // перевіряємо всі рівні пріоритету і повертаємо найвищий знайдений
  if (priorityKeywords.high.some((word) => text.includes(word.toLowerCase())))
    return "high";
  if (priorityKeywords.medium.some((word) => text.includes(word.toLowerCase())))
    return "medium";
  if (priorityKeywords.low.some((word) => text.includes(word.toLowerCase())))
    return "low";
  return "low"; // дефолтний пріоритет
}

async function scrapeAllBills() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const bills = [];

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

    // Додаємо priority до кожного закону
    pageBills.forEach((bill) => {
      bill.priority = getPriority(bill.title + " " + bill.number);
    });

    bills.push(...pageBills);
  }

  await browser.close();
  return bills;
}

app.get("/bills", async (req, res) => {
  try {
    const bills = await scrapeAllBills();
    res.json(bills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scraping failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

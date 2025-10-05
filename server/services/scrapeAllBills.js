import puppeteer from "puppeteer";
import { URL } from "../constants/constants.js";

export async function scrapeAllBills() {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: "networkidle2" });

    const bills = [];

    const totalPages = await page.$$eval(".pagination-button", (buttons) =>
      buttons
        .map((btn) => parseInt(btn.getAttribute("data-page")))
        .filter(Boolean)
    );
    const maxPage = Math.max(...totalPages, 1);

    for (let i = 1; i <= maxPage; i++) {
      if (i > 1) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle2" }),
          page.click(`.pagination-button[data-page='${i}']`),
        ]);
      }

      const pageBills = await page.$$eval(
        "table.table-hover tbody tr",
        (rows) =>
          rows.map((row) => {
            const numberEl = row.querySelector("td:nth-child(2) a");
            return {
              number: numberEl?.innerText.trim() || "",
              link: numberEl?.href || "",
              date:
                row.querySelector("td:nth-child(3)")?.innerText.trim() || "",
              title:
                row.querySelector("td:nth-child(4)")?.innerText.trim() || "",
            };
          })
      );

      bills.push(...pageBills);
    }

    return bills;
  } catch (err) {
    console.error("Scraping failed:", err);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
}

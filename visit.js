import puppeteer from "puppeteer";
import TurndownService from "turndown";

async function visit(url) {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36");
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(url, { waitUntil: "networkidle2" });

  const profile = await page.evaluate(() => {
    return {};
  });

  await browser.close();
  return profile;
}

export async function visitAndExtractMarkdown(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36");
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(url, { waitUntil: "networkidle2" });

  // Extract main content
  const html = await page.evaluate(() => {
    // Try to get main content, fallback to body
    const main = document.querySelector("main") || document.body;
    // Remove scripts/styles
    main.querySelectorAll("script, style, noscript").forEach(e => e.remove());
    return main.innerHTML;
  });

  await browser.close();

  // Convert HTML to Markdown
  const turndownService = new TurndownService({ headingStyle: "atx" });
  const markdown = turndownService.turndown(html);
  return markdown;
}

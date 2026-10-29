import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

// Exercise the exported site with mocked delivery; never send a real lead.
const root = fileURLToPath(new URL("../out/", import.meta.url));
const artifacts = process.env.REFERRAL_UI_ARTIFACTS;
if (artifacts) fs.mkdirSync(artifacts, { recursive: true });
const server = http.createServer((req, res) => {
  let file = path.resolve(root, `.${decodeURIComponent(new URL(req.url, "http://local").pathname)}`);
  if (!file.startsWith(path.resolve(root) + path.sep)) { res.writeHead(403); res.end(); return; }
  file = [file, `${file}.html`, path.join(file, "index.html")].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!file) { res.writeHead(404); res.end(); return; }
  const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".txt": "text/x-component" };
  res.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const origin = `http://127.0.0.1:${server.address().port}`;
try {
  const page = await browser.newPage();
  const errors = [];
  let fail = true;
  let posted;
  page.on("pageerror", error => errors.push(String(error)));
  await page.setRequestInterception(true);
  page.on("request", async req => {
    if (req.url() === `${origin}/api/lead`) {
      posted = req.postData();
      await req.respond({ status: fail ? 502 : 200, contentType: "application/json", body: JSON.stringify(fail ? { ok: false, message: "خطای آزمایشی؛ دوباره تلاش کنید." } : { ok: true }) });
    } else if (req.url().startsWith(origin)) await req.continue();
    else await req.abort();
  });
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewport({ width, height: 1000 });
    await page.goto(`${origin}/referral`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.$eval("html", el => el.dir), "rtl");
    assert.equal(await page.$$eval("main h1", els => els.length), 1);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
    assert.equal(await page.$eval(".site-header__cta", el => el.getAttribute("href")), "/referral");
    assert.equal(await page.$eval(".site-header__cta", el => el.textContent), "همکاری در فروش");
    if (width === 390) {
      await page.click(".mobile-nav__toggle");
      assert.equal(await page.$eval(".mobile-nav__cta", el => el.getAttribute("href")), "/referral");
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => !document.querySelector("#mobile-menu").open);
    }
    if (artifacts && [1440, 390].includes(width)) await page.screenshot({ path: path.join(artifacts, width === 1440 ? "desktop.png" : "mobile.png"), fullPage: true });
  }
  await page.type("#referral-name", "سارا احمدی");
  await page.type("#referral-job", "مشاور کسب‌وکار");
  await page.type("#referral-mobile", "09123456789");
  // A local build may omit Turnstile configuration; only this mocked test enables submission.
  const enable = () => page.$eval('main button[type="submit"]', el => { el.disabled = false; });
  await enable();
  await page.click('main button[type="submit"]');
  await page.waitForFunction(() => document.querySelector('main [aria-live="polite"]').textContent.includes("خطای آزمایشی"));
  assert.equal(await page.$eval("#referral-name", el => el.value), "سارا احمدی", "error must preserve input");
  fail = false;
  await enable();
  await page.click('main button[type="submit"]');
  await page.waitForSelector('main [role="status"]');
  assert.ok(posted.includes("referral") && posted.includes("09123456789"));
  assert.deepEqual(errors, []);
  console.log("Referral: RTL, four widths, navigation, error recovery and mocked submission passed.");
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

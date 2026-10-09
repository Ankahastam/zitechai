import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const copy = JSON.parse(fs.readFileSync(new URL("../content/seo-agent.json", import.meta.url), "utf8"));
const chrome = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const artifacts = process.env.SEO_AGENT_ARTIFACTS;
assert.ok(fs.existsSync(path.join(root, "seo-agent.html")), "Run npm run build:local first.");
assert.ok(fs.existsSync(chrome), "Set CHROME_PATH to your installed Chrome executable.");
if (artifacts) fs.mkdirSync(artifacts, { recursive: true });

const server = http.createServer((req, res) => {
  let file = path.resolve(root, `.${decodeURIComponent(new URL(req.url, "http://localhost").pathname)}`);
  if (file !== path.resolve(root) && !file.startsWith(path.resolve(root) + path.sep)) { res.writeHead(403); res.end(); return; }
  file = [file, `${file}.html`, path.join(file, "index.html")].find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!file) { res.writeHead(404); res.end(); return; }
  const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".webp": "image/webp", ".svg": "image/svg+xml" };
  res.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;

const strings = (value) => typeof value === "string" ? [value] : Object.values(value).flatMap(strings);
const normalize = (text) => text.replace(/\s+/g, " ").trim();

try {
  browser = await puppeteer.launch({ executablePath: chrome, headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await page.setRequestInterception(true);
  page.on("request", (request) => request.url().startsWith(origin) ? request.continue() : request.abort());
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

  for (const [width, height, label] of [[1440, 1000, "desktop"], [768, 1024, "tablet"], [390, 844, "mobile"], [320, 740, "small-mobile"]]) {
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    const response = await page.goto(`${origin}/seo-agent`, { waitUntil: "networkidle0" });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.title(), copy.seo.title);
    assert.equal(await page.$eval('meta[name="description"]', (el) => el.content), copy.seo.description);
    assert.equal(await page.$eval('link[rel="canonical"]', (el) => el.href), "https://zitechai.com/seo-agent");
    assert.equal(await page.$$eval("main h1", (els) => els.length), 1);
    const text = normalize(await page.$eval("main", (el) => [...el.querySelectorAll("h1, h2, h3, p, li, dt, dd, a")].map((node) => node.textContent).join(" ")));
    for (const [key, section] of Object.entries(copy)) {
      if (key === "seo") continue;
      for (const line of strings(section)) assert.ok(text.includes(normalize(line)), `${label}: missing supplied copy: ${line}`);
    }
    assert.ok(await page.$('header a[href="/seo-agent"]'), "Page must be discoverable from the main menu.");
    assert.ok(await page.$('footer a[href="/seo-agent"]'), "Page must be discoverable from the footer.");
    const overflow = await page.$eval("main", (main) => [...main.querySelectorAll("*")].filter((el) => {
      if (!el.getClientRects().length || el.closest("details:not([open])") && !el.closest("summary")) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.left < -1 || r.right > document.documentElement.clientWidth + 1);
    }).map((el) => `${el.tagName}: ${el.textContent.slice(0, 70)}`));
    assert.deepEqual(overflow, [], `${label}: content must fit the viewport`);
    const hero = await page.$eval("main h1", (el) => ({ height: el.getBoundingClientRect().height, line: parseFloat(getComputedStyle(el).lineHeight) }));
    if (width === 1440) assert.ok(hero.height <= hero.line * 2 + 1, "Desktop hero must fit two lines.");
    const primary = await page.$eval('main a[href="#contact"]', (el) => ({
      bottom: el.getBoundingClientRect().bottom,
      color: getComputedStyle(el).color,
      background: getComputedStyle(el).backgroundColor,
      lines: el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight),
    }));
    assert.ok(primary.bottom < height, `${label}: demo CTA must be visible without scrolling`);
    assert.equal(primary.color, "rgb(255, 255, 255)");
    assert.equal(primary.background, "rgb(122, 64, 237)");
    assert.equal(await page.$eval("main h1", (el) => getComputedStyle(el.parentElement).animationName), "none", "Reduced motion must disable entry animation.");
    if (artifacts) await page.screenshot({ path: path.join(artifacts, `${label}.png`) });
  }

  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(`${origin}/seo-agent`, { waitUntil: "networkidle0" });
  const opportunity = 'details[name="seo-opportunity"]';
  await page.focus(`${opportunity}:nth-child(2) summary`);
  await page.keyboard.press("Enter");
  assert.equal(await page.$$eval(opportunity, (els) => els.filter((el) => el.open).length), 1);
  assert.equal(await page.$eval(`${opportunity}:nth-child(2)`, (el) => el.open), true, "Opportunity disclosures must work with the keyboard.");
  const operation = 'details[name="seo-operations"]';
  for (const index of [2, 3]) {
    await page.click(`${operation}:nth-child(${index}) summary`);
    assert.equal(await page.$$eval(operation, (els) => els.filter((el) => el.open).length), 1);
    assert.equal(await page.$eval(`${operation}:nth-child(${index})`, (el) => el.open), true);
  }
  await page.click('main a[href="#contact"]');
  await page.waitForSelector(".contact-dialog[open]", { visible: true });
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector(".contact-dialog").open);
  assert.equal(await page.$eval('main a[href="#contact"]', (el) => el === document.activeElement), true, "Dismissal must return focus to the demo CTA.");

  await page.click('main a[href="#seo-features"]');
  assert.ok(await page.$eval("#seo-features", (el) => Math.abs(el.getBoundingClientRect().top - 96) < 8), "Features link must scroll below the sticky header.");

  await page.evaluate(() => { document.documentElement.style.fontSize = "125%"; });
  await page.setViewport({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, "Enlarged text must not cause horizontal scrolling.");

  await page.setJavaScriptEnabled(false);
  await page.goto(`${origin}/seo-agent`, { waitUntil: "networkidle0" });
  await page.click(`${operation}:nth-child(3) summary`);
  assert.equal(await page.$eval(`${operation}:nth-child(3)`, (el) => el.open), true, "Native disclosures must work without JavaScript.");
  await page.click('main a[href="#contact"]');
  assert.ok(await page.$eval("#contact", (el) => el.getBoundingClientRect().top < innerHeight), "Without JavaScript the demo link must reach the footer contact form.");
  assert.deepEqual(errors, [], "Page must have no browser runtime errors.");
  console.log("SEO Agent OK: supplied copy, metadata, 4 viewports, keyboard disclosures, demo dialog, reduced motion, text scaling, and no-JavaScript fallback.");
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}

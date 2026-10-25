import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

// Run after next build; all requests stay local.
const root = fileURLToPath(new URL("../out/", import.meta.url));
const artifacts = process.env.PARTNERS_UI_ARTIFACTS;
if (artifacts) fs.mkdirSync(artifacts, { recursive: true });
const server = http.createServer((req, res) => {
  let file = path.resolve(root, `.${decodeURIComponent(new URL(req.url, "http://local").pathname)}`);
  if (file !== path.resolve(root) && !file.startsWith(path.resolve(root) + path.sep)) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".webp": "image/webp", ".svg": "image/svg+xml" };
  res.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const origin = `http://127.0.0.1:${server.address().port}`;

try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(String(error)));
  await page.setRequestInterception(true);
  page.on("request", req => req.url().startsWith(origin) ? req.continue() : req.abort());
  const rail = "#partners-rail";
  const position = () => page.$eval(rail, el => -el.scrollLeft);
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewport({ width, height: 900, hasTouch: width < 400 });
    await page.goto(origin, { waitUntil: "networkidle0" });
    await page.waitForSelector(`${rail}[data-looping="true"]`);
    await page.$eval("#partners", el => el.scrollIntoView({ behavior: "instant", block: "center" }));
    await page.mouse.move(0, 0);
    await page.waitForFunction(() => document.querySelector("#partners-rail").scrollLeft < 0);
    assert.equal(await page.$$eval(`${rail} > li:not([aria-hidden="true"])`, els => els.length), 7);
    assert.ok(await page.$$eval(`${rail} > li[aria-hidden="true"] a`, els => els.every(el => el.tabIndex === -1)), "copies must stay out of keyboard navigation");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `page overflow at ${width}`);
    const before = await position();
    await wait(650);
    const delta = await position() - before;
    assert.ok(delta >= 8 && delta < 35, `expected slow autoplay at ${width}, got ${delta}px`);

    await page.hover(rail);
    const hovered = await position();
    await wait(180);
    assert.equal(await position(), hovered, "hover must pause");

    // Force both seams and compare the same logo's viewport position before/after wrapping.
    for (const direction of [-1, 1]) {
      const seam = await page.$eval(rail, (el, direction) => {
        const cycle = el.children[0].offsetLeft - el.children[7].offsetLeft;
        el.scrollLeft = direction === 1 ? -cycle * 2 - 12 : -cycle + 12;
        return { cycle, x: el.children[7].getBoundingClientRect().x, direction };
      }, direction);
      await wait(80);
      const after = await page.$eval(rail, el => ({ position: -el.scrollLeft, x: el.children[7].getBoundingClientRect().x }));
      assert.ok(after.position >= seam.cycle && after.position < seam.cycle * 2, "must wrap to middle copy");
      assert.ok(Math.abs(Math.abs(after.x - seam.x) - seam.cycle) < 5, "wrap must preserve the same visual position");
    }
    await page.mouse.move(0, 0);

    await page.focus(rail);
    await page.keyboard.press("Home");
    const start = await position();
    await page.keyboard.press("ArrowRight");
    assert.ok(await position() > start, "previous must loop to last partner");
    await page.keyboard.press("ArrowLeft");
    assert.ok(Math.abs(await position() - start) < 2, "next must loop back to first partner");
    await page.$eval(rail, el => el.blur());
    if (artifacts) await page.screenshot({ path: path.join(artifacts, `partners-loop-${width}.png`) });
    console.log(`Autoplay, both seams, keyboard, hover, accessibility and overflow OK at ${width}px`);
  }
  await page.click(".partners__pause");
  await page.$eval(".partners__pause", el => el.blur());
  await page.mouse.move(0, 0);
  assert.equal(await page.$eval(".partners__pause", el => el.getAttribute("aria-pressed")), "true");
  const paused = await position();
  await wait(200);
  assert.equal(await position(), paused, "pause button must stop autoplay");
  await page.click(".partners__pause");
  await page.$eval(".partners__pause", el => el.blur());
  await page.mouse.move(0, 0);
  await wait(2200);
  assert.notEqual(await position(), paused, "resume must restart autoplay");
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  const reduced = await position();
  await wait(200);
  assert.equal(await position(), reduced, "reduced motion must disable autoplay");
  await page.setJavaScriptEnabled(false);
  await page.goto(origin, { waitUntil: "networkidle0" });
  assert.equal(await page.$$eval(`${rail} > li`, els => els.filter(el => getComputedStyle(el).display !== "none").length), 7, "no-JS content must remain readable without duplicates");
  assert.deepEqual(errors, []);
  console.log("Pause/resume, reduced motion and no-JS fallback OK");
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { renderChatMarkdown } from "../src/components/chat-markdown.ts";

// Run after a chat-enabled static build. No provider or security tokens are used.
const root = fileURLToPath(new URL("../out/", import.meta.url));
const artifacts = process.env.CHAT_UI_ARTIFACTS;
const chrome = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
assert.ok(fs.existsSync(chrome), "Set CHROME_PATH to your installed Chrome executable.");
assert.ok(fs.existsSync(path.join(root, "index.html")), "Build the site with NEXT_PUBLIC_CHAT_ENABLED=true first.");
if (artifacts) fs.mkdirSync(artifacts, { recursive: true });

const html = renderChatMarkdown('**فارسی**\n\n- یک\n- دو\n\n[لینک](https://example.com)\n\n`English`\n\n```js\nconst x = "<script>";\n```\n\n<script>alert(1)</script>\n[x](javascript:alert(1))\n![تصویر](https://example.com/image.png)');
assert.ok(html.includes("<strong>فارسی</strong>") && html.includes("<ul>") && html.includes("<pre>"));
assert.ok(html.includes('rel="noopener noreferrer"'));
assert.ok(!/<script>|<img|href="javascript:/i.test(html));

const server = http.createServer((req, res) => {
  let file = path.resolve(root, `.${decodeURIComponent(new URL(req.url, "http://local").pathname)}`);
  if (file !== path.resolve(root) && !file.startsWith(path.resolve(root) + path.sep)) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) file += ".html";
  if (!fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".txt": "text/x-component" };
  res.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await puppeteer.launch({ executablePath: chrome, headless: true });

try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  let failNext = false;
  let longNext = false;
  let richNext = false;
  const requests = [];
  await page.setRequestInterception(true);
  page.on("request", async (req) => {
    if (req.url().includes("challenges.cloudflare.com/turnstile")) {
      await req.respond({ status: 200, contentType: "text/javascript", body: `window.turnstile={render(el,options){window.__chatChallenge=options;setTimeout(()=>options.callback('mock-token'),10);return 'chat-widget';},reset(id){if(id==='chat-widget')setTimeout(()=>window.__chatChallenge.callback('mock-token'),10);},remove(){}};` });
    } else if (req.url() === `${origin}/api/chat`) {
      requests.push(JSON.parse(req.postData()));
      const failure = failNext; failNext = false;
      const long = longNext; longNext = false;
      const rich = richNext; richNext = false;
      await new Promise((resolve) => setTimeout(resolve, 250));
      await req.respond({ status: failure ? 502 : 200, contentType: "application/json", body: JSON.stringify(failure ? { ok: false, message: "سرویس موقتاً در دسترس نیست." } : {
        ok: true, answer: long ? "یک پاسخ طولانی برای بررسی پیمایش.\n\n".repeat(50) : rich ? "**زی‌تک** ابتدا نیاز کسب‌وکار را بررسی می‌کند.\n\n- بررسی فرایند\n- طراحی راهکار\n\n`English + فارسی`\n\n```js\nconst message = 'سلام';\n```\n\n<script>window.__unsafe=true</script>\n[x](javascript:alert(1))" : "سلام! **زی‌تک** ابتدا نیاز کسب‌وکار را بررسی می‌کند.\n\n- بررسی فرایندهای فعلی\n- طراحی راهکار مناسب\n\nدربارهٔ کسب‌وکارتان و فرایندی که می‌خواهید هوشمندتر شود توضیح بدهید.",
        sources: [{ title: "راهنمای زی‌تک", url: "https://zitechai.com/chat" }],
      }) });
    } else if (req.url().startsWith(origin)) await req.continue();
    else await req.abort();
  });

  const input = "#zitech-chat-question";
  const form = 'form[aria-label="ارسال پیام به دستیار زی‌تک"]';
  const dock = 'div[data-state]';
  const enabled = () => page.waitForFunction((selector) => !document.querySelector(`${selector} button[type="submit"]`).disabled, {}, form);
  const screenshot = async (label) => { if (artifacts) await page.screenshot({ path: path.join(artifacts, `${label}.png`) }); };
  const articles = () => page.$$eval("#zitech-chat article", (els) => els.length);
  for (const [width, height, label] of [[1440, 1000, "desktop"], [1100, 800, "compact-desktop"], [768, 1024, "tablet"], [390, 844, "mobile"], [320, 640, "small-mobile"]]) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, hasTouch: width <= 390, isMobile: width <= 390 });
    await page.goto(origin, { waitUntil: "networkidle0" });
    await page.waitForSelector(input);
    await page.waitForSelector('a[href^="https://chatgpt.com/?prompt="]', { visible: true });
    assert.equal(await page.$eval(dock, (el) => el.dataset.state), "idle");
    assert.equal(await page.$("#zitech-chat"), null, "Conversation must be lazy loaded");
    assert.equal(await page.$('button[aria-haspopup="dialog"][aria-controls="zitech-chat"]'), null);
    assert.equal(await page.$eval('#zitech-chat-atmosphere > i', (el) => getComputedStyle(el).opacity), "0");
    const composerStyle = await page.$eval(form, (el) => {
      const style = getComputedStyle(el);
      return { width: el.getBoundingClientRect().width, border: style.borderWidth, shadow: style.boxShadow };
    });
    assert.ok(composerStyle.width <= 560, "Composer stays compact on desktop");
    assert.equal(composerStyle.border, "0px");
    assert.ok(!composerStyle.shadow.includes("inset"), "No inner white stroke");
    assert.equal(await page.$("#zitech-chat-disclosure"), null);
    if (label === "desktop") {
      const first = "شما چه خدماتی ارائه می‌دهید؟";
      await page.waitForFunction((text) => document.querySelector("#zitech-chat-suggestion")?.textContent === text, {}, first);
      await page.waitForFunction((text) => {
        const value = document.querySelector("#zitech-chat-suggestion")?.textContent;
        return value && value.length < text.length;
      }, {}, first);
      await page.waitForFunction(() => document.querySelector("#zitech-chat-suggestion")?.textContent === "زی‌تک دقیقاً چه کاری می‌کند؟");
      assert.equal(await page.$eval(input, (el) => el.value), "", "Suggestions never change the user's draft");
      assert.equal(requests.length, 0, "Animated suggestions do not send requests");
    }
    await screenshot(`${label}-idle`);
    const headerGeometry = await page.$eval(".site-header__bar", (el) => {
      const rect = el.getBoundingClientRect();
      return { width: rect.width, center: rect.x + rect.width / 2 };
    });
    const scrollRange = await page.$eval(".hero", (el) => el.getBoundingClientRect().bottom + scrollY);
    const idleGeometry = await page.$eval(form, (el) => {
      const rect = el.getBoundingClientRect();
      return { center: rect.x + rect.width / 2, bottom: rect.bottom };
    });
    await page.evaluate((range) => window.scrollTo({ top: range / 2, behavior: "instant" }), scrollRange);
    await page.waitForFunction(() => {
      const progress = Number(document.querySelector('div[data-state]').style.getPropertyValue("--chat-scroll-progress"));
      return progress > .4 && progress < .6;
    });
    const midWidth = await page.$eval(form, (el) => el.getBoundingClientRect().width);
    const midHeaderWidth = await page.$eval(".site-header__bar", (el) => el.getBoundingClientRect().width);
    assert.ok(midWidth < composerStyle.width - 4 && midWidth > composerStyle.width - 80, "Width follows partial scroll rather than toggling abruptly");
    await page.evaluate((range) => window.scrollTo({ top: range * 2, behavior: "instant" }), scrollRange);
    await page.waitForFunction(() => document.querySelector('div[data-state]').style.getPropertyValue("--chat-scroll-progress") === "1");
    const compactGeometry = await page.$eval(form, (el) => {
      const rect = el.getBoundingClientRect();
      return { width: rect.width, center: rect.x + rect.width / 2, bottom: rect.bottom };
    });
    assert.ok(compactGeometry.width < midWidth);
    const compactHeader = await page.$eval(".site-header__bar", (el) => {
      const rect = el.getBoundingClientRect();
      const controls = [...el.querySelectorAll(":scope > nav, :scope > .site-header__cta, :scope > .brand-logo")].filter((control) => getComputedStyle(control).display !== "none");
      return { width: rect.width, center: rect.x + rect.width / 2, fits: controls.every((control) => { const box = control.getBoundingClientRect(); return box.left >= rect.left && box.right <= rect.right; }) };
    });
    if (width >= 1024) {
      assert.ok(midHeaderWidth < headerGeometry.width && midHeaderWidth > compactHeader.width, "Desktop header width follows scroll progressively");
      assert.ok(compactHeader.fits, "Desktop navigation fits inside the contracted header");
    } else assert.equal(compactHeader.width, headerGeometry.width, "Mobile header width remains unchanged");
    assert.ok(Math.abs(compactHeader.center - headerGeometry.center) < 1, "Header remains centered");
    assert.ok(Math.abs(compactGeometry.center - idleGeometry.center) < 1, "Composer remains centered");
    assert.ok(Math.abs(compactGeometry.bottom - idleGeometry.bottom) < 1, "Bottom anchor stays fixed");
    assert.equal(await page.$eval(input, (el) => el.value), "", "Scroll never changes draft text");
    if (label === "desktop") await screenshot("desktop-scrolled");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForFunction(() => {
      const progress = Number(document.querySelector('div[data-state]').style.getPropertyValue("--chat-scroll-progress"));
      return progress > .05 && progress < .95;
    });
    await page.waitForFunction(() => document.querySelector('div[data-state]').style.getPropertyValue("--chat-scroll-progress") === "0");
    assert.ok(Math.abs(await page.$eval(form, (el) => el.getBoundingClientRect().width) - composerStyle.width) < 1, "Returning to hero restores the original width");
    assert.ok(Math.abs(await page.$eval(".site-header__bar", (el) => el.getBoundingClientRect().width) - headerGeometry.width) < 1, "Returning to top restores header width");
    await page.click(input);
    assert.equal(await page.$("#zitech-chat-suggestion"), null, "Focus stops suggestions");
    assert.equal(await page.$eval(input, (el) => getComputedStyle(el).outlineStyle), "none");
    await page.waitForSelector("#zitech-chat");
    await page.waitForFunction(() => window.__chatChallenge);
    assert.equal(await page.$eval(dock, (el) => el.dataset.state), "focused");
    const atmosphere = await page.$eval('#zitech-chat-atmosphere', (el) => {
      const rect = el.getBoundingClientRect();
      return { x: rect.x, width: rect.width, viewportWidth: document.documentElement.clientWidth, height: rect.height, pointer: getComputedStyle(el).pointerEvents, mask: getComputedStyle(el.firstElementChild).maskImage };
    });
    assert.equal(atmosphere.x, 0);
    assert.ok(atmosphere.width <= atmosphere.viewportWidth && atmosphere.width >= atmosphere.viewportWidth - 32, "Atmosphere spans the viewport, allowing the site's reserved scrollbar gutter");
    assert.ok(atmosphere.height >= height * .55 && atmosphere.height <= height * .7, "Blur reaches behind messages");
    assert.equal(atmosphere.pointer, "none");
    assert.ok(atmosphere.mask.includes("gradient"));
    const metrics = await page.$eval(form, (el) => {
      const rect = el.getBoundingClientRect();
      return { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom, overflow: document.documentElement.scrollWidth > innerWidth, scroll: scrollY };
    });
    assert.ok(metrics.x >= 0 && metrics.y >= 0 && metrics.right <= width && metrics.bottom <= height, JSON.stringify(metrics));
    assert.equal(metrics.overflow, false);
    assert.equal(await page.evaluate(() => document.documentElement.dir), "rtl");
    await page.mouse.click(width / 2, 180);
    assert.equal(await page.$eval(dock, (el) => el.dataset.state), "focused", "Outside clicks preserve expansion");
    await page.click(input);
    await page.type(input, "چه خدماتی دارید؟");
    await page.keyboard.down("Shift"); await page.keyboard.press("Enter"); await page.keyboard.up("Shift");
    await page.type(input, "CRM");
    assert.ok((await page.$eval(input, (el) => el.value)).includes("\n"));
    await page.waitForFunction(() => document.querySelector("#zitech-chat-question").clientHeight > 44);
    await enabled();
    const before = requests.length;
    await page.$eval(input, (el) => el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", isComposing: true, bubbles: true })));
    assert.equal(requests.length, before, "IME Enter must not submit");
    await page.keyboard.press("Enter");
    await page.$eval(form, (el) => el.requestSubmit());
    await page.waitForFunction(() => document.querySelector('div[data-state]').dataset.state === "generating");
    await page.waitForFunction(() => document.querySelectorAll("#zitech-chat article").length === 2);
    assert.equal(requests.length, before + 1, "Duplicate submit blocked");
    assert.equal(requests.at(-1).newConversation, true);
    assert.deepEqual(Object.keys(requests.at(-1)).sort(), ["newConversation", "question", "token"]);
    assert.equal(await page.$("#zitech-chat script"), null);
    assert.equal(await page.evaluate(() => window.__unsafe), undefined);
    assert.ok(await page.$("#zitech-chat strong"));
    assert.equal(await page.$eval("#zitech-chat article div ul", (el) => getComputedStyle(el).listStyleType), "disc");
    assert.ok(await page.$('#zitech-chat a[target="_blank"][rel="noopener noreferrer"]'));
    await screenshot(`${label}-answer`);

    await page.type(input, "متن ذخیره‌شده");
    await page.click('button[aria-label="جمع‌کردن گفتگو"]');
    await page.waitForFunction(() => document.querySelector('div[data-state]').dataset.state === "collapsed");
    assert.equal(await articles(), 2);
    assert.equal(await page.$eval(input, (el) => el.value), "متن ذخیره‌شده");
    if (width > 390) assert.equal(await page.evaluate(() => document.activeElement.id), "zitech-chat-question");
    else assert.notEqual(await page.evaluate(() => document.activeElement.id), "zitech-chat-question", "Collapse releases the mobile keyboard");
    richNext = true;
    await page.click(input); await enabled();
    await page.keyboard.press("Enter");
    if (label === "desktop") {
      await page.click('button[aria-label="جمع‌کردن گفتگو"]');
      await page.waitForFunction(() => document.querySelector('div[data-state]').dataset.state === "collapsed");
    }
    await page.waitForFunction(() => document.querySelectorAll("#zitech-chat article").length === 4);
    if (label === "desktop") {
      assert.equal(await page.$eval(dock, (el) => el.dataset.state), "collapsed", "A pending response must not reopen collapsed chat");
      await page.click(input);
    }
    assert.equal(requests.at(-1).newConversation, false);
    assert.equal(await page.$("#zitech-chat script"), null);
    assert.equal(await page.evaluate(() => window.__unsafe), undefined);
    assert.ok(await page.$("#zitech-chat pre code"));

    failNext = true;
    await page.type(input, "یک پیام دیگر"); await enabled(); await page.keyboard.press("Enter");
    await page.waitForSelector(`${form} [role="alert"]`);
    assert.equal(await page.$eval(input, (el) => el.value), "یک پیام دیگر");
    assert.equal(await articles(), 4);
    await page.evaluate(() => [...document.querySelectorAll('button')].find((el) => el.textContent === "گفتگوی تازه").click());
    await page.waitForFunction(() => document.querySelectorAll("#zitech-chat article").length === 0);
    longNext = true;
    await page.type(input, "پاسخ طولانی"); await enabled(); await page.keyboard.press("Enter");
    await page.waitForFunction(() => document.querySelectorAll("#zitech-chat article").length === 2);
    await page.waitForFunction(() => { const el = document.querySelector("#zitech-chat"); return el.scrollTop + el.clientHeight >= el.scrollHeight - 2; });
    assert.ok(await page.$eval("#zitech-chat", (el) => el.scrollHeight > el.clientHeight));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.keyboard.press("Escape");
    assert.equal(await page.$eval(dock, (el) => el.dataset.state), "collapsed");
    await page.click(input);
    // Simulate VisualViewport keyboard resize without moving the document.
    if (width === 390) {
      await page.evaluate(() => { Object.defineProperty(visualViewport, "height", { configurable: true, value: 420 }); visualViewport.dispatchEvent(new Event("resize")); });
      assert.ok(await page.$eval(form, (el) => el.getBoundingClientRect().bottom <= 420));
      await page.waitForFunction(() => { const el = document.querySelector("#zitech-chat"); return el.scrollTop + el.clientHeight >= el.scrollHeight - 2; });
      await screenshot("mobile-keyboard");
      await page.click('button[aria-label="جمع‌کردن گفتگو"]');
      assert.equal(await page.$eval(dock, (el) => el.dataset.state), "collapsed");
      assert.ok(await page.$eval(form, (el) => el.getBoundingClientRect().bottom <= 420));
      await page.evaluate(() => { delete visualViewport.height; visualViewport.dispatchEvent(new Event("resize")); });
      await page.click(input);
    }
    console.log(`${label}: idle, focus, RTL, input, history, error, scroll and collapse passed`);
  }
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  assert.equal(await page.$eval(form, (el) => getComputedStyle(el).animationName), "none");
  const reducedWidth = await page.$eval(form, (el) => el.getBoundingClientRect().width);
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
  await page.waitForFunction(() => scrollY > 0);
  assert.equal(await page.$eval(form, (el) => el.getBoundingClientRect().width), reducedWidth, "Reduced motion disables scroll resizing");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  // A real Next Link navigation must preserve the shared-layout controller.
  // Keep the touch emulation mode: changing isMobile forces a Puppeteer reload.
  await page.setViewport({ width: 1440, height: 1000, hasTouch: true, isMobile: true });
  const reducedHeaderWidth = await page.$eval(".site-header__bar", (el) => el.getBoundingClientRect().width);
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
  await page.waitForFunction(() => scrollY > 0);
  assert.equal(await page.$eval(".site-header__bar", (el) => el.getBoundingClientRect().width), reducedHeaderWidth, "Reduced motion disables header contraction");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.evaluate(() => { window.__navigationSentinel = true; });
  const route = await page.$$eval('a[href^="/"]', (links) => links.find((el) => el.getAttribute("href") !== "/" && !el.getAttribute("href").includes("#"))?.getAttribute("href"));
  assert.ok(route, "Expected a site navigation link");
  await page.evaluate((href) => document.querySelector(`a[href="${href}"]`).click(), route);
  await page.waitForFunction((href) => location.pathname === href, {}, route);
  assert.equal(await page.evaluate(() => window.__navigationSentinel), true, "Client navigation must not reload the document");
  assert.equal(await articles(), 2, "Conversation survives page navigation");
  await page.evaluate(() => { document.body.style.background = "#19171c"; });
  await screenshot("dark-background");
  // Verify rendered pixels: compositing must actually blur the page, not just
  // expose backdrop-filter declarations inside an isolated opacity group.
  await page.evaluate(() => {
    const pattern = document.createElement("div"); pattern.id = "blur-fixture";
    pattern.style.cssText = "position:fixed;inset:0;z-index:50;pointer-events:none;background:repeating-linear-gradient(90deg,#151515 0 4px,#fff 4px 8px)";
    document.body.append(pattern);
  });
  async function contrastAt(y) {
    const png = Buffer.from(await page.screenshot({ clip: { x: 40, y, width: 160, height: 10 } })).toString("base64");
    return page.evaluate(async (data) => {
      const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
      const canvas = document.createElement("canvas"); canvas.width = image.width; canvas.height = image.height;
      const context = canvas.getContext("2d"); context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const values = Array.from({ length: pixels.length / 4 }, (_, i) => pixels[i * 4]);
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      return Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length);
    }, png);
  }
  await page.click('button[aria-label="جمع‌کردن گفتگو"]');
  assert.equal(await page.$eval("#zitech-chat-suggestion", (el) => el.textContent), "شما چه خدماتی ارائه می‌دهید؟", "Reduced motion uses a static suggestion");
  assert.equal(await page.$eval("#zitech-chat-suggestion", (el) => getComputedStyle(el, "::after").display), "none");
  const idleContrast = await contrastAt(984);
  await page.click(input);
  const sharpContrast = await contrastAt(160);
  const messageContrast = await contrastAt(600);
  const blurredContrast = await contrastAt(984);
  assert.ok(idleContrast > 80 && sharpContrast > 80, "Idle and upper page stay sharp");
  assert.ok(blurredContrast < idleContrast * .5, `Bottom blur must render: idle=${idleContrast}, active=${blurredContrast}`);
  assert.ok(messageContrast < idleContrast * .6, "Blur also renders behind the message area");
  await page.evaluate(() => document.querySelector("#blur-fixture").remove());
  assert.deepEqual(errors, [], "No browser exceptions");
  console.log("Chat UI and Markdown checks passed. Turnstile and DocsGPT responses were mocked.");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

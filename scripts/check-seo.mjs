import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

const output = join(process.cwd(), "out");
const origin = "https://zitechai.com";
const forbiddenOrigins = ["https://www.zitechai.com", "http://www.zitechai.com", "http://zitechai.com", "https://zitechai.pages.dev"];

if (!existsSync(output)) throw new Error("Static export not found. Run npm run build:local first.");

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === "admin" || entry.name.startsWith("_") ? [] : htmlFiles(path);
    return entry.name.endsWith(".html") && !entry.name.startsWith("404") && !entry.name.startsWith("_") ? [path] : [];
  });
}

function routeFor(file) {
  const path = relative(output, file).split(sep).join("/");
  return path === "index.html" ? "/" : `/${path.replace(/\.html$/, "")}`;
}

function content(html, attribute) {
  return html.match(new RegExp(`<meta[^>]+(?:name|property)="${attribute}"[^>]+content="([^"]*)"`, "i"))?.[1];
}

function exported(pathname) {
  const path = decodeURIComponent(pathname).replace(/^\//, "");
  return [join(output, path), join(output, `${path}.html`), join(output, path, "index.html")].find(existsSync);
}

function schemaTypes(value, types = new Set()) {
  if (Array.isArray(value)) value.forEach((item) => schemaTypes(item, types));
  else if (value && typeof value === "object") {
    if (typeof value["@type"] === "string") types.add(value["@type"]);
    if (value["@graph"]) schemaTypes(value["@graph"], types);
  }
  return types;
}

const failures = [];
const pages = new Map();
const titles = new Map();
const descriptions = new Map();
const requiredSchemas = new Map([
  ["/", ["Organization", "WebSite"]],
  ["/about", ["BreadcrumbList"]],
  ["/blog", ["BreadcrumbList"]],
  ["/chat", ["Service", "BreadcrumbList", "FAQPage"]],
  ["/erp", ["Service", "BreadcrumbList", "FAQPage"]],
  ["/marketing-automation", ["Service", "BreadcrumbList", "FAQPage"]],
  ["/voice-agent", ["Service", "BreadcrumbList", "FAQPage"]],
]);

for (const file of htmlFiles(output)) {
  const html = readFileSync(file, "utf8");
  const route = routeFor(file);
  const canonical = `${origin}${route === "/" ? "" : route}`;
  const canonicalTags = [...html.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/gi)].map((match) => match[1]);
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  const description = content(html, "description");
  const jsonLdTypes = new Set();
  const links = new Set();

  pages.set(route, { html, links });
  if (!/<html[^>]*lang="fa"[^>]*dir="rtl"|<html[^>]*dir="rtl"[^>]*lang="fa"/i.test(html)) failures.push(`${route}: missing Persian RTL document attributes`);
  if (!title) failures.push(`${route}: missing title`);
  else if (titles.has(title)) failures.push(`${route}: duplicate title with ${titles.get(title)}`);
  else titles.set(title, route);
  if (!description) failures.push(`${route}: missing meta description`);
  else if (descriptions.has(description)) failures.push(`${route}: duplicate description with ${descriptions.get(description)}`);
  else descriptions.set(description, route);
  if (canonicalTags.length !== 1 || canonicalTags[0] !== canonical) failures.push(`${route}: canonical must be exactly ${canonical}`);
  if (content(html, "og:url") !== canonical) failures.push(`${route}: Open Graph URL must match canonical`);
  if (!content(html, "og:image")?.startsWith(`${origin}/`)) failures.push(`${route}: Open Graph image must use the production origin`);
  if (!content(html, "og:title")) failures.push(`${route}: missing Open Graph title`);
  if (!/^(summary|summary_large_image)$/.test(content(html, "twitter:card") ?? "")) failures.push(`${route}: invalid Twitter card`);
  if (/noindex|nofollow/i.test(content(html, "robots") ?? "")) failures.push(`${route}: accidental noindex/nofollow`);
  if ((html.match(/<h1(?:\s|>)/gi) || []).length !== 1) failures.push(`${route}: expected exactly one h1`);
  if (forbiddenOrigins.some((value) => html.includes(value))) failures.push(`${route}: contains a redirecting or non-production origin`);

  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { schemaTypes(JSON.parse(match[1]), jsonLdTypes); }
    catch { failures.push(`${route}: invalid JSON-LD`); }
  }
  const expectedTypes = route.startsWith("/blog/") ? ["BlogPosting", "BreadcrumbList"] : requiredSchemas.get(route) ?? [];
  for (const type of expectedTypes) if (!jsonLdTypes.has(type)) failures.push(`${route}: missing ${type} structured data`);

  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (/^(?:https?:|mailto:|tel:)/i.test(href)) continue;
    const url = new URL(href, canonical);
    if (url.origin !== origin) continue;
    links.add(url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, ""));
    const target = exported(url.pathname);
    if (!target) failures.push(`${route}: broken internal link ${href}`);
    else if (url.hash && extname(target) === ".html" && !readFileSync(target, "utf8").includes(`id="${url.hash.slice(1)}"`)) failures.push(`${route}: missing anchor target ${href}`);
  }
}

const reachable = new Set(["/"]);
for (let changed = true; changed;) {
  changed = false;
  for (const route of [...reachable]) for (const link of pages.get(route)?.links ?? []) {
    if (pages.has(link) && !reachable.has(link)) { reachable.add(link); changed = true; }
  }
}
for (const route of pages.keys()) if (!reachable.has(route)) failures.push(`${route}: orphan page`);

for (const required of ["robots.txt", "sitemap.xml", "rss.xml", "llms.txt"]) {
  if (!existsSync(join(output, required))) failures.push(`missing ${required}`);
}

const robots = readFileSync(join(output, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`) || /^Disallow:\s*\/$/m.test(robots)) failures.push("robots.txt: invalid crawl or sitemap directive");
const sitemap = readFileSync(join(output, "sitemap.xml"), "utf8");
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
for (const route of pages.keys()) {
  const canonical = `${origin}${route === "/" ? "" : route}`;
  if (!sitemapUrls.has(canonical)) failures.push(`sitemap.xml: missing ${canonical}`);
}
for (const url of sitemapUrls) if (!url.startsWith(`${origin}/`) && url !== origin) failures.push(`sitemap.xml: non-production URL ${url}`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`SEO contract OK: ${pages.size} indexable pages, unique metadata, self-canonicals, schemas, sitemap, and internal links.`);

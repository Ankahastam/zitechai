import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const output = join(process.cwd(), "out");

if (!existsSync(output)) {
  throw new Error("Static export not found. Run npm run build:local first.");
}

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === "admin" || entry.name.startsWith("_") ? [] : htmlFiles(path);
    return entry.name.endsWith(".html") && !entry.name.startsWith("404") ? [path] : [];
  });
}

const failures = [];
const checks = [
  ["Persian language", /<html[^>]*lang="fa"/i],
  ["RTL direction", /<html[^>]*dir="rtl"/i],
  ["title", /<title>[^<]+<\/title>/i],
  ["meta description", /<meta[^>]+name="description"[^>]+content="[^"]+"/i],
  ["canonical URL", /<link[^>]+rel="canonical"[^>]+href="https?:\/\/[^"]+"/i],
  ["Open Graph title", /<meta[^>]+property="og:title"[^>]+content="[^"]+"/i],
  ["Open Graph image", /<meta[^>]+property="og:image"[^>]+content="https?:\/\/[^"]+"/i],
  ["Twitter card", /<meta[^>]+name="twitter:card"[^>]+content="[^"]+"/i],
];

for (const file of htmlFiles(output)) {
  const html = readFileSync(file, "utf8");
  const name = relative(output, file);
  for (const [label, pattern] of checks) {
    if (!pattern.test(html)) failures.push(`${name}: missing ${label}`);
  }
  if ((html.match(/<h1(?:\s|>)/gi) || []).length !== 1) failures.push(`${name}: expected exactly one h1`);
  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); } catch { failures.push(`${name}: invalid JSON-LD`); }
  }
}

for (const required of ["robots.txt", "sitemap.xml", "rss.xml", "llms.txt"]) {
  if (!existsSync(join(output, required))) failures.push(`missing ${required}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("SEO contract OK.");

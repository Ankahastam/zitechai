import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const contracts = {
  "site.json": ["seo", "navigation", "footer"],
  "home.json": ["seo", "hero", "approach", "capabilities", "faq"],
  "chat.json": ["seo", "hero", "channels", "features", "pricing", "faq", "finalCta"],
  "erp.json": ["seo", "hero", "problems", "modules", "flow", "reporting", "approach", "useCases", "faq", "finalCta"],
  "voice-agent.json": ["seo", "hero", "pairs", "features", "industries", "useCases", "pricing", "integrations", "faq", "finalCta"],
};

for (const [file, sections] of Object.entries(contracts)) {
  const content = JSON.parse(readFileSync(new URL(`../content/${file}`, import.meta.url), "utf8"));
  for (const section of sections) {
    assert.ok(content[section], `${file} is missing ${section}`);
  }
}

const blogDirectory = new URL("../content/blog/", import.meta.url);
const blogFiles = readdirSync(blogDirectory).filter((file) => file.endsWith(".json"));
const requiredBlogStrings = [
  "title", "slug", "excerpt", "coverImage", "category", "author",
  "publishedDate", "seoTitle", "seoDescription",
];
const slugs = new Set();

for (const file of blogFiles) {
  const post = JSON.parse(readFileSync(new URL(file, blogDirectory), "utf8"));
  for (const field of requiredBlogStrings) {
    assert.equal(typeof post[field], "string", `${file} has an invalid ${field}`);
    assert.ok(post[field].trim(), `${file} has an empty ${field}`);
  }
  assert.equal(file.replace(/\.json$/, ""), post.slug, `${file} must match its slug field`);
  assert.ok(!slugs.has(post.slug), `${file} has a duplicate slug: ${post.slug}`);
  assert.ok(Number.isFinite(post.readingTime) && post.readingTime > 0, `${file} has an invalid readingTime`);
  assert.ok(Array.isArray(post.tags), `${file} has invalid tags`);
  assert.equal(post.content?.type, "root", `${file} has invalid rich-text content`);
  assert.ok(Array.isArray(post.content?.children), `${file} has invalid rich-text children`);
  assert.ok(!Number.isNaN(Date.parse(post.publishedDate)), `${file} has an invalid publishedDate`);
  if (post.updatedDate) assert.ok(!Number.isNaN(Date.parse(post.updatedDate)), `${file} has an invalid updatedDate`);
  if (post.cta?.label || post.cta?.href) assert.ok(post.cta.label && post.cta.href, `${file} must define both CTA fields`);
  slugs.add(post.slug);
}

console.log(`Content contract OK (${Object.keys(contracts).length} pages, ${blogFiles.length} blog posts).`);

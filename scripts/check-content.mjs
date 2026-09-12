import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const contracts = {
  "site.json": ["seo", "navigation", "footer"],
  "home.json": ["seo", "hero", "approach", "capabilities", "faq"],
  "chat.json": ["seo", "hero", "channels", "features", "pricing", "faq", "finalCta"],
  "voice-agent.json": ["seo", "hero", "pairs", "features", "industries", "useCases", "pricing", "integrations", "faq", "finalCta"],
};

for (const [file, sections] of Object.entries(contracts)) {
  const content = JSON.parse(readFileSync(new URL(`../content/${file}`, import.meta.url), "utf8"));
  for (const section of sections) {
    assert.ok(content[section], `${file} is missing ${section}`);
  }
}

console.log(`Content contract OK (${Object.keys(contracts).length} files).`);

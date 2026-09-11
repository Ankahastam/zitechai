import assert from "node:assert/strict";

const response = await fetch("http://localhost:3000/voice-agent.html");
assert.equal(response.status, 200, "voice-agent page must render");

const html = await response.text();
assert.match(html, /۲۳,۰۰۰,۰۰۰ تومان/, "voice-agent page must show the 23m price");
assert.match(html, /data-voice-motion="ready"/, "voice-agent page must load its motion layer");
const useCaseSection = html.match(/<section[^>]*va-usecases-section[^>]*>/)?.[0] ?? "";
assert.match(useCaseSection, /data-surface="light"/, "use-case section must use the light surface");

const useCaseVisuals = html.match(/<figure[^>]*class="va-process"[^>]*>/g) ?? [];
assert.equal(useCaseVisuals.length, 5, "each use-case card must render a process visual");

const integrationNodes = html.match(/<li[^>]*class="va-integration-node[^\"]*"[^>]*>/g) ?? [];
assert.equal(integrationNodes.length, 4, "the integration map must render four connected systems");
assert.match(html, /data-integration-core="voice-agent"/, "the integration map must center the voice agent");
assert.match(html, /class="va-integration-cta"/, "the integration section must render its consultation CTA");

const industryImages = html.match(/<img[^>]*va-industry__image[^>]*>/g) ?? [];
assert.equal(industryImages.length, 5, "each industry card must render an illustration");

for (const image of industryImages) {
  const source = image.match(/src="([^"]+\.webp)"/)?.[1];
  assert.ok(source, "industry illustrations must use WebP");

  const imageResponse = await fetch(new URL(source, response.url));
  assert.equal(imageResponse.status, 200, `${source} must be served`);
  assert.ok((await imageResponse.arrayBuffer()).byteLength <= 150_000, `${source} must stay under 150KB`);
}

console.log("voice-agent page renders motion, 23m pricing, and five optimized industry images");

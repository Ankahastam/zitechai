# TinaCMS Content Design

## Goal

Add TinaCMS Free in Git-backed mode so approved site copy can be edited from `/admin` while the public Next.js site remains a static export with no TinaCMS runtime dependency.

## Architecture

- Store editable copy in `content/site.json`, `content/home.json`, `content/chat.json`, and `content/voice-agent.json`.
- Keep markup, CSS classes, animation, icons, component structure, and form behavior in source code.
- Import JSON directly during the Next.js build. Metadata and FAQ JSON-LD use the same imported objects as visible content.
- Build the static Tina admin before `next build`. TinaCloud writes edits to GitHub; Cloudflare Pages rebuilds the `out/` directory from the commit.
- Use Tina's local build mode for credential-free local verification. Production builds require `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` in Cloudflare Pages.

## Scope

- Editable: page copy, service descriptions, pricing text, FAQ, CTA labels, navigation, footer, and SEO metadata.
- Not editable: DOM structure, classes, animations, icon choices, interaction labels and validation/error behavior.
- Not included: Visual Editing, Tina data fetching in the public site, D1, KV, databases, custom admin, or runtime CMS requests.

## Safety

- Preserve all existing approved and visibly marked placeholder copy verbatim during migration.
- Disable create/delete actions for the four single-document collections.
- Keep JSON-LD serialization escaped for `<`.
- Validate content shape with Tina audit, TypeScript, lint, and a complete static build.

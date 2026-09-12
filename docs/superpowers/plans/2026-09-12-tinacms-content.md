# TinaCMS Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Git-backed TinaCMS editor for all approved Z-Tech marketing content without adding any public runtime CMS dependency.

**Architecture:** Four single-document JSON collections are edited by TinaCMS and imported directly by Server Components at build time. The Tina admin is generated as static assets before Next.js exports the site.

**Tech Stack:** Next.js 16.3.2, React 19.2.8, TinaCMS, TypeScript, Cloudflare Pages static export

**Spec:** `docs/superpowers/specs/2026-09-12-tinacms-content-design.md`

## Global Constraints

- Persian-first, `lang="fa"`, RTL, accessible and SEO-safe.
- Preserve approved copy verbatim and keep unverified placeholders visibly marked.
- Keep markup, styling, animations, icons, and components in code.
- No Visual Editing, D1, KV, database, custom admin, or public TinaCMS runtime request.

---

### Task 1: Content contract and JSON documents

**Files:**
- Create: `scripts/check-content.mjs`
- Create: `content/site.json`
- Create: `content/home.json`
- Create: `content/chat.json`
- Create: `content/voice-agent.json`
- Modify: `package.json`

**Interfaces:**
- Produces: four parseable single-document JSON files consumed by pages and Tina schemas.

- [ ] Add `check:content` that reads all four documents and asserts their required top-level sections.
- [ ] Run `npm run check:content` and confirm it fails because the documents do not exist.
- [ ] Add the four JSON documents by moving existing copy verbatim.
- [ ] Run `npm run check:content` and confirm it passes.

### Task 2: TinaCMS static admin

**Files:**
- Create: `tina/config.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.env.example`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: the four JSON documents from Task 1.
- Produces: `/admin` static assets and four restricted Tina collections.

- [ ] Install `tinacms` and `@tinacms/cli` with npm.
- [ ] Define four JSON collections with create/delete disabled and fields matching each document.
- [ ] Add production `build`, credential-free `build:local`, and Tina-backed `dev` scripts.
- [ ] Document `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, and branch configuration in `.env.example`.
- [ ] Ignore generated admin assets but keep `tina/tina-lock.json` tracked.
- [ ] Run Tina local audit/build and resolve schema errors.

### Task 3: Build-time content consumption

**Files:**
- Create: `src/content.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/chat/page.tsx`
- Modify: `src/app/voice-agent/page.tsx`
- Modify: `src/components/hero.tsx`
- Modify: `src/components/approach.tsx`
- Modify: `src/components/capabilities.tsx`
- Modify: `src/components/capability-figure.tsx`
- Modify: `src/components/faq-data.ts`
- Modify: `src/components/faq-section.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/components/mobile-navigation.tsx`

**Interfaces:**
- Consumes: typed JSON exports from `src/content.ts`.
- Produces: unchanged rendered markup sourced from JSON at build time.

- [ ] Export the four JSON documents from a Tina-free content module.
- [ ] Replace component-local marketing copy and arrays with JSON imports while preserving structure and icons.
- [ ] Generate route metadata and FAQ JSON-LD from the same JSON objects used for rendering.
- [ ] Run `npm run check:content`, `npm run typecheck`, and `npm run lint`.

### Task 4: Static export verification

**Files:**
- Verify: `out/`
- Verify: `public/admin/`

**Interfaces:**
- Consumes: complete Tina and Next configuration.
- Produces: deployable Cloudflare Pages static output.

- [ ] Run `npm run build:local` and require exit code 0.
- [ ] Confirm `/`, `/chat`, `/voice-agent`, `/admin/index.html`, `robots.txt`, and `sitemap.xml` exist in `out/`.
- [ ] Confirm rendered HTML contains JSON-backed metadata and escaped FAQ JSON-LD.
- [ ] Review `git diff` for unrelated or source-of-truth document changes.

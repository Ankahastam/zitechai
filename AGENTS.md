# Z-Tech Project Instructions

## Read before working

- Read `docs/project-context.md` and `docs/implementation-plan.md` first.
- For visual work, read `docs/design-system.md`; it is the brand source of truth.
- For interaction and refinement, consult `docs/apple-design-system.md` selectively.
- For copy or information architecture, read `docs/content-structure.md`; do not rewrite approved content without explicit instruction.

## Non-negotiable requirements

- This is a Persian-first website. Default to `lang="fa"` and RTL layouts.
- Never invent company facts, customers, testimonials, statistics, outcomes, certifications, or claims. Keep unverified placeholders visibly marked.
- Treat Persian typography, intentional mobile layouts, accessibility, SEO, and performance as completion requirements.
- Prefer typography, whitespace, hierarchy, and composition over generic AI/SaaS decoration.
- Prefer React Server Components. Use the smallest possible Client Component boundary only when interaction requires it.
- Avoid unnecessary dependencies, abstractions, folders, and client JavaScript.
- Preserve semantic DOM order and use logical CSS properties for RTL where practical.

## Scope

- Do not start a new implementation phase unless the user requests it.
- Do not modify the three source-of-truth documents unless explicitly asked.
- Run the smallest relevant validation after changes and report unresolved placeholders or source conflicts.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

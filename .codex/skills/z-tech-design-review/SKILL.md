---
name: z-tech-design-review
description: Review or refine Z-Tech UI for brand fidelity, Persian RTL quality, interaction craft, responsiveness, accessibility, and performance.
---

# Z-Tech design review

Use this skill when implementing or reviewing a visible interface.

1. Read `docs/design-system.md`, `docs/apple-design-system.md`, and the relevant section of `docs/content-structure.md` before judging the UI.
2. Check source fidelity first: no invented claims or content, and brand choices follow the design system.
3. Review the real Persian UI at mobile and desktop widths for RTL flow, typography, hierarchy, whitespace, reading order, and touch targets.
4. Review interaction states: immediate feedback, spatially consistent motion, keyboard/focus behavior, and reduced-motion alternatives. Add sophisticated gesture physics only when the interaction actually needs them.
5. Check semantic structure, contrast, text scaling, image alternatives, metadata, layout stability, font loading, image sizing, and client-JavaScript cost.
6. Fix the smallest root cause that resolves each confirmed issue; do not add decorative effects or dependencies as a substitute for composition.


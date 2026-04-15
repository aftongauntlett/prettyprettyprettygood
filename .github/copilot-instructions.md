# prettyprettyprettygood — Copilot Instructions

This file is the source of truth for this project. Read it before writing any code.

---

## Project Purpose

Volunteer web design service for nonprofits and mission-driven organizations. All work is free. Solo developer. Built with care and intentionality — not haste. Every decision should reflect that.

---

## Tech Stack

- [Astro](https://astro.build): Static site framework. Prefer Astro components over framework components unless interactivity specifically requires otherwise.
- TypeScript (strict mode): All code is typed. No `any`. Props interfaces are defined for every component.
- Vanilla CSS with custom properties: No CSS frameworks. All values derive from `src/styles/tokens.css`.
- [Resend](https://resend.com): Transactional email delivery for the contact flow via `api/contact.ts`.
- [Vercel](https://vercel.com): Deployment platform.

---

## Component Rules

- Every UI pattern that appears more than once **must be a component**.
- Components live in `src/components/` and are named in **PascalCase** (e.g., `CardProject.astro`).
- **No inline styles.** Use CSS custom properties and classes from `global.css` only.
- Props interfaces must be defined for every component using TypeScript.
- Layout components live in `src/layouts/`.

---

## Accessibility Rules

This project targets **WCAG 2.2 AA minimum**, aiming for AAA where practical.

- Every `<img>` needs a descriptive `alt` attribute. Decorative images use `alt=""`.
- Every interactive element needs a **visible focus state** — never remove `:focus-visible`.
- **Semantic HTML is non-negotiable.** Use the correct element for the job.
  - `<button>` for actions, `<a>` for navigation
  - `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`, `<article>` — use them
  - No `<div>` or `<span>` where a semantic element exists
- ARIA attributes only when native HTML semantics are insufficient.
- Color contrast must pass WCAG AA (4.5:1 for normal text, 3:1 for large text).
- The `<SkipToContent />` component must be present on every page via `BaseLayout.astro`.

---

## Performance Rules

Target **Lighthouse 100** across all four categories.

- No render-blocking resources.
- All images use Astro's built-in `<Image />` component from `astro:assets`.
- Fonts are self-hosted in `/public/fonts/` with `font-display: swap` in `@font-face`.
- No unused CSS or JS shipped to the client.
- No client-side JS unless the feature genuinely requires it.
- Prefer `loading="lazy"` and `decoding="async"` on all below-the-fold images.

---

## SEO Rules

- Every page has a unique `<title>` and `<meta name="description">` — passed as props to `BaseLayout.astro`.
- Sitemap is generated via `@astrojs/sitemap` — configured in `astro.config.mjs`.
- `public/robots.txt` must be present.
- Open Graph meta tags on every page (`og:title`, `og:description`, `og:image`, `og:url`).
- Twitter Card meta tags on every page.
- Canonical URL on every page.

---

## CSS / Design Token Rules

- All values (colors, spacing, type, radius, shadow, z-index, transitions) come from `src/styles/tokens.css`.
- `global.css` imports `tokens.css` and is imported once in `BaseLayout.astro`.
- **Before using a new visual value in a component, define it as a token in `tokens.css` first.**
- No magic numbers in component styles. If you need `1.5rem`, there's a `--space-6` for that.

---

## Code Style

- TypeScript strict mode (`"extends": "astro/tsconfigs/strict"` in `tsconfig.json`).
- No `any` types.
- Props interfaces defined for every component.
- Prefer Astro components (`.astro`) over framework components unless interactivity requires it.
- Component files: PascalCase. Style files: kebab-case. Page files: kebab-case.

---

## When to Stop and Ask

If a task requires:

- A new design token or visual pattern not already in `tokens.css` or `global.css` → **define it there first**, then use it.
- A new third-party dependency → **ask before adding**.
- A layout or component pattern that has broader implications → **ask before implementing**.
- Any content decision (copy, imagery, structure) → **ask**.

---

## Error Handling and Code Quality

- **Never silence, ignore, or disable errors or warnings.** All type errors, lint errors, and test failures must be properly fixed, even if unrelated to the current change.
- Do not use `// eslint-disable`, `// @ts-ignore`, or similar comments to suppress errors.
- Always use reusable components for repeated UI patterns.
- Always use design tokens from `tokens.css` for all visual values—never hard-code CSS values.
- All code must pass strict TypeScript, lint, and test checks before merging or deploying.

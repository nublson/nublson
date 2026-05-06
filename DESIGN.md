---
version: alpha
name: Nubelson Fernandes
description: Neutral, editorial personal site — shadcn radix-nova on Geist. Content from Notion; UI is calm typography and generous whitespace.
colors:
  primary: "#252525"
  secondary: "#8e8e8e"
  tertiary: "#b5b5b5"
  neutral: "#ffffff"
  on-primary: "#fafafa"
  muted-surface: "#f7f7f7"
  border: "#ebebeb"
  destructive: "#dc2626"
typography:
  display-xl:
    fontFamily: Geist Sans
    fontSize: 6.25rem
    fontWeight: 600
    lineHeight: 1.2em
    letterSpacing: "-0.05em"
  display-lg:
    fontFamily: Geist Sans
    fontSize: 5rem
    fontWeight: 600
    lineHeight: 1.2em
    letterSpacing: "-0.03em"
  title-md:
    fontFamily: Geist Sans
    fontSize: 2rem
    fontWeight: 600
    lineHeight: 1.6em
    letterSpacing: "-0.02em"
  body-lg:
    fontFamily: Geist Sans
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6em
    letterSpacing: "-0.02em"
  body-md:
    fontFamily: Geist Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6em
    letterSpacing: "-0.02em"
  body-sm:
    fontFamily: Geist Sans
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6em
    letterSpacing: "-0.02em"
  mono-sm:
    fontFamily: Geist Mono
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5em
rounded:
  sm: 6px
  md: 8px
  lg: 10px
spacing:
  xs: 12px
  sm: 16px
  md: 20px
  lg: 60px
  section: 60px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 10px
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 10px
  button-outline:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 10px
  card-content:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
---

## Overview

This is the visual identity for **nublson-v3**, a portfolio and blog. The experience should feel like a **quiet editorial surface**: strong typographic hierarchy, a strictly **neutral grayscale palette**, and **no decorative noise**. Content (case studies, posts, bio copy) comes from **Notion**; the shell must stay out of the way and let long-form text and images read clearly.

**Brand posture:** expert, approachable, craft-focused — closer to a design-engineering journal than a marketing landing page.

**Stack note:** React Server Components, Tailwind CSS 4, shadcn/ui (*radix-nova*, base *neutral*), `next-themes` for light/dark. Tokens in `src/app/globals.css` use **OKLCH**; the hex values in the front matter above are **sRGB companions** for tooling and agents. Dark mode inverts contrast while preserving the same structure (see Colors).

## Colors

The palette is **achromatic**: no brand hue; emphasis comes from weight and size instead of color.

- **Primary (`#252525`):** Main ink — headlines, default button fills, and strong emphasis in light mode. Maps to semantic `--primary` / `--foreground` patterns in code.
- **Secondary (`#8e8e8e`):** Supporting text — metadata, captions, secondary navigation. Maps to **muted** foreground usage.
- **Tertiary (`#b5b5b5`):** De-emphasized chrome — dividers, inactive hints, subtle borders when a heavier border is too loud.
- **Neutral (`#ffffff`):** Page canvas and card surfaces in light mode (`--background`, `--card`).
- **On-primary (`#fafafa`):** Text and icons on primary-colored surfaces (e.g. filled buttons).
- **Muted surface (`#f7f7f7`):** Hover and subtle fills (`--muted`, `--secondary` family).
- **Border (`#ebebeb`):** Hairline structure (`--border`, `--input`).
- **Destructive (`#dc2626`):** Errors and dangerous actions only — never for decoration.

**Dark mode:** Background approaches deep neutral charcoal; foreground and primary **swap roles** so primary surfaces read as light-on-dark. Never introduce a saturated accent color for CTAs — interaction states use **opacity**, **muted fills**, and **focus rings**, not new hues.

## Typography

**Geist Sans** is the single voice for UI and editorial content; **Geist Mono** is optional for code snippets or technical labels.

- **Display (`display-xl` / `display-lg`):** Hero names and major section titles — tight negative tracking, semibold, large responsive jumps (mobile vs. desktop). Implemented via `Typography` variants `h1`–`h2` in `src/components/typography.tsx`.
- **Title (`title-md`):** Subheads and list titles (`h3`–`h4` variants).
- **Body (`body-lg` / `body-md` / `body-sm`):** Default reading text uses **`body-md`**; intros and comfortable long-form can step up to **`body-lg`**. Metadata and compact UI use **`body-sm`**.

**Rules:** Prefer **`text-muted-foreground`** for secondary copy instead of lowering opacity on body text. Do not mix third-party display fonts — consistency matters more than novelty.

## Layout

- **Content width:** Primary column is **`max-width: 840px`**, centered — the `.wrapper` class in `globals.css`. This keeps line length readable for articles and case studies.
- **Horizontal padding:** **`px-5`** (20px) on small screens so text never touches the viewport edge.
- **Vertical rhythm:** Section stacks use **~60px** gaps (`gap-[60px]` on main, hero sections) so blocks breathe; within sections, use **16–24px** between related elements.
- **Header:** Logo, primary nav, social icons, theme toggle — single horizontal row with vertical separators; keep density **compact** so content owns the fold.

## Elevation & Depth

This system avoids heavy drop shadows. Depth is communicated through:

- **Subtle borders** (`border` token) and **flat layered surfaces** (card vs. page background).
- **Focus rings** — `outline` using the **ring** color (`--ring`) for keyboard and skip-link visibility (WCAG-friendly).
- **Skip link** on focus: light shadow only to lift the link above the page — see `.skip-link:focus-visible` in `globals.css`.

Do not stack multiple shadow levels or use glassmorphism; it fights the neutral, print-like tone.

## Shapes

- **Base radius:** **10px** (`--radius` / `rounded-lg`) for buttons, inputs, and cards — soft but not pill-shaped.
- **Scale:** Smaller controls may use **`rounded-md`** (8px) or **`rounded-sm`** (6px) from the token scale.
- **Media:** Cover and thumbnail images use **`rounded-lg`** to match cards; full-bleed heroes may stay square if the crop demands it.

## Components

- **Primary button:** Filled **`primary`** background, **`on-primary`** label, **`rounded-lg`**, compact height (~32px default size in `button` component). Hover darkens slightly via opacity (`bg-primary/80`), not a new color.
- **Outline / ghost:** Use for secondary actions — **`neutral`** or transparent surface, **`primary`** or **`foreground`** text, visible border only when the outline variant requires separation from the background.
- **Cards and lists:** Prefer **border + subtle background** over shadows; titles use **accent-foreground** / semibold patterns per existing sections.
- **Navigation:** Text links and icons use **`muted-foreground`** default and **`foreground`** on hover — no underline on nav unless it is a content link inside prose.

## Do's and Don'ts

**Do**

- Reserve **destructive** color for real errors or irreversible actions.
- Keep **one column** for reading flows; use grids only for project cards or comparable summaries.
- Respect **focus-visible** styles for every interactive control.
- Let **Notion-driven content** use the shared **`Typography`** and content-block components so RSS/HTML stay visually aligned.

**Don't**

- Add a rainbow accent or gradient hero — it breaks the neutral system.
- Shrink body text below **`body-sm`** for main articles.
- Use loud shadows or neon focus rings.
- Hard-code pixel widths outside the **`wrapper`** / grid patterns already in the repo.

## Appendix: Implementation and codebase

This appendix is **not** part of the DESIGN.md visual spec; it documents how the product is built for contributors.

**Architecture:** Next.js 16 App Router, Notion API via `src/services/notion.tsx`, ISR + `revalidateTag("notion-blocks")`, `POST /api/revalidate` with `REVALIDATION_SECRET`. Content filters: **Media** (`Blog` | `Project`), **State** = **Done**, sort by **Publish Date**.

**Repository:** `src/app/` routes; `src/components/` shared UI; `components.json` shadcn config; path alias `@/*` → `src/*`.

**SEO:** RSS under `/feed.xml`, section feeds, `sitemap.ts`, JSON-LD components for posts and site.

**Commands:** `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm lint`, `pnpm type-check`. Environment variables are listed in `.env.example`.

**Further reading:** [DESIGN.md format spec](https://github.com/google-labs-code/design.md) (Google Labs). Validate this file with `npx @google/design.md lint DESIGN.md`.

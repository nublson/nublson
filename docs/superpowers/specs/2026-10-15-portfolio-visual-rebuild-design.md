# Portfolio visual rebuild

Date: 2026-10-15
Status: Approved direction (mockup v4), pending spec review
Mockup: https://claude.ai/artifact/PeTjoxQ2hoVqGzZLcxDWz3

## Goal

Rebuild the look of nublson.com as a quiet, text-first design engineer portfolio, based on the seven
portfolios in the Purl "Design Engineers" folder (Rauno Freiberg, Emil Kowalski, Jakub Krehel,
Paco Coursey, Shu Ding, Benji Taylor, Raphael Salaja) and on Gustavo Fior's project rows.

This is a visual rebuild only. Routes, data flow, Notion service layer, Suspense boundaries, SEO,
RSS, agent discovery, reactions, view counts, speech mode and Purl save keep working as they do now.

## Principles taken from the references

- One reading column, about 640px.
- Hierarchy from weight and gray, not size. Almost everything is 14px.
- Small muted section labels with a quiet "All" link on the right.
- Lists, not cards. Projects are icon + title + one-line description; writing is title + date,
  in the same row style everywhere; only the full archive adds a year column.
- Neutral colors, no accent color.
- Motion is a detail: a short staggered entrance and color-only hovers.

## Foundation

### Tokens (`src/app/globals.css`)

| Token | Light | Dark |
|---|---|---|
| `--background` | `#fafafa` | `#111111` |
| `--foreground` | `#171717` | `#ededed` |
| secondary text (`--muted-foreground` becomes body gray) | `#525252` | `#a1a1a1` |
| tertiary text (labels, dates, descriptions) | `#717171` (oklch 0.55, 4.65:1) | `#8c8c8c` (oklch 0.64, 5.61:1) |
| `--border` (hairlines) | `#ebebeb` | `#222222` |
| tile fill / tile ring | `#f0f0f0` / `#e5e5e5` | `#1a1a1a` / `#2a2a2a` |
| row hover fill | `#f2f2f2` | `#1a1a1a` |

Tokens stay in oklch in the real file. The shadcn token names are kept so `ui/` primitives keep working;
a new `--subtle-foreground` covers the tertiary gray.

### Type

- Body/UI: Inter via `next/font/google`, 14px / 22px, `cv11` and `ss01` on, tabular numerals on dates.
- Display: Newsreader via `next/font/google`, weight 500. Used only for the name on Home, page
  titles (20px / 26px) and article titles (28px / 34px, 24px on phones).
- Article body: 15px / 26px, max about 64ch. In-body `h2` is 15px sans, weight 600.
- Geist Sans is removed (Geist Mono stays for code). `Typography` variants are rewritten to this scale (`h1` article title, `h2` page
  title, `h3` in-body heading, `regular` 14px, `small` 13px for meta).

### Layout

- `.wrapper` becomes `max-w-[672px]` (640px column plus 16px gutters).
- Page vertical rhythm: 56–64px between sections on desktop, 48px on phones.

### Motion

- Entrance: each top-level block of a page fades in from 6px below with a 2px blur, 500ms,
  `--ease-out`, 60ms stagger. CSS only, server-rendered pages stay readable without JS.
- Hovers: color and background-color only, 150ms. No scaling except a 0.96 press on reaction buttons.
- `prefers-reduced-motion` turns entrance and transitions off (existing global rule stays).
- A dedicated micro-interactions pass comes later (see Open items).

## Components

| Component | Change |
|---|---|
| `Header` | 24px logo left, 28px ghost theme toggle right. No nav. |
| `Footer` | One row: `© 2026 Nubelson Fernandes` left, About · Gears · Agents · RSS right, 14px muted. No separator. |
| `HomeHero` / `Hero` | Name in serif 20px, "role · location" in tertiary gray, bio in secondary gray. No 100px headline, no 📍 emoji. |
| `SectionHeader` / `SectionWrapper` | Muted 14px label left, "All" link right. No separator, no large heading. |
| `ProjectItem` | Row grid `20px 1fr`: 20px icon tile (5px radius, inset 1px ring), title weight 500, description one line in tertiary gray below. Row gets hover fill with 8px radius and -10px side bleed. No cover image. |
| `PostList` (replaces `PostItem` rows) | One row style for every list of posts: title left, date right in tertiary gray, hairlines between rows and above/below the list, hovering a row dims its siblings. `groupByYear` prop: on the Writing index posts are grouped with the year in a 64px left column and dates as `dd/mm`. On Home "Writing" and article "More posts" there is no year column (it would hold one value and push titles off the section's left edge); dates show `dd/mm` for the current year and `dd/mm/yy` otherwise. |
| Projects / Gears index | Full list of `ProjectItem` rows. Gears grouped by category with muted labels. |
| About | Serif page title, Notion body as prose, "Elsewhere" list with favicon rows. |
| Article (`/writings/[slug]`, `/projects/[slug]`) | "← Writing" (or "← Projects") back link, serif title, meta line (date · category), description as lede, cover image (10px radius, inset ring), body, the existing floating reactions pill (views, like/dislike, listen, Purl, share) restyled through tokens only, then **More posts** (three latest, excluding current) as a `PostList`. |
| Content blocks | Re-pointed to the new type scale; headings smaller, paragraphs 15px, callouts use tile fill. |
| Skeletons | Rebuilt to match the new row shapes. |

### Favicon links

Every external link to a known profile renders as `[favicon] Label`: 13px icon, weight 500, no
underline, opacity hover. Applies to inline prose links (bio, About) and the About "Elsewhere" list.

- Social profiles (GitHub, YouTube, Instagram) use local SVG marks driven by `src/data/social.json`.
- Links inside Notion rich text get a favicon when the domain matches a known profile; other
  external links keep the underlined style. (Generic favicon fetching for any domain is out of scope.)

## Data

- `PostMetadata` gains `icon?: { type: "emoji"; value: string } | { type: "image"; src: string }`,
  read from the Notion page icon in `formatPostMetadata`.
  - `emoji` → used as is.
  - `external` → URL used as is.
  - `file` (and `custom_emoji` with a file URL) → `buildNotionImageProxyUrl({ resource: "icon", id, v })`,
    because uploaded file URLs expire.
- `NotionImageResource` gains `"icon"`; `/api/notion-image` resolves it from `page.icon`.
- Fallback when no icon: square crop of the cover thumbnail; with no cover either, a monogram tile.

## Not changing

Routes, Notion queries and caching, `generateMetadata`, JSON-LD, RSS, OG images, markdown negotiation,
agent files, reactions API, views API, speech/audio API, Purl OAuth flow.

## Open items (decide before or during implementation)

1. **Reactions, views, Listen to post and Save with Purl placement.** All five live today in one
   sticky floating pill (`src/components/post-reactions.tsx`). Where they go in the new article layout
   is to be discussed (the mockup's footer row is one option). Until decided, the pill keeps its
   current position and behavior and only picks up the new color tokens.
2. **Micro-interactions pass.** A follow-up focused on design engineering details (press states,
   copy feedback, link hover affordances, theme toggle transition). Not part of this rebuild.

## Testing

- Unit tests: icon parsing in `formatPostMetadata` (emoji, external, file, none), proxy `"icon"`
  resource parsing, favicon link mapping.
- Update existing component tests broken by markup changes.
- `pnpm lint`, `pnpm type-check`, `pnpm test`.
- Browser check of `/`, `/projects`, `/writings`, one article, one project, `/about`, `/gears`, 404,
  in light, dark and 375px width, with and without JS.

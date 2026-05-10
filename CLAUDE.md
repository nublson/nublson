# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev            # Start development server
pnpm build          # Production build
pnpm lint           # ESLint (flat config, v9+)
pnpm type-check     # tsc --noEmit
pnpm test           # Vitest run (single pass)
pnpm test:watch     # Vitest watch mode
pnpm test:coverage  # Coverage report
```

Run a single test file: `pnpm vitest run src/utils/formatter.test.ts`

## Architecture

**Stack:** Next.js App Router · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/Radix UI · Notion as CMS

**Content source:** All content (blog posts, work/projects, page hero sections) comes from Notion via `@notionhq/client`. The service layer lives entirely in `src/services/notion.tsx`. Data is filtered by `State === "Done"` and `Media === "Blog"` or `Media === "Project"` from a single Notion database (`NOTION_DATABASE_CONTENT_ID`). A second database (`NOTION_DATABASE_GEARS_ID`) stores tools/gear items.

**Data flow:**
1. `src/services/notion.tsx` — Notion API queries, wrapped with React `cache()` for deduplication and `unstable_cache()` for server-side caching (`revalidate = 10`).
2. `src/lib/map-pool.ts` — Limits concurrent Notion block-fetching to 10 requests to avoid rate limits. Max block nesting depth: 5.
3. App route Server Components call service functions directly; no client-side data fetching.
4. Suspense boundaries + skeleton components (`src/components/skeletons/`) handle streaming.

**ISR:** `/api/revalidate` accepts a POST with `?secret=REVALIDATION_SECRET` and revalidates all blog/work paths on demand (triggered from Notion automations).

**Routing:** `[slug]` dynamic segments under `/app/blog/` and `/app/work/`. Static params generated via `generateStaticParams()` at build time.

**Component rules:**
- `src/components/content-blocks/` — Notion block renderers. These are Server Components. Never add `useEffect` or other client hooks here unless the file is explicitly marked `"use client"`.
- `src/components/ui/` — shadcn primitives. Prefer extending these over creating parallel UI components.
- `src/sections/` — Full-page-width layout sections (hero, posts, projects).
- Only five components are currently client-side: `theme-toggle`, `navigation-list`, `input-group`, `separator`, `code-block-highlight`.

**Styling:** Tailwind CSS v4 via `@tailwindcss/postcss`. Theme tokens are CSS variables in `src/app/globals.css` using oklch color space. Dark mode is class-based (`.dark`). Use `cn()` from `src/lib/utils.ts` for conditional class merging.

**Path alias:** `@/*` → `src/*`

**Testing:** Vitest + jsdom + Testing Library. Coverage excludes app routes and services (those hit real Notion APIs). Test files live alongside source files as `*.test.ts(x)`.

**SEO:** `generateMetadata()` is defined on every route. Helpers in `src/utils/metadata.ts` and `src/utils/share-metadata.ts`. RSS feeds at `/feed.xml`, `/blog/feed.xml`, `/work/feed.xml`.

## Environment Variables

Copy `.env.example` to `.env`. Required vars:

| Variable | Purpose |
|---|---|
| `BASE_URL` | Site origin URL |
| `NOTION_ACCESS_TOKEN` | Notion integration token |
| `NOTION_DATABASE_CONTENT_ID` | Blog + work posts database |
| `NOTION_DATABASE_GEARS_ID` | Gears/tools database |
| `NOTION_PAGE_HOME_ID` | Homepage hero Notion page |
| `NOTION_PAGE_ABOUT_ID` | About page Notion page |
| `NOTION_PAGE_WORK_ID` | Work section header page |
| `NOTION_PAGE_BLOG_ID` | Blog section header page |
| `REVALIDATION_SECRET` | Token for ISR webhook |

Optional: `NOTION_SLUG_PROPERTY=Slug` — if set, slug lookups use this Notion property instead of scanning all records.

## Branch Workflow

`develop` is the default integration branch. Open PRs against `develop`; `main` is for production promotion only.

# Site-wide Markdown Negotiation — Design

**Date:** 2026-08-02
**Status:** Approved
**Context:** Item 1 of the agent-readiness plan (isitagentready.com scored the site 29/100; the Content category is 0/1 because only `/blog/[slug]` and `/work/[slug]` honor `Accept: text/markdown`).

## Goal

Every HTML page on nublson.com returns a markdown representation when a client sends `Accept: text/markdown`, while browsers keep receiving HTML. The scanner specifically tests the homepage and expects `Content-Type: text/markdown`.

## Scope

Negotiated pages (new):

| Path | Markdown source |
|---|---|
| `/` | Homepage hero (Notion `NOTION_PAGE_HOME_ID`) + latest posts and latest projects as linked lists |
| `/about` | About hero + full page blocks (`NOTION_PAGE_ABOUT_ID`) via existing `blocks-to-markdown` |
| `/blog` | Blog section hero (`NOTION_PAGE_BLOG_ID`) + all published blog posts with dates/descriptions |
| `/work` | Work section hero (`NOTION_PAGE_WORK_ID`) + all published projects with dates/descriptions |
| `/gears` | Gears list as linked markdown lists, grouped as the HTML page groups them |

Already working (unchanged): `/blog/[slug]` and `/work/[slug]` via `/api/markdown/[type]/[slug]`.

Out of scope: unknown paths (normal HTML 404), feeds, API routes, HTML→markdown generic conversion.

## Architecture

**Approach chosen:** per-page markdown route + proxy rewrites (mirrors the existing PR #49 pattern). Rejected alternatives: a catch-all `/api/markdown/[[...path]]` route (forces migration of a working route for no behavioral gain) and HTML→markdown conversion in middleware (double render, DOM-fragile).

### New route: `src/app/api/markdown/pages/[page]/route.ts`

- Accepts `page ∈ {home, about, blog, work, gears}`; anything else → 400 JSON.
- Fetches the same Notion data the corresponding HTML page uses (service functions in `src/services/notion.tsx`).
- Builds markdown via new pure builder functions (see Components).
- Response headers: `Content-Type: text/markdown; charset=utf-8`, `Cache-Control: s-maxage=10, stale-while-revalidate=59`, `Vary: Accept`, and `x-markdown-tokens` (estimate: `ceil(chars / 4)`).
- `export const revalidate = 10` like the existing markdown route.

### Proxy: `src/proxy.ts`

- Add `PAGE_MARKDOWN_PATHS` map: `/` → `home`, `/about` → `about`, `/blog` → `blog`, `/work` → `work`, `/gears` → `gears`.
- When `acceptsMarkdown(request)` and the pathname is in the map, rewrite to `/api/markdown/pages/<page>`.
- Add `Vary: Accept` header on all negotiated paths (static pages and post pages) so CDNs cache HTML and markdown separately.

### Components (pure, unit-testable)

New module `src/utils/pages-to-markdown.ts` with builder functions that take already-fetched data (posts, gears, hero blocks) and return markdown strings — no Notion calls, consistent with the coverage config that excludes services. Reuses `blocksToMarkdown`/`postToMarkdown` helpers from `src/utils/blocks-to-markdown` where applicable.

## Error handling

- Invalid page param → 400 JSON (mirrors existing route's invalid-type handling).
- Notion fetch failures propagate as they do for HTML pages (Next error handling); no new retry logic.

## Testing

- Unit tests for each builder in `src/utils/pages-to-markdown.test.ts` (fixtures, no network).
- Proxy tests for new rewrites + `Vary: Accept` in the existing proxy test file (or new one alongside `src/proxy.ts`).
- Manual verification: `pnpm dev`, then `curl -H "Accept: text/markdown"` against `/`, `/about`, `/blog`, `/work`, `/gears` and a browser-style request to confirm HTML is unaffected.
- `pnpm lint`, `pnpm type-check`, `pnpm test` all pass.

## Success criteria

`curl -H "Accept: text/markdown" https://nublson.com/` returns `200` with `Content-Type: text/markdown` after deploy, and the isitagentready.com Content check passes on rescan.

# Books Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/books` (published books grouped by status) and `/books/[slug]` (one book's summary, rendered like a writing).

**Architecture:** The Notion books data source is renamed to the content database's field names, so the existing post queries (`getDatabasePageBySlug`, `getAllPublishedSlugsForStaticParams`, `getAllPublishedPostsForFeed`) read it once their `media` argument is optional. The formatter learns a select `Author` and a `status` field; the pages reuse `Hero`, `ContentSection`, `PostsSection`/`PostList` and `buildShareMetadata`.

**Tech Stack:** Next.js App Router (this repo's version — read `node_modules/next/dist/docs/` before touching route APIs), React 19, TypeScript strict, Tailwind v4, `@notionhq/client` data sources API, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-16-books-page-design.md`

## Global Constraints

- Books data source id: `7a6b03dc-5501-4554-b760-5eac931d05ed` → env `NOTION_DATABASE_BOOKS_ID`; new hero page id → env `NOTION_PAGE_BOOKS_ID`.
- Only `State = Done` books appear anywhere.
- Section order: Reading, Read, then any other status in first-seen order; a Done book with empty `Status` goes under "Read".
- Status labels drop the leading emoji: `"📙 Read"` → `"Read"`, `"📖 Reading"` → `"Reading"`.
- Row date is `Publish Date`; empty date renders nothing (no dash, no crash).
- Not in scope: reactions, view counts, `ListenButton`, "More posts", RSS, markdown negotiation (`src/proxy.ts` maps are markdown-only — leave them), MCP/A2A tools, generated OG card.
- Hybrid SSR (AGENTS.md): await hero + list in the page via `Promise.all`; no `loading.tsx`; `export const revalidate = 10`.
- Posts, projects and gears must query and render exactly as before.
- Branch `feature/books-page`, PR to `develop`. Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. A Done book with no `Status` — appears under "Read", not dropped or in an empty-titled section. (Task 2 test)
2. A book with no `Publish Date` — row shows title, no date text. (Task 3 test)
3. An unknown `/books/<slug>` — 404 page, not a 500. (Task 5 verification)
4. Notion field names drifting back (a missing `Source`/`Status`) — Notion answers 400 on unknown `filter_properties`; the books pages must be checked live after the migration, not only through unit tests. (Task 1 + Task 5 verification)
5. Existing `/writings`, `/writings/[slug]`, `/projects` unchanged after `media` became optional. (Task 6 verification)

---

### Task 1: Migrate the Notion books schema and add the Books hero page

No code. Done by Claude through the Notion connector (`notion-update-data-source`, `notion-create-pages`, `notion-fetch`), with a node script against the API only to read and verify.

**Files:**
- Modify: `.env.local` (add both env vars — gitignored, not committed)

- [ ] **Step 1: Snapshot current state.** Query the data source and save `Name → state, status` for all 11 rows to the scratchpad (`books-before.json`). Expect 8 `published`, 3 `planning`.
- [ ] **Step 2: Rename fields.** `state`→`State`, `description`→`Description`, `publish_date`→`Publish Date`, `path`→`Path`, `category`→`Category`, `author`→`Author`, `status`→`Status`. Types unchanged.
- [ ] **Step 3: Remap `State` options.** planning → `To Do`, resuming → `In Progress`, published → `Done`. Rename in place if the connector allows; otherwise add the three options, set each row from the snapshot, then remove the old options.
- [ ] **Step 4: Add `Source`** — a `url` property, left empty (the shared slug query requests it; Notion returns 400 for unknown `filter_properties`).
- [ ] **Step 5: Create the hero page** "Books" as a sibling of the Writing page (`NOTION_PAGE_BLOG_ID`'s parent), copying that page's property shape (`description` rich text). Placeholder description: "Books I've read and what I took from them." Body: one paragraph "A short note on how I pick and read books." 
- [ ] **Step 6: Verify.** Re-query with `filter: State = Done`, `filter_properties = title, Description, Publish Date, Path, Source, Category, Author, Status`. Expected: HTTP 200, 8 rows, names match the snapshot's `published` set; the other 3 rows have `State = To Do`.
- [ ] **Step 7: Env.** Add `NOTION_DATABASE_BOOKS_ID=7a6b03dc-5501-4554-b760-5eac931d05ed` and `NOTION_PAGE_BOOKS_ID=<new page id>` to `.env.local`.

Rollback: reverse the map in Steps 2–3, delete `Source` and the Books page.

### Task 2: Optional `media` in the post queries; formatter reads books

**Files:**
- Modify: `src/services/notion.tsx` (`getAllPublishedEntriesWithTimestamps`, `getAllPublishedSlugsForStaticParams`, `getAllPublishedEntriesForSitemap`, `getAllPublishedPostsForFeed`, `getDatabasePageBySlug`)
- Modify: `src/utils/formatter.ts` (`PostMetadata`, `formatPostMetadata`, new `groupBooksByStatus`)
- Test: `src/utils/formatter.test.ts`

**Interfaces:**
- Produces: in all five service functions the `media` parameter becomes `media?: keyof typeof mediaMap`, passed as `media ? mediaMap[media] : undefined` (the pattern `getDatabasePages` already uses). `getDatabasePageBySlug(databaseId, media | undefined, slug)` keeps its position so `cache()` keys stay stable.
- Produces: `PostMetadata.status: string` — `Status` select name with leading emoji/space stripped, `""` when absent.
- Produces: `formatPostMetadata` sets `author` from `Author` people (first name) **or** select name.
- Produces: `groupBooksByStatus(books: PostMetadata[]): { status: string; books: PostMetadata[] }[]` — keeps input order within a group.

- [ ] **Step 1: Write failing tests** in `formatter.test.ts` (use `makePage`):
  - `formatPostMetadata` › "reads a select Author": `Author: { type: "select", select: { name: "James Clear" } }` → `author === "James Clear"`.
  - "strips the emoji from Status": `Status: { type: "select", select: { name: "📙 Read" } }` → `status === "Read"`; `"📖 Reading"` → `"Reading"`; no `Status` → `""`.
  - `groupBooksByStatus` › "orders Reading, Read, then others": input statuses `["Read","Planned","Reading","Read"]` → group order `["Reading","Read","Planned"]`, Read group keeps input order.
  - "files an empty status under Read": `[{status:""},{status:"Read"}]` → one group `"Read"` with both, empty first.
- [ ] **Step 2: Run** `pnpm vitest run src/utils/formatter.test.ts` — expect the new tests to FAIL.
- [ ] **Step 3: Implement** the formatter changes. Strip with `/^[^\p{L}\p{N}]+/u` then `trim()`.
- [ ] **Step 4: Make `media` optional** in the five service functions; update the duplicate-slug warning to print `media ?? "all"`.
- [ ] **Step 5: Run** `pnpm vitest run src/utils/formatter.test.ts` and `pnpm type-check` — expect PASS / no errors (fix any `PostMetadata` literals the new required `status` field breaks by adding `status: ""`).
- [ ] **Step 6: Commit** `feat(books): read books through the post queries`.

### Task 3: `PostList` links to a configurable base path

**Files:**
- Modify: `src/components/post-list.tsx`, `src/sections/posts.tsx`
- Test: `src/components/post-list.test.tsx`

**Interfaces:**
- Produces: `PostList` prop `basePath?: string` (default `"/writings"`), threaded through `PostRows`; `PostsSection` gains the same optional prop and passes it down.

- [ ] **Step 1: Write failing tests:**
  - "links rows under basePath": `render(<PostList posts={posts} basePath="/books" />)` → link "Building in Public — read post" has `href="/books/a"`.
  - "renders an undated row without a date": flat list with `post("x","Draft","")` → link present, no `<time>` text (`container.querySelector("time")?.textContent === ""`).
- [ ] **Step 2: Run** `pnpm vitest run src/components/post-list.test.tsx` — basePath test FAILS.
- [ ] **Step 3: Implement** the prop.
- [ ] **Step 4: Run** the same command — PASS; existing "links each row to its post" still expects `/writings/a`.
- [ ] **Step 5: Commit** `feat(posts): let PostList link under any base path`.

### Task 4: `/books` index page

**Files:**
- Create: `src/app/books/(index)/page.tsx`
- Create: `src/app/_components/books-shelf.tsx` (`getBooks`, `BooksShelf`)
- Reuse directly: `BlogHero` and `BlogBody` from `src/app/_components/` (they take generic `PageMetadata` / blocks; no wrappers needed)

**Interfaces:**
- Consumes: `getAllPublishedPostsForFeed(process.env.NOTION_DATABASE_BOOKS_ID!)` (Task 2), `groupBooksByStatus` (Task 2), `PostsSection` with `basePath` (Task 3).
- Produces: `getBooks(): Promise<PostMetadata[]>`; `BooksShelf({ books }: { books: PostMetadata[] })` — one `PostsSection` per group, `title={status}`, `id={status.toLowerCase()}`, `basePath="/books"`, flat (no `groupByYear`), wrapped in `<div data-stream className="flex w-full flex-col gap-14">` like `GearsCategory`.

- [ ] **Step 1: Implement** `books-shelf.tsx` and the page, copying the shape of `src/app/writings/(index)/page.tsx`: `generateMetadata` via `metadataFromNotionPageId(process.env.NOTION_PAGE_BOOKS_ID!, { canonical: "/books" })`; `Promise.all([getPageData, getPageBlocks, getBooks()])`; render hero, body, shelf.
- [ ] **Step 2: Verify** with the dev server (`preview_start` "dev"): `/books` returns 200, shows the placeholder hero, one "Read" section with 8 rows newest first (Essentialism 2022-12-08 first, Atomic Habits 2021-01-13 last), each `href` starting `/books/`. No console errors.
- [ ] **Step 3: Run** `pnpm type-check` and `pnpm exec eslint src` — clean.
- [ ] **Step 4: Commit** `feat(books): add the books shelf page`.

### Task 5: `/books/[slug]` page

**Files:**
- Create: `src/app/books/[slug]/page.tsx`
- Create: `src/app/books/[slug]/_components/book-hero.tsx`

**Interfaces:**
- Consumes: `getDatabasePageBySlug(id, undefined, slug)`, `getAllPublishedSlugsForStaticParams(id)`, `getPageBlocks`, `withThumbnailBlur` (Task 2); `BlogPostBody` from `src/app/writings/[slug]/_components/blog-post-body.tsx`.
- Produces: `BookHero({ metadata }: { metadata: PostMetadata })` — `BlogPostHero` without `ListenButton`: `BackLink href="/books" label="Books"`, `ArticleMeta` with full date + category, `variant="article"`, thumbnail + blur.

- [ ] **Step 1: Implement** the page mirroring `src/app/writings/[slug]/page.tsx` minus JSON-LD, reactions, more posts and the OG card. `generateMetadata`: `buildShareMetadata({ title, description, thumbnail }, { canonical: \`/books/${slug}\`, openGraphType: "article", publishedTime, section: category })` (no `fallbackImage`, so it falls back to the default raster). Missing book → `notFound()`; metadata title "Book not found".
- [ ] **Step 2: Verify:** `/books/atomic-habits` returns 200 with cover, title, lede, date "January 13, 2021"-style meta, "Key Takeaways" heading and 4 list items; `/books/does-not-exist` returns 404; back link goes to `/books`.
- [ ] **Step 3: Run** `pnpm type-check`, `pnpm exec eslint src` — clean.
- [ ] **Step 4: Commit** `feat(books): add a page per book`.

### Task 6: Wiring, docs, env, full check

**Files:**
- Modify: `src/data/navigation.json` (footer `{ "label": "Books", "path": "/books" }` after About)
- Modify: `src/app/sitemap.ts` (`/books` static route, lastModified = max of book entries; `/books/${slug}` routes, monthly, 0.6, via `getAllPublishedEntriesForSitemap(process.env.NOTION_DATABASE_BOOKS_ID!)`)
- Modify: `src/app/api/revalidate/route.ts` (`type?: "blog" | "work" | "book"`; `"book"` → `/books/${slug}`)
- Modify: `.env.example`, `CLAUDE.md` env table (both new vars)

- [ ] **Step 1: Implement** the four edits.
- [ ] **Step 2: Vercel env.** Ask the user before adding `NOTION_DATABASE_BOOKS_ID` and `NOTION_PAGE_BOOKS_ID` to Development, Preview and Production (`vercel env add`); production builds fail without them because `generateStaticParams` queries Notion.
- [ ] **Step 3: Verify:** `/sitemap.xml` lists `/books` and 8 `/books/…` URLs; footer shows "Books"; `/writings`, one `/writings/[slug]` and `/projects` still render with the same rows as before; `curl -X POST` to `/api/revalidate?secret=…` with `{"type":"book","slug":"atomic-habits"}` returns `{ revalidated: true }`.
- [ ] **Step 4: Run** `pnpm type-check`, `pnpm exec eslint src`, `pnpm test` — all pass.
- [ ] **Step 5: Commit** `feat(books): link books from the footer and sitemap`.

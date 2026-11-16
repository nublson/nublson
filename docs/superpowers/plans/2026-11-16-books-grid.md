# Books Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `/books` rows with a cover grid (Open Library covers by ISBN, drawn fallback) and add a Books teaser to Home.

**Architecture:** `ISBN` joins the books' Notion fields and `PostMetadata`. A client `BookCover` renders the Open Library image or a drawn cover on missing ISBN / load error; a server `BookGrid` lays out cards. `/books` and Home both use `BookGrid` inside `SectionWrapper`.

**Tech Stack:** Next.js App Router, React 19, TypeScript strict, Tailwind v4, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-16-books-page-design.md` (section "Refinement: cover grid and Home teaser")

## Global Constraints

- Cover URL exactly `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`; plain `<img loading="lazy" decoding="async" alt="">` (decorative — the title is the card's text).
- Grid: 4 columns, 2 below 560px (`max-[560px]:grid-cols-2`); gap `32px 20px`; cover aspect 2/3.
- Hover lift `-translate-y-1` with `motion-reduce:transform-none`; Reading card ring `outline outline-1 outline-foreground outline-offset-[3px]` on the cover.
- Section order and grouping: `groupBooksByStatus` (unchanged).
- Home teaser: first 4 of `groupBooksByStatus(books).flatMap(g => g.books)`, section title "Books", `path="/books"`, after "Writing".
- Book pages and share images unchanged.
- Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. Open Library 404 for an ISBN (`?default=false`) — drawn cover replaces it, no broken image. (Task 2 test)
2. Book with no ISBN — drawn cover, no request to Open Library. (Task 2 test)
3. Long title ("The Subtle Art of Not Giving A F*ck") — wraps under the cover, doesn't widen the column. (Task 3 live check)
4. Home with Notion books env missing — Home must not break more than today: it already requires Notion; note only. (Task 4 verification)
5. Image already loaded/failed before hydration — `BookCover` checks `img.complete` on mount like `ProjectIconImage`. (Task 2)

---

### Task 1: Notion `ISBN` field and `isbn` in metadata

**Files:** Modify `src/utils/formatter.ts`, `src/services/notion.tsx`, `src/utils/formatter.test.ts`; Notion books data source.

**Interfaces — Produces:** `PostMetadata.isbn: string`; `bookCoverUrl(isbn: string): string` in `formatter.ts`; `BOOK_FILTER_PROPERTIES` includes `"ISBN"`.

- [ ] **Step 1: Notion.** Add `ISBN` (rich text) via the connector; set: Essentialism 9780804137386, Why We Sleep 9781501144318, The Psychology of Money 9780857197689, Hyperfocus 0525522255, The Productivity Project 9781101904039, Unshakeable 9781501164583, Atomic Habits 9780735211292, The Creative Act 9780593652886. Verify by query: 8 rows with ISBN, HTTP 200 with `ISBN` in `filter_properties`.
- [ ] **Step 2: Failing tests** in `formatter.test.ts`: "reads ISBN" (`ISBN: { type: "rich_text", rich_text: [{ plain_text: " 9780735211292 " }] }` → `isbn === "9780735211292"`; absent → `""`); "builds the Open Library cover URL" (`bookCoverUrl("9780735211292")` → the exact Global Constraints URL).
- [ ] **Step 3: Run** `pnpm vitest run src/utils/formatter.test.ts` — FAIL.
- [ ] **Step 4: Implement**; add `"ISBN"` to `BOOK_FILTER_PROPERTIES`; add `isbn: ""` to the fixtures type-check flags.
- [ ] **Step 5: Run** the test file and `pnpm type-check` — PASS. Commit `feat(books): read ISBN from Notion`.

### Task 2: `BookCover`

**Files:** Create `src/components/book-cover.tsx` (`"use client"`), `src/components/book-cover.test.tsx`.

**Interfaces — Produces:** `BookCover({ book, className }: { book: Pick<PostMetadata, "title" | "author" | "isbn">; className?: string })` — a `span` with the book shape (aspect 2/3, `rounded-[2px_4px_4px_2px]`, shadow, spine `before:` gradient on the left 8%, `after:` inset hairline `--image-outline`), containing the `<img>` (fading in via `.fade-in-image`/`data-loaded`) or the drawn cover (title, then author, `text-[10px]`/`text-[9px]`, `bg-card`, padding 8px).

- [ ] **Step 1: Failing tests:** "renders the Open Library cover" (img `src` equals `bookCoverUrl(isbn)`); "draws a cover when there is no ISBN" (no img; text has title and author); "draws a cover when the image fails" (`fireEvent.error(img)` → img gone, title shown).
- [ ] **Step 2: Run** `pnpm vitest run src/components/book-cover.test.tsx` — FAIL.
- [ ] **Step 3: Implement**, mirroring `ProjectIconImage`'s `complete`/`naturalWidth` mount check.
- [ ] **Step 4: Run** — PASS. Commit `feat(books): draw book covers from Open Library`.

### Task 3: `BookGrid` on `/books`

**Files:** Create `src/components/book-grid.tsx`, `src/components/book-grid.test.tsx`; modify `src/app/_components/books-shelf.tsx`.

**Interfaces — Consumes:** `BookCover`. **Produces:** `BookGrid({ books }: { books: PostMetadata[] })` — `ul` grid; each `li > Link href=/books/${slug}` with `BookCover`, title (`font-medium`, `mt-3.5`), author and year (`formatPostDateYear`-style: first 4 chars of `published_date`, omitted when empty) in `text-subtle-foreground`; Reading books' cover gets the ring. `BooksShelf` renders `SectionWrapper title={status} id={status.toLowerCase()}` + `BookGrid` per group (no more `PostsSection`).

- [ ] **Step 1: Failing tests:** "links each card to its book" (`href="/books/atomic-habits"`); "shows the finish year, not a date" (`2021-01-13` → "2021"); "omits the year when undated"; "rings the book being read" (status `Reading` → cover has `outline` class, `Read` doesn't).
- [ ] **Step 2: Run** `pnpm vitest run src/components/book-grid.test.tsx` — FAIL.
- [ ] **Step 3: Implement**; switch `BooksShelf`.
- [ ] **Step 4: Run** tests, `pnpm type-check`, `pnpm exec eslint src` — PASS.
- [ ] **Step 5: Live:** `/books` shows the grid, 7 covers loaded (`naturalWidth > 0`), 4 columns at 1100px and 2 at 375px; temporarily point one book's ISBN at `0000000000` in a dev-only check (or `fireEvent` in browser) to see the drawn cover; long titles wrap. Commit `feat(books): show the shelf as a cover grid`.

### Task 4: Home teaser

**Files:** Create `src/app/_components/home-books.tsx`; modify `src/app/(home)/page.tsx`, `src/components/section-header.tsx` (`"/books": "View all books"`).

**Interfaces — Consumes:** `getBooks`, `groupBooksByStatus`, `BookGrid`, `SectionWrapper`. **Produces:** `getHomeBooks(): Promise<PostMetadata[]>` (first 4 in shelf order), `HomeBooks({ books })` — returns null for an empty list.

- [ ] **Step 1: Implement** and add `getHomeBooks()` to Home's `Promise.all`, rendering `<HomeBooks>` after `<HomePosts>`.
- [ ] **Step 2: Live:** Home shows "Books" with an "All" link to `/books` and 4 cards (Essentialism, Why We Sleep, The Psychology of Money, Hyperfocus today); other Home sections unchanged.
- [ ] **Step 3: Run** `pnpm type-check`, `pnpm exec eslint src`, `pnpm test` — PASS. Commit `feat(home): add a Books teaser`.

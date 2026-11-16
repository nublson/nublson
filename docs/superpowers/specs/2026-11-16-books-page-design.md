# Books page — design

Date: 2026-11-16 · Branch: `feature/books-page` (from `develop`)

## Intent

Add a `/books` shelf to the portfolio where every book opens its own page with
the author's summary and key takeaways, the way `/writings` lists posts and
`/writings/[slug]` renders one. The summaries already exist in Notion; the page
makes them public.

## Goals

- `/books`: a hero (title, description, intro body) from a new Notion page, then
  the published books grouped by reading status.
- `/books/[slug]`: one book, rendered like a writing article — cover, title,
  description lede, meta line, Notion body (summary + key takeaways).
- Books come from the existing Notion books data source
  `7a6b03dc-5501-4554-b760-5eac931d05ed`, read through the same service path as
  posts after its fields are renamed to the content database's names.

## Non-goals

- Reading/Planned books without a summary. Only `State = Done` books appear.
- Reactions, view counts, narration (`ListenButton`), "More posts", RSS feed,
  markdown negotiation, MCP/A2A tools, OG title card. All blog-only today; can
  follow later.
- Ratings, reading progress, Goodreads-style data.

## Anti-goals

- Changing how posts, projects or gears are queried or rendered.
- A per-database field-name config layer.

## Approaches

- **A. Read the books schema as is** — own query and formatter for lowercase
  fields. No Notion changes; two field conventions in code.
- **B. Rename the books fields in Notion to match the content database (chosen)**
  — reuse `getDatabasePages` / `getDatabasePageBySlug` /
  `getAllPublishedSlugsForStaticParams`. One convention; costs a workspace
  schema change.
- C. Per-database field map — machinery for two schemas; dropped.

The user picked B.

## Notion changes (first plan step, not yet done)

Claude makes these through the Notion connector as the first step of the
plan, after this design is approved, then verifies them before writing code.
Nothing on the live site reads the books data source yet, so the rename can't
break production. Rollback: rename the fields and options back (same map,
reversed). Record each book's current `state` before the change so the
verification can compare row by row.

Books data source `7a6b03dc-…` (its title property is already `Name`, which
`formatPostMetadata` reads; no change there):

| Now | After |
|---|---|
| `state` select: planning / resuming / published | `State` select: To Do / In Progress / Done |
| `description` | `Description` |
| `publish_date` | `Publish Date` |
| `path` | `Path` |
| `category` | `Category` |
| `author` (select) | `Author` (select, unchanged type) |
| `status` (select: 📖 Reading, 🗃 Planned, 📙 Read) | `Status` |
| — | `Source` (url, empty) — added because the shared slug query requests it and Notion answers 400 on unknown `filter_properties` |

Grouping by status happens in code (`groupBooksByStatus`) on top of the
default `Publish Date` descending order, so no separate `BOOKS_SORTS` is
needed.

Value map: planning → To Do, resuming → In Progress, published → Done. After the
rename, every book keeps its state (8 Done, 3 To Do today). If renaming an
option in place is not possible through the connector, add the new options,
move each row, then drop the old ones.

New Notion page "Books" beside the Gear/Writing hero pages, with a placeholder
title, `description` property and one intro paragraph for the user to rewrite.

## How it works

**Env:** `NOTION_DATABASE_BOOKS_ID` (the data source id) and
`NOTION_PAGE_BOOKS_ID` (new hero page) in `.env.local`, `.env.example`, the
CLAUDE.md table, and Vercel (Development, Preview, Production).

**Service (`src/services/notion.tsx`):**
- `getDatabasePageBySlug` and `getAllPublishedSlugsForStaticParams` accept an
  optional `media` (books have no `Media` property); behavior for posts is
  unchanged.
- `BOOKS_SORTS`: `Status` ascending, then `Publish Date` descending.
- Books query `filterProperties`: title, `Description`, `Publish Date`,
  `Category`, `Path`, `Author`, `Status`.

**Formatter (`src/utils/formatter.ts`):** `formatPostMetadata` reads `Author`
as a select too (people stays first), and a new `status` field from the
`Status` select with its leading emoji stripped ("📙 Read" → "Read") for
section titles.

**`/books` (`src/app/books/(index)/page.tsx`):** same shape as the writings and
gears index pages — `Promise.all` of hero page, hero blocks and books; hero,
body, then one section per status. Section order: Reading, Read, then any
other status. Today all 8 Done books are "📙 Read", so the page shows one
section until a Done book is marked Reading. *Builder's call:* a Done book
with no `Status` goes under "Read". The row date is `Publish Date` (set on
every Done book today); a book without one shows no date. Rows reuse the writings `PostList` row look (title left, finish
date right), linking to `/books/[slug]`. `PostList` gets the base path as a
prop instead of hard-coding `/writings`.

**`/books/[slug]`:** mirrors `/writings/[slug]` — `generateStaticParams`,
`generateMetadata` via `buildShareMetadata` (cover as share image, falling back
to `/apple-icon.png`), hero with `BackLink` to `/books` labelled "Books", meta
line with finish date and category, cover thumbnail with blur, Notion body via
the existing body renderer. No reactions, listen button or more posts.

**Wiring:** footer link "Books" → `/books` in `src/data/navigation.json`;
`/books` and each book in `sitemap.ts`; `/books` in `src/proxy.ts`'s page map
only if that map is required for the route to resolve (check, don't add
markdown support). *Builder's call:* `/api/revalidate` accepts
`type: "book"` and revalidates `/books/${slug}`, next to `blog` and `work`.
A call with no type already revalidates the whole layout, `/books` included,
so books update even before a per-book Notion automation exists.

## Constraints

- Hybrid SSR rules from AGENTS.md: await hero + list in the page; no
  `loading.tsx`; the variable-length list is awaited, not skeletoned.
- Cover images: book covers are on `s3.amazonaws.com` (allowed today); Unsplash
  placeholders only appear on unpublished books.
- Work lands on `feature/books-page`, PR to `develop`. Independent of the gears
  PR (#114) except a one-line footer conflict.

## Left to the builder

- Component file names and whether the books hero/body reuse the blog ones
  directly or get thin `books-*` wrappers like gears.
- Tests: formatter (select author, status emoji strip) and `PostList` base path.
- Placeholder copy for the Books hero page.

## Refinement: cover grid and Home teaser (approved 2026-11-16)

Mockup picked: **A · Grid** (inspired by gustavofior.com's books page, not a
copy). Replaces the Writing-style rows on `/books`.

- **Notion:** add `ISBN` (rich text) to the books data source; fill the 7
  published books and The Creative Act with ISBNs whose Open Library covers
  were verified.
- **Data:** `BOOK_FILTER_PROPERTIES` also requests `ISBN`; `PostMetadata`
  gains `isbn` (`""` when absent).
- **`/books`:** one section per status (Reading, Read, …). Cards four across,
  three under 560px: book-shaped cover (spine crease, hairline edge, soft
  shadow), title, author, finish year. The Reading book gets a thin ring.
  Covers lift 4px on hover; no motion with `prefers-reduced-motion`. Cards
  link to `/books/[slug]`.
- **Covers:** plain lazy `<img>` from
  `https://covers.openlibrary.org/b/isbn/<isbn>-L.jpg?default=false` (not
  next/image — Open Library redirects to archive.org hosts). No ISBN, or an
  image error → a drawn cover: title and author on a muted card, same shape.
- **Home teaser:** a "Books" section after Writing with the first four books
  in shelf order (Reading first, then newest Read), the same cards, and the
  section header's "All" link to `/books` ("View all books").
- **Book pages:** unchanged (photo cover as header and share image).

Approaches: direct `<img>` from Open Library (chosen) vs. proxying through
next/image (needs redirect hosts allowlisted; little gain for ~8 small
images).

## Change: no book pages (2026-11-16)

Books won't get summaries any more, so `/books/[slug]` (page, hero, share
card), the sitemap's book URLs, the `"book"` revalidate type and `PostList`'s
`basePath` are removed. Cards link to the book's `Path` in a new tab (a book
without one is a plain card) and show no date. Books sort A to Z by title
within a status. The books query requests only the fields books use (no
`Publish Date` or `Source`), so those can be deleted in Notion.

## Change: no Home teaser (2026-11-16)

Books are reached from the footer only; the Home "Books" section is removed.

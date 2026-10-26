## Learned User Preferences

- Prefers concise explanations after code fixes with explicit verification.
- Often asks to commit immediately after confirming a change works.
- Expects feature/fix work on a short-lived branch from `develop` before implementation, then commit/PR when asked.

## Learned Workspace Facts

- Posts metadata includes Notion properties `Path` (url), `Source` (url), and `Category` (select).
- Blog article pages show the three latest posts other than the current one: `getMorePosts` queries Notion for 3 rows with a `title does_not_equal` filter (via `getDatabasePages`' `excludeTitle`), so no over-fetch or slicing.
- Repository workflow uses `develop` as the integration/default branch for feature PRs before promotion to `main`; a manual GitHub Actions `Release` workflow merges `develop` into `main`.
- Content block renderers run as server components; avoid client-only hooks like `useEffect` unless explicitly making the component client-side.
- Published date rendering should prefer Notion datetime values when present and fall back to formatter utilities.
- `getDatabasePages(databaseId, media?, limit?, sorts?, filterProperties?)` defaults to `Publish Date` descending and blog/work filter properties when overrides are omitted.
- Markdown negotiation serves blog and work posts: proxy rewrites to `/api/markdown/blog/[slug]` or `/api/markdown/work/[slug]` when `Accept: text/markdown` is present.
- Agent discovery includes proxy `Link` headers, dynamic `/llms.txt`, `/agents.txt`, `/agents.json`, AI bot rules in `robots.ts`, and static `public/.well-known/*` plus `public/auth.md`.
- Share/OG image fallbacks must be raster (e.g. `/apple-icon.png`), not SVG — Safari and many clients ignore SVG for link previews.
- Blog/work `[slug]` pages should await Notion data in the async page so article HTML renders inside `<main>` for scrapers; avoid parent `loading.tsx` skeletons on slug routes.
- Index/listing pages (`/`, `/about`, `/projects`, `/writings`, and similar): await in the page all non-list content (hero metadata + Notion page body/blocks) so it is in the initial HTML without JS. Where a list's length varies (`/projects`, `/writings`, and Home's projects), await the list too, fetched in parallel with the page via `Promise.all` — its length is unknown, so no skeleton can match it and the swap shifts the layout. Home's 4 posts and "More posts" are awaited too, so they render without JS. Use Suspense with a skeleton only for the interactive reactions row, and build its skeleton from the real row's line boxes so the swap is shift-free.
- Descriptions render as Notion rich text via `RichDescription` (links with the linked site's favicon, emphasis, blank-line paragraphs): index pages' `description` property (Home, About, Writing, Projects) and the article lede from posts' `Description` property. Project rows, feeds and metadata use the joined plain text with whitespace collapsed. Edit copy like Home's "Find me on…" line in Notion, not in code.
- Public blog view counts are lifetime unique visitors via Supabase (session cookie shared with reactions); blog-only UI; private daily uniques stay in Vercel Analytics.

## Cursor Cloud specific instructions

Standard commands live in `package.json` scripts and `CLAUDE.md` (`pnpm dev`, `build`, `lint`, `type-check`, `test`). Package manager is `pnpm` (Node 22 is the CI baseline). The update script runs `pnpm install --frozen-lockfile`, so dependencies are already installed when a session starts.

Env vars: the Notion + Supabase secrets (`NOTION_ACCESS_TOKEN`, `NOTION_DATABASE_*`, `NOTION_PAGE_*`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are provided as injected Cloud-agent secrets, so they are already in `process.env`. The one var that is **not** injected is `BASE_URL` — before running `pnpm dev`, create `.env` (gitignored) with `BASE_URL=http://localhost:3000`, otherwise every route 500s (see below). `.env` values and injected env vars are merged by Next.js.

Non-obvious runtime gotchas:

- The app does **not** degrade gracefully without env vars.
- `BASE_URL` must be a valid absolute URL: the root layout does `metadataBase: new URL(process.env.BASE_URL!)` at module load, which throws `ERR_INVALID_URL` (HTTP 500 on every route) if unset.
- All content comes from a private Notion workspace. With `BASE_URL` set but an invalid/absent `NOTION_ACCESS_TOKEN`, routes return 200 at the HTTP layer but content sections throw `401 API token is invalid` and the browser shows a hard "server error" page (no error boundary).
- Reactions use Supabase. `src/lib/supabase.ts` creates the client at module load and throws if `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are missing, so post pages (`/blog/[slug]`, `/work/[slug]`) and `/api/reactions/*` error without those vars. Core index pages do not import it. Posting a like/dislike writes to the real Supabase `post_reactions` table (dedups by session cookie + hashed IP).
- `pnpm build` calls `generateStaticParams()`, which queries Notion at build time, so a production build also needs valid Notion credentials. Use `pnpm dev` for local work.
- `pnpm test` (Vitest + jsdom) runs fully offline — coverage excludes app routes and the Notion/Supabase service layers, so no secrets are needed for the test suite, lint, or type-check.
- Link favicons come from notionic: `getPageBlocks` calls `fetchBlocks` with `linkFavicons: true` and `ContentSection` renders with `<NotionRenderer linkFavicons>`, so article-body links carry their icon in the cached blocks. Links outside page bodies (descriptions, the link preview card) go through `SiteFavicon` → `@/services/favicon`, which caches notionic's `fetchLinkFavicon`. There are no hand-drawn social icons; every external link gets its real favicon or notionic's globe.

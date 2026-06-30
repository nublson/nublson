## Learned User Preferences

- Prefers concise explanations after code fixes with explicit verification.
- Often asks to commit immediately after confirming a change works.

## Learned Workspace Facts

- Posts metadata includes Notion properties `Path` (url), `Source` (url), and `Category` (select).
- Blog article pages expect `MorePosts` to exclude the current post and show the next three latest posts.
- Repository workflow uses `develop` as the integration/default branch for feature PRs before promotion to `main`.
- Content block renderers run as server components; avoid client-only hooks like `useEffect` unless explicitly making the component client-side.
- Published date rendering should prefer Notion datetime values when present and fall back to formatter utilities.

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

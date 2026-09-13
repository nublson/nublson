# Blog View Counts — Design

**Date:** 2026-09-13  
**Status:** Approved  
**Context:** Public lifetime unique view counts on blog posts. Private daily uniques remain in Vercel Analytics.

## Goal

Show a public lifetime unique-visitor count on `/blog/[slug]` in the existing sticky reactions bar (Eye chip). Count each session at most once per post. Do not track work/project pages.

## Approach

Supabase-backed unique inserts + aggregate counter. Client beacon after mount (avoids most scraper inflation). Reuse `reaction_session_id` cookie so reactions and views share identity.

Rejected: Notion counter (races/rate limits), DIY daily series (Vercel Analytics already covers private trends), third-party sync for the public number (two systems).

## Architecture

1. Visitor opens `/blog/[slug]`.
2. `PostReactions` with `trackViews` fires `POST /api/views/[postId]` once after mount with `{ postSlug }`.
3. API resolves `reaction_session_id` (create if missing).
4. Postgres RPC `record_unique_view` inserts into `post_view_uniques`; on first insert increments `post_view_counts.views`; returns total.
5. Eye chip shows `formatCompactCount(views)`.

Work pages pass `trackViews={false}` and hide the chip.

## Data model

Apply via Supabase CLI (see [`supabase/README.md`](../../../supabase/README.md)) — migration `20260913100000_post_view_counts.sql`:

- `post_view_uniques` — PK `(post_id, session_id)`
- `post_view_counts` — PK `post_id`, columns `post_slug`, `views`, `updated_at`
- `record_unique_view(p_post_id, p_post_slug, p_session_id) returns int`

Service role client only (same as reactions). No daily tables.

## Components

| File | Responsibility |
|------|----------------|
| `src/services/views.ts` | `getViewCount`, `recordUniqueView` |
| `src/app/api/views/[postId]/route.ts` | POST; session cookie |
| `src/components/post-reactions.tsx` | `trackViews`; replace hardcoded count |
| `src/app/_components/post-reactions-loader.tsx` | Pass `trackViews={media === "Blog"}` |

## Errors

API/Supabase failure → chip shows `0`; reactions/share unaffected. Invalid body → 400.

## Testing

Unit tests for `recordUniqueView` / `getViewCount` with mocked Supabase (mirror `reactions.test.ts`). Manual: blog double-visit stable; work has no chip.

## Out of scope

Work tracking, admin dashboard, Vercel Analytics sync, bot UA denylist beyond client-only beacon.

## Success criteria

Blog posts show a real unique count that increments once per session; work posts unchanged; private analytics still via Vercel Analytics.

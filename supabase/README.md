# Supabase

Schema for reactions and blog view counts lives in versioned migrations under `migrations/`.

The Next.js app uses the **service role** key server-side only (`src/lib/supabase.ts`). Migrations grant RPC execute to `service_role`; tables use RLS with no public policies.

## One-time setup

1. Install deps (CLI is a dev dependency):

   ```bash
   pnpm install
   ```

2. Log in to Supabase (opens browser or paste an access token):

   ```bash
   pnpm supabase:login
   ```

3. Link this repo to the hosted project (`ubwmngcqwvdvcyprcdmf`):

   ```bash
   pnpm supabase:link
   ```

   This writes project metadata under `supabase/.temp/` (gitignored).

## Apply migrations to production

Push pending migrations to the linked remote database:

```bash
pnpm supabase:db:push
```

Migrations are idempotent (`if not exists` / `create or replace` / `on conflict do nothing`). Safe to re-run if you previously applied SQL manually in the dashboard.

### Troubleshooting `db push`

**`Remote migration versions not found in local migrations directory`**

The hosted project has migration history that is not in this repo (e.g. `20260512100133_create_post_reactions.sql` was applied before CLI setup). Ensure that baseline file exists locally — it is checked in here and matches the remote history.

**`Found local migration files to be inserted before the last migration on remote database`**

New migrations must use a version timestamp **after** the latest remote migration. Do not use dates earlier than `20260512100133`. If you hit this after renaming files, run:

```bash
pnpm exec supabase db push --yes
```

**Manual SQL before CLI**

If you applied SQL in the dashboard first, either run `db push` (idempotent migrations) or mark versions with `supabase migration repair --status applied <version>`.

## Local development (optional)

Requires [Docker](https://docs.docker.com/get-docker/).

```bash
pnpm supabase:start    # local Postgres + API (ports in config.toml)
pnpm supabase:status   # URLs and keys for local stack
pnpm supabase:db:reset # replay migrations + seed
pnpm supabase:stop
```

Point `.env` at local values from `supabase status` when testing reactions/views offline. Live reaction and view count updates use Supabase Realtime and require `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env`.

## Adding a new migration

1. Edit schema locally or write SQL by hand.
2. Create a migration file:

   ```bash
   pnpm supabase migration new your_change_name
   ```

3. Apply locally: `pnpm supabase:db:reset`
4. Apply to production: `pnpm supabase:db:push`

Or diff against local:

```bash
pnpm supabase:db:diff -- your_change_name
```

## Migrations

| File | Purpose |
|------|---------|
| `20260512100133_create_post_reactions.sql` | Likes/dislikes per session (remote baseline) |
| `20260913100000_post_view_counts.sql` | Lifetime unique blog view counts + `record_unique_view` RPC |
| `20260913200000_post_view_counts_realtime.sql` | Realtime + public read policy for live view count updates |
| `20260913210000_post_reactions_realtime.sql` | Realtime + public read policy for live like/dislike updates |
| `20260916120000_backfill_views_from_reactions.sql` | Seed `post_view_uniques` from historical reactors; rebuild `post_view_counts` |
| `20260922120000_create_post_audio.sql` | Speech mode: `post_audio` table + public `post-audio` storage bucket for generated narration MP3s |
| `20260923120000_repair_post_audio_slug_post_id.sql` | Repair poison `post_audio` row for `building-in-public-…` (wrong Notion `post_id` under UNIQUE slug) |

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

Migrations are idempotent (`if not exists` / `create or replace`). Safe to re-run if you previously applied SQL manually in the dashboard.

If the remote already has objects but no migration history, `db push` still applies and records the migration versions.

## Local development (optional)

Requires [Docker](https://docs.docker.com/get-docker/).

```bash
pnpm supabase:start    # local Postgres + API (ports in config.toml)
pnpm supabase:status   # URLs and keys for local stack
pnpm supabase:db:reset # replay migrations + seed
pnpm supabase:stop
```

Point `.env` at local values from `supabase status` when testing reactions/views offline.

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
| `20260313000000_post_reactions.sql` | Likes/dislikes per session |
| `20260313100000_post_view_counts.sql` | Lifetime unique blog view counts + `record_unique_view` RPC |

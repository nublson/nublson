-- Post reactions (likes/dislikes). One reaction per session per post.

create table if not exists public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id text not null,
  post_slug text not null,
  session_id text not null,
  reaction_type text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (post_id, session_id)
);

create index if not exists post_reactions_post_id_idx
  on public.post_reactions (post_id);

alter table public.post_reactions enable row level security;

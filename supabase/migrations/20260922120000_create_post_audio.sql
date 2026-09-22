-- Speech mode: generated MP3 narration per blog post, cached in Storage.
-- One row per Notion post; content_hash detects edits so audio regenerates
-- only when the narrated text actually changes.

create table if not exists public.post_audio (
  post_id text primary key,
  post_slug text not null,
  content_hash text not null,
  audio_path text not null,
  voice text not null,
  model text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists post_audio_post_slug_idx
  on public.post_audio (post_slug);

alter table public.post_audio enable row level security;

-- Public bucket: narrated MP3s are public blog content, served directly by
-- their public URL. Writes go through the service role only (bypasses RLS),
-- same access model as the tables above.
insert into storage.buckets (id, name, public)
values ('post-audio', 'post-audio', true)
on conflict (id) do nothing;

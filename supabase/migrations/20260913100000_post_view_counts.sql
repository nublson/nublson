-- Blog lifetime unique view counts (public counter; private trends via Vercel Analytics).

create table if not exists public.post_view_uniques (
  post_id text not null,
  session_id text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, session_id)
);

create table if not exists public.post_view_counts (
  post_id text primary key,
  post_slug text not null,
  views integer not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.record_unique_view(
  p_post_id text,
  p_post_slug text,
  p_session_id text
)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  inserted integer;
  current_views integer;
begin
  insert into public.post_view_uniques (post_id, session_id)
  values (p_post_id, p_session_id)
  on conflict (post_id, session_id) do nothing;

  get diagnostics inserted = row_count;

  if inserted > 0 then
    insert into public.post_view_counts (post_id, post_slug, views)
    values (p_post_id, p_post_slug, 1)
    on conflict (post_id) do update
      set views = public.post_view_counts.views + 1,
          post_slug = excluded.post_slug,
          updated_at = now();
  else
    insert into public.post_view_counts (post_id, post_slug, views)
    values (p_post_id, p_post_slug, 0)
    on conflict (post_id) do update
      set post_slug = excluded.post_slug;
  end if;

  select views into current_views
  from public.post_view_counts
  where post_id = p_post_id;

  return coalesce(current_views, 0);
end;
$$;

revoke all on function public.record_unique_view(text, text, text) from public;
grant execute on function public.record_unique_view(text, text, text) to service_role;

alter table public.post_view_uniques enable row level security;
alter table public.post_view_counts enable row level security;

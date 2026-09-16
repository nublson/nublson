-- One-time (idempotent) backfill: treat historical reactors as unique visitors.
-- Views started later than reactions, so likes could exceed views without this.

insert into public.post_view_uniques (post_id, session_id, created_at)
select r.post_id, r.session_id, r.created_at
from public.post_reactions r
on conflict (post_id, session_id) do nothing;

insert into public.post_view_counts (post_id, post_slug, views, updated_at)
select
  u.post_id,
  coalesce(
    (
      select r.post_slug
      from public.post_reactions r
      where r.post_id = u.post_id
      order by r.updated_at desc
      limit 1
    ),
    (
      select c.post_slug
      from public.post_view_counts c
      where c.post_id = u.post_id
    ),
    u.post_id
  ),
  count(*)::integer,
  now()
from public.post_view_uniques u
group by u.post_id
on conflict (post_id) do update
  set views = excluded.views,
      post_slug = excluded.post_slug,
      updated_at = now();

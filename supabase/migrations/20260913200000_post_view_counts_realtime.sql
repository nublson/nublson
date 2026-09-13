-- Enable Realtime broadcasts when view counts change (public read-only).

drop policy if exists "Anyone can read post view counts" on public.post_view_counts;

create policy "Anyone can read post view counts"
  on public.post_view_counts
  for select
  to anon, authenticated
  using (true);

alter table public.post_view_counts replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    join pg_namespace n on n.oid = c.relnamespace
    where p.pubname = 'supabase_realtime'
      and n.nspname = 'public'
      and c.relname = 'post_view_counts'
  ) then
    alter publication supabase_realtime add table public.post_view_counts;
  end if;
end $$;

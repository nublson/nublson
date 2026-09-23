-- Speech mode: repair stranded post_audio rows where UNIQUE(post_slug) blocked
-- caching after Notion post_id drift (duplicate titles / mismatched data source).
--
-- Idempotent: only rewrites the known poison row for the flagship writings post.
-- App code now looks up / upserts by post_slug; this migration unblocks the
-- existing Opus object so the next play can redirect instead of regenerating.

update public.post_audio
set
  post_id = '38ab1726-8ab3-80da-b95d-c7834bf2bb12',
  updated_at = now()
where post_slug = 'building-in-public-and-the-fear-of-being-seen'
  and post_id = '389b1726-8ab3-81a8-816b-f48306cc1a25';

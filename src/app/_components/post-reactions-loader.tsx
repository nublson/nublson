import { PostReactions } from "@/components/post-reactions";
import { getDatabasePageBySlug } from "@/services/notion";
import { getViewCount } from "@/services/views";

export type PostReactionsContentMedia = "Blog" | "Project";

/**
 * Renders only what is the same for every visitor (the view count), so the
 * post page stays static (ISR). Reading the reaction session cookie here would
 * make the whole route render per request; `PostReactions` fetches the
 * visitor's reactions from `/api/reactions/[postId]` instead, which owns the
 * session cookie, and shows its skeleton until then.
 */
export async function PostReactionsLoader({
  params,
  media,
}: {
  params: Promise<{ slug: string }>;
  media: PostReactionsContentMedia;
}) {
  const { slug } = await params;
  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    media,
    slug,
  );
  if (!found) return null;

  const postId = found.page.id;
  const trackViews = media === "Blog";
  const initialViews = trackViews ? await getViewCount(postId) : 0;

  return (
    <PostReactions
      postId={postId}
      postSlug={slug}
      trackViews={trackViews}
      initialViews={initialViews}
    />
  );
}

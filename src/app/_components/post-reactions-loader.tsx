import { PostReactions } from "@/components/post-reactions";
import { getDatabasePageBySlug } from "@/services/notion";
import { getPostReactions } from "@/services/reactions";
import { getViewCount } from "@/services/views";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "reaction_session_id";

export type PostReactionsContentMedia = "Blog" | "Project";

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
  const jar = await cookies();
  const sessionId = jar.get(SESSION_COOKIE)?.value ?? randomUUID();
  const initialData = await getPostReactions(postId, sessionId);
  const initialViews = trackViews ? await getViewCount(postId) : 0;

  return (
    <PostReactions
      postId={postId}
      postSlug={slug}
      initialData={initialData}
      trackViews={trackViews}
      initialViews={initialViews}
    />
  );
}

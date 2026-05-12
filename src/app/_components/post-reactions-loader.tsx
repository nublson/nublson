import { PostReactions } from "@/components/post-reactions";
import { getDatabasePageBySlug } from "@/services/notion";
import { getPostReactions } from "@/services/reactions";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "reaction_session_id";

/** Matches `getDatabasePageBySlug` content filter (Blog posts vs work projects). */
export type PostReactionsContentMedia = "Blog" | "Project";

export async function PostReactionsLoader({
  params,
  media = "Blog",
}: {
  params: Promise<{ slug: string }>;
  media?: PostReactionsContentMedia;
}) {
  const { slug } = await params;
  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    media,
    slug,
  );
  if (!found) return null;

  const postId = found.page.id;
  const jar = await cookies();
  const sessionId = jar.get(SESSION_COOKIE)?.value ?? randomUUID();
  const initialData = await getPostReactions(postId, sessionId);

  return (
    <PostReactions postId={postId} postSlug={slug} initialData={initialData} />
  );
}

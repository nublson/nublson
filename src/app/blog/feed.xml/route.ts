import { getAllPublishedPostsForFeed } from "@/services/notion";
import { buildRssDocument, rssItemsFromPosts } from "@/utils/rss";

export const revalidate = 10;

export async function GET() {
  const base = process.env.BASE_URL!;
  const origin = base.replace(/\/$/, "");
  const databaseId = process.env.NOTION_DATABASE_CONTENT_ID!;
  const posts = await getAllPublishedPostsForFeed(databaseId, "Blog");
  const xml = buildRssDocument({
    title: "Nubelson Fernandes — Blog",
    link: `${origin}/blog`,
    description: "Writing and notes from Nubelson Fernandes.",
    selfUrl: `${origin}/blog/feed.xml`,
    items: rssItemsFromPosts(base, "/blog", posts),
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=10, stale-while-revalidate",
    },
  });
}

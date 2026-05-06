import { getAllPublishedPostsForFeed } from "@/services/notion";
import { buildRssDocument, rssItemsFromPosts } from "@/utils/rss";

export const revalidate = 10;

export async function GET() {
  const base = process.env.BASE_URL!;
  const origin = base.replace(/\/$/, "");
  const databaseId = process.env.NOTION_DATABASE_CONTENT_ID!;
  const posts = await getAllPublishedPostsForFeed(databaseId, "Project");
  const xml = buildRssDocument({
    title: "Nubelson Fernandes — Work",
    link: `${origin}/work`,
    description: "Selected projects and case studies.",
    selfUrl: `${origin}/work/feed.xml`,
    items: rssItemsFromPosts(base, "/work", posts),
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=10, stale-while-revalidate",
    },
  });
}

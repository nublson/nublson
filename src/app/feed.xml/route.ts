import { getAllPublishedPostsForFeed } from "@/services/notion";
import {
  buildRssDocument,
  rssItemsFromPosts,
  type RssFeedItem,
} from "@/utils/rss";

export const revalidate = 10;

export async function GET() {
  const base = process.env.BASE_URL!;
  const databaseId = process.env.NOTION_DATABASE_CONTENT_ID!;
  const [blogPosts, workPosts] = await Promise.all([
    getAllPublishedPostsForFeed(databaseId, "Blog"),
    getAllPublishedPostsForFeed(databaseId, "Project"),
  ]);

  const items: RssFeedItem[] = [
    ...rssItemsFromPosts(base, "/blog", blogPosts),
    ...rssItemsFromPosts(base, "/work", workPosts),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  const origin = base.replace(/\/$/, "");
  const selfUrl = `${origin}/feed.xml`;
  const xml = buildRssDocument({
    title: "Nubelson Fernandes — Blog & Work",
    link: origin,
    description: "Latest writing and projects from Nubelson Fernandes.",
    selfUrl,
    items,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=10, stale-while-revalidate",
    },
  });
}

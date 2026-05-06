import type { PostMetadata } from "@/utils/formatter";

export type RssFeedItem = {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
};

function pubDateForPost(post: PostMetadata): Date {
  const raw = post.published_date?.trim();
  if (raw) {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date(post.updated_date);
}

/** Map Notion post metadata to RSS items (absolute links). */
export function rssItemsFromPosts(
  baseUrl: string,
  pathPrefix: "/blog" | "/work",
  posts: PostMetadata[],
): RssFeedItem[] {
  const base = baseUrl.replace(/\/$/, "");
  return posts.map((post) => ({
    title: post.title,
    link: `${base}${pathPrefix}/${post.slug}`,
    description: post.description.trim() || post.title,
    pubDate: pubDateForPost(post),
  }));
}

function escapeXml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/** RFC 822 / RFC 1123 date for RSS 2.0 `pubDate`. */
export function toRssPubDate(date: Date): string {
  return date.toUTCString();
}

export function buildRssDocument(options: {
  title: string;
  link: string;
  description: string;
  selfUrl: string;
  language?: string;
  items: RssFeedItem[];
}): string {
  const language = options.language ?? "en-us";
  const lastBuild =
    options.items.length > 0
      ? new Date(
          Math.max(...options.items.map((i) => i.pubDate.getTime())),
        )
      : new Date();

  const itemXml = options.items
    .map((item) => {
      const guid = item.link;
      return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${escapeXml(toRssPubDate(item.pubDate))}</pubDate>
      <guid isPermaLink="true">${escapeXml(guid)}</guid>
    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(options.title)}</title>
    <link>${escapeXml(options.link)}</link>
    <description>${escapeXml(options.description)}</description>
    <language>${escapeXml(language)}</language>
    <lastBuildDate>${escapeXml(toRssPubDate(lastBuild))}</lastBuildDate>
    <atom:link href="${escapeXml(options.selfUrl)}" rel="self" type="application/rss+xml" />${itemXml}
  </channel>
</rss>`;
}

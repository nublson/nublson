import {
  getAboutPageLastModified,
  getAllPublishedEntriesForSitemap,
  type PublishedSitemapEntry,
} from "@/services/notion";
import type { MetadataRoute } from "next";

function maxLastModified(dates: Date[]): Date {
  if (dates.length === 0) return new Date();
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.BASE_URL!;
  const databaseId = process.env.NOTION_DATABASE_CONTENT_ID!;

  const [blogEntries, workEntries, aboutLastModified] = await Promise.all([
    getAllPublishedEntriesForSitemap(databaseId, "Blog"),
    getAllPublishedEntriesForSitemap(databaseId, "Project"),
    getAboutPageLastModified(),
  ]);

  const blogDates = blogEntries.map(
    (e: PublishedSitemapEntry) => e.lastModified,
  );
  const workDates = workEntries.map(
    (e: PublishedSitemapEntry) => e.lastModified,
  );
  const homeDates = [
    ...blogDates,
    ...workDates,
    ...(aboutLastModified ? [aboutLastModified] : []),
  ];

  const staticRoutes = [
    {
      path: "/",
      lastModified: maxLastModified(homeDates),
    },
    {
      path: "/about",
      lastModified: aboutLastModified ?? new Date(),
    },
    {
      path: "/blog",
      lastModified: maxLastModified(blogDates),
    },
    {
      path: "/work",
      lastModified: maxLastModified(workDates),
    },
  ].map(({ path, lastModified }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const blogRoutes = blogEntries.map(
    ({ slug, lastModified }: PublishedSitemapEntry) => ({
      url: `${base}/blog/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  const workRoutes = workEntries.map(
    ({ slug, lastModified }: PublishedSitemapEntry) => ({
      url: `${base}/work/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...blogRoutes, ...workRoutes];
}

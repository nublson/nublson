import { getAllPublishedSlugsForStaticParams } from "@/services/notion";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.BASE_URL!;

  const [blogSlugs, workSlugs] = await Promise.all([
    getAllPublishedSlugsForStaticParams(
      process.env.NOTION_DATABASE_CONTENT_ID!,
      "Blog",
    ),
    getAllPublishedSlugsForStaticParams(
      process.env.NOTION_DATABASE_CONTENT_ID!,
      "Project",
    ),
  ]);

  const staticRoutes = ["/", "/about", "/blog", "/work"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const blogRoutes = blogSlugs.map(({ slug }) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const workRoutes = workSlugs.map(({ slug }) => ({
    url: `${base}/work/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes, ...workRoutes];
}

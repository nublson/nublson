import { getData } from "@/services/notion";
import sitemapList from "@/utils/sitemapPages.json";

export default async function sitemap() {
  const [articles, products, resources] = await Promise.all([
    getData(process.env.NOTION_DATABASE_CONTENT_ID as string, "Blog"),
    getData(
      process.env.NOTION_DATABASE_CONTENT_ID as string,
      "Store",
      undefined,
      "products"
    ),
    getData(
      process.env.NOTION_DATABASE_CONTENT_ID as string,
      "Store",
      undefined,
      "resources"
    ),
  ]);

  const blogSitemaps = articles.posts.map((item) => {
    return {
      url: `${process.env.BASE_URL}/blog/${item.post_slug}`,
      lastModified: item.modified_date,
    };
  });

  const storeSitemaps = products.posts.map((item) => {
    return {
      url: `${process.env.BASE_URL}/store/${item.post_slug}`,
      lastModified: item.modified_date,
    };
  });

  const resourcesSitemaps = resources.posts.map((item) => {
    return {
      url: `${process.env.BASE_URL}/resources/${item.post_slug}`,
      lastModified: item.modified_date,
    };
  });

  const routes = sitemapList.pages.map((item) => ({
    url: `${process.env.BASE_URL}${item.path}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...blogSitemaps, ...storeSitemaps, ...resourcesSitemaps];
}

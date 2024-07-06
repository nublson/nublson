import { getData } from "@/services/notion";
import sitemapList from "@/utils/sitemapPages.json";

export default async function sitemap() {
  const [articles, products] = await Promise.all([
    getData(process.env.NOTION_DATABASE_ARTICLES_ID),
    getData(process.env.NOTION_DATABASE_PRODUCTS_ID),
  ]);

  const blogSitemaps = articles.map((item) => {
    return {
      url: `${process.env.BASE_URL}/blog/${item.post_slug}`,
      lastModified: item.modified_date,
    };
  });

  const storeSitemaps = products.map((item) => {
    return {
      url: `${process.env.BASE_URL}/store/${item.post_slug}`,
      lastModified: item.modified_date,
    };
  });

  const routes = sitemapList.pages.map((item) => ({
    url: `${process.env.BASE_URL}${item.path}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...blogSitemaps, ...storeSitemaps];
}

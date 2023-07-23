import { getData } from "@/services/notion";
import sitemapList from "@/utils/sitemapPages.json";

export default async function sitemap() {
  const articles = (await getData(process.env.NOTION_DATABASE_ARTICLES_ID)).map(
    (item) => {
      return {
        url: `${process.env.BASE_URL}/blog/${item.post_slug}`,
        lastModified: item.modified_date,
      };
    }
  );

  const routes = sitemapList.pages.map((item) => ({
    url: `${process.env.BASE_URL}${item.path}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...articles];
}

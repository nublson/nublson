import { getData } from "@/services/notion";
import sitemapList from "@/utils/sitemapPages.json";

async function fetchAllPages(databaseId: string) {
  let page = 1;
  let hasMore = true;
  const allPosts = [];

  while (hasMore) {
    const data = await getData(databaseId, page, 10);
    if (!data) break;

    allPosts.push(...data.posts);
    hasMore = data.hasMore;
    page += 1;
  }

  return allPosts;
}

export default async function sitemap() {
  const [articles, products] = await Promise.all([
    fetchAllPages(process.env.NOTION_DATABASE_ARTICLES_ID as string),
    fetchAllPages(process.env.NOTION_DATABASE_PRODUCTS_ID as string),
  ]);

  const blogSitemaps = articles.map((item, index) => {
    const pageNumber = Math.floor(index / 10) + 1;
    return {
      url: `${process.env.BASE_URL}/blog/${pageNumber}/${item.post_slug}`,
      lastModified: item.modified_date,
    };
  });

  const storeSitemaps = products.map((item, index) => {
    const pageNumber = Math.floor(index / 10) + 1;
    return {
      url: `${process.env.BASE_URL}/store/${pageNumber}/${item.post_slug}`,
      lastModified: item.modified_date,
    };
  });

  const routes = sitemapList.pages.map((item) => ({
    url: `${process.env.BASE_URL}${item.path}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...blogSitemaps, ...storeSitemaps];
}

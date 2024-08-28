import { getData } from "@/services/notion";
import sitemapList from "@/utils/sitemapPages.json";

export default async function sitemap() {
  const [articles, products, resources] = await Promise.all([
    getData(process.env.NOTION_DATABASE_ARTICLES_ID as string, "Blog", 1),
    getData(
      process.env.NOTION_DATABASE_PRODUCTS_ID as string,
      "Store",
      1,
      undefined,
      "products"
    ),
    getData(
      process.env.NOTION_DATABASE_PRODUCTS_ID as string,
      "Store",
      1,
      undefined,
      "resources"
    ),
  ]);

  const postsPerPage = 10;
  const totalArticlePages = Math.ceil(articles.posts.length / postsPerPage);
  const totalProductPages = Math.ceil(products.posts.length / postsPerPage);
  const totalResourcesPages = Math.ceil(products.posts.length / postsPerPage);

  const blogSitemaps = articles.posts.map((item, index) => {
    const pageNumber = Math.floor(index / postsPerPage) + 1;
    return {
      url: `${process.env.BASE_URL}/blog/${pageNumber}/${item.post_slug}`,
      lastModified: item.modified_date,
    };
  });

  const storeSitemaps = products.posts.map((item, index) => {
    const pageNumber = Math.floor(index / postsPerPage) + 1;
    return {
      url: `${process.env.BASE_URL}/store/${pageNumber}/${item.post_slug}`,
      lastModified: item.modified_date,
    };
  });

  const resourcesSitemaps = resources.posts.map((item, index) => {
    const pageNumber = Math.floor(index / postsPerPage) + 1;
    return {
      url: `${process.env.BASE_URL}/resources/${pageNumber}/${item.post_slug}`,
      lastModified: item.modified_date,
    };
  });

  const blogPageSitemaps = Array.from(
    { length: totalArticlePages },
    (_, index) => {
      const pageUrlPart = index > 0 ? `/${index + 1}` : "";
      return {
        url: `${process.env.BASE_URL}/blog${pageUrlPart}`,
        lastModified: new Date().toISOString(),
      };
    }
  );

  const storePageSitemaps = Array.from(
    { length: totalProductPages },
    (_, index) => {
      const pageUrlPart = index > 0 ? `/${index + 1}` : "";
      return {
        url: `${process.env.BASE_URL}/store${pageUrlPart}`,
        lastModified: new Date().toISOString(),
      };
    }
  );

  const resourcesPageSitemaps = Array.from(
    { length: totalResourcesPages },
    (_, index) => {
      const pageUrlPart = index > 0 ? `/${index + 1}` : "";
      return {
        url: `${process.env.BASE_URL}/resources${pageUrlPart}`,
        lastModified: new Date().toISOString(),
      };
    }
  );

  const routes = sitemapList.pages.map((item) => ({
    url: `${process.env.BASE_URL}${item.path}`,
    lastModified: new Date().toISOString(),
  }));

  return [
    ...routes,
    ...blogSitemaps,
    ...storeSitemaps,
    ...resourcesSitemaps,
    ...blogPageSitemaps,
    ...storePageSitemaps,
    ...resourcesPageSitemaps,
  ];
}

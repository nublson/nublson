import { getData } from "@/services/notion"; // Adjust the import path
import sitemapList from "@/utils/sitemapPages.json"; // Adjust the import path
import { PostProps } from "@/utils/types"; // Adjust the import path

async function fetchAllPages(databaseId: string): Promise<PostProps[]> {
  let page = 1;
  let hasMore = true;
  const allPosts: PostProps[] = [];

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

  const articlesPerPage = 10;
  const productsPerPage = 10;
  const totalArticlePages = Math.ceil(articles.length / articlesPerPage);
  const totalProductPages = Math.ceil(products.length / productsPerPage);

  // Generate blog post URLs with pagination
  const blogSitemaps = articles.map((item, index) => {
    const pageNumber = Math.floor(index / articlesPerPage) + 1;
    return {
      url: `${process.env.BASE_URL}/blog/${pageNumber}/${item.post_slug}`,
      lastModified: item.modified_date,
    };
  });

  // Generate store post URLs with pagination
  const storeSitemaps = products.map((item, index) => {
    const pageNumber = Math.floor(index / productsPerPage) + 1;
    return {
      url: `${process.env.BASE_URL}/store/${pageNumber}/${item.post_slug}`,
      lastModified: item.modified_date,
    };
  });

  // Generate URLs for each page in the blog section
  const blogPageSitemaps = Array.from(
    { length: totalArticlePages },
    (_, index) => ({
      url: `${process.env.BASE_URL}/blog/${index + 1}`,
      lastModified: new Date().toISOString(),
    })
  );

  // Generate URLs for each page in the store section
  const storePageSitemaps = Array.from(
    { length: totalProductPages },
    (_, index) => ({
      url: `${process.env.BASE_URL}/store/${index + 1}`,
      lastModified: new Date().toISOString(),
    })
  );

  // Generate static routes
  const routes = sitemapList.pages.map((item) => ({
    url: `${process.env.BASE_URL}${item.path}`,
    lastModified: new Date().toISOString(),
  }));

  return [
    ...routes,
    ...blogSitemaps,
    ...storeSitemaps,
    ...blogPageSitemaps,
    ...storePageSitemaps,
  ];
}

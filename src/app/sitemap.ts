import sitemapList from "@/utils/sitemapPages.json";

export default async function sitemap() {
  const routes = sitemapList.pages.map((item) => ({
    url: `${process.env.BASE_URL}${item.path}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
}

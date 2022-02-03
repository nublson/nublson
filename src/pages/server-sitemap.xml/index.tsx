import { GetServerSideProps } from "next";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import { getData } from "../../services/notion";
import { formatPosts } from "../../utils/formatter";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const articles = await getData(process.env.NOTION_DATABASE_ID, "article");
  const products = await getData(process.env.NOTION_DATABASE_ID, "product");

  const formatedArticles = formatPosts(articles);
  const formatedProducts = formatPosts(products);

  const articleFields: ISitemapField[] = formatedArticles.map((article) => ({
    loc: `${process.env.BASE_URL}/blog/${article.page_slug}`,
    lastmod: new Date().toISOString(),
  }));

  const productFields: ISitemapField[] = formatedProducts.map((product) => ({
    loc: `${process.env.BASE_URL}/store/${product.page_slug}`,
    lastmod: new Date().toISOString(),
  }));

  const fields = articleFields.concat(productFields);

  return getServerSideSitemap(context, fields);
};

export default function Site() {}

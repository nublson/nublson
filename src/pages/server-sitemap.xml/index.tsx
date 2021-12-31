import { GetServerSideProps } from "next";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import { getArticles } from "../../services/notion";
import { formatPosts } from "../../utils/formatter";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const results = await getArticles(process.env.NOTION_DATABASE_ID);

  const posts = formatPosts(results);

  const fields: ISitemapField[] = posts.map((post) => ({
    loc: `${process.env.BASE_URL}/blog/${post.slug}`,
    lastmod: new Date().toISOString(),
  }));

  return getServerSideSitemap(context, fields);
};

export default function Site() {}

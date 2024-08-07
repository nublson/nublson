import { Metadata } from "next";
import { Header, LastPosts, WorkSection } from "../sections";

import { getData } from "@/services/notion";

import pages from "@/utils/pages.json";
import work from "@/utils/work.json";

export const metadata: Metadata = {
  title: pages.home.title,
  description: pages.home.description,
  alternates: {
    canonical: `/`,
  },
  openGraph: {
    type: "website",
    url: process.env.BASE_URL,
    description: pages.home.description,
    siteName: "nublson.com",
  },
};

export default async function Home() {
  const [articles, products, videos, newsletter] = await Promise.all([
    getData(process.env.NOTION_DATABASE_ARTICLES_ID, 1, 2),
    getData(process.env.NOTION_DATABASE_PRODUCTS_ID, 1, 2),
    getData(process.env.NOTION_DATABASE_VIDEOS_ID, 1, 2),
    getData(process.env.NOTION_DATABASE_NEWSLETTER_ID, 1, 2),
  ]);

  return (
    <>
      <Header
        label={pages.home.label}
        title={pages.home.title}
        thumbnail={pages.home.thumbnail}
        description={pages.home.description}
      />
      <WorkSection title="Creating on" workList={work.items} />
      {newsletter.posts.length && (
        <LastPosts
          title="Newsletter"
          type="newsletter"
          posts={newsletter.posts}
          external
          linkTo="https://nublson.substack.com"
        />
      )}
      {videos.posts.length && (
        <LastPosts
          title="Last videos"
          type="videos"
          posts={videos.posts}
          external
          linkTo="https://youtube.com/@nublson"
        />
      )}
      {products.posts.length && (
        <LastPosts
          title="Last products"
          type="store"
          posts={products.posts}
          linkTo="/store"
        />
      )}
      {articles.posts.length && (
        <LastPosts
          title="Last articles"
          type="blog"
          posts={articles.posts}
          linkTo="/blog"
        />
      )}
    </>
  );
}

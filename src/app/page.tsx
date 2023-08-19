import { Metadata } from "next";
import { Header, LastPosts, WorkSection } from "../sections";

import { getData, getVideos } from "@/services/notion";

import pages from "@/utils/pages.json";
import work from "@/utils/work.json";

export const metadata: Metadata = {
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

export const revalidate = 30;

export default async function Home() {
  const [articles, products, videos] = await Promise.all([
    getData(process.env.NOTION_DATABASE_ARTICLES_ID),
    getData(process.env.NOTION_DATABASE_PRODUCTS_ID),
    getVideos(process.env.NOTION_DATABASE_VIDEOS_ID),
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
      <LastPosts
        title="Articles"
        type="articles"
        posts={[articles[0], articles[1]]}
        linkTo="/blog"
      />
      <LastPosts
        title="Products"
        posts={[products[0], products[1]]}
        linkTo="/store"
      />
      <LastPosts
        title="Videos"
        posts={[videos[0], videos[1]]}
        external
        linkTo="https://youtube.com/@nublson"
      />
    </>
  );
}

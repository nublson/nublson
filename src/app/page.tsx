import { Metadata } from "next";
import { Header, LastPosts, WorkSection } from "../sections";

import { getData } from "@/services/notion";

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

export default async function Home() {
  const [articles, videos, newsletter] = await Promise.all([
    getData(process.env.NOTION_DATABASE_ARTICLES_ID),
    getData(process.env.NOTION_DATABASE_VIDEOS_ID),
    getData(process.env.NOTION_DATABASE_NEWSLETTER_ID),
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
        title="Newsletter"
        type="newsletter"
        posts={[newsletter[0], newsletter[1]]}
        external
        linkTo="https://nublson.substack.com"
      />
      <LastPosts
        title="Last videos"
        type="videos"
        posts={[videos[0], videos[1]]}
        external
        linkTo="https://youtube.com/@nublson"
      />
      <LastPosts
        title="Last articles"
        type="blog"
        posts={[articles[0], articles[1]]}
        linkTo="/blog"
      />
    </>
  );
}

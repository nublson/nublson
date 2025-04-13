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
  twitter: {
    card: "summary_large_image",
    site: process.env.BASE_URL,
    title: pages.home.title,
    description: pages.home.description,
    images: pages.home.thumbnail,
    creator: "@nublson",
  },
};

export default async function Home() {
  const videos = await getData(
    process.env.NOTION_DATABASE_CONTENT_ID,
    "Youtube",
    2
  );

  return (
    <>
      <Header
        label={pages.home.label}
        title={pages.home.title}
        thumbnail={pages.home.thumbnail}
        description={pages.home.description}
      />
      <WorkSection title="Creating on" workList={work.items} />
      {videos.posts.length > 0 && (
        <LastPosts
          title="Last videos"
          type="videos"
          posts={videos.posts}
          external
          linkTo="https://youtube.com/@nublson"
        />
      )}
    </>
  );
}

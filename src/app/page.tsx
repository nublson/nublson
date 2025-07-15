import { Metadata } from "next";
import { Header, LastPosts, WorkSection } from "../sections";

import { getPlaylistVideos } from "@/services/youtube";
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
  const data = await getPlaylistVideos({
    playlistId: process.env.YOUTUBE_PLAYLIST_ID,
  });

  return (
    <>
      <Header
        label={pages.home.label}
        title={pages.home.title}
        thumbnail={pages.home.thumbnail}
        description={pages.home.description}
      />
      <WorkSection title="Creating on" workList={work.items} />
      {data.length > 0 && (
        <LastPosts
          title="Last videos"
          type="videos"
          posts={data}
          external
          linkTo="https://youtube.com/@nublson"
        />
      )}
    </>
  );
}

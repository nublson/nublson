import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import pageData from "@/utils/pages.json";

export const metadata: Metadata = {
  title: pageData.blog.title,
  description: pageData.blog.description,
  metadataBase: new URL(process.env.BASE_URL),
  openGraph: {
    type: "website",
    url: `${process.env.BASE_URL}/blog`,
    title: pageData.blog.title,
    description: pageData.blog.description,
    siteName: "nublson.com",
    images: [
      {
        url: pageData.blog.thumbnail,
      },
    ],
  },
};

export const revalidate = 60;

export default async function Blog() {
  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);

  return <PostsSection posts={data} type="articles" />;
}

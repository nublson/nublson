import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import pageData from "@/utils/pages.json";

export const metadata: Metadata = {
  title: pageData.blog.title,
  description: pageData.blog.description,
  alternates: {
    canonical: `/blog`,
  },
  twitter: {
    card: "summary_large_image",
    title: pageData.blog.title,
    description: pageData.blog.description,
    siteId: "1131704795604164615",
    creator: "@nublson",
    creatorId: "1131704795604164615",
  },
  openGraph: {
    type: "website",
    url: `${process.env.BASE_URL}/blog`,
    title: pageData.blog.title,
    description: pageData.blog.description,
    siteName: "nublson.com",
  },
};

export const revalidate = 30;

export default async function Blog() {
  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);

  return <PostsSection posts={data} type="articles" />;
}

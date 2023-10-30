import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import { formatPosts } from "@/utils/formatter";
import pageData from "@/utils/pages.json";

export const metadata: Metadata = {
  title: pageData.blog.title,
  description: pageData.blog.description,
  alternates: {
    canonical: `/blog`,
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
  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID).then(
    (response) => formatPosts(response)
  );

  return <PostsSection posts={data} type="articles" />;
}

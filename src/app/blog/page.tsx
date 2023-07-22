import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing down about personal development and technology.",
};

export const revalidate = 60;

export default async function Blog() {
  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);

  return <PostsSection posts={data} type="articles" />;
}

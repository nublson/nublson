import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
};

export const revalidate = 60;

export default async function Blog() {
  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);

  return <PostsSection posts={data} type="articles" />;
}

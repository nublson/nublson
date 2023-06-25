import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { formatPosts } from "@/utils/formatter";

export default async function Blog() {
  const data = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);

  return <PostsSection posts={formatPosts(data)} type="articles" />;
}

import { products } from "@/mocks";
import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { formatPosts } from "@/utils/formatter";

export default async function Store() {
  const data = await getData(process.env.NOTION_DATABASE_PRODUCTS_ID);

  return <PostsSection posts={formatPosts(data)} type="products" />;
}

import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";

export default async function Store() {
  const data = await getData(process.env.NOTION_DATABASE_PRODUCTS_ID);

  return <PostsSection posts={data} type="products" />;
}

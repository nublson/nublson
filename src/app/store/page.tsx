import { products } from "@/mocks";
import { PostsSection } from "@/sections";

export default function Store() {
  return <PostsSection posts={products} type="products" />;
}

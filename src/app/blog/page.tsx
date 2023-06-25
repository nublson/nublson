import { articles } from "@/mocks";
import { PostsSection } from "@/sections";

export default function Blog() {
  return <PostsSection posts={articles} type="articles" />;
}

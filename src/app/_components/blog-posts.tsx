import PostsSection from "@/sections/posts";
import { getDatabasePages } from "@/services/notion";
import { formatPostMetadata, type PostMetadata } from "@/utils/formatter";

export async function getBlogPosts(): Promise<PostMetadata[]> {
  const blogPages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Blog",
    20,
  );
  return formatPostMetadata(blogPages);
}

export function BlogPosts({ posts }: { posts: PostMetadata[] }) {
  return (
    <PostsSection title="All posts" id="writing" posts={posts} groupByYear />
  );
}
